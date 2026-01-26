import { StyleSheet, Text, View, TextInput, TouchableOpacity, useColorScheme, Alert} from 'react-native'
import React, {useState} from 'react'
import { API_URL, BLUE_COLOR, BOLD_FONT, DARK_BACKGROUND, DARK_COLOR, GREY_COLOR, HORIZONTAL_MARGIN, LIGHT_COLOR, REGULAR_FONT, SLATE_COLOR, WHITE_BACKGROUND, WHITE_COLOR } from '../../utils/const'
import { Eye, EyeCros } from '../../assets'
import {api} from '../../utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useAuth} from '../../context/AuthContext';
import {getFcmToken} from '../../utils/notifications';

export default function RegisterPage({navigation}) {
    const {setIsLoggedIn, setLoggedInState} = useAuth();
    const isDarkMode = useColorScheme() === 'dark'
    const [isSecure, setIsSecure] = useState(true)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [passwordConfirmation, setPasswordConfirmation] = useState('')
    const [loading, setLoading] = useState(false)

    const handleRegister = async () => {
      if (!name || !email || !password || !passwordConfirmation) {
        Alert.alert('Error', 'Semua field wajib diisi')
        return
      }

      if (password !== passwordConfirmation) {
        Alert.alert('Error', 'Konfirmasi password tidak cocok')
        return
      }

      setLoading(true)

      try {
        // Dapatkan FCM token
        const fcmToken = await getFcmToken();

        const registerData = {
          name,
          email,
          password,
          password_confirmation: passwordConfirmation
        };

        // Tambahkan FCM token ke data registrasi jika tersedia
        if (fcmToken) {
          registerData.fcm_token = fcmToken;
        }

        const response = await api.post(`/api/auth/register`, registerData);

        console.log('Register response:', response.data); // Debug log

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

        Alert.alert('Success', 'Registrasi berhasil');

      } catch (error) {
        console.log('Register error details:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
        });

        // Error will be handled by global interceptor
      } finally {
        setLoading(false)
      }
    }

  return (
    <View style={{
        flex : 1,
        backgroundColor : isDarkMode ? DARK_BACKGROUND : WHITE_BACKGROUND
     }}>
        <View style={{
            marginHorizontal : HORIZONTAL_MARGIN,
            justifyContent : 'center',
            height : '100%',
         }}>
            <View style={{
                marginBottom : 15
             }}>
                <Text style={{
                    fontFamily : BOLD_FONT,
                    fontSize : 24,
                    color : isDarkMode ? DARK_COLOR : LIGHT_COLOR
                }}>Register</Text>
            </View>
            <TextInput
            style={{
                borderWidth: 1,
                borderColor : isDarkMode ? SLATE_COLOR : GREY_COLOR,
                borderRadius : 5,
                padding : 10,
                fontFamily : REGULAR_FONT,
                color : isDarkMode ? DARK_COLOR : LIGHT_COLOR
             }}
             placeholder='Masukan Nama'
             placeholderTextColor={isDarkMode ? SLATE_COLOR : GREY_COLOR}
             value={name}
             onChangeText={text => setName(text)}
            />
             <View style={{height : 20}}/>
            <TextInput
            style={{
                borderWidth: 1,
                borderColor : isDarkMode ? SLATE_COLOR : GREY_COLOR,
                borderRadius : 5,
                padding : 10,
                fontFamily : REGULAR_FONT,
                color : isDarkMode ? DARK_COLOR : LIGHT_COLOR
             }}
             placeholder='Masukan email'
             placeholderTextColor={isDarkMode ? SLATE_COLOR : GREY_COLOR}
             value={email}
             onChangeText={text => setEmail(text.trim())}
             keyboardType="email-address"
             autoCapitalize="none"
            />

            <View style={{height : 20}}/>

            <View
              style={{
                borderWidth: 1,
                borderColor : isDarkMode ? SLATE_COLOR : GREY_COLOR,
                borderRadius : 5,
                flexDirection: 'row',
                alignItems : 'center',
                justifyContent : 'space-between',
                paddingHorizontal: 10
             }}
            >
                <TextInput style={{
                fontFamily : REGULAR_FONT,
                color : isDarkMode ? DARK_COLOR : LIGHT_COLOR,
                flex : 1
             }}
             placeholder='Password'
             placeholderTextColor={isDarkMode ? SLATE_COLOR : GREY_COLOR}
             secureTextEntry={isSecure}
             value={password}
             onChangeText={text => setPassword(text)}/>
               <TouchableOpacity onPress={() => setIsSecure(!isSecure)}>
                {isSecure ? <Eye /> : <EyeCros />}
               </TouchableOpacity>
            </View>

            <View style={{height : 20}}/>

            <View
              style={{
                borderWidth: 1,
                borderColor : isDarkMode ? SLATE_COLOR : GREY_COLOR,
                borderRadius : 5,
                flexDirection: 'row',
                alignItems : 'center',
                justifyContent : 'space-between',
                paddingHorizontal: 10
             }}
            >
                <TextInput style={{
                fontFamily : REGULAR_FONT,
                color : isDarkMode ? DARK_COLOR : LIGHT_COLOR,
                flex : 1
             }}
             placeholder='Konfirmasi Password'
             placeholderTextColor={isDarkMode ? SLATE_COLOR : GREY_COLOR}
             secureTextEntry={isSecure}
             value={passwordConfirmation}
             onChangeText={text => setPasswordConfirmation(text)}/>
            </View>

            <View style={{height : 20}}/>

            <TouchableOpacity 
              style={{
                  backgroundColor : loading ? '#99ccff' : BLUE_COLOR,
                  padding : 10,
                  borderRadius : 5,
                  opacity: loading ? 0.7 : 1
               }}
               onPress={handleRegister}
               disabled={loading}>
                <Text style={{ color : WHITE_COLOR, textAlign : 'center', fontFamily : REGULAR_FONT }}> 
                  {loading ? 'Loading...' : 'Register'}
                </Text>
            </TouchableOpacity>

            <View style={{height : 20}}/>
            <View
              style={{
                flexDirection: 'row',
                columnGap: 5,
                justifyContent: 'center',
              }}>
              <Text>Sudah punya akun?</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={{color: BLUE_COLOR}}>Login</Text>
              </TouchableOpacity>
            </View>

        </View>
    </View>
  )
}

const styles = StyleSheet.create({})