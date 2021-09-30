//This is an example code for Bottom Navigation//
import React from 'react';

//import all the basic component we have used
import {Card, CardItem, Left, Right, Body, Container, Content,Thumbnail, Tabs, Tab} from 'native-base';
import Verified from './users/verified';
import New from './users/new';
import NoNew from './users/nonew';

export default class UserScreen extends React.Component {
  render() {
    return (
      <Container>
         <Tabs>
          <Tab heading="Verified">
            <Verified navigation={this.props.navigation}/>
          </Tab>
          <Tab heading="New">
            <New navigation={this.props.navigation}/>
          </Tab>
          <Tab heading="All">
            <NoNew navigation={this.props.navigation}/>
          </Tab>
        </Tabs>
      </Container>
    );
  }
}