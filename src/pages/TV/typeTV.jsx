import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  useColorScheme,
  FlatList,
  SafeAreaView,
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

export default function TypeTV({route, navigation}) {
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
      const response = await api.post('/api/product/tv', {
        provider: provider.toLowerCase(),
      });

      if (response.data && response.data.data) {
        let allProducts = response.data.data.tv || [];
        
        // Filter to ensure we only have objects with a 'type' property and belong to the selected provider
        const validProducts = allProducts.filter(item =>
          item && item.type && item.provider &&
          item.provider.toLowerCase() === provider.toLowerCase()
        );

        // Extract unique types
        const uniqueTypes = [...new Set(validProducts.map(item => item.type))];

        // Format the types for display
        const formattedTypes = uniqueTypes
          .filter(type => type)
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
      console.error('Error fetching TV types:', err);
    }
  };

  const handleTypePress = (selectedType) => {
    navigation.navigate('TopupTV', {
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
      <CustomHeader title={title || "Jenis Layanan TV"} />
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
          ) : types.length > 0 ? (
            <FlatList
              data={types}
              renderItem={renderTypeItem}
              keyExtractor={(item) => item.id.toString()}
              showsVerticalScrollIndicator={false}
              style={styles.flatList}
            />
          ) : (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <Text style={styles.typeButtonText(isDarkMode)}>Tidak ada jenis layanan tersedia</Text>
            </View>
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
