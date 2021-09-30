//This is an example code for Bottom Navigation//
import React from 'react';
//import react in our code.
import { Container, Header, Icon, Accordion, Text, View, Card, CardItem, Thumbnail, Body, Left, Right, Button, Grid, Col } from "native-base";
import {TouchableOpacity, StyleSheet, FlatList, ScrollView } from 'react-native';
//import all the basic component we have used
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
export default class DriversEarning extends React.Component {
    constructor(props){
        super(props);
        this.ref = firestore().collection('orders').where('OrderId', '==', this.props.order );
 
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
            <Text style={{ fontSize: 18, fontWeight: 'bold'}}>Your Earnings</Text>
            <FlatList
              data={this.state.data}
              renderItem={({ item }) => 
              <View>
              <Grid style={{padding: 8}}>
              <Col>
                <Text style={{fontSize: 13, fontWeight: 'bold', color:'green'}}>Total Earnings</Text>
              </Col>
              <Col>
    <Text style={{textAlign: 'right',fontSize: 13,  color:'green', fontStyle:'italic'}}> ₱{item.datas.DriverProfit}</Text>
              </Col>
            </Grid>
            <Grid  style={{padding: 8}}>
            <Col>
                <Text style={{fontSize: 13, fontWeight: 'bold', color:'green'}}>Wallet deduction</Text>
              </Col>
              <Col>
    <Text style={{textAlign: 'right', fontSize: 13,  color:'green', fontStyle:'italic'}}> ₱{Math.round(item.datas.LessDriverWallet)}</Text>
              </Col>
            </Grid>
            <View style={styles.line} />
            <Grid  style={{padding: 8}}>
            <Col>
                <Text style={{fontSize: 13, fontWeight: 'bold', color:'green'}}>Total</Text>
              </Col>
              <Col>
    <Text style={{textAlign: 'right', fontSize: 15 ,color: 'green', fontStyle:'italic'}}>₱{parseInt(item.datas.DriverProfit)-parseInt(item.datas.LessDriverWallet)}</Text>                
                </Col>
            </Grid></View>}
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
  };