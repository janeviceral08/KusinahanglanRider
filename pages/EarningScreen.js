import React,{ Component} from 'react';
import { Platform,
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
ActivityIndicator,
FlatList} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Container, Card, Thumbnail, Body, Right, Left, CardItem,Button, Icon, Header,Titl, List, Item, Input, Title} from 'native-base';
import moment from "moment";
import Modal from 'react-native-modal';
var {height, width} = Dimensions.get('window');
var dateFormat = require('dateformat');
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

class riderDetails extends Component{
  _listeners = [];
  constructor(props) {
    super(props);
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
      store_path: '',
      currentDate: new Date(),
      printModal: false,
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
      isDatePickerVisible: false,
      isDatePickerVisibleEnd: false,
      dateRangeModal: false,
      startDate: "",
      endDate: "",
 
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
console.log('orders: ', orders)
    this.setState({
      dataSource : orders,
      loading: false,
   })

  }


  showDatePickerEnd = () => {
    this.setState({isDatePickerVisibleEnd: true})
      };
    
       hideDatePickerEnd = () => {
        this.setState({isDatePickerVisibleEnd: false})
      };
    
       handleConfirmEnd = (date) => {
        console.warn("A date has been picked: ", date);
          this.setState({endDate: date})
        this.hideDatePickerEnd();
      };
          
           showDatePicker = () => {
    this.setState({isDatePickerVisible: true})
      };
    
       hideDatePicker = () => {
        this.setState({isDatePickerVisible: false})
      };
    
       handleConfirm = (date) => {
        console.warn("A date has been picked: ", date);
          this.setState({startDate: date})
        this.hideDatePicker();
      };

  TotalAmount(){
    let total = 0
  this.state.dataSource.forEach((item) => {
    total += this.OverallTotal(item.datas.Products) + item.datas.delivery_charge + item.datas.extraKmCharge
  
})
return total;
  }

  
  OverallTotal(items){
    let total = 0
  items.forEach((item) => {
    if(item.sale_price){
      total += item.sale_price * item.qty
  }else{
      total += item.price * item.qty
  }    
})
return total;
}


  onRiderClear(){
    Alert.alert(
      'Confirmation',
      'Are you sure you want to proceed?',
      [
        {
          text: 'Cancel',
          onPress: () => this.setState({visibleModal2: false}),
          style: 'cancel'
        },
        { text: 'OK', onPress: () => this.saveRiderReport() }
      ],
      { cancelable: false }
    );
  }

  saveRiderReport(){
    const today = this.state.currentDate;
    const date_ordered = moment().format('MMMM Do YYYY, h:mm:ss a');
    const week_no = moment().format('MMDDYYYY').isoWeek();
    const time =  moment().format('h:mm:ss a');
    const date = moment().format('MMMM D, YYYY');
    const newDocumentID = firestore().collection('rider_report').doc().id;
    const userId = auth().currentUser.uid;
    this.ref.collection('rider_report').doc(newDocumentID).set({
        Date: date,
        Rider_Id: this.state.id,
        Orders: this.state.dataSource,
        Total_Delivery: this.state.dataSource.length,
        Total_Amount: this.TotalAmount(),
        id: newDocumentID
    })
  }

  _bootstrapAsync = (id) =>{
    const today = this.state.currentDate;
  
    const date_ordered = moment(today).format('MMMM Do YYYY, h:mm:ss a');
    const week_no = moment(today , "MMDDYYYY").isoWeek();
    const time =  moment(today).format('h:mm:ss a');
    const date = moment().format('MMMM D, YYYY');
    let Name = 'id';
    let Date = 'Date';
    let path = 'DeliveredBy.'+'id';
    let paths = 'OrderDetails.'+'Date';
      this.unsubscribe = this.ref.collection('orders').where('DeliveredBy.id', '==', id)
      .where('OrderDetails.Date','==', date).onSnapshot(this.onCollectionUpdate) ;
    };


