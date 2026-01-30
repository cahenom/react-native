import React, {createContext, useContext, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {api} from '../utils/api'; // Import the API utility
import {Alert} from 'react-native';
import { setBiometricEnabledStatus } from '../utils/biometricUtils';

const AuthContext = createContext();

const AuthProvider = ({children}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true); // State untuk menandakan proses pengecekan otentikasi

  // Function to reload user data from storage
  const reloadUserData = async () => {
    const token = await AsyncStorage.getItem('token');
    const userData = await AsyncStorage.getItem('user');

    if (token && userData) {
      setIsLoggedIn(true);
      setUser(JSON.parse(userData));
    } else {
      setIsLoggedIn(false);
      setUser(null);
    }
  };

  useEffect(() => {
    // Initialize on mount
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    const token = await AsyncStorage.getItem('token');

    if (token) {
      try {
        // Fetch fresh user data from API using POST method
        const response = await api.post('/api/user/profile');
        if (response.data && response.data.data) {
          const userProfile = response.data.data;
          await AsyncStorage.setItem('user', JSON.stringify(userProfile)); // Update local storage

          // Store biometric status in cache
          if (userProfile.biometric_enabled !== undefined) {
            await setBiometricEnabledStatus(userProfile.biometric_enabled);
          }

          setUser(userProfile);
          setIsLoggedIn(true);
        } else {
          // Jika API mengembalikan data kosong, fallback ke local storage
          const userData = await AsyncStorage.getItem('user');
          if (userData) {
            setUser(JSON.parse(userData));
            setIsLoggedIn(true);

            // Also check for biometric status in the local user data
            const parsedUserData = JSON.parse(userData);
            if (parsedUserData.biometric_enabled !== undefined) {
              await setBiometricEnabledStatus(parsedUserData.biometric_enabled);
            }
          } else {
            setIsLoggedIn(false);
            setUser(null);
          }
        }
      } catch (error) {
        console.error('Error fetching user profile on init:', error);

        // Tampilkan notifikasi bahwa fetch API gagal
        Alert.alert(
          'Kesalahan Jaringan',
          'Gagal mengambil data profil. Aplikasi akan menggunakan data lokal.',
          [
            {
              text: 'OK',
              onPress: async () => {
                // Fallback to local storage if API fails
                const userData = await AsyncStorage.getItem('user');
                if (userData) {
                  const parsedUserData = JSON.parse(userData);
                  setUser(parsedUserData);

                  // Also check for biometric status in the local user data
                  if (parsedUserData.biometric_enabled !== undefined) {
                    await setBiometricEnabledStatus(parsedUserData.biometric_enabled);
                  }

                  setIsLoggedIn(true);
                } else {
                  setIsLoggedIn(false);
                  setUser(null);
                }
              }
            }
          ]
        );
      }
    } else {
      setIsLoggedIn(false);
      setUser(null);
    }

    setIsCheckingAuth(false); // Selesai pengecekan otentikasi
  };

  const logout = async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
  };

  // Function to update login state manually when user logs in
  const setLoggedInState = async (userData, token) => {
    if (token) {
      await AsyncStorage.setItem('token', token);
    }

    if (userData) {
      await AsyncStorage.setItem('user', JSON.stringify(userData));

      // Store biometric status in cache
      if (userData.biometric_enabled !== undefined) {
        await setBiometricEnabledStatus(userData.biometric_enabled);
      }

      setIsLoggedIn(true);
      setUser(userData);
    }
  };

  // Function to refresh user profile data from API
  const refreshUserProfile = async () => {
    try {
      // Use POST method for refreshing user profile
      const response = await api.post('/api/user/profile');
      if (response.data && response.data.data) {
        const userProfile = response.data.data;
        await AsyncStorage.setItem('user', JSON.stringify(userProfile));

        // Store biometric status in cache
        if (userProfile.biometric_enabled !== undefined) {
          await setBiometricEnabledStatus(userProfile.biometric_enabled);
        }

        setUser(userProfile);
        return userProfile;
      }
    } catch (error) {
      console.error('Error refreshing user profile:', error);

      // Tampilkan notifikasi bahwa refresh gagal
      Alert.alert(
        'Kesalahan Jaringan',
        'Gagal memperbarui profil. Aplikasi akan menggunakan data lokal.',
        [
          {
            text: 'OK',
            onPress: async () => {
              // Ambil data dari local storage jika refresh gagal
              const userData = await AsyncStorage.getItem('user');
              if (userData) {
                setUser(JSON.parse(userData));
              }
            }
          }
        ]
      );

      throw error;
    }
  };

  // Function to login with fallback mechanism
  const loginWithFallback = async (email, password) => {
    try {
      // Dapatkan FCM token
      const fcmToken = await import('../utils/notifications').then(module => module.getFcmToken());

      const loginData = {
        email,
        password,
      };

      // Tambahkan FCM token ke data login jika tersedia
      if (fcmToken) {
        loginData.fcm_token = fcmToken;
      }

      const response = await api.post(`/api/auth/login`, loginData);

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

      // Store biometric status in cache
      if (user.biometric_enabled !== undefined) {
        await setBiometricEnabledStatus(user.biometric_enabled);
      }

      // Update the context state with user data
      setIsLoggedIn(true);
      setUser(user);

      return { success: true, user, token };
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

      // Jika login API gagal, tawarkan fallback ke data lokal jika tersedia
      const storedToken = await AsyncStorage.getItem('token');
      const storedUser = await AsyncStorage.getItem('user');

      if (storedToken && storedUser) {
        // Tampilkan notifikasi bahwa login API gagal tapi bisa gunakan data lokal
        return new Promise((resolve) => {
          Alert.alert(
            'Kesalahan Jaringan',
            'Login ke server gagal. Gunakan data lokal?',
            [
              {
                text: 'Gunakan Data Lokal',
                onPress: async () => {
                  try {
                    // Gunakan data yang tersimpan
                    setIsLoggedIn(true);
                    setUser(JSON.parse(storedUser));
                    resolve({ success: true, user: JSON.parse(storedUser), token: storedToken, usingLocalData: true });
                  } catch (parseError) {
                    console.error('Error parsing stored user data:', parseError);
                    resolve({ success: false, error: 'Data lokal rusak' });
                  }
                }
              },
              {
                text: 'Coba Lagi',
                onPress: () => {
                  resolve({ success: false, error: 'retry_needed' });
                }
              },
              {
                text: 'Batalkan',
                style: 'cancel',
                onPress: () => {
                  resolve({ success: false, error: 'cancelled' });
                }
              }
            ]
          );
        });
      } else {
        // Error will be handled by global interceptor

        return { success: false, error: error.message };
      }
    }
  };

  return (
    <AuthContext.Provider value={{isLoggedIn, setIsLoggedIn, user, setUser, logout, setLoggedInState, reloadUserData, refreshUserProfile, loginWithFallback, isCheckingAuth}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthProvider;