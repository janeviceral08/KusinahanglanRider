//This is an example code for Bottom Navigation//
import React from 'react';
//import react in our code.
import { Container, Header, Content, Icon, Accordion, Text, View, Card, CardItem, Thumbnail, Body, Left, Right, Button } from "native-base";
import {   TouchableOpacity, StyleSheet, FlatList } from 'react-native';

export default class OrderDetailsItems extends React.Component {
    constructor(props) {
        super(props);      
        this.state = {
          user: null,
          email: "",
          password: "",
          formValid: true,
          error: "",
          loading: false,
          dataSource: [],
        };
        this.Fetchdata();
      }
        
    Fetchdata = () => {
        return fetch('https://batchbuddies.com/OrderDetailsItems.php',{
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
    
            store_id : this.props.store,
            order_id : this.props.items
    
    
          })
    
         } )
        .then((response) => response.json())
        .then((responseJson) => {
          
          this.setState({
            loading: false,
            dataSource: responseJson,
          }, function() {
            // In this block you can do something with new state.
          });

        })
        .catch((error) => {
          console.error(error);
        });
      }
  //Profile Screen to show from Open profile button
  render() {
    return (
      <View >
         <FlatList
               data={this.state.dataSource}
               renderItem={({ item }) => (   
            <View>         
            <Card>
            <CardItem style={{padding: 0}}>
            <Left >
               <Text style={{fontSize: 13}}>{item.pr_name} ({item.pr_qty}) {item.pr_unit}</Text>
            </Left>
            <Right>
               <Text style={{fontSize: 13, fontWeight: 'bold'}}> {parseInt(item.pr_price) * parseInt(item.pr_qty)}</Text>
            </Right>
            </CardItem>
            </Card>
                  
             </View>
           )}
           keyExtractor={item => item.pr_id}
           
       />
        
      </View>
    );
  }
}