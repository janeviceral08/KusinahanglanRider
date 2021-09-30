import React, { Component } from 'react';
import { Container, Header, Tab, Tabs, TabHeading, Icon, Text } from 'native-base';
import Pending from './orders/Pending';
import Delivered from './orders/Delivered';
import Processing from './orders/Processing';

export default class TabsAdvancedExample extends Component {
  render() {
    return (
      <Container>
        <Tabs>
          <Tab heading="Pending" tabStyle={{backgroundColor: '#FFFFFF'}} textStyle={{color: 'tomato'}} activeTabStyle={{backgroundColor: 'tomato'}} activeTextStyle={{color: '#fff', fontWeight: 'normal'}}>
            <Pending navigation={this.props.navigation}/>
          </Tab>
          <Tab heading="Processing" tabStyle={{backgroundColor: '#FFFFFF'}} textStyle={{color: 'tomato'}} activeTabStyle={{backgroundColor: 'tomato'}} activeTextStyle={{color: '#fff', fontWeight: 'normal'}}>
            <Processing navigation={this.props.navigation}/>
          </Tab>
          <Tab heading="Delivered" tabStyle={{backgroundColor: '#FFFFFF'}} textStyle={{color: 'tomato'}} activeTabStyle={{backgroundColor: 'tomato'}} activeTextStyle={{color: '#fff', fontWeight: 'normal'}}>
            <Delivered navigation={this.props.navigation}/>
          </Tab>
        </Tabs>
      </Container>
    );
  }
}