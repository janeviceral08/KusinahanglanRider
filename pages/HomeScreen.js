//This is an example code for Bottom Navigation//
import React from 'react';
//import react in our code.
import {
  TextInput,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Platform,
  Image
} from 'react-native';
import { Card, Divider } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';


const { width, height } = Dimensions.get('window');

export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.ref = firestore();
    this.state = {
      wallet: 0,
      routeForMap: [],
    }
  }

  componentDidMount() {
    this.getWallet();
  }

  getWallet =async () =>{
     const uid= await AsyncStorage.getItem('usertoken');
     console.log('uid: ', uid)
    this.unsubscribe = this.ref.collection('riders').where('userId', '==', uid ).onSnapshot(this.onCollectionUpdate);
    };
    onCollectionUpdate = (querySnapshot) => {
      const rider = [];
      querySnapshot.forEach((doc) => {
        this.setState({
          wallet:doc.data().wallet,
       });
      });
    }

  render() {
    //console.log('routeForMap: ', this.state.routeForMap)
    //console.log('summary: ', this.state.summary)

    return (      <View style={styles.container}>
    
    <Card containerStyle={styles.card}>
				<Text style={styles.notes}>Rider Wallet Balance</Text>
				
				<View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
					<Image style={{width:50, height:50}} source={require('../assets/Wallet.png')} />
          <Text style={styles.time}>₱{parseFloat(this.state.wallet).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}</Text>
				</View>
        </Card>
</View>
  
    );
  }

}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card:{
		backgroundColor:'rgba(56, 172, 236, 1)',
		borderWidth:0,
		borderRadius:20
	},
	time:{
		fontSize:30,
		color:'#fff'
	},
	notes: {
		fontSize: 18,
		color:'#fff',
		textTransform:'capitalize'
	}
});


