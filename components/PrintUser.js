import React from "react";
import Img from "../assets/image1.jpg";
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';


//Returning list of users
const PrintUser = ({navigation, user }) => {
  return (


      <View style={styles.mycard}>
          <Image source={{uri:user.pic}} style={styles.img}/>
          <View>
          <Text style = {styles.status}>
          {`${user.isOnline ? "online" : "offline"}`}
          </Text>
              <Text style={styles.text}>
                  {user.firstName}
              </Text>
              <Text style={styles.text}>
                {user.lastName}
                </Text>
              <Text style={styles.text}>
                  {user.email}
              </Text>
          </View>
          <View style={styles.interestsContainer}>
         {user.interests.map((name, index) => (
           <Text key={index}>{name}</Text>
         ))}
       </View>
      </View>

  )
};

export default PrintUser;

const styles = StyleSheet.create({
  itemContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#ecf0f1',
    paddingTop: 12,
    paddingBottom: 12,
    borderColor: 'lightgrey',
    borderBottomWidth: 1,
  },
  nameContainer: {
    flex: 9,
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoContainer: {
    justifyContent: 'center',
    marginLeft: 16,
  },
  name: {
    fontSize: 18,
    fontWeight: '600'
  },
  interestsContainer: {
    flex: 4,
    justifyContent: 'center',
  },
  actionContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  img:{width:60,height:60,borderRadius:30,backgroundColor:"green"},
  text:{
      fontSize:18,
      marginLeft:15,

  },
  mycard:{
      flexDirection:"row",
      margin:3,
      padding:4,
      backgroundColor:"white",
      borderBottomWidth:1,
      borderBottomColor:'grey'
  },
  status: {

  },

});
