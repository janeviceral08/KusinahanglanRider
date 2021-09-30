import React, { Component } from "react";
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {
  View,
  Text,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Button, Left, Right, Icon, Toast} from 'native-base';
import Colors from '../Colors';

import colors from "../color";
import InputField from "../component/form/InputField";
import messaging from '@react-native-firebase/messaging';


export default class Login extends Component {
  constructor() {
    super();

    this.state = {
      user: null,
      email: "",
      password: "",
      formValid: true,
      error: "",
      loading: false
    };
  }

  handleCloseNotification = () => {
    this.setState({ formValid: true });
  };

  componentDidMount() {
    this.unsubscriber = auth().onAuthStateChanged(user => {
      this.setState({ user });
    });
    messaging().getToken().then(token=>{
      console.log('token: ', token)
      AsyncStorage.setItem('token', token)
    })

  }


  Login =async () => {
    this.setState({ loading: true });
    const token= await AsyncStorage.getItem('token');
      auth()
      .signInWithEmailAndPassword(this.state.email, this.state.password)
      .then(user => {
        const userId = auth().currentUser.uid;
        AsyncStorage.setItem('usertoken', userId);        
        const updateRef = firestore().collection('riders').doc(userId);
        updateRef.update({
          token: firestore.FieldValue.arrayUnion(token),
          status: true,
        });
        this.props.navigation.navigate('Apps');
      })
      .catch(error =>
        
        this.setState({
          error: error.message,
          formValid: false
          // loadingVisible: false
        }),
      
      );
  };

  
  componentWillUnmount() {
    if (this.unsubscriber) {
      this.unsubscriber();
    }
  }

  static navigationOptions = {
    header: null
  };
  render() {
    const { formValid, loadingVisible } = this.state;
    const showNotification = formValid ? false : true;
    const bgColor = formValid ? colors.green01 : colors.darkOrange;
    var left = (
      <Left style={{flex:1}}>
        <Button onPress={() => Actions.pop()} transparent>
          <Icon name='ios-arrow-back' />
        </Button>
      </Left>
    );
    return (
      
      <KeyboardAvoidingView
        style={[{ backgroundColor: bgColor }, styles.wrapper]}
        behavior="padding"
      >
  
   

        <View style={styles.scrollViewWrapper}>
        
          <ScrollView style={styles.scrollView}>
          <View style={{marginBottom: 35, width: '100%'}}>
            <Text style={{fontSize: 24, fontWeight: 'bold', textAlign: 'left', width: '100%', color: Colors.navbarBackgroundColor}}>Welcome back, </Text>
            <Text style={{fontSize: 18, textAlign: 'left', width: '100%', color: '#687373'}}>Please Login to continue </Text>
          </View>
            <InputField
              labelText="EMAIL ADDRESS"
              onChangeText={(text) => this.setState({email: text})}
              labelTextSize={14}
              labelColor={colors.white}
              textColor={colors.white}
              borderBottomColor={colors.white}
              inputType="email"
              customStyle={{ marginBottom: 30 }}
              
            />
            <InputField
              labelText="PASSWORD"
              onChangeText={(text) => this.setState({password: text})}
              labelTextSize={14}
              labelColor={colors.white}
              textColor={colors.white}
              borderBottomColor={colors.white}
              inputType="password"
              customStyle={{ marginBottom: 30 }}
              
            />
          <View style={{alignItems: 'center'}}>
            <Button block onPress={() => this.Login()} style={{backgroundColor: Colors.navbarBackgroundColor, marginTop: 20}}>
              <Text style={{color: 'white', fontSize: 15, fontWeight:'bold'}}>     Login    </Text>
            </Button>
          </View>
          <View style={{alignItems: 'center'}}>
              <Text style={{color: '#ffffff'}}>  {this.state.error} </Text>    
          </View>
          </ScrollView>
          
        </View>
      </KeyboardAvoidingView>
    );
  }
}
const styles = StyleSheet.create({
  wrapper: {
    display: "flex",
    flex: 1
  },
  scrollView: {
    paddingLeft: 30,
    paddingRight: 30,
    paddingTop: 20,
    flex: 1
  },
  scrollViewWrapper: {
    marginTop: 70,
    flex: 1
  },
  loginHeader: {
    fontSize: 28,
    color: colors.white,
    fontWeight: "300",
    marginBottom: 40
  },
  notificationWrapper: {
    position: "absolute",
    bottom: -20,
    left: 0,
    right: 0
  },
  nextButtonWrapper: {
    alignItems: "flex-end",
    right: 20,
    bottom: 50
  }
});
