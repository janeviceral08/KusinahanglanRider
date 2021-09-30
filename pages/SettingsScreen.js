//This is an example code for Bottom Navigation//
import React from 'react';
//import react in our code.
import { Text, View, TouchableOpacity, StyleSheet, Alert,ScrollView, Image } from 'react-native';
import {Card, CardItem, Left, Right, Body, Container,Thumbnail, List, ListItem,Item, Input, Button} from 'native-base';
import SwitchToggle from 'react-native-switch-toggle';
import AntDesign from 'react-native-vector-icons/AntDesign';
//import all the basic component we have used
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from "./Loader";
import Modal from 'react-native-modal';
import {imgDefault} from './images';
import * as ImagePicker from "react-native-image-picker"


export default class SettingsScreen extends React.Component {
  constructor(props) {
    super(props);    
    this.ref = firestore();
    this.unsubscribe = null;
    this.state = {
      name:'',
      email:'',
      number:'',
      status: true,
      uid:'',
      token: [],
      riderInfo: null,
      image:null,
      wallet: 0,
      loading: false,
    };
    
  }

  _bootstrapAsync =async () =>{
    const uid= await AsyncStorage.getItem('usertoken');
    this.unsubscribe = this.ref.collection('riders').where('userId', '==', uid ).onSnapshot(this.onCollectionUpdate);
    this.setState({ uid: uid })
    };


  onCollectionUpdate = (querySnapshot) => {
    const rider = [];
    querySnapshot.forEach((doc) => {
      this.setState({
        name:doc.data().Name,
        email: doc.data().Email,
        number:doc.data().Mobile,
        token:doc.data().token,
        wallet:doc.data().wallet,
        riderInfo: doc.data(),
      newImage: doc.data().image
     });
    });
  }
  componentDidMount() {  
    this._bootstrapAsync();
  }

 
  
  _updateAuthStatus = () =>{
    Alert.alert(
        'Notice',
        'Are you sure you want to logout?',
        [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {text: 'OK', onPress: () => this.signOut()},
        ],
        {cancelable: false},
      );
  }

    signOut=async () =>{
      const token= await AsyncStorage.getItem('token');
      firestore().collection('riders').doc(this.state.uid).update({
          token: firestore.FieldValue.arrayRemove(token),
          status: false,
        }).then(user=>
                      auth().signOut().then(user => {     
                        AsyncStorage.setItem('usertoken','');      
                      this.props.navigation.navigate('Auth')    
                  })
          ).catch((err)=>    Alert.alert(
            'Log out Failed',
            'Sorry, Try again',
            [
            
              {text: 'OK', onPress: () => console.log('Cancel Pressed')},
            ],
            {cancelable: false},
          ))

       
      }
      openGallery = () => {
        ImagePicker.launchImageLibrary({
            maxWidth: 500,
            maxHeight: 500,
            mediaType: 'photo',
            includeBase64: true,
        }, image => {
         
              console.log('base64: ', image);
            if(image.didCancel== true){
      console.log('base64: ', image);
      return;
            }
        this.setState({newImage:image.assets[0].base64})
                     })
       }
    
