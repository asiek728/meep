import React, { useState, useEffect, useLayoutEffect } from 'react'
import { View, Dimensions, ActivityIndicator, Text, Image, FlatList, StyleSheet, TouchableOpacity } from 'react-native'
import { useAuthState } from "react-firebase-hooks/auth";
import { db, auth, storage } from '../firebase/firebase-cfg';
import { getFirestore, getDocs, collection, getDoc, doc, onSnapshot, query, forEach, where, orderBy, addDoc, setDoc, Timestamp, updateDoc } from 'firebase/firestore';
import '../components/Styles';
import { useFocusEffect } from '@react-navigation/native';

export default function Messages({ user, route, navigation }) {
  // Definition and initialisation of the messages in the chat, storing all variables using React hooks
  const [users, setUsers] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastMsg, setlastMsg] = useState([])
  const user1 = auth.currentUser.uid;

  const [themeColors, setThemeColors] = useState(global.theme);
  useFocusEffect(
    React.useCallback(() => {
      setThemeColors(global.theme);
    }, [])
  );

  //Fetching users list, not including yourself
  useEffect(() => {
    setIsLoading(true);
    // create query object
    const q = query(collection(db, "users"), where("uid", "not-in", [user1]));
    // execute query
    const unsub = onSnapshot(q, (querySnapshot) => {
      let users = [];
      querySnapshot.forEach((doc) => {
        users.push(doc.data());
      });
      setUsers(users);
      setIsLoading(false);
    });
    return () => unsub();
  }, []);

  //Fetching last messages collection to display last message next user with status of UNREAD
  useEffect(() => {
    setIsLoading(true);
    // create query object
    const q = query(collection(db, "lastMsg"));
    // execute query
    const unsub = onSnapshot(q, (querySnapshot) => {
      let lastMsg = [];
      querySnapshot.forEach((doc) => {
        lastMsg.push(doc.data());
      });
      setlastMsg(lastMsg);
      setIsLoading(false);
    });
    return () => unsub();
  }, []);


  //Rendering users list
  const RenderCard = ({ item }) => {
    //Creates unique conversation id using id of user you are logged in and id of user selected
    const docid = item.uid > user1 ? user1 + "-" + item.uid : item.uid + "-" + user1

    const updateMes = async () => {
      const docSnap = await getDoc(doc(db, "lastMsg", docid));
      // if last message exists and message is from selected user
      if (docSnap.data() && docSnap.data().from !== user1) {
        // update last message doc, set unread to false
        await updateDoc(doc(db, "lastMsg", docid), { unread: true });
      }
    }


    //Navigates to chat with attributes
    // Dispalying avatar
    //Disaplying first name, last name and online status
    //Filtering array of last messages to display last message and status
    return (

      <TouchableOpacity onPress={() => navigation.navigate('Chat', {
        name: item.name, uid: item.uid,
        status: typeof (item.status) == "string" ? item.status : item.status
      })
      }
        onPressIn={() => {
          updateMes();
        }}>

        <View style={styles.mycard}>
          <Image
            style={styles.styleAvatar}
            source={{
              uri: 'https://api.multiavatar.com/' + item.avatar + '.png'
            }}
          />

          <View>
            <Text style={styles.text}>
              {item.firstName} {item.lastName}
            </Text>

            <Text style={{ paddingLeft: "10%" }}> {lastMsg.filter(
              (message) => message._id === docid).map((data) => { return (<Text>{"\n"}{data.text.slice(0, 10)}...</Text>) })}</Text>
          </View>

          <View>
            <Text>{`${item.isOnline ? "online" : "offline"}`} </Text>

            <Text> {lastMsg.filter(
              (message) => message._id === docid).map((data) => { return (<Text>{`${data.unread ? " " : "unread"}`}</Text>) })} </Text>
          </View>
        </View>

      </TouchableOpacity>
    )

  }
  if (isLoading) {
    return (
      <View style={{
        flex: 1, justifyContent: 'center', alignItems: 'center',
        backgroundColor: themeColors.backgroundColor
      }}>
        <ActivityIndicator size="large" color="#5500dc" />
      </View>
    );
  }

  return (
    <View style={{
      flex: 1, marginTop: 50,
      backgroundColor: themeColors.backgroundColor
    }}>
      <FlatList
        data={users}
        renderItem={({ item }) => { return <RenderCard item={item} /> }}
        keyExtractor={(item) => item.uid}
      />
    </View>
  )
}

// Styles used in the Messages file
const styles = StyleSheet.create({
  // Default valus of the avatar
  img: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "green"
  },

  // Avatar style
  styleAvatar: {
    width: '15%',
    height: '100%',
    marginBottom: '5%',
  },

  // Text style of First and Last name
  text: {
    fontSize: 18,
    marginLeft: "10%",

  },

  // Card containing all the information
  mycard: {
    flex: 1,
    flexDirection: 'row',
    height: Dimensions.get('window').height - 780,
    margin: "1%",
    padding: "1%",
    backgroundColor: "white",
  },
});
