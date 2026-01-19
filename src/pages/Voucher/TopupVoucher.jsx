import {StyleSheet, Text, View, useColorScheme, ScrollView, FlatList, ActivityIndicator, Alert, SafeAreaView} from 'react-native';
import React, {useState, useEffect, useMemo} from 'react';
import {
  BLUE_COLOR,
  DARK_BACKGROUND,
  DARK_COLOR,
  FONT_NORMAL,
  GREY_COLOR,
  HORIZONTAL_MARGIN,
  LIGHT_COLOR,
  MEDIUM_FONT,
  REGULAR_FONT,
  WHITE_BACKGROUND,
  windowWidth,
} from '../../utils/const';
import Input from '../../components/form/Input';
import BottomButton from '../../components/BottomButton';
import ProductList from '../../components/ProductList';
import {api} from '../../utils/api';
import ConfirmationModal from '../../components/ConfirmationModal';

// Cache to store fetched products
const productCache = new Map();

export default function TopupVoucher({route}) {
  const {provider, title} = route.params;
  const isDarkMode = useColorScheme() === 'dark';
  const [customer_no, setCustomerNo] = useState('');
  const [selectItem, setSelectItem] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Memoized sorted products to avoid re-sorting on every render
  const sortedProducts = useMemo(() => {
    return [...products].sort((a, b) => a.price - b.price);
  }, [products]);

  useEffect(() => {
    fetchProductsByProvider();
  }, [provider]);

  const fetchProductsByProvider = async () => {
    try {
      console.log('Attempting to fetch vouchers for provider:', provider);
      
      // Check if products are already cached for this provider
      if (productCache.has(provider)) {
        console.log('Using cached vouchers for provider:', provider);
        const cachedProducts = productCache.get(provider);
        setProducts(cachedProducts);
        return;
      }
      
      const response = await api.post('/api/product/voucher');
      
      console.log('Response status:', response.status);
      console.log('Full response:', response);
      console.log('Response data:', response.data);
      
      if (response.data && response.data.data && response.data.data.voucher) {
        const allProducts = response.data.data.voucher;
        console.log('All vouchers for provider:', allProducts);
        console.log('Selected provider:', provider);
        
        const filteredProducts = allProducts.filter(item => item.provider === provider);
        console.log('Filtered vouchers:', filteredProducts);
        
        const transformedProducts = filteredProducts.map(item => ({
          id: item.id,
          label: item.name,
          price: item.price,
          desc: item.desc,
          category: item.category,
          sku: item.sku,
          multi: item.multi
        }));
        
        console.log('Transformed vouchers:', transformedProducts);
        
        // Cache the products for this provider
        productCache.set(provider, transformedProducts);
        setProducts(transformedProducts);
      } else {
        console.log('Unexpected response structure:', response.data);
        Alert.alert('Error', 'Struktur data tidak sesuai. Silakan hubungi administrator.');
      }
    } catch (error) {
      console.error('Error details:', {
        message: error.message,
        response: error.response,
        status: error.response?.status,
        data: error.response?.data
      });
      
      if (error.response?.status === 405) {
        Alert.alert('Error', 'Metode tidak diizinkan. Endpoint mungkin salah atau tidak mendukung metode POST.');
      } else if (error.response?.status === 401) {
        Alert.alert('Error', 'Autentikasi gagal. Token mungkin sudah kadaluarsa.');
      } else if (error.response?.status === 404) {
        Alert.alert('Error', 'Endpoint tidak ditemukan. Silakan periksa kembali alamat API.');
      } else {
        Alert.alert('Error', `Gagal memuat produk voucher: ${error.message}\nStatus: ${error.response?.status || 'Unknown'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const resetInput = () => {
    setCustomerNo('');
  };

  const handleContinue = () => {
    if (!customer_no) {
      Alert.alert('Error', 'Silakan masukkan nomor tujuan');
      return;
    }
    if (!selectItem) {
      Alert.alert('Error', 'Silakan pilih produk terlebih dahulu');
      return;
    }

    // Show confirmation modal
    setShowConfirmation(true);
  };

  const confirmOrder = async () => {
    try {
      const response = await api.post('/api/order/topup', {
        sku: selectItem.sku,
        customer_no: customer_no,
      });

      console.log('Topup response:', response.data);

      // Close confirmation modal
      setShowConfirmation(false);

      // Navigate to success screen with the response data
      navigation.navigate('SuccessNotif', {
        item: {
          ...response.data,
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
      setShowConfirmation(false);
      Alert.alert('Error', error.response?.data?.message || 'Gagal melakukan topup. Silakan coba lagi.');
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, {flex: 1, justifyContent: 'center', alignItems: 'center'}]}>
        <ActivityIndicator size="large" color="#138EE9" />
      </View>
    );
  }

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
            onchange={text => setCustomerNo(text)}
            ondelete={resetInput}
            type="numeric"
            lebar={windowWidth * 0.9}
          />
        </View>
      </View>

      {/* Scrollable Product List */}
      {sortedProducts.length > 0 ? (
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.productsContainer}>
            {sortedProducts.map((p, index) => (
              <View key={`${p.id}-${index}`} style={styles.productItem}>
                <ProductList
                  selectItem={selectItem?.id}
                  data={p}
                  action={() => setSelectItem(p)}
                />
              </View>
            ))}
          </View>
        </ScrollView>
      ) : (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20}}>
          <Text style={{fontFamily: REGULAR_FONT, color: isDarkMode ? DARK_COLOR : LIGHT_COLOR}}>
            Tidak ada produk tersedia untuk {provider}
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
      <ConfirmationModal
        isVisible={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={confirmOrder}
        destination={customer_no}
        product={selectItem?.label || selectItem?.name}
        price={selectItem?.price}
        isDarkMode={isDarkMode}
      />
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