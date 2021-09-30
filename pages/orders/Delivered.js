import React,{ Component} from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, Dimensions } from 'react-native';
import {Container, Card, CardItem, Thumbnail, Body, Button} from 'native-base';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SCREEN_WIDTH = Dimensions.get('window').width;

class Delivered extends Component{
    constructor() {
        super();
        this.ref = firestore();
        this.unsubscribe = null;
        this.state = {
          user: null,
          email: "",
          password: "",
          formValid: true,
          error: "",
          loading: false,
          dataSource: [],
          uid:'',
          store_path: ''
        };
         }
        
         onCollectionUpdate = (querySnapshot) => {
          const orders = [];
          querySnapshot.forEach((doc) => {
           orders.push ({
                  datas : doc.data(),
                  key : doc.id
                  });
          })
          this.setState({
            dataSource : orders,
            loading: false,
         })
      
        }
     
        _bootstrapAsync =async () =>{
            const uid= await AsyncStorage.getItem('usertoken');
            this.unsubscribe = this.ref.collection('orders').where('DeliveredBy.id', '==', uid).where('OrderStatus','==','Delivered').onSnapshot(this.onCollectionUpdate) ;
          };
     
    
        componentDidMount() {
          this.setState({loading: true})
          this._bootstrapAsync();
        }

  render(){
    return (
      <Container>
          <SafeAreaView> 
            {this.state.dataSource.length > 0 ?
                <FlatList
                    data={this.state.dataSource}
                    renderItem={({ item }) => (

                        <Card  style={{marginLeft: 15, marginRight:15, paddingBottom: 5, marginBottom: 0, paddingLeft: 5, paddingRight: 5, paddingTop: 5,backgroundColor:'#E8E8E8',borderRadius: 8, flexDirection: 'column' }}>
                            <CardItem button onPress={() => this.props.navigation.navigate('OrderDetailsDelivered',{ 'orders' : item.datas, 'path' : this.state.store_path })}  >            
                                <Body style={{paddingLeft: 10}}>
                                    <View style={{flexDirection: 'row',paddingVertical: 5}}>
                                        <AntDesign name="form" size={18} color="#1aad57"/>
                                        <Text style={{color:'salmon',fontSize: 14, fontWeight:'bold'}}> Order Number:</Text><Text> #00{item.datas.OrderNo}</Text>
                                    </View>
                                    <View style={{flexDirection: 'row',paddingVertical: 5}}>
                                        <AntDesign name="user" size={18} color="#1aad57"/>
                                        <Text style={{color:'salmon',fontSize: 14, fontWeight:'bold'}}> Customer :</Text><Text> {item.datas.AccountInfo.name}</Text>
                                    </View>
                                    <View style={{flexDirection: 'row',paddingVertical: 5}}> 
                                        <AntDesign name="dashboard" size={18} color="#1aad57"/>
                                        <Text note style={{color:'salmon', fontSize: 12, fontWeight: 'bold'}}> Time:</Text><Text> {item.datas.OrderDetails.Time}</Text>
                                    </View>
                                    <View style={{flexDirection: 'row',paddingVertical: 5}}> 
                                        <AntDesign name="table" size={18} color="#1aad57"/>
                                        <Text note style={{color:'salmon', fontSize: 12, fontWeight: 'bold'}}> Date:</Text><Text> {item.datas.OrderDetails.Date}</Text>
                                    </View>     
                                      <View style={{flexDirection: 'row',paddingVertical: 5}}> 
                                        <AntDesign name="infocirlce" size={18} color="#1aad57"/>
                                        <Text note style={{color:'salmon', fontSize: 12, fontWeight: 'bold'}}> Status:</Text><Text> {item.datas.OrderStatus}</Text>
                                    </View>  
                                </Body>
           
                            </CardItem>                             
                            </Card>
                    )}
                    enableEmptySections={true}
                    style={{ marginTop: 10 }}
                
                /> :
                <Text style={{textAlign: 'center', paddingTop: 100}}>No orders yet.</Text>}
          </SafeAreaView>
      </Container>
    );
}
}

export default Delivered;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
});
