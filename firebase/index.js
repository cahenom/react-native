import { app, apps } from '@react-native-firebase/app';
import messaging from '@react-native-firebase/messaging';

// Fungsi untuk inisialisasi Firebase - hanya mengembalikan app yang sudah ada
export async function initializeFirebase() {
  // Firebase App sudah diinisialisasi oleh sistem native melalui google-services.json
  // Kita hanya perlu mengembalikan app yang sudah ada
  if (apps && apps.length > 0) {
    console.log('Using existing Firebase app');
    return apps[0];
  } else {
    console.log('No Firebase app found');
    return null;
  }
}

// Getter untuk messaging service
export async function getMessagingService() {
  // Karena Firebase App sudah diinisialisasi oleh sistem native,
  // kita bisa langsung mengaksesnya
  try {
    return messaging();
  } catch (error) {
    console.error('Error getting messaging service:', error);
    return null;
  }
}

// Request permission for notifications
export async function requestUserPermission() {
  try {
    const messagingInstance = await getMessagingService();
    if (!messagingInstance) {
      console.warn('Firebase messaging not available, skipping permission request');
      return false;
    }

    const authStatus = await messagingInstance.requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
    }

    return enabled;
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    // Fallback ke instance messaging langsung
    try {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log('Authorization status (fallback):', authStatus);
      }

      return enabled;
    } catch (fallbackError) {
      console.error('Error requesting notification permission (fallback):', fallbackError);
      return false;
    }
  }
}

// Export default sebagai fungsi yang mengembalikan promise
export default initializeFirebase;