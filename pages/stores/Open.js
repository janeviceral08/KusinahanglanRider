import React, { Component } from "react";
import {StyleSheet, FlatList, TouchableOpacity, Alert, View} from 'react-native';
import { Container, Header,  Icon, Accordion, Text,  Card, CardItem, Thumbnail, Body, Left, Right, Button } from "native-base";
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import SwitchToggle from 'react-native-switch-toggle';


export default class Open extends Component {
  constructor(props) {
    super(props);
    this.storeRef = firestore().collection('stores').where('store_status', '==', 'open');
    this.storeRef=this.storeRef.where('store_admin_status', '==', 'open')

    this.unsubscribe = null;

    this.state = {
      data:[],
   
    };

  }

  
  Onsettingopen = (item) =>{

    Alert.alert(
      'Alert',
      'Are you sure you want to OPEN your Store?',
      [
       
        {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        {text: 'OK', onPress: () =>  this.updatopen(item)},
      ],
      { cancelable: false }
    )
  }
  updatopen(item) {
    
    const updateRef = firestore().collection('stores').doc(item);
    updateRef.update({
     
      store_status: 'open',
    })
  
    
  } 

  Onsettingclose= (item) =>{

    Alert.alert(
      'Alert',
      'Are you sure you want to CLOSE your Store?',
      [
       
        {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        {text: 'OK', onPress: () =>  this.updatclose(item)},
      ],
      { cancelable: false }
    )
  }
  updatclose(item) {
   
    const updateRef = firestore().collection('stores').doc(item);
    updateRef.update({
     
      store_status: 'close',
    })
    return fetch('https://batchbuddies.com/delete_product_cart_unavailable_store.php',{
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
              },
        body: JSON.stringify({
          
         store_id: item,
    })
   
    })
  } 
    
  onCollectionUpdate = (querySnapshot) => {
    const stores = [];
    querySnapshot.forEach((doc) => {
     stores.push ({
            datas : doc.data(),
            key : doc.id
            });
    });
    this.setState({
      data : stores,
  
   });
  
  }
  componentDidMount(){
     this.unsubscribe = this.storeRef.onSnapshot(this.onCollectionUpdate);

  }

  _renderHeader(item, expanded) {
    return (
        <TouchableOpacity onPress={()=> this.props.navigation.navigate('StoreProducts', {'store': item.datas.store_id})}>
        <Card style={{
          marginBottom: 10 }}>
           <CardItem>
              <Thumbnail large square source={{uri: item.datas.store_image}}/>
                <Body style={{paddingLeft: 10}}>  
                    <Text style={{fontSize: 13, fontWeight:'bold'}}>{item.datas.store_name}</Text>
                    <Text note style={{fontSize: 10}}><Text style={{fontWeight: 'bold', fontSize: 11}}>Address :</Text>{item.datas.store_address}</Text>
                    <Text note style={{fontSize: 10}}><Text style={{fontWeight: 'bold', fontSize: 11}}>Section :</Text>{item.datas.store_section}</Text>
                    <Text note style={{fontSize: 10}}><Text style={{fontWeight: 'bold', fontSize: 11}}>Wallet :</Text> {item.datas.store_wallet}</Text>
                    <Text note style={{fontSize: 10}}><Text style={{fontWeight: 'bold', fontSize: 11}}>ID # :</Text> {item.datas.store_id}</Text>
                </Body>
                <Right>
                <Text style={{fontSize: 9}}>Available?</Text>
          {item.datas.store_status == 'close' ?  <SwitchToggle
                containerStyle={{
                  width: 60,
                  height: 25,
                  borderRadius: 30,
                  padding: 5,
                }}
                backgroundColorOn='#a0e1e5'
                backgroundColorOff='#e5e1e0'
                circleStyle={{
                  width: 20,
                  height: 20,
                  borderRadius: 27.5,
                  backgroundColor: 'blue', // rgb(102,134,205)
                }}
                switchOn= {false}              
                onPress={() => this.Onsettingopen(item.datas.store_id)}
                circleColorOff='red'
                circleColorOn='green'
                duration={500}
              />
      :item.datas.store_status == 'open' ? <SwitchToggle
      containerStyle={{
        width: 60,
        height: 25,
        borderRadius: 30,
        padding: 5,
      }}
      backgroundColorOn='#a0e1e5'
      backgroundColorOff='#e5e1e0'
      circleStyle={{
        width: 20,
        height: 20,
        borderRadius: 27.5,
        backgroundColor: 'blue', // rgb(102,134,205)
      }}
      switchOn= {true}              
      onPress={() => this.Onsettingclose(item.datas.store_id)}
      circleColorOff='red'
      circleColorOn='green'
      duration={500}
    />:null
  }
                </Right>
              </CardItem>
        </Card>
         </TouchableOpacity>
    );
  }

  render() {
    return (
      <Container>
        <View>
        <FlatList
               data={this.state.data}
               renderItem={({ item }) => (
                 
                    this._renderHeader(item)
                
                  
               )}
               keyExtractor={item => item.datas.OrderId}
               
           />
        </View>
      </Container>
    );
  }
}

