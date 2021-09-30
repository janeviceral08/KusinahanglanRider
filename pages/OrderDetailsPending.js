import React,{ Component} from 'react';
import {    Platform,
  StyleSheet,
  Text,
  View,
  ScrollView,
  DeviceEventEmitter,
  NativeEventEmitter,
  Switch,
  TouchableOpacity,
  Dimensions,
  ToastAndroid,
  Alert,
ActivityIndicator } from 'react-native';
import {Container, CardItem, Body, Card, Left, Right, List, ListItem, Button} from 'native-base';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Fontisto from 'react-native-vector-icons/Fontisto';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { FlatList } from 'react-native-gesture-handler';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import OrderItems from '../component/OrderItems';
import Modal from 'react-native-modal';
import {BluetoothEscposPrinter, BluetoothManager, BluetoothTscPrinter} from "react-native-bluetooth-escpos-printer";
import RNImmediatePhoneCall from 'react-native-immediate-phone-call';
import MapView, {  Polyline,  PROVIDER_GOOGLE,  } from 'react-native-maps';
import axios  from 'axios';
import Rider_img from '../assets/rider1.png';
import customer_img from '../assets/customer1.png';
import GetLocation from 'react-native-get-location'

var {height, width} = Dimensions.get('window');
var dateFormat = require('dateformat');

class OrderDetailsPending extends Component{
  _listeners = [];
constructor(props){
    super(props);
 
    this.ref = firestore().collection('riders');
    const orders = this.props.route.params.orders;
    this.state={
        orders: orders,
        visibleModal: false,
        visibleModal2: false,
        data:[],
        devices: null,
        pairedDs:[],
        foundDs: [],
        bleOpend: false,
        open: false,
        loading: false,
        boundAddress: '',
        debugMsg: '',
        visibleModal: false,
        store_key:'',
        name:'',
        store_name:'',
        address:'',
        city:'',
        startingLocation: {
            latitude: this.props.route.params.RLat,
            longitude: this.props.route.params.RLong,
        },
        finishLocation: {
            latitude: orders.ULat,
            longitude: orders.ULong,
          },
          routeForMap: [],
          name:'',
          email:'',
          number:'',
          status: true,
          uid:'',
          token: [],
    }
  
}

onCollectionUpdate = (querySnapshot) => {
    const stores = [];
    querySnapshot.forEach((doc) => {
     stores.push ({
            datas : doc.data(),
            key : doc.id,
            RLat: doc.data().RLat,
            RLong: doc.data().RLong,
            });
    });

    this.setState({
      data : stores,
  
   });
 
  
  }

  storeTotal(){
    const {orders} = this.state;
    let total = 0;
    orders.Products.forEach(item => {
            if(item.sale_price){
                total += item.sale_price * item.qty
            }else{
                total += item.price * item.qty
            }      
    });
    return total;
}
 
  onChangeRider(item){
    Alert.alert(
      'Confirmation',
      'Are you sure you want to proceed?',
      [
        {
          text: 'Cancel',
          onPress: () => this.setState({visibleModal2: false}),
          style: 'cancel'
        },
        { text: 'OK', onPress: () => this.changeRider(item) }
      ],
      { cancelable: false }
    );
}

changeRider(item){
    const ref = firestore().collection('orders').doc(this.state.orders.OrderId);
    ref.update({ 
        DeliveredBy : {           
            Name: item.Name,
            token: item.token,
            id: item.userId
        },
    })
    this.setState({visibleModal2: false})
}

  
onMarkAsDelivered(){
    Alert.alert(
      'Confirmation',
      'This order will be marked as Delivered, are you sure you want to proceed?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('cancel presss'),
          style: 'cancel'
        },
        { text: 'OK', onPress: () => this.markOrderAsDelivered() }
      ],
      { cancelable: false }
    );
}

onCall(item){
  Alert.alert(
    'Proceed to Call?',
    'Are you sure you want to proceed?',
    [
      {
        text: 'Cancel',
        onPress: () => this.setState({visibleModal: false}),
        style: 'cancel'
      },
      { text: 'OK', onPress: () => RNImmediatePhoneCall.immediatePhoneCall(item)}
    ],
    { cancelable: false }
  );
}

markOrderAsDelivered(item){
    const ref = firestore().collection('orders').doc(this.state.orders.OrderId);
    ref.update({ 
        OrderStatus : "Delivered"
    })
    this.props.navigation.goBack();
}



