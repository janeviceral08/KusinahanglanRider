//This is an example code for Bottom Navigation//
import React from 'react';
import {StyleSheet, FlatList,TouchableOpacity, Alert} from 'react-native';
import { Container, Header, Content, Icon, Accordion, Text, View, Card, CardItem, Thumbnail, Body, Left, Right, Button } from "native-base";
import StepIndicator from 'react-native-step-indicator'
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import AntDesign from 'react-native-vector-icons/AntDesign'
//import all the basic component we have used

export default class StoreHeader extends React.Component {
    constructor(props) {
        super(props);    
        this.storeRef = firestore().collection('stores').where('store_id', '==', this.props.stores );
        this.unsubscribe = null;  
        console.log('store',this.props.store)
        this.state = {
          user: null,
          email: "",
          password: "",
          formValid: true,
          error: "",
          loading: false,
          dataSource: [],
          data:[],
          store_percentage:'',
          store_address:'',
          store_image:'',
          store_name:''
        };
      }

    
  onCollectionUpdate = (querySnapshot) => {
    const orders = [];
    querySnapshot.forEach((doc) => {
        this.setState({
           store_percentage : doc.data().store_percentage,
           store_name : doc.data().store_name,
           store_image: doc.data().store_image,
           store_address: doc.data().store_address,
         });
        
    });
   
  }


  componentDidMount() {
      this.unsubscribe = this.storeRef.onSnapshot(this.onCollectionUpdate);     
    }
  render() {
    return (
        <Card style={{
            marginBottom: 10 }}>
                <CardItem>
                <Thumbnail small source={{uri : this.state.store_image}}/>
                  <Body style={{paddingLeft: 10}}>
                  
                      <Text style={{fontSize: 15, fontWeight:'bold'}}><AntDesign name="isv" size={13}/>  {this.state.store_name}</Text>
                      <Text note style={{fontSize: 10}}><Text style={{fontWeight: 'bold'}}><AntDesign name="enviromento" size={13}/></Text>  {this.state.store_address}</Text>
                  </Body>
                  <Right>
        <Text note style={{borderWidth: 1, padding: 2, color: 'white', backgroundColor: 'orange', borderRadius: 10}}>{this.props.store_status}</Text> 
                  </Right>
                </CardItem>
          </Card>
    );
  }
}