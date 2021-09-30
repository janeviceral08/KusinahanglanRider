/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';
// Register background handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
    const channelId = await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
        sound: 'notif',
      });
  
      // Display a notification
      await notifee.displayNotification({
        title: 'Notification Title',
        body: 'Main body content of the notification',
        android: {
          channelId,
          smallIcon: 'ic_launcher', // optional, defaults to 'ic_launcher'.
          sound: 'notif',
        },
      });
    console.log('Message handled in the background!', remoteMessage);
  });
AppRegistry.registerComponent(appName, () => App);
