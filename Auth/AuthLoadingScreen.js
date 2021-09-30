import React from 'react';
import {
  ActivityIndicator,
  Button,
  StatusBar,
  StyleSheet,
  View
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
//import {fcmService} from '../pages/FCM/FCMService'


export default class AuthLoadingScreen extends React.Component{
  constructor(){
    super();
    this._bootstrapAsync();
  }

  
  handleCloseNotification = () => {
    this.setState({ formValid: true });
  };

  componentDidMount() {

   //   fcmService.register(this.onRegister, this.onNotification, this.onOpenNotification)
  }


onRegister(token){
  console.log("[NotificationFCM] onRegister: ", token)

}

onNotification(notify){
  console.log("[NotificationFCM] onNotification: ", notify)

  const channelObj = {
    channelId: "SampleChannelID",
    channelName: "SampleChannelName",
    channelDes: "sampleChannelDes"
  }

  const channel = fcmService.buildChannel(channelObj)

  const buildNotify = {
    dataId: notify._notificationId,
    title: notify._title,
    content: notify._body,
    sound: 'default',
    channel: channel,
    data: {},
    colorBgIcon: '#1A243B',
    largeIcon: 'ic_launcher',
    smallIcon: 'ic_launcher',
    vibrate: true
  }

  const notification = fcmService.buildNotification(buildNotify)
  fcmService.displayNotification(notification)
}

onOpenNotification(notify){
  console.log("[NotificationFCM] onOpenNotification", notify)
}

  _bootstrapAsync = async () =>{
    const uid= await AsyncStorage.getItem('usertoken');
    this.props.navigation.navigate(uid ? 'Apps' : 'Auth');
    };

    render(){
       return (
         <View style ={styles.container}>
          <ActivityIndicator />
          <StatusBar barStyle="default" />
         </View> 
       );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});




