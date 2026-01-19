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

export default function LoginPage({navigation}) {
  const {setIsLoggedIn, setLoggedInState} = useAuth();
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
      const response = await api.post(`/api/auth/login`, {
        email,
        password,
      });

      console.log('Login response:', response.data); // Debug log

      const token = response.data.data?.token;
      const user = response.data.data?.user;

      if (!token) {
        throw new Error('Token tidak ditemukan dalam respons');
      }

      // SIMPAN TOKEN
      await AsyncStorage.setItem('token', token);

      // SIMPAN USER
      await AsyncStorage.setItem('user', JSON.stringify(user));

      // Update the context state with user data
      setLoggedInState(user);

      Alert.alert('Success', 'Login berhasil');

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

      // Handle different error scenarios
      if (error.response?.status === 401) {
        Alert.alert('Error', 'Email atau password salah');
      } else if (error.response?.status === 422) {
        // Validation error
        const errors = error.response.data.errors || error.response.data.message;
        Alert.alert('Error Validasi', typeof errors === 'string' ? errors : JSON.stringify(errors));
      } else if (error.code === 'NETWORK_ERROR') {
        Alert.alert('Error Jaringan', 'Tidak dapat terhubung ke server. Pastikan jaringan internet Anda stabil.');
      } else {
        Alert.alert('Error', error.response?.data?.message || 'Terjadi kesalahan saat login. Silakan coba lagi.');
      }
    } finally {
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