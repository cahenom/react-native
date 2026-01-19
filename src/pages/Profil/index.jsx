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
    Alert.alert(
      'Konfirmasi Logout',
      'Apakah Anda yakin ingin keluar?',
      [
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
                routes: [{ name: 'Login' }],
              });
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert('Error', 'Gagal logout. Silakan coba lagi.');
            }
          },
        },
      ]
    );
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

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: isDarkMode ? DARK_BACKGROUND : WHITE_BACKGROUND,
      }}
      contentContainerStyle={{padding: HORIZONTAL_MARGIN}}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.profileHeader}>
        <Text
          style={[
            styles.title,
            {color: isDarkMode ? DARK_COLOR : LIGHT_COLOR},
          ]}>
          Profil Pengguna
        </Text>
      </View>

      <View style={styles.profileInfo}>
        <View style={styles.infoRow}>
          <Text
            style={[
              styles.label,
              {color: isDarkMode ? DARK_COLOR : LIGHT_COLOR},
            ]}>
            Nama
          </Text>
          <Text
            style={[
              styles.value,
              {color: isDarkMode ? DARK_COLOR : LIGHT_COLOR},
            ]}>
            {user?.name || '-'}
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.infoRow}>
          <Text
            style={[
              styles.label,
              {color: isDarkMode ? DARK_COLOR : LIGHT_COLOR},
            ]}>
            Email
          </Text>
          <Text
            style={[
              styles.value,
              {color: isDarkMode ? DARK_COLOR : LIGHT_COLOR},
            ]}>
            {user?.email || '-'}
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.infoRow}>
          <Text
            style={[
              styles.label,
              {color: isDarkMode ? DARK_COLOR : LIGHT_COLOR},
            ]}>
            Saldo
          </Text>
          <Text
            style={[
              styles.value,
              {color: isDarkMode ? DARK_COLOR : LIGHT_COLOR},
            ]}>
            Rp {user?.saldo ? parseFloat(user.saldo).toLocaleString() : '0'}
          </Text>
        </View>
      </View>

      <View style={styles.logoutSection}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  profileHeader: {
    marginBottom: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: FONT_NORMAL + 4,
    fontFamily: BOLD_FONT,
  },
  profileInfo: {
    backgroundColor: WHITE_COLOR,
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
  },
  value: {
    fontFamily: REGULAR_FONT,
    fontSize: FONT_NORMAL,
    textAlign: 'right',
    flex: 1,
    marginLeft: 20,
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 8,
  },
  logoutSection: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 30,
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