import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import Router from './router';
import AuthProvider from './context/AuthContext';
import { useEffect } from 'react';
import { preloadAllData } from './services/preloadService';
import { handleTokenRefreshForServer } from './services/notificationService';
import initializeFirebase, { requestUserPermission } from '../firebase'; // Impor fungsi inisialisasi Firebase dan permission
import { configurePushNotifications } from './utils/pushNotificationConfig';

function App() {
  useEffect(() => {
    // Inisialisasi Firebase
    const initApp = async () => {
      try {
        await initializeFirebase();
        console.log('Firebase initialized successfully in App component');

        // Request notification permission immediately when the app starts
        await requestUserPermission();
        console.log('Notification permission requested on app startup');

        // Configure push notifications to handle foreground messages
        configurePushNotifications();
        console.log('Push notifications configured');
      } catch (error) {
        console.error('Error initializing Firebase in App component:', error);
      }

      // Preload all provider and product data when the app starts
      const preloadData = async () => {
        try {
          await preloadAllData();
          console.log('All provider and product data preloaded successfully');
        } catch (error) {
          console.error('Error preloading data:', error);
        }
      };

      // Handle FCM token refresh
      const setupNotifications = async () => {
        try {
          // Fungsi untuk menangani pembaruan token (misalnya, saat token berubah)
          const handleTokenUpdate = async (newToken) => {
            console.log('FCM token updated:', newToken);
            // Disini bisa ditambahkan logika untuk mengirim token baru ke server saat login
          };

          await handleTokenRefreshForServer(handleTokenUpdate);
          console.log('FCM token refresh handler set up successfully');
        } catch (error) {
          console.error('Error setting up FCM token refresh:', error);
        }
      };

      await preloadData();
      await setupNotifications();
    };

    initApp();
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
