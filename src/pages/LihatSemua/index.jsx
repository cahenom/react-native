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

export default function LihatSemuaScreen({navigation}) {
  const isDarkMode = useColorScheme() === 'dark';
  const {user} = useAuth();

  // Services data based on mainmenus (all services including PDAM, Internet, BPJS)
  const services = mainmenus.map((item, index) => ({
    ...item,
    id: index,
  }));

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: isDarkMode ? DARK_BACKGROUND : WHITE_BACKGROUND}}>
      <CustomHeader title="Semua Layanan" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.servicesSection}>
        <FlatList
          data={services}
          numColumns={4}
          renderItem={({item}) => (
            <TouchableOpacity
              style={styles.serviceItem}
              onPress={() => navigation.navigate(item.path)}>
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
            </TouchableOpacity>
          )}
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
    paddingBottom: 100,
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
});
