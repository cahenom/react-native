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
import {fetchProviderList} from '../../helpers/providerHelper';

export default function Voucher({navigation}) {
  const isDarkMode = useColorScheme() === 'dark';
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProviders();
  }, []);

  const [error, setError] = useState(null);

  const fetchProviders = async () => {
    setLoading(true);
    const result = await fetchProviderList('voucher_providers', '/api/product/voucher', 'voucher');

    setProviders(result.providers);
    setError(result.error);
    setLoading(false);
  };

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    fetchProviders();
  };

  const handleProviderPress = (provider) => {
    navigation.navigate('TopupVoucher', {
      provider: provider,
      title: `${provider} Voucher`,
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

  if (loading && !error) {
    return (
      <View style={[styles.wrapper(isDarkMode), {justifyContent: 'center', alignItems: 'center'}]}>
        <ActivityIndicator size="large" color="#138EE9" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.wrapper(isDarkMode), {justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20}]}>
        <Text style={[styles.buttonText(isDarkMode), {textAlign: 'center', marginBottom: 20}]}>
          {error}
        </Text>
        <TouchableOpacity
          style={[styles.layananButton(isDarkMode), {backgroundColor: '#138EE9', alignItems: 'center'}]}
          onPress={handleRetry}
        >
          <Text style={[styles.buttonText(isDarkMode), {color: 'white'}]}>Coba Lagi</Text>
        </TouchableOpacity>
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