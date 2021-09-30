/**
* This is the Product component
**/

// React native and others libraries imports
import React, { PureComponent } from 'react';
import {  Dimensions, TouchableHighlight, Image, TouchableOpacity} from 'react-native'
import { View, Col, Card, CardItem, Body, Button, Left, ListItem, List, Content, Thumbnail, Right, Text,Grid, Toast } from 'native-base';
import FastImage from 'react-native-fast-image';
import styles from './styles';
// Our custom files and classes import
import Icon from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
// screen sizing


export default class Item extends PureComponent {
  state = {
   visibleModal: false,
   quantity: 1,
   products:{},
   cartItems:{},
   loading: false,
  };

  increment =(product) => {
    let qty = parseInt(product.pr_qty)+1;
    let qt = String(qty);
    const updateRef = firestore().collection('products').doc(product.pr_id);
    updateRef.update({
        pr_qty : qt,
    })
  }

  decrement = (product) => {
    
    let qty = parseInt(product.pr_qty)-1;
    let qt = String(qty);
    const updateRef = firestore().collection('products').doc(product.pr_id);
    updateRef.update({
      pr_qty : qt,
    })
  }

  render() {
    return(
      <View  style={{flex:1}}>  
       <View style={styles.categoriesItemContainer}>
            <FastImage
            style={styles.categoriesPhoto} 
            source={{
                uri: this.props.product.datas.pr_image,
                headers: { Authorization: 'someAuthToken' },
                priority: FastImage.priority.high,
            }}
            resizeMode={FastImage.resizeMode.cover}
        />

         <Text style={styles.categoriesStoreName}>{this.props.product.datas.pr_name}</Text>
         <Text style={styles.categoriesPrice}>₱{this.props.product.datas.pr_price}/  {this.props.product.datas.pr_unit} </Text>
         <View style={{flexDirection:'row', justifyContent: "center"}}>
         {this.props.product.datas.pr_qty > 1 ? 
                 <TouchableOpacity onPress={
                   ()=>{
                     this.decrement(this.props.product.datas);
                    
                   }
                 }> 
                 <Icon  name="minussquareo" size={20} color="black" style={{marginRight:10, marginTop:2}} />
                 </TouchableOpacity>
                 : <TouchableOpacity disabled={true} onPress={
                  ()=>{
                    this.decrement(this.props.product.datas)
                    
                  }
                }> 
                <Icon name="minussquareo" size={20} color="gray" style={{marginRight:10, marginTop:2}} />
                </TouchableOpacity>
                  }    
              
              
                   <Text style={{fontSize:20, }}>
                     {this.props.product.datas.pr_qty} 
                   </Text>
          
             
                   <TouchableOpacity onPress={
                     ()=>{
                       this.increment(this.props.product.datas)
                     }
                   }>
                   <Icon name="plussquareo" size={20} color="black" style={{marginLeft:10, marginTop:2}} />
                   </TouchableOpacity>
                   </View>
       </View>
      </View>
    );
  }

}
