//This is an example code for Bottom Navigation//
import React from 'react';
//import react in our code.
import { Container, Header, Content, Icon, Accordion, Text, View, Card, CardItem, Thumbnail, Body, Left, Right, Button, Grid, Col } from "native-base";
import {TouchableOpacity, StyleSheet, FlatList } from 'react-native';
//import all the basic component we have used
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

import Communications from 'react-native-communications';
export default class AccountDetails extends React.Component {
    constructor(props){
        super(props);
        this.ref = firestore().collection('orders').where('OrderId', '==', this.props.user );
  
        this.unsubscribe = null;
        this.state = {
            data:[]
        }
    }
  //Profile Screen to show from Open profile button
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
    this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate);

 }

  render() {
    return (
      <View >   
        <View style={styles.invoice}>
            <Text style={{ fontSize: 18, fontWeight: 'bold'}}>Delivery Details</Text>
            <FlatList
              data={this.state.data}
              renderItem={({ item }) => 
              <View>
                 <Grid style={{padding: 8}}>
              <Col>
                <Text style={{fontSize: 13, fontWeight: 'bold', color:'black'}}>Customer Name:</Text>
              </Col>
              <Col>
    <Text style={{textAlign: 'center',fontSize: 13,  color:'black', fontStyle:'italic'}}>{item.datas.Name}</Text>
              </Col>
            </Grid>
            <Grid  style={{padding: 8}}>
            <Col>
                <Text style={{fontSize: 13, fontWeight: 'bold', color:'black'}}>Contact:</Text>
              </Col>
              <Col>
    <Text style={{textAlign: 'center', fontSize: 13,  color:'black', fontStyle:'italic'}}>{item.datas.Contact}</Text>
              </Col>
            </Grid>
            {item.datas.OrderStatus == "Delivered" && item.datas.OrderStatus == "Cancelled" ?  
            null :
            <View>
            <TouchableOpacity 
            style = {styles.button}
            onPress={() => Communications.phonecall(item.datas.Contact, true)}>
              <Text style={styles.text}>
                Make Phone Call
              </Text>
        </TouchableOpacity>
        <TouchableOpacity 
        style = {styles.button}
        onPress={() => Communications.text(item.datas.Contact, 'Test Text Here')}>
          <Text style={styles.text}>
            Send a Text/iMessage
          </Text>
      </TouchableOpacity>
        </View>
            }
 
           </View>}
              keyExtractor={item => item.key}
            />
              
          </View>       
      </View>
    );
  }
}

const styles = {
    invoice: {
      padding: 20,
      backgroundColor:"#FFFFFF",
      borderTopStyle:'dashed',
      borderBottomStyle:'dashed',
      borderWidth: 2,
      borderRadius: 1,
    },
    line: {
      width: '100%',
      height: 1,
      backgroundColor: '#bdc3c7',
      marginBottom: 10,
      marginTop: 10
    },
    group6: {
      width: 375,
      height: 45,
    },
    rectangle3: {
      width: 375,
      height: 45,
      backgroundColor: "rgba(94,163,58,1)",
      
    },
    placeOrder: {
      backgroundColor: "transparent",
      color: "rgba(255,255,255,1)",
      fontSize: 11,
      letterSpacing: -0.31,
      marginTop: 16,
      marginLeft: 156
    },
    button: {
      justifyContent: 'center',
      width : 300,
      backgroundColor:"#307cae",
      marginTop : 20,
    },
    text: {
      fontSize: 18,
      textAlign : 'center',
      padding : 10,
      color : '#ffffff',
    },
  };