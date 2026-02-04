import {StyleSheet, Text, View, useColorScheme, ScrollView, FlatList, ActivityIndicator, Alert, SafeAreaView, TouchableOpacity} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import {
  BLUE_COLOR,
  DARK_BACKGROUND,
  DARK_COLOR,
  FONT_NORMAL,
  FONT_SEDANG,
  GREY_COLOR,
  HORIZONTAL_MARGIN,
  LIGHT_COLOR,
  MEDIUM_FONT,
  REGULAR_FONT,
  SLATE_COLOR,
  WHITE_BACKGROUND,
  windowWidth,
} from '../../utils/const';
import Input from '../../components/form/Input';
import BottomButton from '../../components/BottomButton';
import ProductCard from '../../components/ProductCard';
import SkeletonCard from '../../components/SkeletonCard';
import BottomModal from '../../components/BottomModal';
import TransactionDetail from '../../components/TransactionDetail';
import { api } from '../../utils/api';
import {numberWithCommas} from '../../utils/formatter';
import { makeTopupCall } from '../../helpers/apiBiometricHelper';

export default function TopupData({route, navigation}) {
  const {provider, title, type} = route.params;
  const isDarkMode = useColorScheme() === 'dark';
  const scrollViewRef = useRef(null);

  // State for products
  const [customer_no, setCustomerNo] = useState('');
  const [selectItem, setSelectItem] = useState(null);
  const [sortedProducts, setSortedProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  // Simple validation
  const validateInputs = () => {
    const errors = {};
    if (!customer_no.trim()) {
      errors.customer_no = 'Nomor tujuan harus diisi';
    } else if (!/^\d+$/.test(customer_no)) {
      errors.customer_no = 'Nomor tidak valid';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const clearValidationErrors = () => setValidationErrors({});
  const resetInput = () => {
    setCustomerNo('');
    setSelectItem(null);
    clearValidationErrors();
  };

  // Fetch products when customer number changes
  useEffect(() => {
    if (customer_no) {
      fetchProducts();
    } else {
      setSortedProducts([]);
    }
  }, [customer_no]);

  const fetchProducts = async () => {
    if (!customer_no) return;

    setLoading(true);
    try {
      const response = await api.post('/api/product/data', {
        customer_no: customer_no,
      });

      let allProducts = [];

      if (response.data && response.data.data) {
        if (response.data.data.paket_data) {
          allProducts = response.data.data.paket_data;
        } else if (Array.isArray(response.data.data)) {
          allProducts = response.data.data;
        } else if (response.data.data && typeof response.data.data === 'object') {
          allProducts = Object.values(response.data.data).flat().filter(item => item && typeof item === 'object');
        }
      }

      // Filter products by type if specified
      const filteredProducts = type
        ? allProducts.filter(product => product.type && product.type === type)
        : allProducts;

      // Sort products by price (or any other criteria)
      const sorted = [...filteredProducts].sort((a, b) => a.price - b.price);

      setSortedProducts(sorted);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const [showModal, setShowModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false); // Loading state to prevent spam clicks

  const handleContinue = () => {
    if (!validateInputs()) {
      // If validation fails, scroll to the top to show the error indicators
      scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: true });
    } else {
      // If validation passes, show confirmation modal
      setShowModal(true);
    }
  };

  const confirmOrder = async () => {
    if (isProcessing) return; // Prevent multiple clicks

    setIsProcessing(true); // Set loading state to prevent spam clicks

    try {
      const response = await makeTopupCall({
        sku: selectItem.sku,
        customer_no: customer_no,
      }, 'Verifikasi sidik jari atau wajah untuk melakukan isi data');

      console.log('Topup response:', response);

      // Close confirmation modal
      setShowModal(false);

      // Navigate to success screen with the response data
      navigation.navigate('SuccessNotif', {
        item: {
          ...response,
          customer_no: customer_no
        },
        product: {
          ...selectItem,
          product_name: selectItem?.name || selectItem?.label,
          product_seller_price: selectItem?.price
        },
      });
    } catch (error) {
      console.error('Topup error:', error);
      setShowModal(false);
      // Error will be handled by global interceptor
    } finally {
      setIsProcessing(false); // Reset loading state
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: isDarkMode ? DARK_BACKGROUND : WHITE_BACKGROUND, paddingBottom: 100}}>
      {/* Fixed Header and Input Section */}
      <View style={[styles.container, {paddingBottom: 10, backgroundColor: isDarkMode ? DARK_BACKGROUND : WHITE_BACKGROUND}]}>
        <View style={{marginBottom: 15}}>
          <Text
            style={{
              fontFamily: MEDIUM_FONT,
              fontSize: 16,
              color: isDarkMode ? DARK_COLOR : LIGHT_COLOR,
            }}>
            {title || provider}
          </Text>
        </View>

        <View style={styles.formGroup}>
          <Input
            value={customer_no}
            placeholder="Masukan nomor tujuan"
            onchange={text => {
              setCustomerNo(text);
              if (validationErrors.customer_no) {
                clearValidationErrors();
              }
            }}
            ondelete={resetInput}
            type="numeric"
            lebar={windowWidth * 0.9}
            hasError={!!validationErrors.customer_no}
          />
        </View>
      </View>

      {/* Scrollable Product List */}
      {loading ? (
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.productsContainer}>
            {/* Skeleton cards while loading */}
            {Array.from({ length: 6 }).map((_, index) => (
              <View key={`skeleton-${index}`} style={styles.productItem}>
                <SkeletonCard />
              </View>
            ))}
          </View>
        </ScrollView>
      ) : sortedProducts.length > 0 ? (
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.productsContainer}>
            {sortedProducts.map((p, index) => (
              <ProductCard
                key={`${p.id}-${index}`}
                product={p}
                isSelected={selectItem?.id === p.id}
                onSelect={setSelectItem}
                style={styles.productItem}
              />
            ))}
          </View>
        </ScrollView>
      ) : (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20}}>
          <Text style={{fontFamily: REGULAR_FONT, color: isDarkMode ? DARK_COLOR : LIGHT_COLOR}}>
            {type ? `Tidak ada produk ${type} tersedia untuk ${provider}` : `Tidak ada produk tersedia untuk ${provider}`}
          </Text>
        </View>
      )}

      {/* Fixed Bottom Button */}
      {selectItem && (
        <View style={[styles.bottomButtonContainer, {backgroundColor: isDarkMode ? DARK_BACKGROUND : WHITE_BACKGROUND}]}>
          <BottomButton
            label="Lanjutkan"
            action={handleContinue}
            isLoading={false}
          />
        </View>
      )}

      {/* Confirmation Modal */}
      <BottomModal
        visible={showModal}
        onDismis={() => setShowModal(false)}
        title="Detail Transaksi">
        <TransactionDetail
          destination={customer_no}
          product={selectItem?.label || selectItem?.name}
          description={selectItem?.desc}
          price={selectItem?.price}
          onConfirm={() => {
            setShowModal(false);
            confirmOrder();
          }}
          onCancel={() => setShowModal(false)}
          isLoading={isProcessing}
        />
      </BottomModal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: HORIZONTAL_MARGIN,
    marginTop: 15,
  },
  formGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    columnGap: 5,
  },
  scrollContent: {
    flexGrow: 1,
  },
  productsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 25,
    marginTop: 10,
    paddingHorizontal: HORIZONTAL_MARGIN,
    columnGap: 5,
    paddingBottom: 150, // Extra padding to prevent overlap with bottom button
  },
  productItem: {
    width: '47%', // Adjusted to prevent clipping
    marginBottom: 0, // Let the rowGap in parent handle spacing
  },
  spacer: {
    height: 120, // Space equivalent to bottom button height plus some extra
    width: '100%',
  },
  bottomButtonContainer: {
    paddingHorizontal: HORIZONTAL_MARGIN,
    paddingBottom: 20,
    paddingTop: 10,
    position: 'absolute', // Position absolutely at the bottom
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1, // Ensure it appears on top if needed
  },
});