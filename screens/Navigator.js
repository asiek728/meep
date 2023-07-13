import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './Home.js';
import Login from './Login.js';
import Profile from './Profile.js';
import Settings from './Settings.js';
import Register from './Register.js'
import ForgotPass from './ForgotPass.js'
import EditDetails from './EditDetails.js'
import Chat from './Chat.js'
import SetUpUser from './SetUpUser.js'
import PrintUser from '../components/PrintUser.js'
import ReportUser from './ReportUser.js'
import Support from './Support.js'

// Helper file to navigate between screens fluently
const Stack = createNativeStackNavigator(screens);

const screens = {
  Login: {
    screen: Login
  },
  Home: {
    screen: Home
  },
  Profile: {
    screen: Profile
  },
  Settings: {
    screen: Settings
  },
  Register: {
    screen: Register
  },
  Reset: {
    screen: ForgotPass
  },
  Chat: {
    screen: Chat
  },
  EditDetails: {
    screen: EditDetails
  },
  PrintUser: {
    screen: PrintUser
  },
  SetUpUser: {
    screen: SetUpUser
  },
  ReportUser: {
    screen: ReportUser
  },
  Support: {
    screen: Support
  },
}

// Creation of a Container to navigate between screens. Load as default the Login page.
export default () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false  }} />
        <Stack.Screen name="Register" component={Register} options={{ headerShown: false  }} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="Chat" component={Chat} options={{ headerTransparent:true }} />
        <Stack.Screen name="ReportUser" component={ReportUser} />
        <Stack.Screen name="PrintUser" component={PrintUser} />
        <Stack.Screen name="Settings" component={Settings} />
        <Stack.Screen name="Support" component={Support} />
        <Stack.Screen name="EditDetails" component={EditDetails} />
        <Stack.Screen name="SetUpUser" component={SetUpUser} options={{ headerShown: false  }} />
        <Stack.Screen name="ForgotPass" component={ForgotPass} options={{ headerShown: false, title: 'Reset Password'}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};
