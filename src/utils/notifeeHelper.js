import notifee, { AndroidImportance } from '@notifee/react-native';

/**
 * Initialize Notifee channels
 */
export const setupNotifeeChannels = async () => {
  // Create a channel for transactions with custom sound
  await notifee.createChannel({
    id: 'transactions',
    name: 'Transaction Notifications',
    importance: AndroidImportance.HIGH,
    sound: 'success', // Refers to res/raw/success.mp3
  });
};

/**
 * Display a local notification with sound
 * @param {string} title - Notification title
 * @param {string} body - Notification body
 * @param {object} data - Optional data payload
 */
export const displayNotification = async (title, body, data = {}) => {
  // Request permissions (required for iOS and Android 13+)
  await notifee.requestPermission();

  // Display a notification
  await notifee.displayNotification({
    title: title,
    body: body,
    data: data,
    android: {
      channelId: 'transactions',
      importance: AndroidImportance.HIGH,
      pressAction: {
        id: 'default',
      },
      // You can also specify sound here if not specified in the channel
      sound: 'success', 
    },
  });
};
