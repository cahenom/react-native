/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';
import { displayNotification } from './src/utils/notifeeHelper';

// Latar belakang (Background/Killed) notification handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
  
  // Jika remoteMessage.notification ada, Firebase sudah menampilkannya secara otomatis.
  // Kita hanya perlu memicu notifikasi manual jika ini adalah "data-only" message.
  if (!remoteMessage.notification && remoteMessage.data) {
    await displayNotification(
      'Punya Kios',
      remoteMessage.data.body || 'Ada pesan baru',
      remoteMessage.data
    );
  }
});

AppRegistry.registerComponent(appName, () => App);
