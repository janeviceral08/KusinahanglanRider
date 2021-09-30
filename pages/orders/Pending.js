import React,{ Component} from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, Dimensions, Alert } from 'react-native';
import {Container, Card, CardItem, Thumbnail, Body, Button} from 'native-base';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SCREEN_WIDTH = Dimensions.get('window').width;

class Pending extends Component{
    constructor() {
        super();
        this.ref = firestore();
        this.unsubscribe = null;
        this.state = {
          formValid: true,
          error: "",
          loading: false,
          dataSource: ["0"],
          uid:'',
          store_path: '',
          pendings: [],
          name:'',
      token: [],
      wallet: 0,
      admin_wallet: 0,
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
          //console.log(orders)
          this.setState({
            dataSource : orders,
            loading: false,
         })
      
        }
     
        _bootstrapAsync =async () =>{
            const uid= await AsyncStorage.getItem('usertoken');
            this.unsubscribe = this.ref.collection('orders').where('DeliveredBy.id', '==', uid).where('OrderStatus','==','Processing').onSnapshot(this.onCollectionUpdate) ;
          };
          GetPending =async () =>{
            const uid= await AsyncStorage.getItem('usertoken');
            this.unsubscribe = this.ref.collection('orders').where('OrderStatus', '==', "Pending").orderBy('OrderNo', 'asc').onSnapshot(this.onCollectionUpdateGetPending) ;
          };
              
          onCollectionUpdateGetPending = (querySnapshot) => {
            const orders = [];
            querySnapshot.forEach((doc) => {
             orders.push ({
                    datas : doc.data(),
                    key : doc.id
                    });
            })
            //console.log(orders)
            this.setState({
                pendings : orders,
              loading: false,
           })
        
          }
    
        componentDidMount() {
          this.setState({loading: true})
          this.GetRiderInfo();
          this._bootstrapAsync();
          this.GetPending();
    this.getDelivery();
        
        }

        GetRiderInfo =async () =>{
            const uid= await AsyncStorage.getItem('usertoken');
            this.unsubscribe = this.ref.collection('riders').where('userId', '==', uid ).onSnapshot(this.onCollectionUpdateGetRiderInfo);
            this.setState({ uid: uid }) };
              
            onCollectionUpdateGetRiderInfo = (querySnapshot) => {
                const rider = [];
                querySnapshot.forEach((doc) => {
                  this.setState({
                    name:doc.data().Name,
                    email: doc.data().Email,
                    number:doc.data().Mobile,
                    token:doc.data().token,
                    wallet:doc.data().wallet,
                 });
                });
              }


              
getDelivery = async() =>{
    console.log('getDelivery!');
    const getData= this.ref.collection('charges').where('status', '==', 'process').onSnapshot(
        querySnapshot => {
            const orders = []
            querySnapshot.forEach(doc => {
                console.log('doc.data(): ',doc.data())
                this.setState({
        
                    admin_wallet: doc.data().AdminWallet,
                 })
            });

        },
        error => {
            console.log(error)
        }
    );

    };
  render(){
      console.log('admin Wallet: ', this.state.admin_wallet)
    return (
      <Container>
          <SafeAreaView> 
            {this.state.pendings.length > 0 ?
                <FlatList
                    data={this.state.pendings}
                    renderItem={({ item }) => (

                        <Card  style={{marginLeft: 15, marginRight:15, paddingBottom: 5, marginBottom: 0, paddingLeft: 5, paddingRight: 5, paddingTop: 5,backgroundColor:'#E8E8E8',borderRadius: 8, flexDirection: 'column' }} key={item.key}>
                            <CardItem button onPress={() => {this.state.admin_wallet < 1? Alert.alert(
    'Sorry You Cannot Proceed',
    'Admin have insufficient balance',
    [
      { text: 'OK', onPress: () => null}
    ],
    { cancelable: false }
  ) :this.state.dataSource.length > 0 || this.state.wallet < 1? null: this.props.navigation.navigate('OrderDetailsPending',{ 'orders' : item.datas, 'path' : this.state.store_path, 'RLat' : item.datas.Products[0].slatitude, 'RLong' :  item.datas.Products[0].slongitude, 'RiderId': this.state.uid, 'RiderName': this.state.name, 'RiderToken': this.state.token })}}  >            
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

export default Pending;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
});
