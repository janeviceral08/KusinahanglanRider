//This is an example code for Bottom Navigation//
import React from 'react';

//import all the basic component we have used
import {Card, CardItem, Left, Right, Body, Container, Content,Thumbnail, Tabs, Tab} from 'native-base';
import Open from './stores/Open';
import Close from './stores/Close';
import Admin from './stores/Admin';


export default class StoreScreen extends React.Component {
  render() {
    return (
      <Container>
         <Tabs>
          <Tab heading="Open">
            <Open navigation={this.props.navigation}/>
          </Tab>
          <Tab heading="Close">
            <Close navigation={this.props.navigation}/>
          </Tab>
          <Tab heading="Admin Close">
            <Admin navigation={this.props.navigation}/>
          </Tab>
        </Tabs>
      </Container>
    );
  }
}