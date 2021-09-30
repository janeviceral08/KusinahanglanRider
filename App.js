//This is an example code for Bottom Navigation//
import React, { useEffect } from 'react';
import { Button, Text, View, TouchableOpacity, StyleSheet  } from 'react-native';
//import all the basic component we have used
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeScreen from './pages/HomeScreen';
import EarningScreen from './pages/EarningScreen'
import SettingsScreen from './pages/SettingsScreen';
import DetailsScreen from './pages/DetailsScreen';
import ProfileScreen from './pages/ProfileScreen';
import OrderDetails from './pages/OrderDetails';
import OrderDetailsPending from './pages/OrderDetailsPending';
import OrderDetailsDelivered from './pages/OrderDetailsDelivered';
import AuthLoadingScreen from './Auth/AuthLoadingScreen';
import Login from './Auth/Login';
import OrderScreen from './pages/OrderScreen'
import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();


function SettingsStack() {
  return (
    <Stack.Navigator>
        <Stack.Screen 
        name="Settings" 
        component={SettingsScreen} 
        options={{headerShown:false}}
        />  
        <Stack.Screen 
        name="Details" 
        component={DetailsScreen} 
        options={{headerShown:false}}
        />  
        <Stack.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{headerShown:false}}
        />  
      
        
    </Stack.Navigator>
  );
}

function OrderStack() {
  return (
    <Stack.Navigator>
           <Stack.Screen 
        name="Orders" 
        component={OrderScreen} 
        options={{headerShown:false}}/>  
        <Stack.Screen 
        name="OrderDetails" 
        component={OrderDetails} 
        options={{headerShown:false}}/> 
                <Stack.Screen 
        name="OrderDetailsDelivered" 
        component={OrderDetailsDelivered} 
        options={{headerShown:false}}/> 
            <Stack.Screen 
        name="OrderDetailsPending" 
        component={OrderDetailsPending} 
        options={{headerShown:false}}/> 
    </Stack.Navigator>
  );
}

function EarningsStack() {
  return (
    <Stack.Navigator>
           <Stack.Screen 
        name="Earnings" 
        component={EarningScreen} 
        options={{headerShown:false}}/>  
        <Stack.Screen 
        name="OrderDetails" 
        component={OrderDetails} 
        options={{headerShown:false}}/> 
               <Stack.Screen 
        name="OrderDetailsDelivered" 
        component={OrderDetailsDelivered} 
        options={{headerShown:false}}/> 
        
    </Stack.Navigator>
  );
}


function Apps() {
  return (
    <Tab.Navigator tabBarOptions={{
      activeTintColor: "rgba(94,163,58,1)",
      inactiveTintColor: 'gray',
      style: {
        backgroundColor: 'salmon',
    
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
      },
      
    }}
    initialRouteName="Home"
    >
       
       
 
              <Tab.Screen 
            name="Orders" 
            component={OrderStack} 
            options={{headerShown:false,
              tabBarLabel: 'Orders',
              tabBarIcon: ({focused, color, size, tintColor}) => (
                <Ionicons name={'ios-sync'} size={25} color={color}  style={{ paddingTop: 2}} active={focused}/>
              ),
           
            }}
            
            />   
              <Tab.Screen 
          name="Reports" 
          component={EarningsStack}
          options={{headerShown:false,
            tabBarLabel: 'Reports',
            tabBarIcon: ({focused, color, size, tintColor}) => (
              <Ionicons name={'ios-cash'} size={25} color={color}  style={{ paddingTop: 2}} active={focused}/>
            ),
            
          }}
        
        />  
             <Tab.Screen 
            name="Account" 
            component={SettingsStack} 
            options={{headerShown:false,
              tabBarLabel: 'Account',
              tabBarIcon: ({focused, color, size, tintColor}) => (
                <Ionicons name={'md-person'} size={25} color={color}  style={{ paddingTop: 2}} active={focused}/>
              ),
           
            }}
            
            />   
    </Tab.Navigator>
  );
}
function AuthStack() {
  return (
    <Stack.Navigator>
           <Stack.Screen 
        name="Login" 
        component={Login} 
        options={{headerShown:false}}/>  
  
    </Stack.Navigator>
  );
}

function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{headerShown:false}}
      />
  
      <Stack.Screen
        name="Details"
        component={DetailsScreen}
        options={{headerShown:false,tabBarVisible:false,}}
      />

    </Stack.Navigator>
  );
}

const App = () => {
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('remoteMessage: ', remoteMessage)
      const channelId = await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
        sound: 'notif',
      });
  
      // Display a notification
      await notifee.displayNotification({
        title: remoteMessage.notification.title,
        body: remoteMessage.notification.body,
        android: {
          channelId,
          smallIcon: 'ic_launcher', // optional, defaults to 'ic_launcher'.
          sound: 'notif',
        },
      });
    });

    return unsubscribe;
  }, []);
  return (
      <NavigationContainer>
        <Stack.Navigator>
           <Stack.Screen
            name="AuthLoadingScreen"
            component={AuthLoadingScreen}
            options={{headerShown:false}}
          />
          <Stack.Screen
            name="Auth"
            component={AuthStack}
            options={{headerShown:false}}
          />
           <Stack.Screen
            name="Apps"
            component={Apps}
            options={{headerShown:false}}
          />
            
        </Stack.Navigator>
      </NavigationContainer>
  );
};
const styles = StyleSheet.create({
  shadow:{
    shadowColor: '#7f5df0',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius:3.5,
    elevation:5
  }
})

export default App;
