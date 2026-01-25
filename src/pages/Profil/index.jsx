import {
  StyleSheet,
  Text,
  View,
  useColorScheme,
  TouchableOpacity,
  Alert,
  ScrollView,
  RefreshControl,
} from 'react-native';
import React, {useState} from 'react';
import {
  BOLD_FONT,
  DARK_BACKGROUND,
  DARK_COLOR,
  FONT_NORMAL,
  HORIZONTAL_MARGIN,
  LIGHT_COLOR,
  REGULAR_FONT,
  WHITE_BACKGROUND,
  BLUE_COLOR,
  WHITE_COLOR,
} from '../../utils/const';
import {useAuth} from '../../context/AuthContext';

export default function ProfilScreen({navigation}) {
  const isDarkMode = useColorScheme() === 'dark';
  const {user, logout, refreshUserProfile} = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  const handleLogout = () => {
    Alert.alert('Konfirmasi Logout', 'Apakah Anda yakin ingin keluar?', [
      {
        text: 'Batal',
        style: 'cancel',
      },
      {
        text: 'Keluar',
        onPress: async () => {
          try {
            // Call the logout function from context
            await logout();
            // Navigate to login screen after logout
            navigation.reset({
              index: 0,
              routes: [{name: 'Login'}],
            });
          } catch (error) {
            console.error('Logout error:', error);
            Alert.alert('Error', 'Gagal logout. Silakan coba lagi.');
          }
        },
      },
    ]);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshUserProfile();
    } catch (error) {
      console.error('Failed to refresh user profile:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const cardBackgroundColor = isDarkMode ? DARK_BACKGROUND : WHITE_BACKGROUND;

  const styles = StyleSheet.create({
    profileHeader: {
      marginBottom: 20,
      paddingTop: 20,
    },
    title: {
      fontSize: FONT_NORMAL + 4,
      fontFamily: BOLD_FONT,
      color: isDarkMode ? DARK_COLOR : LIGHT_COLOR,
    },
    profileInfo: {
      backgroundColor: cardBackgroundColor,
      borderRadius: 10,
      padding: 15,
      marginBottom: 20,
      elevation: 3,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.22,
      shadowRadius: 2.22,
    },
    infoRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 8,
    },
    label: {
      fontFamily: REGULAR_FONT,
      fontSize: FONT_NORMAL,
      color: isDarkMode ? DARK_COLOR : LIGHT_COLOR,
    },
    value: {
      fontFamily: REGULAR_FONT,
      fontSize: FONT_NORMAL,
      textAlign: 'right',
      flex: 1,
      marginLeft: 20,
      color: isDarkMode ? DARK_COLOR : LIGHT_COLOR,
    },
    divider: {
      height: 1,
      backgroundColor: isDarkMode ? 'rgb(255, 255, 255)' : '#000000',
      marginVertical: 8,
    },
    logoutSection: {
      flex: 1,
      justifyContent: 'flex-end',
      marginBottom: 30,
    },
    settingsSection: {
      marginBottom: 10,
    },
    settingsButton: {
      backgroundColor: BLUE_COLOR,
      padding: 15,
      borderRadius: 10,
      alignItems: 'center',
    },
    settingsButtonText: {
      color: WHITE_COLOR,
      fontFamily: BOLD_FONT,
      fontSize: FONT_NORMAL,
    },
    logoutButton: {
      backgroundColor: '#ff4444',
      padding: 15,
      borderRadius: 10,
      alignItems: 'center',
    },
    logoutButtonText: {
      color: WHITE_COLOR,
      fontFamily: BOLD_FONT,
      fontSize: FONT_NORMAL,
    },
  });

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: isDarkMode ? DARK_BACKGROUND : WHITE_BACKGROUND,
      }}
      contentContainerStyle={{padding: HORIZONTAL_MARGIN}}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      <View style={styles.profileHeader}>
        <Text style={styles.title}>Profil Pengguna</Text>
      </View>

      <View style={styles.profileInfo}>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Nama</Text>
          <Text style={styles.value}>{user?.name || '-'}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.infoRow}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{user?.email || '-'}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.infoRow}>
          <Text style={styles.label}>Saldo</Text>
          <Text style={styles.value}>
            Rp {user?.saldo ? parseFloat(user.saldo).toLocaleString() : '0'}
          </Text>
        </View>
      </View>

      <View style={styles.settingsSection}>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => navigation.navigate('Settings')}>
          <Text style={styles.settingsButtonText}>Pengaturan</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.logoutSection}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
