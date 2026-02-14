import {
  StyleSheet,
  Text,
  View,
  useColorScheme,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Image,
  SafeAreaView,
} from 'react-native';
import CustomHeader from '../../components/CustomHeader';
import React from 'react';
import {
  BOLD_FONT,
  DARK_BACKGROUND,
  DARK_COLOR,
  FONT_NORMAL,
  FONT_SEDANG,
  HORIZONTAL_MARGIN,
  LIGHT_COLOR,
  MEDIUM_FONT,
  REGULAR_FONT,
  SLATE_COLOR,
  WHITE_COLOR,
  BLUE_COLOR,
  WHITE_BACKGROUND,
  GREY_COLOR,
} from '../../utils/const';
import {mainmenus} from '../../data/mainmenu';
import {useAuth} from '../../context/AuthContext';
import {Alert} from '../../utils/alert';

export default function LihatSemuaScreen({navigation}) {
  const isDarkMode = useColorScheme() === 'dark';
  const {user} = useAuth();

  // Services data based on mainmenus (all services including PDAM, Internet, BPJS)
  const services = mainmenus.map((item, index) => ({
    ...item,
    id: index,
  }));

  const pascabayarLabels = ['bpjs kesehatan', 'pdam', 'internet'];
  
  const prabayarServices = services.filter(item => 
    !pascabayarLabels.includes(item.label.toLowerCase())
  );
  
  const pascabayarServices = services.filter(item => 
    pascabayarLabels.includes(item.label.toLowerCase())
  );

  // Coming soon services
  const comingSoonServices = ['PDAM', 'Internet'];

  const handleServicePress = (item) => {
    if (comingSoonServices.includes(item.label)) {
      Alert.alert('Segera Hadir', `Fitur ${item.label} akan segera hadir!`);
    } else {
      navigation.navigate(item.path);
    }
  };

  const renderServiceItem = ({item}) => (
    <TouchableOpacity
      style={styles.serviceItem}
      onPress={() => handleServicePress(item)}>
      <View
        style={[
          styles.serviceIconContainer,
          {backgroundColor: isDarkMode ? '#1a2332' : '#f1f5f9'},
        ]}>
        <Image source={item.ikon} style={styles.serviceIcon} />
      </View>
      <Text
        style={[
          styles.serviceLabel,
          {color: isDarkMode ? '#cbd5e1' : '#334155'},
        ]}>
        {item.label}
      </Text>
      {comingSoonServices.includes(item.label) && (
        <Text
          style={[
            styles.comingSoonBadge,
            {color: '#f59e0b'},
          ]}>
          Segera
        </Text>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: isDarkMode ? DARK_BACKGROUND : WHITE_BACKGROUND}}>
      <CustomHeader title="Semua Layanan" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom: 40}}>
        <View style={styles.servicesSection}>
          <Text style={[styles.sectionTitle, {color: isDarkMode ? DARK_COLOR : LIGHT_COLOR}]}>
            Layanan Prabayar
          </Text>
          <FlatList
            data={prabayarServices}
            numColumns={4}
            renderItem={renderServiceItem}
            keyExtractor={item => item.id.toString()}
            scrollEnabled={false}
            contentContainerStyle={styles.gridContent}
          />

          <Text style={[styles.sectionTitle, {color: isDarkMode ? DARK_COLOR : LIGHT_COLOR, marginTop: 10}]}>
            Layanan Pascabayar
          </Text>
          <FlatList
            data={pascabayarServices}
            numColumns={4}
            renderItem={renderServiceItem}
            keyExtractor={item => item.id.toString()}
            scrollEnabled={false}
            contentContainerStyle={styles.gridContent}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: HORIZONTAL_MARGIN,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  servicesSection: {
    flex: 1,
    marginHorizontal: HORIZONTAL_MARGIN,
    marginTop: 20,
  },
  gridContent: {
    paddingBottom: 10,
  },
  serviceItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    margin: 4,
  },
  serviceIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  serviceIcon: {
    width: 26,
    height: 26,
  },
  serviceLabel: {
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },
  comingSoonBadge: {
    fontSize: 9,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: BOLD_FONT,
    marginBottom: 10,
  },
});
