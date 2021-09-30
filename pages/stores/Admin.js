import React, { Component } from "react";
import {StyleSheet, FlatList, TouchableOpacity, View} from 'react-native';
import { Container, Header, Icon, Accordion, Text, Card, CardItem, Thumbnail, Body, Left, Right, Button } from "native-base";
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';


export default class Admin extends Component {
  constructor(props) {
    super(props);
    this.storeRef = firestore().collection('stores').where('store_admin_status', '==', 'close');
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

