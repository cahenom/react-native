import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  Alert,
} from 'react-native';
import React, {useState} from 'react';
import {
  API_URL,
  BLUE_COLOR,
  BOLD_FONT,
  DARK_BACKGROUND,
  DARK_COLOR,
  GREY_COLOR,
  HORIZONTAL_MARGIN,
  LIGHT_COLOR,
  REGULAR_FONT,
  SLATE_COLOR,
  WHITE_BACKGROUND,
  WHITE_COLOR,
} from '../../utils/const';
import {Eye, EyeCros} from '../../assets';
import {api} from '../../utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useAuth} from '../../context/AuthContext';
import {getFcmToken} from '../../utils/notifications';

export default function LoginPage({navigation}) {
  const {loginWithFallback, setIsLoggedIn, setLoggedInState} = useAuth();
  const isDarkMode = useColorScheme() === 'dark';
  const [isSecure, setIsSecure] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    // Basic validation
    if (!email || !password) {
      Alert.alert('Error', 'Email dan password wajib diisi');
      return;
    }

    setLoading(true);

    try {
      // Gunakan fungsi login baru dengan fallback
      const result = await loginWithFallback(email, password);

      if (result.success) {
        if (result.usingLocalData) {
          Alert.alert('Info', 'Login menggunakan data lokal karena koneksi ke server gagal.');
        } else {
          Alert.alert('Success', 'Login berhasil');
        }
      } else if (result.error === 'retry_needed') {
        // Jika pengguna memilih untuk mencoba lagi
        setLoading(false);
        // Panggil fungsi login lagi
        await handleLogin();
      } else if (result.error === 'cancelled') {
        // Jika pengguna membatalkan login
        setLoading(false);
      } else {
        // Jika ada error lain
        setLoading(false);
      }
    } catch (error) {
      console.log('Login error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        config: error.config ? {
          url: error.config.url,
          method: error.config.method,
          data: error.config.data
        } : undefined
      });

      setLoading(false);
    }
  };


  return (
    <View
      style={{
        flex: 1,
        backgroundColor: isDarkMode ? DARK_BACKGROUND : WHITE_BACKGROUND,
      }}>
      <View
        style={{
          marginHorizontal: HORIZONTAL_MARGIN,
          justifyContent: 'center',
          height: '100%',
        }}>
        <View
          style={{
            marginBottom: 15,
          }}>
          <Text
            style={{
              fontFamily: BOLD_FONT,
              fontSize: 24,
              color: isDarkMode ? DARK_COLOR : LIGHT_COLOR,
            }}>
            Login
          </Text>
        </View>
        <TextInput
          style={{
            borderWidth: 1,
            borderColor: isDarkMode ? SLATE_COLOR : GREY_COLOR,
            borderRadius: 5,
            padding: 10,
            fontFamily: REGULAR_FONT,
            color: isDarkMode ? DARK_COLOR : LIGHT_COLOR,
          }}
          placeholder="Masukan email"
          placeholderTextColor={isDarkMode ? SLATE_COLOR : GREY_COLOR}
          value={email}
          onChangeText={text => setEmail(text.trim())}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <View style={{height: 20}} />

        <View
          style={{
            borderWidth: 1,
            borderColor: isDarkMode ? SLATE_COLOR : GREY_COLOR,
            borderRadius: 5,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 10,
          }}>
          <TextInput
            style={{
              fontFamily: REGULAR_FONT,
              color: isDarkMode ? DARK_COLOR : LIGHT_COLOR,
              flex: 1,
            }}
            placeholder="Password"
            placeholderTextColor={isDarkMode ? SLATE_COLOR : GREY_COLOR}
            secureTextEntry={isSecure}
            value={password}
            onChangeText={text => setPassword(text)}
          />
          <TouchableOpacity onPress={() => setIsSecure(!isSecure)}>
            {isSecure ? <Eye /> : <EyeCros />}
          </TouchableOpacity>
        </View>

        <View style={{height: 20}} />

        <TouchableOpacity
          style={{
            backgroundColor: loading ? '#99ccff' : BLUE_COLOR,
            padding: 10,
            borderRadius: 5,
            opacity: loading ? 0.7 : 1,
          }}
          onPress={handleLogin}
          disabled={loading}>
          <Text
            style={{
              color: WHITE_COLOR,
              textAlign: 'center',
              fontFamily: REGULAR_FONT,
            }}>
            {loading ? 'Loading...' : 'Login'}
          </Text>
        </TouchableOpacity>
        <View style={{height: 20}} />
        <Text
          style={{
            color: isDarkMode ? SLATE_COLOR : GREY_COLOR,
            textAlign: 'center',
            fontFamily: REGULAR_FONT,
          }}>
            atau
        </Text>
        <View style={{height: 20}} />
        <View
          style={{
            flexDirection: 'row',
            columnGap: 5,
            justifyContent: 'center',
          }}>
          <Text>Belum punya akun?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={{color: BLUE_COLOR}}>Daftar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({});