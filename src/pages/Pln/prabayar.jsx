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
import React, {useState, useEffect, useMemo} from 'react';
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

// Cache to store fetched products
const productCache = new Map();

export default function PLNPrabayar() {
  const isDarkMode = useColorScheme() === 'dark';

  const [customer_no, setCustomerNo] = useState('');
  const [selectItem, setSelectItem] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Memoized sorted products to avoid re-sorting on every render
  const sortedProducts = useMemo(() => {
    return [...products].sort((a, b) => a.price - b.price);
  }, [products]);

  const resetInput = () => {
    setCustomerNo('');
  };

  const fetchProducts = async () => {
    try {
      // Check if products are already cached
      if (productCache.has('pln_prabayar')) {
        console.log('Using cached PLN Prabayar products');
        const cachedProducts = productCache.get('pln_prabayar');
        setProducts(cachedProducts);
        return;
      }

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

        // Cache the products
        productCache.set('pln_prabayar', transformedProducts);
        setProducts(transformedProducts);
      } else {
        Alert.alert('Error', 'Struktur data tidak sesuai. Silakan hubungi administrator.');
      }
    } catch (error) {
      console.error('Error fetching PLN products:', error);
      if (error.response?.status === 405) {
        Alert.alert('Error', 'Metode tidak diizinkan. Endpoint mungkin salah atau tidak mendukung metode POST.');
      } else if (error.response?.status === 401) {
        Alert.alert('Error', 'Autentikasi gagal. Token mungkin sudah kadaluarsa.');
      } else if (error.response?.status === 404) {
        Alert.alert('Error', 'Endpoint tidak ditemukan. Silakan periksa kembali alamat API.');
      } else {
        Alert.alert('Error', `Gagal memuat produk PLN: ${error.message}\nStatus: ${error.response?.status || 'Unknown'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // Load products when component mounts
  useEffect(() => {
    fetchProducts();
  }, []);

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
        <View style={[styles.bottom, {backgroundColor: isDarkMode ? DARK_BACKGROUND : WHITE_BACKGROUND}]}>
          <TouchableOpacity style={styles.bottomButton} onPress={handleContinue}>
            <Text style={styles.buttonText}>Lanjutkan</Text>
          </TouchableOpacity>
        </View>
      )}
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
});