getLoc =async () =>{
   
    this.unsubscribe = firestore().collection('orders').where('OrderId', '==', this.state.orders.OrderId).onSnapshot(this.onCollectionUpdateRoute);
    };


    onCollectionUpdateRoute = (querySnapshot) => {
    querySnapshot.forEach((doc) => {
      //  console.log('r: ',doc.data())
     this.setState({
          startingLocation: {
                    latitude: doc.data().RLat,
                    longitude: doc.data().RLong,
                },

     });
    });
  }

componentDidMount(){
    setInterval(()=>{
        GetLocation.getCurrentPosition({
            showLocationDialog: true,
            enableHighAccuracy: true,
            timeout: 20000,
            maximumAge: 0,
            distanceFilter: 0
        })
        .then(location => {
            
            firestore().collection('orders').doc(this.state.orders.OrderId).update({
                RLat: location.latitude,
                RLong: location.longitude
              })
              .then(user => {
                console.log('OrderId: ',this.state.orders.OrderId);
                  console.log('latitude: ',location.latitude);
                console.log('longitude: ',location.longitude);
              
                //this._getRoute(location.latitude, location.longitude)
            }
                
                ).catch(error => {
                    const { code, message } = error;
                    console.log('Update Error');
                })
    
    
        })
        .catch(error => {
            const { code, message } = error;
            console.warn(code, message);
        })
        console.log('working')
      }, 60000);
      
    //this.getLoc();
    this.storeID();
    this._getRoute();
    this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate);
   

    BluetoothManager.isBluetoothEnabled().then((enabled)=> {
      this.setState({
          bleOpend: Boolean(enabled),
          loading: false
      })
  }, (err)=> {
      err
  });

  if (Platform.OS === 'ios') {
      let bluetoothManagerEmitter = new NativeEventEmitter(BluetoothManager);
      this._listeners.push(bluetoothManagerEmitter.addListener(BluetoothManager.EVENT_DEVICE_ALREADY_PAIRED,
          (rsp)=> {
              this._deviceAlreadPaired(rsp)
          }));
      this._listeners.push(bluetoothManagerEmitter.addListener(BluetoothManager.EVENT_DEVICE_FOUND, (rsp)=> {
          this._deviceFoundEvent(rsp)
      }));
      this._listeners.push(bluetoothManagerEmitter.addListener(BluetoothManager.EVENT_CONNECTION_LOST, ()=> {
          this.setState({
              name: '',
              boundAddress: ''
          });
      }));
  } else if (Platform.OS === 'android') {
      this._listeners.push(DeviceEventEmitter.addListener(
          BluetoothManager.EVENT_DEVICE_ALREADY_PAIRED, (rsp)=> {
              this._deviceAlreadPaired(rsp)
          }));
      this._listeners.push(DeviceEventEmitter.addListener(
          BluetoothManager.EVENT_DEVICE_FOUND, (rsp)=> {
              this._deviceFoundEvent(rsp)
          }));
      this._listeners.push(DeviceEventEmitter.addListener(
          BluetoothManager.EVENT_CONNECTION_LOST, ()=> {
              this.setState({
                  name: '',
                  boundAddress: ''
              });
          }
      ));
      this._listeners.push(DeviceEventEmitter.addListener(
          BluetoothManager.EVENT_BLUETOOTH_NOT_SUPPORT, ()=> {
              ToastAndroid.show("Device Not Support Bluetooth !", ToastAndroid.LONG);
          }
      ))
  }
 
}



storeID (){
    const {orders} = this.state;
    var uniq = {}
    if(orders.Products.length == 1){
      var arrFiltered = orders.Products;
    }else{
      var arrFiltered = orders.Products.filter(obj => !uniq[obj.storeId] && (uniq[obj.storeId] = true));
    }

    return arrFiltered;
}


_deviceAlreadPaired(rsp) {
  var ds = null;
  if (typeof(rsp.devices) == 'object') {
      ds = rsp.devices;
  } else {
      try {
          ds = JSON.parse(rsp.devices);
      } catch (e) {
      }
  }
  if(ds && ds.length) {
      let pared = this.state.pairedDs;
      pared = pared.concat(ds||[]);
      this.setState({
          pairedDs:pared
      });
  }
}

_deviceFoundEvent(rsp) {//alert(JSON.stringify(rsp))
  var r = null;
  try {
      if (typeof(rsp.device) == "object") {
          r = rsp.device;
      } else {
          r = JSON.parse(rsp.device);
      }
  } catch (e) {//alert(e.message);
      //ignore
  }
  //alert('f')
  if (r) {
      let found = this.state.foundDs || [];
      if(found.findIndex) {
          let duplicated = found.findIndex(function (x) {
              return x.address == r.address
          });
          //CHECK DEPLICATED HERE...
          if (duplicated == -1) {
              found.push(r);
              this.setState({
                  foundDs: found
              });
          }
      }
  }
}

