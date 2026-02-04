import {
  StyleSheet,
  Text,
  View,
  TextInput,
  useColorScheme,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Alert,
  PermissionsAndroid,
  Platform,
  Linking,
} from 'react-native';
import React, {useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  BLUE_COLOR,
  DARK_BACKGROUND,
  DARK_COLOR,
  FONT_NORMAL,
  FONT_SEDANG,
  GREEN_COLOR,
  GREY_COLOR,
  HORIZONTAL_MARGIN,
  LIGHT_COLOR,
  MEDIUM_FONT,
  REGULAR_FONT,
  SLATE_COLOR,
  WHITE_BACKGROUND,
} from '../../utils/const';
import {product_pulsa} from '../../data/product_pulsa';
import BottomModal from '../../components/BottomModal';
import Input from '../../components/form/Input';
import TransactionDetail from '../../components/TransactionDetail';
import ProductCard from '../../components/ProductCard';
import {numberWithCommas} from '../../utils/formatter';
import {api} from '../../utils/api';
import {makePaymentCall, makeTopupCall} from '../../helpers/apiBiometricHelper';

// Cache to store fetched products
const productCache = new Map();

export default function Pulsa({navigation}) {
  const isDarkMode = useColorScheme() === 'dark';
  const [nomorTujuan, setNomor] = useState(null);
  const [selectItem, setSelectItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [data_pulsa, setPulsa] = useState([]);
  const [loading, setLoading] = useState(false);

  const clearNomor = () => {
    setNomor(null);
  };

  const handleProduct = async () => {
    if (!nomorTujuan) {
      return;
    }

    setLoading(true);

    // Create a cache key based on the customer number
    const cacheKey = `pulsa_${nomorTujuan}`;

    // Check if products are already cached for this customer number
    if (productCache.has(cacheKey)) {
      console.log('Using cached pulsa products for:', nomorTujuan);
      const cachedProducts = productCache.get(cacheKey);
      setPulsa(cachedProducts.pulsa || []);
      setLoading(false);
      return;
    }

    try {
      const response = await api.post(`/api/product/pulsa`, {
        customer_no: nomorTujuan,
      });

      console.log('API Response:', response.data); // Debug log

      if (response.data && response.data.data) {
        console.log('Pulsa products:', response.data.data.pulsa); // Debug log

        // The API returns pulsa in the response
        const pulsaProducts = response.data.data.pulsa || [];

        // Cache the products for this customer number
        productCache.set(cacheKey, {
          pulsa: pulsaProducts,
        });

        setPulsa(pulsaProducts);
      } else {
        // Fallback to original structure if different
        const pulsaProducts = response.data.data?.pulsas || [];

        // Cache the products for this customer number
        productCache.set(cacheKey, {
          pulsa: pulsaProducts,
        });

        setPulsa(pulsaProducts);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log('Error fetching pulsa products:', error);
    }
  };

  const [isProcessing, setIsProcessing] = useState(false); // Loading state to prevent spam clicks

  const handleTopup = async () => {
    if (isProcessing) return; // Prevent multiple clicks

    setIsProcessing(true); // Set loading state to prevent spam clicks

    try {
      const response = await makeTopupCall(
        {
          customer_no: nomorTujuan,
          sku: selectItem?.sku || selectItem?.product_sku,
          type: 'pulsa', // Specify the type for the unified endpoint
        },
        'Verifikasi sidik jari atau wajah untuk melakukan isi pulsa',
      );

      // Close the modal before navigating
      setShowModal(false);

      navigation.navigate('SuccessNotif', {
        item: {
          ...response,
          customer_no: nomorTujuan,
        },
        product: {
          ...selectItem,
          product_name: selectItem?.name || selectItem?.product_name,
          product_seller_price:
            selectItem?.price || selectItem?.product_seller_price,
        },
      });
      console.log('response topup : ', response);
    } catch (error) {
      console.log('response error : ', error);
      if (error.message !== 'Biometric authentication failed') {
        // Error will be handled by global interceptor
      }
    } finally {
      setIsProcessing(false); // Reset loading state
    }
  };

  return (
    <>
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: isDarkMode ? DARK_BACKGROUND : WHITE_BACKGROUND,
        }}>
        <View
          style={{
            flex: 1,
            marginHorizontal: HORIZONTAL_MARGIN,
            marginTop: 15,
            backgroundColor: isDarkMode ? DARK_BACKGROUND : WHITE_BACKGROUND,
          }}>
          <View
            style={{
              rowGap: 10,
            }}>
            <Input
              value={nomorTujuan}
              placeholder="Masukan nomor tujuan"
              onchange={text => setNomor(text)}
              ondelete={() => clearNomor()}
              type="numeric"
            />

            {loading ? (
              <View style={styles.button}>
                <ActivityIndicator size="small" color="#fff" />
                <Text style={styles.buttonLabel}>Loading</Text>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.button}
                onPress={() => handleProduct()}>
                <Text style={styles.buttonLabel}>Tampilkan produk</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* PRODUK PULSA */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{flex: 1, marginTop: 10}}
            contentContainerStyle={{paddingBottom: 100}}>
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                rowGap: 25,
              }}>
              {data_pulsa.map(p => {
                return (
                  <ProductCard
                    key={p.id}
                    product={p}
                    isSelected={selectItem?.id === p.id}
                    onSelect={setSelectItem}
                    style={{width: '45%'}}
                  />
                );
              })}
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
      {selectItem && (
        <View style={styles.bottom(isDarkMode)}>
          <TouchableOpacity
            style={styles.bottomButton}
            onPress={() => setShowModal(!showModal)}>
            <Text style={styles.buttonLabel}>Lanjutkan</Text>
          </TouchableOpacity>
        </View>
      )}
      <BottomModal
        visible={showModal}
        onDismis={() => setShowModal(!showModal)}
        title="Detail Transaksi">
        <TransactionDetail
          destination={nomorTujuan}
          product={selectItem?.name || selectItem?.product_name}
          description={selectItem?.desc || selectItem?.product_desc}
          price={selectItem?.price || selectItem?.product_seller_price}
          onConfirm={() => handleTopup()}
          onCancel={() => setShowModal(false)}
          isLoading={isProcessing}
        />
      </BottomModal>
    </>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    rowGap: 10,
  },
  button: {
    backgroundColor: BLUE_COLOR,
    borderRadius: 5,
    padding: 5,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonLabel: {
    fontFamily: REGULAR_FONT,
    color: WHITE_BACKGROUND,
    textAlign: 'center',
  },
  bottom: isDarkMode => ({
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: isDarkMode ? DARK_BACKGROUND : WHITE_BACKGROUND,
    padding: 10,
  }),
  bottomButton: {
    backgroundColor: BLUE_COLOR,
    padding: 10,
    borderRadius: 5,
  },
  modalData: isDarkMode => ({
    borderBottomWidth: 1,
    borderBottomColor: isDarkMode ? SLATE_COLOR : GREY_COLOR,
    paddingVertical: 5,
    rowGap: 5,
  }),
  labelModalData: isDarkMode => ({
    fontFamily: MEDIUM_FONT,
    fontSize: FONT_SEDANG,
    color: isDarkMode ? LIGHT_COLOR : LIGHT_COLOR, // Changed to ensure contrast
  }),
  valueModalData: isDarkMode => ({
    fontFamily: REGULAR_FONT,
    fontSize: FONT_NORMAL,
    color: isDarkMode ? LIGHT_COLOR : LIGHT_COLOR, // Changed to ensure contrast
  }),
  loadingButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    columnGap: 10,
  },
});
