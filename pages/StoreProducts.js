import React, {Component} from 'react';
import {StyleSheet, View, FlatList, TouchableOpacity, Text, Image, ScrollView} from 'react-native';
import { Container, Header,Button, Left, Right, Body, Title, List, ListItem, Thumbnail,Icon, Grid, Col, Card, CardItem } from 'native-base';``
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Item from './Items';


export default class StoreProducts extends Component {
    constructor(props) {
        super(props);
        const store = this.props.route.params.store;
        this.ref = firestore().collection('products').where('store_id', '==', store );
        this.ref= this.ref.orderBy("pr_name", "asc");
        this.unsubscribe = null;
        this.state = {
          dataSource: [],
          section: this.props.title,
          loading: true,
          stores:''
        };
 
    }
  
   
    onCollectionUpdate = (querySnapshot) => {
      const products = [];
      querySnapshot.forEach((doc) => {
       products.push ({
              datas : doc.data(),
              key : doc.id
              });
      });
      this.setState({
        dataSource : products,
        loading: false,
        
     });

    }
  

    componentDidMount() {
        this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate);
   
      }
      render(){
        return (
          <Container>              
           <ScrollView>

                   {this.renderProducts()}
            </ScrollView>          
         </Container>    
        );
      }
    
      renderProducts() {
        let items = [];
        let stateItems = this.state.dataSource
        for(var i=0; i<stateItems.length; i+=2 ) {
          if(stateItems[i+1]) {
            items.push(
              <Grid key={i}>
                <Item key={stateItems[i].datas.pr_id} product={stateItems[i]} />
                <Item key={stateItems[i+1].datas.pr_id} product={stateItems[i+1]} />
              </Grid>
            );
          }
          else {
            items.push(
              <Grid key={i}>
                <Item key={stateItems[i].datas.pr_id} product={stateItems[i]} />
                <Col key={i+1} />
              </Grid>
            );
          }
        }
        return items;
      }
   
}