_renderRow(rows){
  let items = [];
  for(let i in rows){
      let row = rows[i];

      if(row.address) {
          items.push(
              <TouchableOpacity key={new Date().getTime()+i} style={styles.wtf} onPress={()=>{
              this.setState({
                  loading:true
              });
              BluetoothManager.connect(row.address)
                  .then((s)=>{
                      this.setState({
                          loading:false,
                          boundAddress:row.address,
                          name:row.name || "UNKNOWN"
                      })
                  },(e)=>{
                      this.setState({
                          loading:false
                      })
                      alert(e);
                  })

          }}><Text style={styles.name}>{row.name || "UNKNOWN"}</Text><Text
                  style={styles.address}>{row.address}</Text></TouchableOpacity>
          );
      }
  }
  return items;
}



_getRoute = (latitude, longitude) => {

    let from_lat = parseFloat(this.state.startingLocation.latitude)
    let from_long = parseFloat(this.state.startingLocation.longitude)
    let to_lat = parseFloat(this.state.finishLocation.latitude)
    let to_long = parseFloat(this.state.finishLocation.longitude)
    // we will save all Polyline coordinates in this array
    let routeCoordinates = [];
    console.log('get route')
    axios.get(`https://route.ls.hereapi.com/routing/7.2/calculateroute.json?apiKey=5fcoJoPAIOye99-ssHc6TIx73yOAhtWiU1_1p1461X4&waypoint0=geo!${from_lat},${from_long}&waypoint1=geo!${to_lat},${to_long}&mode=fastest;bicycle;traffic:disabled&legAttributes=shape`)
    .then(res => {
        // here we are getting all route coordinates from API response
  // here we are getting all route coordinates from API response
 
        res.data.response.route[0].leg[0].shape.map(m => {
          // here we are getting latitude and longitude in seperate variables because HERE sends it together, but we
          // need it seperate for <Polyline/>
          let latlong = m.split(',');
          let latitude = parseFloat(latlong[0]);
          let longitude = parseFloat(latlong[1]);
          routeCoordinates.push({latitude: latitude, longitude: longitude});
      })
      this.setState({
          routeForMap: routeCoordinates,
          // here we can access route summary which will show us how long does it take to pass the route, distance etc.
          summary: res.data.response.route[0].summary,
          // NOTE just add this 'isLoading' field now, I'll explain it later
          isLoading: false,
      })
      }).catch(err => {
      console.log(err)
      })
}
onConfirmation(item){
    Alert.alert(
      'Confirmation',
      'Are you sure you want to proceed?',
      [
        {
          text: 'Cancel',
          onPress: () => this.setState({visibleModal: false}),
          style: 'cancel'
        },
        { text: 'OK', onPress: () => this.acceptOrder(item) }
      ],
      { cancelable: false }
    );
}
acceptOrder(item){
    this.setState({loading: true,})
    const ref = firestore().collection('orders').doc(this.state.orders.OrderId);
    const notif_ref = firestore().collection('notification').doc(this.state.orders.OrderId);
    ref.update({ 
        OrderStatus : "Processing",
        rider_id:this.props.route.params.RiderId,
        DeliveredBy : {           
            Name: this.props.route.params.RiderName,
            token: this.props.route.params.RiderToken,
            id: this.props.route.params.RiderId
        },
    })
   
                                                    this.setState({loading: false,})
                                                this.props.navigation.goBack();
                                
    
}



  render(){
    const {orders} = this.state;
    console.log('routeForMap: ', this.state.routeForMap)
    return (
      <Container>
        <ScrollView>
        <Card transparent>
            <CardItem style={{marginRight: 10, marginLeft: 10, backgroundColor:'#E8E8E8', paddingBottom: 0}}>
                <Left/>
                <Body style={{flex: 2}}><Text style={{fontWeight: 'bold', fontSize: 18}}>Order Details</Text></Body>
                <Right>
                  <TouchableOpacity onPress={()=> this.setState({printModal: true})}>
                    <Text>
                      Print
                    </Text>
                  </TouchableOpacity>
                </Right>
            </CardItem>
            <CardItem style={{marginRight: 10, marginLeft: 10, backgroundColor:'#E8E8E8', paddingBottom: 0, height: 400}}>
                <Body style={{backgroundColor: 'white', borderRadius:10}}>
                <View style={{width:'100%', flexDirection:'row', backgroundColor: 'lightblue', padding: 10, borderTopRightRadius: 10, borderTopLeftRadius: 10}}>
                                <AntDesign name="pushpin" size={18} color="red"/>
                                <Text  style={{paddingHorizontal: 10,fontWeight:'bold',}}>Order Details</Text>
                            </View>
                    
                            <View style={{position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    alignItems: 'center'}}>
    
    <MapView
      provider={PROVIDER_GOOGLE}
      zoomEnabled={true}
        showsUserLocation={true}
        scrollEnabled={true}
                pitchEnabled={true}
        style={{ position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0}}
          region={{
            latitude: this.state.startingLocation.latitude, 
            longitude: this.state.startingLocation.longitude,
             latitudeDelta: 0.01,
              longitudeDelta: 0.005,
          }}
         
          >
             {this.state.routeForMap && (
                <Polyline
                  key="editingPolyline"
                  coordinates={this.state.routeForMap}
                  strokeColor="#F00"
                  fillColor="rgba(255,0,0,0.5)"
                  strokeWidth={5}
                />
              )}
             
          <MapView.Marker
             coordinate={{latitude: this.state.startingLocation.latitude, longitude: this.state.startingLocation.longitude}}
             title={"Store"}
             description={"Store Location"}
             image={Rider_img}
          />
              <MapView.Marker
             coordinate={{latitude: this.state.finishLocation.latitude, longitude: this.state.finishLocation.longitude}}
             title={"User"}
             description={"user Description"}
             image={customer_img}
          />
          
          </MapView>
    </View>
    </Body>                
            </CardItem>
            <CardItem style={{marginRight: 10, marginLeft: 10, backgroundColor:'#E8E8E8', paddingBottom: 0}}>
                <Body style={{backgroundColor: 'white', borderRadius:10}}>
                <View style={{width:'100%', flexDirection:'row', backgroundColor: 'lightblue', padding: 10, borderTopRightRadius: 10, borderTopLeftRadius: 10}}>
                                <AntDesign name="pushpin" size={18} color="red"/>
                                <Text  style={{paddingHorizontal: 10,fontWeight:'bold',}}>Order Details</Text>
                            </View>
                    <View style={{flexDirection: 'row',paddingVertical: 5,paddingHorizontal:10}}>
                        <AntDesign name="form" size={18} color="#1aad57"/>
                        <Text style={{color:'salmon',fontSize: 14, fontWeight:'bold'}}> Order Number:</Text><Text> #00{orders.OrderNo}</Text>
                    </View>
                    <View style={{flexDirection: 'row',paddingVertical: 5,paddingHorizontal:10}}>
                        <AntDesign name="user" size={18} color="#1aad57"/>
                        <Text style={{color:'salmon',fontSize: 14, fontWeight:'bold'}}> Customer :</Text><Text> {orders.AccountInfo.name}</Text>
                    </View>
                    <View style={{flexDirection: 'row',paddingVertical: 5,paddingHorizontal:10}}> 
                        <AntDesign name="dashboard" size={18} color="#1aad57"/>
                        <Text note style={{color:'salmon', fontSize: 14, fontWeight: 'bold'}}> Time:</Text><Text> {orders.OrderDetails.Time}</Text>
                    </View>
                    <View style={{flexDirection: 'row',paddingVertical: 5,paddingHorizontal:10}}> 
                        <AntDesign name="table" size={18} color="#1aad57"/>
                        <Text note style={{color:'salmon', fontSize: 14, fontWeight: 'bold'}}> Date:</Text><Text> {orders.OrderDetails.Date}</Text>
                    </View>     
                    <View style={{flexDirection: 'row',paddingVertical: 5,paddingHorizontal:10}}> 
                        <AntDesign name="solution1" size={18} color="#1aad57"/>
                        <Text note style={{color:'salmon', fontSize: 14, fontWeight: 'bold'}}> Recepient:</Text><Text> {orders.Billing.name}</Text>
                    </View>  
                    <View style={{flexDirection: 'row',paddingVertical: 5,paddingHorizontal:10}}> 
                        <AntDesign name="phone" size={18} color="#1aad57"/>
                        <TouchableOpacity onPress={()=>this.onCall(orders.Billing.phone)}>
                            <Text note style={{color:'salmon', fontSize: 14, fontWeight: 'bold'}}> Contact #:</Text><Text> {orders.Billing.phone}</Text>
                        </TouchableOpacity>
                    </View>  
                    <View style={{flexDirection: 'row',paddingVertical: 5,paddingHorizontal:10}}> 
                        <AntDesign name="enviromento" size={18} color="#1aad57"/>
                        <Text numberOfLines={5} note style={{color:'salmon', fontSize: 14, fontWeight: 'bold'}}> Delivery Address:</Text>
                    </View>  
                    <View style={{flexDirection: 'row',paddingLeft:30, paddingBottom:10}}> 
                        <Text>{orders.Billing.address}, {orders.Billing.barangay},{orders.Billing.province}</Text>
                    </View> 
                    <View style={{flexDirection: 'row',paddingVertical: 5,paddingHorizontal:10}}> 
                        <Fontisto name="motorcycle" size={18} color="#1aad57"/>
                        <Text note style={{color:'salmon', fontSize: 14, fontWeight: 'bold'}}> Assigned Rider :</Text><Text> {orders.DeliveredBy.Name}</Text>
                    </View> 
                  {orders.RiderCancel < 0 || orders.RiderCancel== undefined?null:  <View>
                    <View style={{flexDirection: 'row',paddingVertical: 5,paddingHorizontal:10}}> 
                        <MaterialCommunityIcons name="file-cancel-outline" size={18} color="#1aad57"/>
                        <Text numberOfLines={5} note style={{color:'salmon', fontSize: 14, fontWeight: 'bold'}}>Cancelled By Riders:</Text>
                    </View>  
                  {orders.RiderCancel.map((info, index) =>  {return(<View style={{flexDirection: 'row',paddingLeft:30, paddingBottom:10}} key={index}> 
                        <Text>{info.RiderName}- {info.CancelledReason}</Text>
                    </View>)} )}
                    </View> }
                </Body>                                             
            </CardItem>
            <CardItem style={{marginRight: 10, marginLeft: 10, backgroundColor:'#E8E8E8', paddingBottom: 0}}>
                <Left/>
                <Body style={{flex: 3}}><Text style={{fontWeight: 'bold', fontSize: 15}}>Ordered Products by Store</Text></Body>
                <Right/>
            </CardItem>
            <CardItem style={{marginRight: 10, marginLeft: 10, backgroundColor:'#E8E8E8',flexDirection: 'column' , paddingBottom: 0}}>
                {
                this.storeID().map((item,index) => {
                    return (
                        <Body style={{flex: 1, marginTop: 5}} key={index}>
                            <View style={{width:'100%', flexDirection:'row', backgroundColor: 'lightblue', padding: 10, borderTopRightRadius: 10, borderTopLeftRadius: 10}}>
                                <AntDesign name="pushpin" size={18} color="red"/>
                                <Text  style={{paddingHorizontal: 10,fontWeight:'bold',}}>{item.store_name}</Text>
                            </View>
                            <View style={{flexDirection:'row', backgroundColor: 'white', borderBottomLeftRadius:10,borderBottomRightRadius: 10}}>
                                <OrderItems navigation={this.props.navigation} id={item.storeId} subtotal={orders.subtotal} oid={orders.OrderId} item={orders.Products} />
                            </View>
                        </Body>
                    )
                })
                }   
            </CardItem>
            <CardItem style={{marginRight: 10, marginLeft: 10, backgroundColor:'#E8E8E8', paddingBottom: 0}}>
                <Left/>
                <Body style={{flex: 3}}><Text style={{fontWeight: 'bold', fontSize: 15}}>Order Summary/Total</Text></Body>
                <Right/>
            </CardItem>
            <CardItem style={{marginRight: 10, marginLeft: 10, backgroundColor:'#E8E8E8'}}>
                <View style={{flex:1,paddingLeft: 10, backgroundColor:'white', paddingHorizontal: 10, borderRadius: 10}}>
                    <View style={{flexDirection: 'row',paddingVertical: 5, justifyContent:'space-between'}}>
                        <Text style={{color:'#1aad57',fontSize: 14, fontWeight:'bold'}}>Sub Total</Text>
                        <Text>₱{Math.round(this.storeTotal()*10)/10}</Text>
                    </View>
                    <View style={{flexDirection: 'row',paddingVertical: 5, justifyContent:'space-between'}}>
                        <Text style={{color:'#1aad57',fontSize: 14, fontWeight:'bold'}}>Delivery Charge</Text><Text> ₱{Math.round(orders.delivery_charge*10)/10}</Text>
                    </View>
                    <View style={{flexDirection: 'row',paddingVertical: 5, justifyContent:'space-between'}}> 
                        <Text note style={{color:'#1aad57', fontSize: 12, fontWeight: 'bold'}}>Extra Kilometer Charge</Text><Text> ₱{orders.extraKmCharge}</Text>
                    </View>
                        
                    <View style={{flexDirection: 'row',paddingVertical: 5, justifyContent:'space-between'}}> 
                        <Text note style={{color:'red', fontSize: 14, fontWeight: 'bold'}}>Discount</Text><Text> -₱{orders.discount}</Text>
                    </View>  
                    <View style={{borderBottomWidth: 1, borderBottomColor: 'gray'}}/>
                    <View style={{flexDirection: 'row',paddingVertical: 5, justifyContent:'space-between'}}> 
                        <Text note style={{color:'#1aad57', fontSize: 15, fontWeight: 'bold'}}>Total</Text><Text style={{color:'#1aad57', fontSize: 15, fontWeight: 'bold'}}> ₱{Math.round((this.storeTotal() + orders.extraKmCharge + orders.delivery_charge - orders.discount)*10)/10}</Text>
                    </View> 
                </View>                                             
            </CardItem>

       
             {orders.OrderStatus == 'Pending' &&
             <CardItem style={{marginRight: 10, marginLeft: 10, flex: 3, justifyContent: "space-between", alignContent: "center",backgroundColor:'#E8E8E8' }}>
             <Button style={{backgroundColor: 'limegreen', flex:1, marginHorizontal: 2}} block onPress={()=> this.onConfirmation()}>
                 <Text style={{color:'white', fontSize: 15, fontWeight: 'bold'}}>Accept</Text>
             </Button>
         </CardItem>
            }
        </Card>
        </ScrollView>
    <Modal
              isVisible={this.state.printModal}
               animationInTiming={1000}
            animationIn='slideInUp'
            animationOut='slideOutDown'
            animationOutTiming={1000}
            useNativeDriver={true}
              onBackdropPress={() => this.setState({printModal: false})} transparent={true}>
                 <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.title}>Open Bluetooth Before Scanning </Text>
                <View>
                <View style={{flexDirection: 'row', alignContent: "center", justifyContent: "center"}}>
                <Text>Turn On Switch</Text>
                <Switch value={this.state.open} onValueChange={(v)=>{
                this.setState({
                    loading:true
                })
                if(!v){
                    BluetoothManager.disableBluetooth().then(()=>{
                        this.setState({
                          open:false,
                            loading:false,
                            foundDs:[],
                            pairedDs:[]
                        });
                    },(err)=>{alert(err)});

                }else{
                    BluetoothManager.enableBluetooth().then((r)=>{
                        var paired = [];
                        if(r && r.length>0){
                            for(var i=0;i<r.length;i++){
                                try{
                                    paired.push(JSON.parse(r[i]));
                                }catch(e){
                                    //ignore
                                }
                            }
                        }
                        this.setState({
                          open:true,
                            loading:false,
                            pairedDs:paired
                        })
                    },(err)=>{
                        this.setState({
                            loading:false
                        })
                        alert(err)
                    });
                }
            }}/>
            </View>
            <View style={{paddingHorizontal : 30, paddingVertical: 10}}>
                    <Button block disabled={this.state.loading || !this.state.open} onPress={()=>
                        this._scan()
                    }><Text>Scan</Text></Button>
            </View>
                </View>
                <Text  style={styles.title}>Connected:<Text style={{color:"blue"}}>{!this.state.name ? 'No Devices' : this.state.name}</Text></Text>
                <Text  style={styles.title}>Found(tap to connect):</Text>
                {this.state.loading ? (<ActivityIndicator animating={true}/>) : null}
                <View>
                {this.state.foundDs &&
                    this._renderRow(this.state.foundDs)
                }
                </View>
                <Text  style={styles.title}>Paired:</Text>
                {this.state.loading ? (<ActivityIndicator animating={true}/>) : null}
                <View style={{flex:1,flexDirection:"column"}}>
                {
                    this._renderRow(this.state.pairedDs)
                }
                </View>

                <View style={{flexDirection:"column",justifyContent:"space-around",paddingVertical:10 , paddingHorizontal: 30}}>         
                <Button block  color="tomato" disabled={this.state.loading|| !(this.state.bleOpend && this.state.boundAddress.length > 0) }
                        title="Print Receipt" onPress={async () => {
                    try {
                        await BluetoothEscposPrinter.printerInit();
                        await BluetoothEscposPrinter.printerLeftSpace(0);

                        await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER);
                        await BluetoothEscposPrinter.setBlob(0);
                        await  BluetoothEscposPrinter.printText(`Order No. ${orders.OrderNo}\r\n`, {
                            encoding: 'GBK',
                            codepage: 0,
                            widthtimes: 1,
                            heigthtimes: 0,
                            fonttype: 2
                        });
                        
                        await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.LEFT);
                        await  BluetoothEscposPrinter.printText("Date / Time " + (dateFormat(new Date(), "yyyy-mm-dd h:MM:ss")) + "\r\n", {});
                        await  BluetoothEscposPrinter.printText(`TRID  ${orders.OrderId}\r\n`, {});
                        await  BluetoothEscposPrinter.printText(`Rider:  ${orders.DeliveredBy.Name}\r\n`, {});
               
                        await  BluetoothEscposPrinter.printText("--------------------------------\r\n", {});
                        let columnWidths = [23, 4, 7, 8];
                        let columnWidths2 =[23, 4,7, 8 ];
                        await BluetoothEscposPrinter.printColumn(columnWidths,
                            [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.CENTER, BluetoothEscposPrinter.ALIGN.CENTER, BluetoothEscposPrinter.ALIGN.RIGHT],
                            ["Item", 'Qty', 'Price', 'Total'], {encoding: 'GBK',
                            codepage: 0,
                            widthtimes: 0,
                            heigthtimes: 0,
                            fonttype: 1});
                       await  BluetoothEscposPrinter.printText("--------------------------------\r\n", {});
                         await orders.Products.map((item, i) => {
                               let num = item.qty;
                               let num2 = item.price;
                               let num3 = Math.round((num * num2)*10)/10;
                               let num4 = item.sale_price;
                               let num5= Math.round((num * num4)*10)/10;
                               let sale_price = num4.toString();
                               let price = num2.toString();
                               let qty= num.toString();  
                               let total = num3.toString();
                               let total_sp = num5.toString();

                                if(item.sale_price){    
                                  BluetoothEscposPrinter.printColumn(columnWidths,
                                                        [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.CENTER, BluetoothEscposPrinter.ALIGN.RIGHT],
                                                        [`${item.name} ${item.brand} (${item.unit})`, `${qty}`, sale_price, total_sp],{encoding: 'GBK',
                                                        codepage: 0,
                                                        widthtimes: 0,
                                                        heigthtimes: 0,
                                                        fonttype: 1})
                                                        
                                          BluetoothEscposPrinter.printText(`Note: ${item.note}\r\n`, {encoding: 'GBK',
                                                                                                        codepage: 0,
                                                                                                        widthtimes: 0,
                                                                                                        heigthtimes: 0,
                                                                                                        fonttype: 1});
                                }else{
                                   BluetoothEscposPrinter.printColumn(columnWidths,
                                                        [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.CENTER, BluetoothEscposPrinter.ALIGN.RIGHT],
                                                        [`${item.name} ${item.brand} (${item.unit})`, `  ${qty}`, price, total], {encoding: 'GBK',
                                                        codepage: 0,
                                                        widthtimes: 0,
                                                        heigthtimes: 0,
                                                        fonttype: 1})
                                          BluetoothEscposPrinter.printText(`Note: ${item.note}\r\n`, {
                                                                                                        encoding: 'GBK',
                                                                                                        codepage: 0,
                                                                                                        widthtimes: 0,
                                                                                                        heigthtimes: 0,
                                                                                                        fonttype: 1});
                                }
                          });
                        await  BluetoothEscposPrinter.printText("--------------------------------\r\n", {});
                        await BluetoothEscposPrinter.printColumn(columnWidths2,
                                                    [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.CENTER, BluetoothEscposPrinter.ALIGN.RIGHT],
                                                    ["Subtotal", "", "", `${Math.round(this.storeTotal()*10)/10}`], {encoding: 'GBK',
                                                    codepage: 0,
                                                    widthtimes: 0,
                                                    heigthtimes: 0,
                                                    fonttype: 1})
                        await  BluetoothEscposPrinter.printText("\r\n", {});
                        await BluetoothEscposPrinter.printColumn(columnWidths2,
                          [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.CENTER, BluetoothEscposPrinter.ALIGN.RIGHT],
                          ["Delivery Charge", "", "", `${Math.round(orders.delivery_charge*10)/10}`], {encoding: 'GBK',
                          codepage: 0,
                          widthtimes: 0,
                          heigthtimes: 0,
                          fonttype: 1})
                        await  BluetoothEscposPrinter.printText("\r\n", {});
                        await BluetoothEscposPrinter.printColumn(columnWidths2,
                          [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.CENTER, BluetoothEscposPrinter.ALIGN.RIGHT],
                          ["Extra Kilometer Charge", "", "",`${orders.extraKmCharge}`], {encoding: 'GBK',
                          codepage: 0,
                          widthtimes: 0,
                          heigthtimes: 0,
                          fonttype: 1})
                        await  BluetoothEscposPrinter.printText("\r\n", {});
                        await BluetoothEscposPrinter.printColumn(columnWidths2,
                                                    [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.CENTER, BluetoothEscposPrinter.ALIGN.RIGHT],
                                                    ["Discount", "", "-", `${orders.discount}`], {encoding: 'GBK',
                                                    codepage: 0,
                                                    widthtimes: 0,
                                                    heigthtimes: 0,
                                                    fonttype: 1})
                        await  BluetoothEscposPrinter.printText("--------------------------------\r\n", {});
                        await BluetoothEscposPrinter.printColumn(columnWidths2,
                                                    [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.CENTER, BluetoothEscposPrinter.ALIGN.RIGHT],
                                                    ["Total", "", "", `${Math.round((this.storeTotal() + orders.extraKmCharge + orders.delivery_charge - orders.discount)*10)/10}`], {encoding: 'GBK',
                                                    codepage: 0,
                                                    widthtimes: 0,
                                                    heigthtimes: 0,
                                                    fonttype: 1})
                   
                     
                        await  BluetoothEscposPrinter.printText("--------------------------------\r\n", {});
        
                        await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER);
                        await  BluetoothEscposPrinter.printText("Thank you for ordering with us!\r\n\r\n\r\n",  {
                            encoding: 'GBK',
                            codepage: 0,
                            widthtimes: 0,
                            heigthtimes: 0,
                            fonttype: 1
                        });
                        await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.LEFT);
                    } catch (e) {
                        alert(e.message || "ERROR");
                    }

                }}><Text>Print</Text></Button>
                 
                </View>
                <View style={{ paddingHorizontal: 30}}>
                <Button block  color="tomato" 
                         onPress={()=> this.setState({printModal: false})}><Text>Close</Text></Button>
                </View>
                </ScrollView>
            </Modal>
      </Container>
    );
}

