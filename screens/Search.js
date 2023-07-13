import React, { useState, useEffect, useLayoutEffect } from 'react'
import { View, Picker, Switch, ActivityIndicator, TextInput, Button, ScrollView, Text, Image, FlatList, StyleSheet, TouchableOpacity } from 'react-native'
import RNPickerSelect from 'react-native-picker-select';
import { useAuthState } from "react-firebase-hooks/auth";
import { db, auth, storage } from '../firebase/firebase-cfg';
import { getFirestore, getDocs, collection, getDoc, doc, onSnapshot, query, forEach, where, orderBy, addDoc, setDoc, Timestamp, updateDoc } from 'firebase/firestore';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as geofire from 'geofire-common';
import * as Location from 'expo-location';

import { useFocusEffect } from '@react-navigation/native';



function interestsString(interests) {
  var s = "";
  for (var i = 0; i < interests.length; i++) {
    s = s + interests[i] + ", ";
  }
  s = s.slice(0, -2);
  return s;
}

export default function Messages({ navigation, route }) {

  // Definition and initialisation of the all data, storing all variables using React hooks
  const [user, loading, error] = useAuthState(auth);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isNearby, setNearby] = useState(null);
  const [users, setUsers] = useState(null);
  const [filteredDataSource, setFilteredDataSource] = useState([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const user1 = auth.currentUser.uid;

  //Changing colors to dark mode
  const [themeColors, setThemeColors] = useState(global.theme);
  useFocusEffect(
    React.useCallback(() => {
      setThemeColors(global.theme);
    }, [])
  );


  // Definition of all the genders
  const genders = [
		{ label: 'Male', value: 'Male' },
		{ label: 'Female', value: 'Female' },
		{ label: 'Other', value: 'Other' }];

  // Fetching Users collection
  useEffect(() => {
    setNearby(false);
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
      setFilteredDataSource(users)
      setIsLoading(false);
    });
    return () => unsub();
  }, []);

  // Getting location from db
  const getLocationHandler = () => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
      }

      let { coords } = await Location.getCurrentPositionAsync();

      if (coords) {
        let { longitude, latitude } = coords;
        let hash = geofire.geohashForLocation([latitude, longitude]);
        hash = (hash.substring(0, 5));

        //add cords and hash to database
        try {
          await updateDoc(doc(db, "users", user.uid), {
            longitude: longitude,
            latitude: latitude,
            localisation: hash,
          });
        }
        catch (err) {
          console.log(err)
        }

        const q2 = query(collection(db, "users"), where("uid", "!=", user?.uid), where("localisation", "==", hash));
        const unsub3 = onSnapshot(q2, (querySnapshot) => {
          let users = [];
          querySnapshot.forEach((doc) => {
            users.push(doc.data());
          });
          setUsers(users);
          setFilteredDataSource(users)
        });
        return () => unsub3();
      }

    })();
  };

  //Function for fetch the users collection
  const showAllUsers = () => {
    const q = query(collection(db, "users"), where("uid", "not-in", [user1]));
    const unsub3 = onSnapshot(q, (querySnapshot) => {
      let users = [];
      querySnapshot.forEach((doc) => {
        users.push(doc.data());
      });
      setUsers(users);
      setFilteredDataSource(users)
    });
    return () => unsub3();
  }

  // Stop sharing location function
  const stopSharing = () => {
    (async () => {
      try {
        await updateDoc(doc(db, "users", user.uid), {
          longitude: 0,
          latitude: 0,
          localisation: "0",
        });
      }
      catch (err) {
        console.log(err)
      }
    })();
  }
  // Toggle button to switch between sharing and not sharing location
  const toggleSwitch = () => {
    if (isNearby == true) {
      stopSharing();
      showAllUsers();
    }
    else if (isNearby == false) {
      getLocationHandler();
    }
    setNearby(isNearby ? false : true);
  }

  // Filtering users by category */ }
  const searchFilterFunction = (text) => {
    // Check if searched text is not blank
    if (text) {

      // Update FilteredDataSource
      const output = filteredDataSource.filter(x => x.categories.some(y => y.toUpperCase().includes(text.toUpperCase())));

      setFilteredDataSource(output);
      setSearch(text);
    } else {
      // Inserted text is blank
      // Update FilteredDataSource with masterDataSource
      setFilteredDataSource(users);
      setSearch(text);
    }
  };

  // Navigation to report user
  const handleDecline = () => {
    navigation.navigate('ReportUser');
  }

  // Rendering users list
  const RenderCard = ({ item }) => {
    // Creating uniques conersation id
    const docid = item.uid > user1 ? user1 + "-" + item.uid : item.uid + "-" + user1

    // Requst chat with user, send some to db
    const sendRequest = async () => {
      try {
        await addDoc(collection(db, "requests"), {
          from: user1,
          to: item.uid,
          accepted: false,
        });
      }
      catch (err) {
        console.error(err)
      }
    }


    return (
      <TouchableOpacity
      >
        {/* Avatar*/}
        <View style={[styles.mycard, {
          borderBottomColor: themeColors.shadowColor,
          backgroundColor: themeColors.userCard
        }]}>
          <Image
            style={styles.styleAvatar}
            source={{
              uri: 'https://api.multiavatar.com/' + item.avatar + '.png'
            }}
          />
          {/* Disaplying all attributes */}
          <View>
            <View style={{ marginTop: 5, marginBottom: 5, flexDirection: 'row' }}>
              <Text style={[styles.text, {
                fontWeight: 'bold',
                color: themeColors.textColor
              }]}>
                {item.firstName}{" "}{item.lastName}
              </Text>
              <Text style={[styles.text, {
                marginLeft: 'auto',
                color: themeColors.textColor
              }]}>
                UoA
              </Text>
            </View>
            <Text numberOfLines={1} style={[styles.text, {
              flex: 1,
              color: themeColors.textColor
            }]}>
              {"  "}{interestsString(item.interests)}
            </Text>

            {/* Two buttons, one for reporting users, which leads to certain screen and one to request chat */}
            <Button title="Report" onPress={() => navigation.navigate('ReportUser', { name: item.name, uid: item.uid })
            } />
            <Button title="Request chat" onPress={sendRequest} />

          </View>
        </View>


        {/* Online status icon */}
        <View style={styles.onlineStatusIcon}>
          <Icon
            name={item.isOnline ? "circle" : "minus-circle"}
            size={15}
            style={{ color: item.isOnline ? "#0090c0" : "#c00000" }} />
        </View>

      </TouchableOpacity>
    )

  }

  {/* Sending query to database, tp fetch filtered list using gender attribute */ }
  const searchHandler = () => {
    if (search != '') {
      const q = query(collection(db, "users"), where("gender", "==", search), where("uid", "not-in", [user1]));

      // execute query
      const unsub2 = onSnapshot(q, (querySnapshot) => {
        let users = [];
        querySnapshot.forEach((doc) => {
          users.push(doc.data());
        });
        setFilteredDataSource(users);
      });
      return () => unsub2();
    }
  };


  {/* Loading indicator */ }
  if (isLoading) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center',
    backgroundColor:themeColors.backgroundColor}}>
      <ActivityIndicator size="large" color="#5500dc" />
    </View>
  );
  }

  return (
    <View style={{ backgroundColor: themeColors.backgroundColor, flex: 1 }}>
      {/* Search bar */}
      <TextInput
        style={[styles.searchbar, {
          backgroundColor: themeColors.backgroundColor,
          borderColor: themeColors.shadowColor, color: themeColors.textColor
        }]}
        onChangeText={(text) => searchFilterFunction(text)}
        placeholder='Search for new friends! What are your interests?'
        placeholderTextColor={themeColors.placeholderColor} />


      {/* toggle button */}
      <View style={styles.filterBar}>
        <View style={styles.filterSection}>
          <Text style={{ color: themeColors.textColor }}>Only nearby: </Text>
          <Switch style={styles.switch}
            trackColor={{ true: "#767577", false: "lightgrey" }}
            thumbColor={isNearby ? "blue" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch}
            value={isNearby}
          />
        </View>
      </View>


      {/* Filter picker */}
      <View style={styles.inputView}>
        <RNPickerSelect style={pickerStyle}
          placeholder={{ label: "Choose your gender", value: null }}
          onValueChange={(itemValue, itemIndex) => setSearch(itemValue)}
          items={genders}
        />
      </View>
      {/*Button for applying filters */}
      <Button title="Apply filters" color="grey" onPress={searchHandler} />

      {/* Rendring list in scrollview component */}
      <ScrollView style={{ backgroundColor: themeColors.backgroundColor }}>
        <FlatList
          data={filteredDataSource}
          renderItem={({ item }) => { return <RenderCard item={item} /> }}
          keyExtractor={(item) => item.uid}
        />
      </ScrollView>
    </View>
  );
}

