import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  StyleSheet, Text, View, Image, TextInput, Button, TouchableOpacity,
} from "react-native";
import { auth, db, uid,
  registerWithEmailAndPassword,
} from '../firebase/firebase-cfg';
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth, updateProfile, updateUser } from "firebase/auth";

// Function to register the user in the platform
export default function App({ navigation })  {

  const accept = () => {

  }



  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholder="First Name"
          placeholderTextColor="#003f5c"
        />
      </View>

      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholder="Last Name"
          placeholderTextColor="#003f5c"
        />
      </View>
      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholder="Date of Birth"
          placeholderTextColor="#003f5c"
        />
      </View>
      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholder="Description"
          placeholderTextColor="#003f5c"
        />
      </View>
      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholder="Gender"
          placeholderTextColor="#003f5c"
        />
      </View>
      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholder="University"
          placeholderTextColor="#003f5c"
        />
      </View>

      <TouchableOpacity style={styles.backToLogin} onPress={accept}>
        <Text style={styles.acceptButton}>Accept</Text>
      </TouchableOpacity>
    </View>
  );
}

// Styles used to display the interface
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ecf0f1",
    alignItems: "center",
    justifyContent: "center",
  },

  image: {
    marginBottom: 40,
  },

  inputView: {
    backgroundColor: "#FFFFFF",
    borderRadius: 5,
    borderColor: "#A9A9A9",
    borderWidth: 2,
    width: "30%",
    height: 40,
    marginBottom: 20,
    textAlign: "center",
  },

  backToLogin: {
    marginTop: 20,
    width: "30%",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF",
    borderColor: "#8E94F2"
  },

  TextInput: {
    height: 50,
    flex: 1,
    padding:5,
    alignItems: "center"
  },

  acceptButton: {
    height: 30,
    marginBottom: 30,
  },

});
