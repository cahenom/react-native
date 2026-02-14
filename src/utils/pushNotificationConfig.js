import messaging from '@react-native-firebase/messaging';
import {Platform} from 'react-native';
import { displayNotification, setupNotifeeChannels } from './notifeeHelper';

/**
 * Configure push notification handlers
 */
export const configurePushNotifications = () => {
  // Setup Notifee channels for sound
  setupNotifeeChannels();

  // Handle foreground messages (when app is active)
  const unsubscribeForeground = messaging().onMessage(async remoteMessage => {
    console.log('Foreground message received:', remoteMessage);

    // Show local notification with sound via Notifee
    if (remoteMessage.notification) {
      const { title, body } = remoteMessage.notification;
      await displayNotification(
        title,
        body,
        remoteMessage.data
      );
    }
  });

  // Handle notification tap (when user taps on notification)
  const unsubscribeNotificationTap = messaging().onNotificationOpenedApp(remoteMessage => {
    console.log('Notification caused app to open from background state:', remoteMessage);
  });

  // Handle app launch from terminated state via notification
  const unsubscribeAppLaunch = messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        console.log('Notification caused app to open from quit state:', remoteMessage);
      }
    });

  // Return unsubscribe functions to clean up when needed
  return {
    unsubscribeForeground,
    unsubscribeNotificationTap,
    unsubscribeAppLaunch,
  };
};

/**
 * Request notification permissions
 */
export const requestNotificationPermission = async () => {
  try {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
    }

    return enabled;
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return false;
  }
};

/**
 * Get FCM token
 */
export const getFcmToken = async () => {
  try {
    const enabled = await requestNotificationPermission();

    if (!enabled) {
      console.log('Notification permission not granted');
      return null;
    }

    const fcmToken = await messaging().getToken();

    if (fcmToken) {
      console.log('FCM Token:', fcmToken);
      return fcmToken;
    } else {
      console.log('Failed to get FCM token');
      return null;
    }
  } catch (error) {
    console.error('Error getting FCM token:', error);
    return null;
  }
};