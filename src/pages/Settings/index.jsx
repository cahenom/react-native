import {
  StyleSheet,
  Text,
  View,
  useColorScheme,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import React, {useState, useEffect} from 'react';
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
  GREY_COLOR,
  SLATE_COLOR,
} from '../../utils/const';
import {useAuth} from '../../context/AuthContext';
import {api} from '../../utils/api';

export default function SettingsScreen({navigation}) {
  const isDarkMode = useColorScheme() === 'dark';
  const {user, reloadUserData} = useAuth();
  
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Update local state when user data changes
    setName(user?.name || '');
    setEmail(user?.email || '');
  }, [user]);

  const handleUpdateProfile = async () => {
    if (!name.trim() || !email.trim()) {
      Alert.alert('Error', 'Nama dan email harus diisi');
      return;
    }

    setLoading(true);
    
    try {
      const response = await api.post('/api/user/profile', {
        name: name.trim(),
        email: email.trim()
      });
      
      console.log('Update response:', response.data);
      
      if (response.data && response.data.status) {
        Alert.alert('Success', 'Profil berhasil diperbarui');
        
        // Reload user data to update the context
        await reloadUserData();
        
        // Navigate back to profile
        navigation.goBack();
      } else {
        Alert.alert('Error', response.data.message || 'Gagal memperbarui profil');
      }
    } catch (error) {
      console.error('Update error:', error);
      if (error.response?.data?.message) {
        Alert.alert('Error', error.response.data.message);
      } else {
        Alert.alert('Error', 'Gagal memperbarui profil. Silakan coba lagi.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View
      style={[
        styles.container,
        {backgroundColor: isDarkMode ? DARK_BACKGROUND : WHITE_BACKGROUND},
      ]}>
      <View style={styles.formContainer}>
        <Text style={[styles.title, {color: isDarkMode ? DARK_COLOR : LIGHT_COLOR}]}>
          Pengaturan Profil
        </Text>
        
        <View style={styles.inputGroup}>
          <Text style={[styles.label, {color: isDarkMode ? DARK_COLOR : LIGHT_COLOR}]}>
            Nama
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: isDarkMode ? DARK_BACKGROUND : WHITE_COLOR,
                color: isDarkMode ? DARK_COLOR : LIGHT_COLOR,
                borderColor: isDarkMode ? SLATE_COLOR : GREY_COLOR,
              },
            ]}
            value={name}
            onChangeText={setName}
            placeholder="Masukkan nama anda"
            placeholderTextColor={isDarkMode ? SLATE_COLOR : GREY_COLOR}
          />
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={[styles.label, {color: isDarkMode ? DARK_COLOR : LIGHT_COLOR}]}>
            Email
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: isDarkMode ? DARK_BACKGROUND : WHITE_COLOR,
                color: isDarkMode ? DARK_COLOR : LIGHT_COLOR,
                borderColor: isDarkMode ? SLATE_COLOR : GREY_COLOR,
              },
            ]}
            value={email}
            onChangeText={setEmail}
            placeholder="Masukkan email anda"
            placeholderTextColor={isDarkMode ? SLATE_COLOR : GREY_COLOR}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
        
        <TouchableOpacity 
          style={styles.updateButton} 
          onPress={handleUpdateProfile}
          disabled={loading}
        >
          <Text style={styles.updateButtonText}>
            {loading ? 'Memperbarui...' : 'Perbarui Profil'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: HORIZONTAL_MARGIN,
  },
  formContainer: {
    marginTop: 20,
  },
  title: {
    fontSize: FONT_NORMAL + 4,
    fontFamily: BOLD_FONT,
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontFamily: REGULAR_FONT,
    fontSize: FONT_NORMAL,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    fontFamily: REGULAR_FONT,
  },
  updateButton: {
    backgroundColor: BLUE_COLOR,
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  updateButtonText: {
    color: WHITE_COLOR,
    fontFamily: REGULAR_FONT,
    fontSize: FONT_NORMAL,
  },
});