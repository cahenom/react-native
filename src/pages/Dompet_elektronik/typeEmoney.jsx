import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  useColorScheme,
  FlatList,
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
import CustomHeader from '../../components/CustomHeader';
import SkeletonCard from '../../components/SkeletonCard';
import ModernButton from '../../components/ModernButton';
import {SafeAreaView} from 'react-native';

export default function TypeEmoney({route, navigation}) {
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
      console.log('Fetching types for e-money provider:', provider); // Debug log

      const response = await api.post('/api/product/emoney', {
        provider: provider.toLowerCase(), // Pass the selected provider in lowercase
      });

      console.log('API Response for e-money types:', response.data); // Debug log

      if (response.data && response.data.data) {
        // Extract unique types from the data
        let allProducts = [];

        // Handle the correct response structure: { status, message, data: { emoney: [...] } }
        if (response.data.data && Array.isArray(response.data.data.emoney)) {
          allProducts = response.data.data.emoney;
        } else if (Array.isArray(response.data.data)) {
          // Fallback if the structure is slightly different
          allProducts = response.data.data;
        }

        console.log('All e-money products:', allProducts); // Debug log

        // Filter to ensure we only have objects with a 'type' property and belong to the selected provider
        const validProducts = allProducts.filter(item =>
          item && item.type && item.provider &&
          item.provider.toLowerCase() === provider.toLowerCase()
        );

        console.log('Valid e-money products for provider:', validProducts); // Debug log

        // Extract unique types
        const uniqueTypes = [...new Set(validProducts.map(item => item.type))];

        console.log('Unique e-money types:', uniqueTypes); // Debug log

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
      console.error('Error fetching e-money types:', err);
    }
  };

  const handleTypePress = (selectedType) => {
    navigation.navigate('TopupDompet', {
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

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: isDarkMode ? DARK_BACKGROUND : WHITE_BACKGROUND}}>
      <CustomHeader title={title || "Jenis Dompet Elektronik"} />
      <View style={styles.wrapper(isDarkMode)}>
        <View style={styles.container(isDarkMode)}>
          {loading ? (
            <FlatList
              data={[1, 2, 3, 4, 5, 6]}
              renderItem={() => <SkeletonCard style={{height: 50, marginBottom: 15}} />}
              keyExtractor={(item) => item.toString()}
            />
          ) : error ? (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20}}>
              <Text style={[styles.typeButtonText(isDarkMode), {textAlign: 'center', marginBottom: 20}]}>
                Error: {error}
              </Text>
              <ModernButton
                label="Coba Lagi"
                onPress={fetchTypes}
              />
            </View>
          ) : (
            <FlatList
              data={types}
              renderItem={renderTypeItem}
              keyExtractor={(item) => item.id.toString()}
              showsVerticalScrollIndicator={false}
              style={styles.flatList}
            />
          )}
        </View>
      </View>
    </SafeAreaView>
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
    flex: 1,
  }),
  title: isDarkMode => ({
    fontFamily: REGULAR_FONT,
    fontSize: 18,
    color: isDarkMode ? DARK_COLOR : LIGHT_COLOR,
    marginBottom: 15,
  }),
  flatList: {
    flex: 1,
  },
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