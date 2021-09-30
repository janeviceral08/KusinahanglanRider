import React, { Component } from "react";
import {StyleSheet, FlatList, TouchableOpacity, View} from 'react-native';
import { Container, Header, Icon, Accordion, Text,  Card, CardItem, Thumbnail, Body, Left, Right, Button } from "native-base";
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';



export default class RiderScreen extends Component {
  constructor(props) {
    super(props);
    this.ref = firestore().collection('delivery');
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
     this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate);
 
  }

  _renderHeader(item, expanded) {
    return (
        <TouchableOpacity onPress={()=> this.props.navigation.navigate('RiderDetails', {'rider': item.datas, 'key': item.key})}>
        <Card style={{
          marginBottom: 10 }}>
           <CardItem>
           <Thumbnail large square source={require('../../assets/rider.png')}/>
                <Body style={{paddingLeft: 10}}>  
                    <Text style={{fontSize: 13, fontWeight:'bold'}}>{item.datas.delivery_name}</Text>
                    <Text note style={{fontSize: 10}}><Text style={{fontWeight: 'bold', fontSize: 11}}>Mobile # :</Text>{item.datas.delivery_contact}</Text>
                    <Text note style={{fontSize: 10}}><Text style={{fontWeight: 'bold', fontSize: 11}}>Email :</Text>{item.datas.delivery_email}</Text>
                    <Text note style={{fontSize: 10}}><Text style={{fontWeight: 'bold', fontSize: 11}}>ID # :</Text> {item.key}</Text>
                    {item.datas.delivery_status ? <Text style={{fontWeight: 'bold', fontSize: 11, color:'green'}}>Online</Text>
                    :<Text style={{fontWeight: 'bold', fontSize: 11, color:'red'}}>Offline</Text> }
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

