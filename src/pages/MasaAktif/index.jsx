import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  useColorScheme,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {
  DARK_BACKGROUND,
  DARK_COLOR,
  GREY_COLOR,
  HORIZONTAL_MARGIN,
  LIGHT_COLOR,
  REGULAR_FONT,
  SLATE_COLOR,
  WHITE_BACKGROUND,
} from '../../utils/const';
import {ArrowRight} from '../../assets';
import {api} from '../../utils/api';

export default function MasaAktif({navigation}) {
  const isDarkMode = useColorScheme() === 'dark';
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    try {
      console.log('Attempting to fetch masa aktif providers...');
      const response = await api.post('/api/product/masaaktif');

      console.log('Response status:', response.status);
      console.log('Response data:', response.data);

      if (response.data && response.data.status === "success" && response.data.data && response.data.data.masa_aktif) {
        const allProducts = response.data.data.masa_aktif;
        console.log('All products:', allProducts);

        const uniqueProviders = [...new Set(allProducts.map(item => item.provider))];
        console.log('Unique providers:', uniqueProviders);

        setProviders(uniqueProviders);
      } else {
        console.log('Unexpected response structure:', response.data);
        Alert.alert('Error', response.data.message || 'Silakan hubungi administrator.');
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
        Alert.alert('Error', error.response?.data?.message || `Gagal memuat daftar provider masa aktif: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleProviderPress = (provider) => {
    navigation.navigate('TopupMasaAktif', {
      provider: provider,
      title: `${provider} Masa Aktif`,
    });
  };

  const renderProviderItem = ({item}) => (
    <TouchableOpacity
      style={styles.layananButton(isDarkMode)}
      onPress={() => handleProviderPress(item)}>
      <Text style={styles.buttonText(isDarkMode)}>{item}</Text>
      <ArrowRight />
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={[styles.wrapper(isDarkMode), {justifyContent: 'center', alignItems: 'center'}]}>
        <ActivityIndicator size="large" color="#138EE9" />
      </View>
    );
  }

  return (
    <View style={styles.wrapper(isDarkMode)}>
      <View style={styles.container(isDarkMode)}>
        <FlatList
          data={providers}
          renderItem={renderProviderItem}
          keyExtractor={(item) => item}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: isDarkMode => ({
    flex: 1,
    backgroundColor: isDarkMode ? DARK_BACKGROUND : WHITE_BACKGROUND,
  }),
  container: isDarkMode => ({
    marginHorizontal: HORIZONTAL_MARGIN,
    marginTop: 15,
  }),
  layananButton: isDarkMode => ({
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: isDarkMode ? SLATE_COLOR : GREY_COLOR,
    padding: 10,
    justifyContent: 'space-between',
  }),
  buttonText: isDarkMode => ({
    fontFamily: REGULAR_FONT,
    color: isDarkMode ? DARK_COLOR : LIGHT_COLOR,
  }),
});