{/*Styles */ }
const styles = StyleSheet.create({
  img: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  text: {
    fontSize: 16,
    marginLeft: 15,

  },
  mycard: {
    flexDirection: "row",
    borderRadius: 20,
    margin: 3,
    padding: 4,
    borderBottomWidth: 2,
  },
  actionContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  status: {},
  searchbar: {
    alignSelf: 'center',
    margin: 40,
    marginBottom: 0,
    marginTop: 50,
    padding: 10,
    borderRadius: 25,
    borderWidth: 2,
    width: '95%',
    height: 50
  },
  inputView: {
    borderRadius: 5,
    borderColor: "#A9A9A9",
    width: "40%",
    height: "6%",
    marginBottom: "1%",
    textAlign: "center",
  },
  filterBar: {
    alignSelf: 'center',
    marginLeft: 40,
    marginRight: 40,
    marginBottom: 40,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    padding: 10,
    width: '95%',
    minHeight: 50
  },
  filterSection: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  switch: {
    marginRight: 40
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  text: {
    fontSize: 16,
    fontWeight: "400",
    textAlign: "center",
    color: "white"
  },
  styleAvatar: {
    width: '30%',
    height: '100%',
    marginBottom: '5%',
  },

  onlineStatusIcon: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginLeft: 'auto',
    flex: 1,
    marginRight: 2,
    marginTop: -26
  },

});

const pickerStyle = StyleSheet.create({
  inputIOS: {
    padding: "5%",
    marginTop: '1%',
    borderRadius: 5,

  },
  inputAndroid: {
    padding: "5%",
    borderRadius: 5,
  }
});
