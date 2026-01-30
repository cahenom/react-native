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
import React, {useState, useMemo} from 'react';
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
import {product_data, product_pulsa} from '../../data/product_pulsa';
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
  const [type, setType] = useState('Pulsa');
  const [selectItem, setSelectItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [data_pulsa, setPulsa] = useState([]);
  const [paket_data, setPaketData] = useState([]);
  const [loading, setLoading] = useState(false);

  const openContactPicker = () => {
    // Fitur dari kontak dihapus
    Alert.alert('Info', 'Fitur pemilihan dari kontak telah dihapus.');
  };

  const product_type = useMemo(() => ['Pulsa', 'Data'], []);

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
      setPaketData(cachedProducts.paket_data || []);
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
        console.log('Paket Data products:', response.data.data.paket_data); // Debug log

        // The API returns both pulsa and paket_data in a single call
        // Use separate arrays as provided by the API
        const pulsaProducts = response.data.data.pulsa || [];
        const paketDataProducts = response.data.data.paket_data || [];

        // Cache the products for this customer number
        productCache.set(cacheKey, {
          pulsa: pulsaProducts,
          paket_data: paketDataProducts,
        });

        setPulsa(pulsaProducts);
        setPaketData(paketDataProducts);
      } else {
        // Fallback to original structure if different
        const pulsaProducts = response.data.data?.pulsas || [];
        const paketDataProducts = response.data.data?.paket_data || [];

        // Cache the products for this customer number
        productCache.set(cacheKey, {
          pulsa: pulsaProducts,
          paket_data: paketDataProducts,
        });

        setPulsa(pulsaProducts);
        setPaketData(paketDataProducts);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log('Error fetching products:', error);
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
          <View
            style={{
              flexDirection: 'row',
              marginTop: 15,
              columnGap: 15,
            }}>
            {product_type.map(t => {
              return (
                <TouchableOpacity
                  key={t}
                  style={[
                    styles.buttonTab,
                    t === type
                      ? {
                          borderBottomColor: BLUE_COLOR,
                          borderBottomWidth: 2,
                        }
                      : '',
                  ]}
                  onPress={() => setType(t)}>
                  <Text
                    style={[
                      styles.buttonTabLabel(isDarkMode),
                      t === type
                        ? {
                            color: BLUE_COLOR,
                          }
                        : '',
                    ]}>
                    {t}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
          {/* PRODUK */}
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
              {type === 'Pulsa' ? (
                <>
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
                </>
              ) : (
                <>
                  {paket_data.map(d => {
                    return (
                      <ProductCard
                        key={d.id}
                        product={d}
                        isSelected={selectItem?.id === d.id}
                        onSelect={setSelectItem}
                        style={{width: '45%'}}
                      />
                    );
                  })}
                </>
              )}
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
  buttonTab: {
    width: '47%',
    borderBottomColor: GREY_COLOR,
    borderBottomWidth: 1,
    padding: 5,
  },
  buttonTabLabel: isDarkMode => ({
    textAlign: 'center',
    color: isDarkMode ? DARK_COLOR : LIGHT_COLOR,
    fontFamily: REGULAR_FONT,
  }),
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
