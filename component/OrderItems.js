import React,{ Component} from 'react';
import { View, Text,  StyleSheet,TouchableOpacity ,Alert, ScrollView} from 'react-native';
import {Container, List, ListItem, Left, Body, Right, Thumbnail,Button, Icon, Card, CardItem, Root, Toast, Item} from 'native-base';
import Modal from 'react-native-modal';
import { TextInput } from 'react-native-gesture-handler';
//import { StackActions, NavigationActions } from 'react-navigation';

/*const resetAction = StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({ routeName: 'OrderDetails' })],
});
*/

class OrderItems extends Component{
    constructor(props){
        super(props);
        this.state={
            visibleModal: false,     
            id: '',
            qty: 0,
            quantity: 0,
            price: 0
        } 
    }
    storeTotal(){
        let total = 0;
        this.props.item.forEach(item => {
            if(item.storeId == this.props.id){
                if(item.sale_price){
                    total += item.sale_price * item.qty
                }else{
                    total += item.price * item.qty
                }
                
            }
            
        });
        return total;
    }

    updateTextInput = (text, field) => {
        const state = this.state
        state[field] = text;
        this.setState(state);
      }
      


  render(){
    return (
    <Root>
      <ScrollView>
            { this.props.item.map((item, index) => {
             return(
               <View key={index}>
                {item.storeId == this.props.id &&
                <List>
                <ListItem>
                    <Left style={{flex:6, flexDirection: 'column'}}>
                    <Text>{item.qty} x {item.name}</Text>
                        
                      <Text style={{fontSize: 12, color: 'red'}} note numberOfLines={3}>Note: {item.note}</Text>
                    </Left>
                    <Right style={{flex:3}}>
                    {item.sale_price ? <Text>₱{Math.round((item.qty * item.sale_price)*10)/10}</Text>: <Text>₱{Math.round((item.qty * item.price)*10)/10}</Text>}
                        
                    </Right> 
                </ListItem>  
                   
                   </List>
                }
                    {item.choice  ? 
              [item.choice.map((drink, i) =>
                <View key={i}>
                   <List style={{marginLeft: 20}}>
                   <ListItem>
                      <Left  style={{justifyContent: "flex-start"}}>
                          <Text style={{fontWeight:'bold', fontSize: 20}}>{'\u2022' + " "}</Text>
                      </Left>
                      <Body style={{justifyContent: "flex-start", flex: 5}}>
                          <Text style={{ fontSize: 12}}>{item.qty}x </Text>
                          <Text style={{ fontSize: 12}}>{drink.label}</Text>
                      </Body>
                      <Right style={{justifyContent: "flex-end", flex:1}}>
                          <Text style={{ fontSize: 13 }}>₱{drink.price*item.qty}</Text>
                      </Right>                                                   
                   </ListItem>
               </List>
               </View>
              )] : null}
            </View>
            )}
            )}      
            <View style={{flexDirection: 'row', justifyContent: 'space-between', padding: 15}}>
            <Text style={{fontSize: 15, fontWeight: 'bold', color: 'salmon'}}>Total</Text>
            <Text style={{fontSize: 15, fontWeight: 'bold', color: 'salmon'}}>₱{Math.round(this.storeTotal()*10)/10}</Text>
            </View>
      </ScrollView>
    </Root>
    );
}
}

export default OrderItems;


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