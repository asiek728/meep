import React, { useState, useEffect, useLayoutEffect } from "react";
import { View } from "react-native";
import { Badge } from 'react-native-elements';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';
import Search from './Search.js';
import Profile from './Profile.js';
import Messages from './Messages.js';
import { useAuthState } from "react-firebase-hooks/auth";
import { db, auth, storage } from '../firebase/firebase-cfg';
import { collection, onSnapshot, query, where, getDoc, doc } from 'firebase/firestore';
import '../components/Styles';
import { useFocusEffect } from '@react-navigation/native';

// Definition of the Home Screen
const Tab = createBottomTabNavigator();

export default function Home({ navigation }) {

  // Definition and initialisation of the all data, storing all variables using React hooks
  const [unreadmes, setunreadmes] = useState([])
  const user1 = auth.currentUser.uid;
  //Setting colors to dark mode
  const [themeColors, setThemeColors] = useState(global.theme);
  useFocusEffect(
    React.useCallback(() => {
      setThemeColors(global.theme);
    }, [])
  );

  //Fetching last mesasges array to unreadmes
  useLayoutEffect(() => {
    setThemeColors(global.theme);
    const collectionRef = collection(db, "lastMsg");
    const q = query(collectionRef, where("to", "in", [user1]));
    const unsubscribe = onSnapshot(q, querySnapshot => {
      setunreadmes(
        querySnapshot.docs.map(doc => ({
          _id: doc.data().from,
          createdAt: doc.data().createdAt.toDate(),
          text: doc.data().text,
          unread: doc.data().unread,
        }))
      );
    });
    return unsubscribe;
  });


  //counting how many unread messages user have
  const isFound = unreadmes.filter(element => {
    if (element.unread === false) {
      return true;
    }
  });

  // Return the bottom bar (Navigation Bar) between Profile, Search and Messages

  return (

    <Tab.Navigator
      initialRouteName="Search"
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: themeColors.backgroundColor,
        }
      }}>
      <Tab.Screen
        name="Profile" component={Profile} options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="user" size={size} color={color} />
          )
        }} />
      <Tab.Screen name="Search" component={Search} options={{
        tabBarIcon: ({ color, size }) => (
          <Icon name="search" size={size} color={color} />
        )
      }} />
      {/*counter for unread messages, have length of array attribute to count how many unread message user have */}
      <Tab.Screen name="Messages" component={Messages} options={{
        tabBarIcon: ({ color, size }) => (
          <View>
            <Icon name="comments" size={size} color={color} />
            <Badge
              status="error"
              value={`${isFound.length ? isFound.length : ""}`}
              containerStyle={{ position: 'absolute', top: -4, right: -4 }}
            />
          </View>
        )
      }} />
    </Tab.Navigator>
  );
}
