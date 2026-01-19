import React, {createContext, useContext, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {api} from '../utils/api'; // Import the API utility

const AuthContext = createContext();

const AuthProvider = ({children}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

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
          setUser(userProfile);
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
          setUser(null);
        }
      } catch (error) {
        console.error('Error fetching user profile on init:', error);
        // Fallback to local storage if API fails
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          setUser(JSON.parse(userData));
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
          setUser(null);
        }
      }
    } else {
      setIsLoggedIn(false);
      setUser(null);
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
  };

  // Function to update login state manually when user logs in
  const setLoggedInState = async (userData) => {
    await AsyncStorage.setItem('user', JSON.stringify(userData));
    // Token should already be set by the login process
    const token = await AsyncStorage.getItem('token');

    if (token) {
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
        setUser(userProfile);
        return userProfile;
      }
    } catch (error) {
      console.error('Error refreshing user profile:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{isLoggedIn, setIsLoggedIn, user, setUser, logout, setLoggedInState, reloadUserData, refreshUserProfile}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthProvider;