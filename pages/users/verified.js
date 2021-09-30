import React, { Component } from "react";
import {StyleSheet, FlatList, TouchableOpacity, TextInput, View} from 'react-native';
import { Container, Header, Icon, Accordion, Text, Card, CardItem, Thumbnail, Body, Left, Right, Button } from "native-base";
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';



export default class Verified extends Component {
  constructor(props) {
    super(props);
    this.ref = firestore().collection('users').where('Status', '==', 'Verified');
    this.ref= this.ref.orderBy("Name", "asc");
    this.unsubscribe = null;
    this.state = {
      text: '',
      data:[],
    };
    this.arrayholder = [];
  }
    
  onCollectionUpdate = (querySnapshot) => {
    const stores = [];
    querySnapshot.forEach((doc) => {
     stores.push ({
            datas : doc.data(),
            key : doc.id
            });
    });
    this.arrayholder = stores;
    this.setState({
      data : stores,
  
   });
  
  }
  componentDidMount(){
     this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate);
 
  }

  
  GetFlatListItem(name) {
    Alert.alert(name);
  }
 
  searchData(text) {
    const newData = this.arrayholder.filter(item => {
      const itemData = item.datas.Name.toUpperCase();
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1
    });
 
    this.setState({
      data: newData,
      text: text
      })
    }

  _renderHeader(item, expanded) {
    return (
        <TouchableOpacity onPress={()=> this.props.navigation.navigate('UserDetails', {'user': item.datas})}>
        <Card style={{
          marginBottom: 10 }}>
           <CardItem>
           <Thumbnail large square source={require('../../assets/user.png')}/>
                <Body style={{paddingLeft: 10}}>  
                    <Text style={{fontSize: 13, fontWeight:'bold'}}>{item.datas.Name}</Text>
                    <Text note style={{fontSize: 10}}><Text style={{fontWeight: 'bold', fontSize: 11}}>Mobile # :</Text>{item.datas.Mobile}</Text>
                    <Text note style={{fontSize: 10}}><Text style={{fontWeight: 'bold', fontSize: 11}}>Email :</Text>{item.datas.Email}</Text>
                    <Text note style={{fontSize: 10}}><Text style={{fontWeight: 'bold', fontSize: 11}}>ID # :</Text> {item.key}</Text>
                </Body>
              </CardItem>
        </Card>
         </TouchableOpacity>
    );
  }

  render() {
    return (
      <Container>
        <TextInput 
         style={styles.textInput}
         onChangeText={(text) => this.searchData(text)}
         value={this.state.text}
         underlineColorAndroid='transparent'
         placeholder="Search Here" />
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


const styles = StyleSheet.create({

  row: {
    fontSize: 18,
    padding: 12
  },
 
  textInput: {
 marginTop: 5,
    textAlign: 'center',
    height: 42,
    borderWidth: 1,
    borderColor: '#009688',
    borderRadius: 8,
    backgroundColor: "#FFFF"
 
  }
});