import React, { Component } from 'react';
import { Image, ScrollView } from 'react-native';
import { Container, Header, Card, CardItem, Thumbnail, Text, Button, Icon, Left, Body, Item, Input, Col, View, Right} from 'native-base';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
export default class UserDetails extends Component {
    constructor(props) {
        super(props);
        const user = this.props.route.params.user;
        const key = this.props.route.params.key;
        this.state = {
         users : user,
         key: key
        };
   
      }

      

  updatUserStatus() {
    const updateRef = firestore().collection('users').doc(this.state.key);
    updateRef.update({
      Status: 'Verified',
    }).then((docRef) => {
        this.props.navigation.navigate('Users')
      Toast.show({
        text: 'Status successfully updated!',
        position: 'bottom',
        type: 'success',
        buttonText: 'Dismiss',
        duration: 3000
      });
    })

}

updatUserStatusNew() {
  const updateRef = firestore().collection('users').doc(this.state.key);
  updateRef.update({
    Status: 'New',
  }).then((docRef) => {
      this.props.navigation.navigate('Users')
    Toast.show({
      text: 'Status successfully updated!',
      position: 'bottom',
      type: 'success',
      buttonText: 'Dismiss',
      duration: 3000
    });
  })

}

  render() {
    return (
      <Container>
        <ScrollView>
          <Card style={{flex: 0}}>
            <CardItem>
              <Left>
              <Thumbnail large square source={require('../assets/user.png')}/>
                <Body>
                  <Text>{this.state.users.Name}</Text>
                  <Text note>{this.state.users.Status}</Text>
                </Body>
              </Left>
            </CardItem>
            <View>
            <Text style={{paddingLeft: 5, color:'#ccc'}}>Mobile #</Text>
            <Item regular style={{marginTop: 5}}>
                <Input disabled placeholder={this.state.users.Mobile} />
            </Item>
            <Text style={{paddingLeft: 5, color:'#ccc'}}>Email</Text>
            <Item regular style={{marginTop: 5}}>
                <Input disabled placeholder={this.state.users.Email} />
            </Item>
            <Text style={{paddingLeft: 5, color:'#ccc'}}>Gender</Text>
            <Item regular style={{marginTop: 5, marginBottom: 5}}>
                <Input disabled placeholder={this.state.users.Gender} />
            </Item>
            </View>
            {this.state.users.Status == 'Verified' ?
                null : this.state.users.Status == 'New' ?  
                <CardItem footer button onPress={() => this.updatUserStatus()}>
                <Left />
                  <Text style={{alignContent: "center", flex:1, color:'red'}}>Verify User</Text>
                  <Right />
                </CardItem> :
                <CardItem footer button onPress={() => this.updatUserStatusNew()}>
                <Left />
                  <Text style={{alignContent: "center", flex:1, color:'red'}}>Update Status</Text>
                  <Right />
                </CardItem>
            }
           
          </Card>
          
        </ScrollView>
      </Container>
    );
  }
}