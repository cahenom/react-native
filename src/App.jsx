import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import Router from './router';
import AuthProvider from './context/AuthContext';
import { useEffect } from 'react';
import { preloadAllData } from './services/preloadService';

function App() {
  useEffect(() => {
    // Preload all provider and product data when the app starts
    const preloadData = async () => {
      try {
        await preloadAllData();
        console.log('All provider and product data preloaded successfully');
      } catch (error) {
        console.error('Error preloading data:', error);
      }
    };

    preloadData();
  }, []);

  return (
    <NavigationContainer>
      <AuthProvider>
        <Router />
      </AuthProvider>
    </NavigationContainer>
  );
}

export default App;
