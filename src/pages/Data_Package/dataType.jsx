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
import { api } from '../../utils/api';

export default function DataType({route, navigation}) {
  const {provider, title} = route.params;
  const isDarkMode = useColorScheme() === 'dark';
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTypes();
  }, []);

  const fetchTypes = async () => {
    try {
      setLoading(true);
      const response = await api.post('/api/product/data', {
        provider: provider, // Pass the selected provider
      });

      console.log('API Response:', response.data); // Debug log

      if (response.data && response.data.data) {
        // Extract unique types from the data
        let allProducts = [];

        // Handle different possible structures of the response
        if (response.data.data.paket_data) {
          allProducts = response.data.data.paket_data;
        } else if (Array.isArray(response.data.data)) {
          allProducts = response.data.data;
        } else if (response.data.data && typeof response.data.data === 'object') {
          // If data contains other nested properties, try to find products
          allProducts = Object.values(response.data.data).flat().filter(item => item && typeof item === 'object');
        }

        console.log('All products:', allProducts); // Debug log

        // Filter to ensure we only have objects with a 'type' property
        const validProducts = allProducts.filter(item => item && item.type);

        // Extract unique types
        const uniqueTypes = [...new Set(validProducts.map(item => item.type))];

        console.log('Unique types:', uniqueTypes); // Debug log

        // Format the types for display
        const formattedTypes = uniqueTypes
          .filter(type => type) // Filter out any undefined/null types
          .map(type => ({
            id: type,
            name: type,
            provider: provider
          }));

        setTypes(formattedTypes);
      }
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
      console.error('Error fetching types:', err);
    }
  };

  const handleTypePress = (selectedType) => {
    navigation.navigate('TopupData', {
      provider: provider,
      type: selectedType.name,
      title: `${provider} ${selectedType.name}`,
    });
  };

  const renderTypeItem = ({item}) => (
    <TouchableOpacity
      style={styles.typeButton(isDarkMode)}
      onPress={() => handleTypePress(item)}>
      <Text style={styles.typeButtonText(isDarkMode)}>{item.name}</Text>
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

  if (error) {
    return (
      <View style={[styles.wrapper(isDarkMode), {justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20}]}>
        <Text style={[styles.typeButtonText(isDarkMode), {textAlign: 'center', marginBottom: 20}]}>
          Error: {error}
        </Text>
        <TouchableOpacity
          style={[styles.typeButton(isDarkMode), {backgroundColor: '#138EE9', alignItems: 'center'}]}
          onPress={fetchTypes}
        >
          <Text style={[styles.typeButtonText(isDarkMode), {color: 'white'}]}>Coba Lagi</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.wrapper(isDarkMode)}>
      <View style={styles.container(isDarkMode)}>
        <Text style={styles.title(isDarkMode)}>Pilih Jenis Paket {provider}</Text>
        <FlatList
          data={types}
          renderItem={renderTypeItem}
          keyExtractor={(item) => item.id.toString()}
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
  title: isDarkMode => ({
    fontFamily: REGULAR_FONT,
    fontSize: 18,
    color: isDarkMode ? DARK_COLOR : LIGHT_COLOR,
    marginBottom: 15,
  }),
  typeButton: isDarkMode => ({
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: isDarkMode ? SLATE_COLOR : GREY_COLOR,
    padding: 10,
    justifyContent: 'space-between',
  }),
  typeButtonText: isDarkMode => ({
    fontFamily: REGULAR_FONT,
    color: isDarkMode ? DARK_COLOR : LIGHT_COLOR,
  }),
});