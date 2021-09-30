import React, { Component } from "react";
import {StyleSheet, FlatList, TouchableOpacity, View} from 'react-native';
import { Container, Header, Icon, Accordion, Text, Card, CardItem, Thumbnail, Body, Left, Right, Button } from "native-base";
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';



export default class On_the_way extends Component {
  constructor(props) {
    super(props);
    this.orderRef = firestore().collection('orders').where('OrderStatus', '==', 'On the way');
    this.orderRef= this.orderRef.orderBy("TransactionId", "desc");
    this.unsubscribe = null;
    this.state = {
      data:[],
    };

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
     this.unsubscribe = this.orderRef.onSnapshot(this.onCollectionUpdate);
 
  }

  _renderHeader(item, expanded) {
    return (
      <TouchableOpacity onPress={()=> this.props.navigation.navigate('OrderDetail', {'order': item.datas})}>
      <Card style={{
        marginBottom: 10 }}>
            <CardItem>
            <Thumbnail large square source={require('../../assets/kusinahanglan.png')}/>
              <Body style={{paddingLeft: 10}}>  
                  <Text style={{fontSize: 13, fontWeight:'bold'}}>{item.datas.Name}</Text>
                  <Text note style={{fontSize: 10}}><Text style={{fontWeight: 'bold', fontSize: 11}}>TR #</Text>{item.datas.TransactionId}</Text>
                  <Text note style={{fontSize: 10}}><Text style={{fontWeight: 'bold', fontSize: 11}}>OR #</Text>{item.datas.OrderId}</Text>
                  <Text note style={{fontSize: 10}}><Text style={{fontWeight: 'bold', fontSize: 11}}>Address :</Text> {item.datas.Address}</Text>
                  <Text note style={{fontSize: 10}}><Text style={{fontWeight: 'bold', fontSize: 11}}>Rider :</Text> {item.datas.delivery_personnel}</Text>
                  <Text note style={{fontSize: 10}}><Text style={{fontWeight: 'bold', fontSize: 11}}>Date Ordered :</Text> {item.datas.DateOrdered}</Text>
              </Body>
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