_selfTest() {
  this.setState({
      loading: true
  }, ()=> {
      BluetoothEscposPrinter.selfTest(()=> {
      });

      this.setState({
          loading: false
      })
  })
}

_scan() {
  this.setState({
      loading: true
  })
  BluetoothManager.scanDevices()
      .then((s)=> {
          var ss = s;
          var found = ss.found;
          try {
              found = JSON.parse(found);//@FIX_it: the parse action too weired..
          } catch (e) {
              //ignore
          }
          var fds =  this.state.foundDs;
          if(found && found.length){
              fds = found;
          }
          this.setState({
              foundDs:fds,
              loading: false
          });
      }, (er)=> {
          this.setState({
              loading: false
          })
          alert('error' + JSON.stringify(er));
      });
}

}

export default OrderDetailsPending;

const styles = StyleSheet.create({
  line: {
    width: '100%',
    height: 1,
    backgroundColor: '#bdc3c7',
    marginBottom: 10,
    marginTop: 10
  },
  invoice: {
      padding: 20,
      backgroundColor:"#FFFFFF",
      borderWidth: 0.2,
      borderBottomColor: '#ffffff',
      borderTopColor: '#ffffff',

    },
    centerElement: {justifyContent: 'center', alignItems: 'center'},
    content: {
      backgroundColor: 'white',
      padding: 22,
      borderRadius: 4,
      borderColor: 'rgba(0, 0, 0, 0.1)',
    },
     container: {
        backgroundColor: '#F5FCFF',
        paddingVertical: 20
    },

    title:{
        width:width,
        backgroundColor:"#eee",
        color:"#232323",
        paddingLeft:8,
        textAlign:"left"
    },
    wtf:{
        flex:1,
        flexDirection:"row",
        justifyContent:"space-between",
        alignItems:"center",
        paddingHorizontal: 10
    },
    name:{
        flex:1,
        textAlign:"left"
    },
    address:{
        flex:1,
        textAlign:"right"
    }
});



const style = StyleSheet.create({
    wrapper: {
      // marginBottom: -80,
      backgroundColor: "white",
      height: 80,
      width: "100%",
      padding: 10
    },
    notificationContent: {
      flexDirection: "row",
      flexWrap: "wrap",
      alignItems: "flex-start"
    },
   sssage: {
      marginBottom: 2,
      fontSize: 14
    },
    closeButton: {
      position: "absolute",
      right: 10,
      top: 10
    },
    content: {
      backgroundColor: 'white',
      padding: 22,
      borderRadius: 4,
      borderColor: 'rgba(0, 0, 0, 0.1)',
    },
    contentTitle: {
      fontSize: 20,
      fontWeight: "bold",
      marginBottom: 5,
    },
  });