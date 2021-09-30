import React, { Component } from "react";
import { ScrollView } from 'react-native'
import { Container, Header, Card, CardItem, Text, Body } from "native-base";
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

export default class RiderDetails extends Component {
    constructor(props) {
        super(props);
        var that = this;
        var monthNames = ["January", "February", "March", "April", "May","June","July", "August", "September", "October", "November","December"];
        var d = new Date();
        var date = new Date().getDate(); //Current Date
        var month = monthNames[d.getMonth()]; //Current Month
        var year = new Date().getFullYear(); //Current Year
        var hours = new Date().getHours(); //Current Hours
        var min = new Date().getMinutes(); //Current Minutes
        var sec = new Date().getSeconds(); //Current Seconds
         
        const rider = this.props.route.params.rider;
        const key = this.props.route.params.key;
     
        this.state = {
         rider : rider,
         key: key,
         dates: month + ' ' + date + ',' + year,
         dataSource: []
        };
        this.ref = firestore().collection('orders').where('delivery_personnel', '==', this.state.key );
        this.ref =   this.ref.where('OrderStatus', '==','Delivered') ; 
        this.ref = this.ref.where('DateOrdered', '==', this.state.dates); 
      }

  
   
    onCollectionUpdate = (querySnapshot) => {
      const orders = [];
      querySnapshot.forEach((doc) => {
       orders.push ({
              datas : doc.data(),
              key : doc.id
              });
      });
      this.setState({
        dataSource : orders,
        loading: false,
        
     });
    
    }

    componentDidMount() {
    
        this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate);     
      }

      
  calculateTotal = () => {
    let total = 0
    this.state.dataSource.forEach((item) => {
      total += parseFloat(item.datas.DriverProfit);
    })
  
    return total;
  }
  render() {
 
    return (
      <Container>
        <ScrollView>
        <Card>
            <CardItem header bordered>
                <Text>Wallet Balance: {this.state.rider.delivery_wallet}</Text>
            </CardItem>
          </Card>
          <Card>
            <CardItem header bordered>
                <Text>Today's Earnings: {this.calculateTotal()}</Text>
            </CardItem>
          </Card>
          <Card>
            <CardItem header bordered>
                <Text>Name: {this.state.rider.delivery_name}</Text>
            </CardItem>
            <CardItem header bordered>
                <Text>Email: {this.state.rider.delivery_email}</Text>
            </CardItem>
            <CardItem header bordered>
                <Text>Contact #: {this.state.rider.delivery_contact}</Text>
            </CardItem>
            <CardItem header bordered>
                <Text>Address: {this.state.rider.delivery_address}</Text>
            </CardItem>
            <CardItem header bordered>
                <Text>Birthdate: {this.state.rider.delivery_birthdate}</Text>
            </CardItem>
            <CardItem header bordered>
                <Text>CR: {this.state.rider.delivery_cr}</Text>
            </CardItem>
            <CardItem header bordered>
                <Text>License: {this.state.rider.delivery_license}</Text>
            </CardItem>
            <CardItem header bordered>
                <Text>OR : {this.state.rider.delivery_or}</Text>
            </CardItem>
            <CardItem header bordered>
                <Text>Plate #: {this.state.rider.delivery_plate}</Text>
            </CardItem>
          </Card>
        </ScrollView>
      </Container>
    );
  }
}