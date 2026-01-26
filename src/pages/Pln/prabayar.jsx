import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  useColorScheme,
  ScrollView,
  ActivityIndicator,
  Alert,
  SafeAreaView,
} from 'react-native';
import React, {useState, useEffect, useMemo, useRef} from 'react';
import usePersistentState from '../../hooks/usePersistentState';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  BLUE_COLOR,
  DARK_BACKGROUND,
  DARK_COLOR,
  FONT_KECIL,
  FONT_NORMAL,
  GREEN_COLOR,
  GREY_COLOR,
  HORIZONTAL_MARGIN,
  LIGHT_COLOR,
  MEDIUM_FONT,
  REGULAR_FONT,
  SLATE_COLOR,
  WHITE_BACKGROUND,
  WHITE_COLOR,
  windowWidth,
} from '../../utils/const';
import Input from '../../components/form/Input';
import {CheckProduct} from '../../assets';
import {api} from '../../utils/api';
import ProductList from '../../components/ProductList';
import BottomButton from '../../components/BottomButton';
import BottomModal from '../../components/BottomModal';
import TransactionDetail from '../../components/TransactionDetail';
import {numberWithCommas} from '../../utils/formatter';

// Cache to store fetched products
const productCache = new Map();

export default function PLNPrabayar({navigation}) {
  const isDarkMode = useColorScheme() === 'dark';

  const [customer_no, setCustomerNo] = useState('');
  const [selectItem, setSelectItem] = useState(null);
  const [products, setProducts, isLoadingFromHook, , isCacheExpired, needsBackgroundRefresh, isRefreshing] = usePersistentState('pln_prabayar_products', []);
  const [loading, setLoading] = useState(true);
  const hasLoaded = useRef(false); // Track if data has been loaded in this session

  // Memoized sorted products to avoid re-sorting on every render
  const sortedProducts = useMemo(() => {
    return [...products].sort((a, b) => a.price - b.price);
  }, [products]);

  const resetInput = () => {
    setCustomerNo('');
  };

  const handleRefresh = async () => {
    setLoading(true);
    await fetchProducts(true); // Force refresh when user wants to update data
    setLoading(false);
  };

  const fetchProducts = async (forceRefresh = false) => {
    // Show loading only when forcing refresh
    if (forceRefresh) {
      setLoading(true);
    }

    // Check if products are already cached in memory
    if (productCache.has('pln_prabayar') && !forceRefresh) {
      console.log('Using cached PLN Prabayar products without fetching');
      const cachedProducts = productCache.get('pln_prabayar');
      await setProducts(cachedProducts);
      if (forceRefresh) {
        setLoading(false);
      }
      return;
    }

    // Check if products are cached in AsyncStorage
    if (!forceRefresh) {
      try {
        const cachedData = await AsyncStorage.getItem('pln_prabayar_cache');
        if (cachedData) {
          const parsedData = JSON.parse(cachedData);
          productCache.set('pln_prabayar', parsedData);
          await setProducts(parsedData);
          if (forceRefresh) {
            setLoading(false);
          }

          // Optionally fetch fresh data in the background if not forcing refresh
          try {
            const response = await api.post('/api/product/pln');
            if (response.data && response.data.data && response.data.data.pln) {
              const allProducts = response.data.data.pln;
              const prepaidProducts = allProducts;

              const transformedProducts = prepaidProducts.map(item => ({
                id: item.id,
                label: item.name,
                price: item.price,
                desc: item.desc,
                category: item.category,
                sku: item.sku,
                multi: item.multi
              }));

              // Update cache with fresh data
              productCache.set('pln_prabayar', transformedProducts);
              await AsyncStorage.setItem('pln_prabayar_cache', JSON.stringify(transformedProducts));
            }
          } catch (bgError) {
            console.log('Background refresh failed for PLN Prabayar, keeping cached data');
          }

          return;
        }
      } catch (error) {
        console.error('Error reading cached PLN products:', error);
      }
    }

    // If no cached data or forcing refresh, try to fetch fresh data from API
    try {
      const response = await api.post('/api/product/pln');

      console.log('PLN products response:', response.data);

      if (response.data && response.data.data && response.data.data.pln) {
        const allProducts = response.data.data.pln;
        console.log('All PLN products:', allProducts);

        // Filter for prepaid products specifically - since all PLN products in the response are prepaid tokens
        const prepaidProducts = allProducts;

        const transformedProducts = prepaidProducts.map(item => ({
          id: item.id,
          label: item.name,
          price: item.price,
          desc: item.desc,
          category: item.category,
          sku: item.sku,
          multi: item.multi
        }));

        console.log('Transformed PLN prepaid products:', transformedProducts);

        // Cache the products in memory
        productCache.set('pln_prabayar', transformedProducts);

        // Cache the products in AsyncStorage for persistence
        await AsyncStorage.setItem('pln_prabayar_cache', JSON.stringify(transformedProducts));

        await setProducts(transformedProducts);
      } else {
        Alert.alert('Error', 'Struktur data tidak sesuai. Silakan hubungi administrator.');
      }
    } catch (error) {
      console.error('Error fetching PLN products:', error);

      // If there's an error but we have cached data, try to load it anyway
      try {
        const cachedData = await AsyncStorage.getItem('pln_prabayar_cache');
        if (cachedData) {
          const parsedData = JSON.parse(cachedData);
          productCache.set('pln_prabayar', parsedData);
          await setProducts(parsedData);
          console.log('Loaded cached PLN Prabayar products due to fetch error');
        } else {
          // Only show error if no cached data exists
          // Error will be handled by global interceptor
        }
      } catch (cacheError) {
        console.error('Error loading cached data as fallback:', cacheError);
        // Show error if both fetch and cache loading failed
        // Error will be handled by global interceptor
      }
    } finally {
      if (forceRefresh) {
        setLoading(false);
      }
    }
  };

  // Initialize data from persistent storage
  useEffect(() => {
    const initializeData = async () => {
      if (hasLoaded.current) {
        return; // Already initialized in this session
      }

      // Wait for persistent state to load
      if (!isLoadingFromHook) {
        // Check if cache is expired
        const expired = await isCacheExpired();
        if (products.length === 0 || expired) {
          // No data available or cache is expired, fetch fresh data
          await fetchProducts(false);
        } else {
          // We have valid cached data, no need to fetch initially
          setLoading(false);
          hasLoaded.current = true; // Mark as initialized

          // Check if background refresh is needed
          const shouldRefreshInBackground = await needsBackgroundRefresh();
          if (shouldRefreshInBackground) {
            // Fetch fresh data in background without affecting UI
            fetchProducts(false); // Don't force refresh, just update cache
          }
        }
      }
    };

    initializeData();
  }, [isLoadingFromHook, products, isCacheExpired, needsBackgroundRefresh]);

  // Update loading state based on persistent state loading
  useEffect(() => {
    if (isLoadingFromHook) {
      setLoading(true); // Still loading persistent state
    }
    // Don't override loading state set by fetchProducts
  }, [isLoadingFromHook]);

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false); // Loading state to prevent spam clicks

  const handleContinue = () => {
    if (!customer_no) {
      Alert.alert('Error', 'Silakan masukkan nomor meter');
      return;
    }
    if (!selectItem) {
      Alert.alert('Error', 'Silakan pilih produk terlebih dahulu');
      return;
    }

    console.log('Selected Item:', selectItem);
    console.log('Customer Number:', customer_no);

    // Show confirmation modal
    setShowModal(true);
  };

  const confirmOrder = async () => {
    if (isProcessing) return; // Prevent multiple clicks

    setIsProcessing(true); // Set loading state to prevent spam clicks

    try {
      const response = await api.post('/api/order/topup', {
        sku: selectItem.sku,
        customer_no: customer_no,
      });

      console.log('PLN Topup response:', response.data);

      // Close confirmation modal
      setShowModal(false);

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
      console.error('PLN Topup error:', error);
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
        <View style={styles.formGroup}>
          <Input
            value={customer_no}
            placeholder="Masukan nomor meter"
            onchange={text => setCustomerNo(text)}
            ondelete={resetInput}
            type="numeric"
            lebar={windowWidth * 0.9}
          />
        </View>
      </View>

      {/* Scrollable Product List */}
      {loading ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 50}}>
          <ActivityIndicator size="large" color="#138EE9" />
        </View>
      ) : sortedProducts.length > 0 ? (
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
            Tidak ada produk PLN Prabayar tersedia
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
  button: {
    backgroundColor: BLUE_COLOR,
    borderRadius: 5,
    padding: 15,
    flex: 1,
  },
  buttonText: {
    color: WHITE_COLOR,
    fontFamily: REGULAR_FONT,
    textAlign: 'center',
  },
  infoPelanggan: isDarkMode => ({
    backgroundColor: isDarkMode ? DARK_BACKGROUND : WHITE_BACKGROUND,
    marginTop: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: isDarkMode ? SLATE_COLOR : GREY_COLOR,
    borderRadius: 10,
  }),
  contentBlock: isDarkMode => ({
    borderBottomWidth: 1,
    borderBottomColor: isDarkMode ? SLATE_COLOR : GREY_COLOR,
    marginTop: 10,
    rowGap: 5,
  }),
  label: isDarkMode => ({
    fontFamily: MEDIUM_FONT,
    fontSize: FONT_KECIL,
    color: isDarkMode ? DARK_COLOR : LIGHT_COLOR,
  }),
  value: isDarkMode => ({
    fontFamily: REGULAR_FONT,
    fontSize: FONT_NORMAL,
    color: isDarkMode ? DARK_COLOR : LIGHT_COLOR,
  }),
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
  bottomButton: {
    backgroundColor: BLUE_COLOR,
    padding: 10,
    borderRadius: 5,
  },
});