       updateTextInput = (text, field) => {
        const state = this.state
        state[field] = text;
        this.setState(state);
      }
  //Setting Screen to show in Setting Option
  render() {
    const {   ColorMotor,
      Province,
      Email,
      Exp,
      FBAccount,
      License,
      MBrand,
      Mobile,
      MotorCR,
      MotorOR,
      Name,
      PlateNo,
      image,
      Status,
      userId,
      newImage,
      id 
    } = this.state;

    return (
      <ScrollView>
      <Card>
      <Loader loading={this.state.loading} />
        <CardItem button onPress={()=>this.setState({DetailsModal: true, ColorMotor:this.state.riderInfo.ColorMotor,
Province:this.state.riderInfo.Address,
Email:this.state.riderInfo.Email,
Exp:this.state.riderInfo.Exp,
FBAccount:this.state.riderInfo.FBAccount,
License:this.state.riderInfo.License,
MBrand:this.state.riderInfo.MBrand,
Mobile:this.state.riderInfo.Mobile,
MotorCR:this.state.riderInfo.MotorCR,
MotorOR:this.state.riderInfo.MotorOR,
Name:this.state.riderInfo.Name,
PlateNo:this.state.riderInfo.PlateNo,
image:this.state.riderInfo.image, 
userId:this.state.riderInfo.userId, })}>
        <Thumbnail small source={require('../assets/user.png')}/>
              <Body style={{paddingLeft: 10}}>
              
                  <Text style={{fontSize: 13, fontWeight:'bold'}}>{this.state.name}</Text>
                  <Text style={{fontSize: 13, fontWeight:'bold'}}>Wallet Balance: ₱{parseFloat(this.state.wallet).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}</Text>
                  <Text note style={{fontSize: 10}}><Text style={{fontWeight: 'bold'}}>Email :</Text>{this.state.email}</Text>
                  <Text note style={{fontSize: 10}}><Text style={{fontWeight: 'bold'}}>Mobile # :</Text> {this.state.number}</Text>
              </Body>
              <Right>
                
              </Right>
        </CardItem>
      
      </Card>
      <Card>
        <CardItem style={{marginVertical: 5, paddingRight: 0}} button onPress={() =>  this._updateAuthStatus()}>
         <Text>SIGN OUT</Text>
         
         <Right style={{paddingRight: 0}}>
            <AntDesign name="poweroff" size={20} color='red' />
         </Right>
       </CardItem>
      </Card>
      <Modal
      isVisible={this.state.DetailsModal}
      animationInTiming={700}
      animationIn='slideInUp'
      animationOut='slideOutDown'
      animationOutTiming={700}
      useNativeDriver={true}
      onBackdropPress={() => this.setState({DetailsModal: false})} transparent={true}>
     <Card style={style.content}>
        <List>
        <ScrollView>
          
                    <Text style={{marginTop: 15, fontSize: 10}}>Name</Text>
                    <Item regular style={{marginTop: 7}}>
                        <Input value={Name}  keyboardType={'default'} onChangeText={(text) =>this.updateTextInput(text, 'Name')} placeholderTextColor="#687373" />
                    </Item>
                    <Text style={{marginTop: 15, fontSize: 10}}>Email</Text>
                    <Item regular style={{marginTop: 7}}>
                        <Input value={Email}  keyboardType={'default'} placeholderTextColor="#687373" />
                    </Item>
                       <Text style={{marginTop: 15, fontSize: 10}}>Mobile Number</Text>
                    <Item regular style={{marginTop: 7}}>
                        <Input value={Mobile}  keyboardType={'number-pad'} onChangeText={(text) => { isNaN(text)? null:this.updateTextInput(text, 'Mobile')}} placeholderTextColor="#687373" />
                    </Item>
                       <Text style={{marginTop: 15, fontSize: 10}}>Facebook Account</Text>
                    <Item regular style={{marginTop: 7}}>
                        <Input value={FBAccount}  keyboardType={'default'} onChangeText={(text) =>this.updateTextInput(text, 'FBAccount')} placeholderTextColor="#687373" />
                    </Item>
                    <Text style={{marginTop: 15, fontSize: 10}}>Complete Address</Text>
                    <Item regular style={{marginTop: 7}}>
                        <Input value={Province} keyboardType={'default'} onChangeText={(text) =>this.updateTextInput(text, 'Province')} placeholderTextColor="#687373" />
                    </Item>
                    <Text style={{marginTop: 15, fontSize: 10}}>License Number</Text>
                    <Item regular style={{marginTop: 7}}>
                        <Input value={License} keyboardType={'default'} onChangeText={(text) =>this.updateTextInput(text, 'License')} placeholderTextColor="#687373" />
                    </Item>
                    <Text style={{marginTop: 15, fontSize: 10}}>License Expiration Date</Text>
                    <Item regular style={{marginTop: 7}}>
                        <Input value={Exp}  keyboardType={'default'} onChangeText={(text) =>this.updateTextInput(text, 'Exp')} placeholderTextColor="#687373" />
                    </Item>
                    <Text style={{marginTop: 15, fontSize: 10}}>Plate Number</Text>
                    <Item regular style={{marginTop: 7}}>
                        <Input value={PlateNo} onChangeText={(text) => this.updateTextInput(text, 'PlateNo')} placeholderTextColor="#687373" />
                    </Item>
                    <Text style={{marginTop: 15, fontSize: 10}}>Motorcycle Color</Text>
                    <Item regular style={{marginTop: 7}}>
                        <Input value={ColorMotor} keyboardType={'default'} onChangeText={(text) =>this.updateTextInput(text, 'ColorMotor')} placeholderTextColor="#687373" />
                    </Item>
                    <Text style={{marginTop: 15, fontSize: 10}}>Motorcycle Brand</Text>
                    <Item regular style={{marginTop: 7}}>
                        <Input value={MBrand}  keyboardType={'default'} onChangeText={(text) =>this.updateTextInput(text, 'MBrand')} placeholderTextColor="#687373" />
                    </Item>
                    <Text style={{marginTop: 15, fontSize: 10}}>Official Receipt</Text>
                    <Item regular style={{marginTop: 7}}>
                        <Input value={MotorOR}  keyboardType={'default'} onChangeText={(text) =>this.updateTextInput(text, 'MotorOR')} placeholderTextColor="#687373" />
                    </Item>
                    <Text style={{marginTop: 15, fontSize: 10}}>Certificate of Registration</Text>
                    <Item regular style={{marginTop: 7}}>
                        <Input value={MotorCR}  keyboardType={'default'} onChangeText={(text) =>this.updateTextInput(text, 'MotorCR')} placeholderTextColor="#687373" />
                    </Item>
                   
                        
      <Button block style={{ height: 30, backgroundColor:  "#33c37d", marginTop: 10}}
        onPress={() => {          Alert.alert(
        'Proceed to Update',
        'Are you sure to proceed?',
        [{text: 'Cancel', onPress: () => null},{text: 'OK', onPress: () => this.UpdateInfo()}]
    )}}
      >
       <Text style={{color:'white'}}>Update Info</Text>
      </Button>
                </ScrollView>
           </List>   

    </Card>
    </Modal>
      </ScrollView>
    );
  }
  UpdateInfo(){
    const {ColorMotor,
          Province,
          Email,
          Exp,
          FBAccount,
          License,
          MBrand,
          Mobile,
          MotorCR,
          MotorOR,
          Name,
          PlateNo,
          image,
          Status,
          userId,
          newImage,} = this.state
    this.setState({loading: true})
          if(newImage === null){
    firestore().collection('riders').doc(userId).update({
      ColorMotor,
         Address: Province ,
          Email,
          Exp,
          FBAccount,
          License,
          MBrand,
            Mobile: Mobile.toString(),
          MotorCR,
          MotorOR,
          Name,
          PlateNo}).then((docRef) => {  
                      Alert.alert(
            'Updated Successfully',
            'Rider Information is Updated',
            [{text: 'OK', onPress: () =>  this.setState({DetailsModal: false, loading: false})}]
        )}).catch((err)=>      {Alert.alert(
            'Updated Failed',
            err,
            [{text: 'OK', onPress: () =>  this.setState({DetailsModal: false, loading: false})}]
            )})
        }
      else{
      let base64Img = `data:image/jpg;base64,${this.state.newImage}`;
        let data = {
          "file": base64Img,
          "upload_preset": "bgzuxcoc",
        }
       let CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/kusinahanglan/upload';
    fetch(CLOUDINARY_URL, {
        body: JSON.stringify(data),
        headers: {
          'content-type': 'application/json'
        },
        method: 'POST',
      }).then(async r => {
        let data = await r.json()
                    console.log('url: ', 'https'+data.url.slice(4))
    
                    firestore().collection('riders').doc(userId).update({
      ColorMotor,
          Address: Province ,
          Email,
          Exp,
          FBAccount,
          License,
          MBrand,
          Mobile: Mobile.toString(),
          MotorCR,
          MotorOR,
          Name,
          PlateNo,
          image:'https'+data.url.slice(4)}).then((docRef) => {  
                        Alert.alert(
            'Updated Successfully',
            'Rider Information is Updated',
            [{text: 'OK', onPress: () =>  this.setState({DetailsModal: false, loading: false})}]
        )
        }).catch((err)=>Alert.alert(
            'Updated Failed',
            err,
            [{text: 'OK', onPress: () =>  this.setState({DetailsModal: false, loading: false})}]
            ))
      }).catch((err)=>Alert.alert(
            'Upload Image Failed',
            err,
            [{text: 'OK', onPress: () =>  this.setState({DetailsModal: false, loading: false})}]
            ))
      }
      }
}

const style = StyleSheet.create({
  wrapper: {
    // marginBottom: -80,
    backgroundColor: "white",
    height: 80,
    width: "100%",
    padding: 10
  },
  notificationContent: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "flex-start"
  },
 sssage: {
    marginBottom: 2,
    fontSize: 14
  },
  closeButton: {
    position: "absolute",
    right: 10,
    top: 10
  },
  content: {
    height: '80%',
    backgroundColor: 'white',
    padding: 22,
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  contentTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },
});

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 10,
    width: 300,
    marginTop: 16,
  },
});