   async componentDidMount() {
    const uid= await AsyncStorage.getItem('usertoken');
    this.setState({loading: true})
    console.log(uid)
    this._bootstrapAsync(uid);
  }
  
  GetData = () =>{
    this.haveNewValue();
}
haveNewValue = async() =>{
  const uid= await AsyncStorage.getItem('usertoken');
 this.setState({ loading: true,dateRangeModal: false})
   const startDate = this.state.startDate;
   const endDate = this.state.endDate;
   const date_ordered = moment(startDate).unix();
       const date_orderedendDate = moment(endDate).unix();
     this.unsubscribes = this.ref.collection('orders').where('DeliveredBy.id', '==', uid).where('OrderStatus','==', 'Delivered').where('Timestamp','>=', date_ordered)
     .where('Timestamp','<=', date_orderedendDate).onSnapshot(
               querySnapshot => {
                   const orders = []
                   querySnapshot.forEach(doc => {
                       console.log('doc.data(): ',doc.data())
                       orders.push ({
           datas : doc.data(),
           key : doc.id
           })
                   });
                   this.setState({
     dataSource : orders,
     loading: false,
     
  })
               },
               error => {
                   console.log(error)
               }
           )
   };

  render(){
    console.log('earnings: ', this.state.dataSource)
    
    return (
      <Container>
  
        <Header androidStatusBarColor="#2c3e50" style={{display:'none'}} style={{backgroundColor: 'white'}}>
          <Left style={{flex:1}}>      
              
          </Left>
          <Body style={{flex: 3}}>
            <Title style={{color:'tomato'}}>Rider Delivery Details</Title>
          </Body>
          <Right style={{flex:1}}>
          <Button transparent  onPress={()=> this.setState({dateRangeModal: true})}>
                    <Icon style={{color:'tomato'}} name='md-calendar-sharp' />
                 </Button> 
              <Button transparent  onPress={()=> this.setState({printModal: true})}>
                    <Icon style={{color:'tomato'}} name='md-print' />
                 </Button> 
          </Right>
        </Header>

        <Modal
      isVisible={this.state.dateRangeModal}
      animationInTiming={700}
      animationIn='slideInUp'
      animationOut='slideOutDown'
      animationOutTiming={700}
      useNativeDriver={true}
      onBackdropPress={() => this.setState({dateRangeModal: false})} transparent={true}>
     <Card style={style.content}>
       
        <List>
        
            
                    <Text style={{marginTop: 15, fontSize: 10}}>Start Date/Time</Text>
                    <Item regular style={{marginTop: 7, padding: 10}}>
                       <TouchableOpacity onPress={this.showDatePicker} style={{width: '100%'}}>
<Text>{this.state.startDate===""?'Start Date/Time':moment(this.state.startDate).format('MMM D, YYYY h:mm a')}</Text>
</TouchableOpacity>

                    </Item>
                        <Text style={{marginTop: 15, fontSize: 10}}>End Date/Time</Text>
                    <Item regular style={{marginTop: 7, padding: 10}}>
                   
<TouchableOpacity onPress={this.showDatePickerEnd} style={{width: '100%'}}>
<Text>{this.state.endDate ===""?'End Date/Time':moment(this.state.endDate).format('MMM D, YYYY h:mm a')}</Text>
</TouchableOpacity>
                    </Item>
           </List>   
    
      <Button block style={{ height: 30, backgroundColor:  "#33c37d", marginTop: 10}}
        onPress={() => this.GetData()}
      >
       <Text style={{color:'white'}}>Get Data</Text>
      </Button>
    </Card>
    </Modal>  
        <DateTimePickerModal
        isVisible={this.state.isDatePickerVisible}
        mode="datetime"
        onConfirm={this.handleConfirm}
        onCancel={this.hideDatePicker}
      />
      <DateTimePickerModal
        isVisible={this.state.isDatePickerVisibleEnd}
        mode="datetime"
        onConfirm={this.handleConfirmEnd}
        onCancel={this.hideDatePickerEnd}
      />

        <ScrollView style={{ backgroundColor: "white" }}>
        
        <View>
        <Card transparent> 
            <CardItem style={{backgroundColor:'lightblue'}}>
              <Left>
                <Text >Order #</Text>
              </Left>
              <Body>
                <Text> Status</Text>
              </Body>
              <Body>
                <Text> Date</Text>
              </Body>
              <Body>
                <Text> Delivery Charge</Text>
              </Body>
              <Body>
                <Text> Extra Charge</Text>
              </Body>
              <Right>
                <Text>Total</Text>
              </Right>
            </CardItem>
        </Card>
        <FlatList
               data={this.state.dataSource}
               renderItem={({ item }) => (            
            <Card transparent>
              <CardItem button onPress={() => this.props.navigation.navigate('OrderDetails',{ 'orders' : item.datas, 'path' : this.state.store_path })} >
                <Left style={{flex:1}}>
                <Text style={{fontSize: 10, fontWeight: 'bold', marginBottom: 10}}>
                    #00{item.datas.OrderNo}
                  </Text>
                </Left>
                <Body style={{paddingLeft: 5,flex:1,}}>
                  
                  <Text note style={{fontSize: 10, fontWeight: 'bold'}}>{item.datas.OrderStatus}</Text>
   
                </Body>
                <Body style={{paddingLeft: 5, flex: 1}}>
                  
                <Text note style={{fontSize: 12,}}>{moment(item.datas.OrderDetails.Date).format('MM/D/YY')}</Text>
   
                </Body>
                <Body>
                  <Text style={{fontSize: 12, marginBottom: 10}}>₱{Math.round(item.datas.delivery_charge)}</Text>
                </Body>
                <Body>
                    <Text style={{fontSize: 12, marginBottom: 10}}>₱{Math.round(item.datas.extraKmCharge *10)/10}</Text>
                </Body>
                
                <Right style={{textAlign: 'right'}}>
                  <Text style={{fontSize: 10, fontWeight: 'bold', marginBottom: 10}}>₱{Math.round((this.OverallTotal(item.datas.Products) + item.datas.delivery_charge + item.datas.extraKmCharge)*10)/10}</Text>
                </Right>
                </CardItem>
            </Card>
           )}
           keyExtractor={item => item.key}
       />
        
          <View style={{borderTopColor: 'black', borderTopWidth: 2,borderStyle: 'dashed',  borderRadius: 1}}/>
          <CardItem>
            <Left>
              <Text style={{ color: 'tomato'}}>Total</Text>
            </Left>
            <Right>
              <Text style={{ color:'tomato'}}>
              ₱{Math.round(this.TotalAmount()*10)/10}
              </Text>
            </Right>
          </CardItem>
     </View>  
     <View style={{borderTopColor: 'black', borderTopWidth: 2,borderStyle: 'dashed',  borderRadius: 1}}/>
     <View>
          <CardItem>
            <Left>

            </Left>
            <Body>
              <Text style={{ color: 'tomato'}}>Summary</Text>
            </Body>
            <Right>
             
            </Right>
          </CardItem>
          <CardItem>
            <Left>
              <Text style={{ color: 'tomato'}}>Total No. of Orders Delivered:</Text>
            </Left>
            <Right>
              <Text style={{ color:'tomato'}}>
             {this.state.dataSource.length}
              </Text>
            </Right>
          </CardItem>
          <CardItem>
            <Left>
               <Text style={{color:'limegreen'}}>Total </Text>
            </Left>
            <Right>
               <Text style={{color:'limegreen'}}>₱{Math.round(this.TotalAmount()*10)/10}</Text>          
            </Right>
          </CardItem>
     </View>  
       
        </ScrollView>
      </Container>
    );
}
}

export default riderDetails;

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