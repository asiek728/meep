import * as React from 'react';
import { useState, useCallback, useEffect, useLayoutEffect } from 'react'
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native';
import { GiftedChat, InputToolbar } from 'react-native-gifted-chat';
import { db, auth, storage } from '../firebase/firebase-cfg';
import { getFirestore, getDocs, collection, getDoc, doc, onSnapshot, query, forEach, where, orderBy, addDoc, setDoc, Timestamp, updateDoc } from 'firebase/firestore';
import '../components/Styles';
import { useFocusEffect } from '@react-navigation/native';



// Definition of the function
const Chat = ({ user, route, navigation }) => {
  // Definition and initialisation of the messages in the chat, storing all variables using React hooks
  const [messages, setMessages] = useState([]);
  const { uid } = route.params; 
  const [isLoading, setIsLoading] = useState(false);
  const user1 = auth.currentUser.uid;
  const docid = uid > user1 ? user1 + "-" + uid : uid + "-" + user1



  // Updating status of UNREAD of last message
  const updateMes = async () => {
    const docSnap = await getDoc(doc(db, "lastMsg", docid));
    // if last message exists and message is from selected user
    if (docSnap.data() && docSnap.data().from !== user1) {
      // update last message doc, set unread to false
      await updateDoc(doc(db, "lastMsg", docid), { unread: true });
    }
  }
  //Changing colors to dark mode
  const [themeColors, setThemeColors] = useState(global.theme);
  useFocusEffect(
    React.useCallback(() => {
      setThemeColors(global.theme);
    }, [])
  );
  //Fetching all messages in array messages and orderBy desc
  useEffect(() => {
    setIsLoading(true);
    const collectionRef = collection(db, 'chats', docid, 'messages');
    const q = query(collectionRef, orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, querySnapshot => {
      setMessages(
        querySnapshot.docs.map(doc => ({
          _id: doc.data()._id,
          createdAt: doc.data().createdAt.toDate(),
          text: doc.data().text,
          user: doc.data().user
        }))
      );

    }); setIsLoading(false);
    return unsubscribe;
  });
  //Updating status of last message
  useEffect(() => {
    updateMes();
  })

  const renderInputToolbar = (props) => {
    //Add the extra styles via containerStyle
    return <InputToolbar {...props}
      containerStyle={{
        borderTopWidth: 1.5,
        backgroundColor: themeColors.backgroundColor
      }} />
  }

  //Function for sending messages, add Document to db messages and setting new message as last message to have unread status
  const onSend = useCallback((messages = []) => {
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, messages)
    );

    const { _id, createdAt, text, user } = messages[0];
    addDoc(collection(db, 'chats', docid, 'messages'), {
      _id,
      createdAt,
      text,
      user,
      sentTo: uid,
    });
    setDoc(doc(db, "lastMsg", docid), {
      _id: docid,
      text,
      from: user1,
      to: uid,
      createdAt: Timestamp.fromDate(new Date()),
      unread: false,
    });


  }, []);


  // onSend is a function to update the chat with the new message typed by the user. The chat does not save any message.
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
  // Return the chat under a SafeAreaView
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: themeColors.backgroundColor }}>
      <GiftedChat
        messages={messages}
        onSend={messages => onSend(messages)}
        alwaysShowSend
        renderInputToolbar={renderInputToolbar}
        scrollToBottom
        user={{
          _id: auth?.currentUser?.uid,
          email: auth?.currentUser?.email,
        }}
      />
    </SafeAreaView>
  );

}
export default Chat;
