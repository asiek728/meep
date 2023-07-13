

    import React, { useEffect, useState } from "react";
    import { StyleSheet, View, Button, TextInput,ScrollView, TouchableOpacity } from "react-native";
    import { useAuthState } from "react-firebase-hooks/auth";
    import { db, auth, storage } from '../firebase/firebase-cfg';
    import { collection, onSnapshot, query, where } from 'firebase/firestore';
    import Constants from 'expo-constants';
    import FilterBar from '../components/FilterBar';
    import PrintUser from "../components/PrintUser";



    // Defnition of the Messages Screen
    export default function Search(navigation) {

      const [user, loading, error] = useAuthState(auth);
      const [search, setSearch] = useState("");
      const [users, setUsers] = useState([]);
      const user1 = auth.currentUser.uid;
      useEffect(() => {


        // create query object
        const q = query(collection(db, "users"), where("uid", "not-in", [user1]));
        // execute query
        const unsub = onSnapshot(q, (querySnapshot) => {
          let users = [];
          querySnapshot.forEach((doc) => {
            users.push(doc.data());
          });
          setUsers(users);
        });
        return () => unsub();
      }, []);


    };


    const styles = StyleSheet.create({
      container: {
        flex: 1,
        paddingTop: Constants.statusBarHeight,
        backgroundColor: '#ecf0f1',
        padding: 8,
      },
      searchbar: {
        alignSelf: 'center',
        margin: 40,
        marginBottom: 0,
        padding: 10,
        borderRadius: 25,
        backgroundColor: "#fff",
        width: '95%',
        height: 50
      },
    });
