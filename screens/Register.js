import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { StyleSheet, Text, View, TextInput, TouchableOpacity, KeyboardAvoidingView, ScrollView } from "react-native";
import { auth, db } from '../firebase/firebase-cfg';
import PasswordStrengthMeterBar from 'react-native-password-strength-meter-bar';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

// Screen to register the user in the platform

export default function App({ navigation, route }) {
  // Definition and initialisation of the all data, storing all variables using React hooks
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Method to register the user in the database
  const register = async () => {

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const user = res.user;
      await setDoc(doc(db, "users", res.user.uid), {
        uid: user.uid,
        authProvider: "local",
        email,
        gender: "Gender",
        firstName: "First Name",
        lastName: "Last Name",
        dob: 0,
        localisation: "N/A",
        longitude: 0,
        latitude: 0,
        description: "Description",
        categories: ['N/A'],
        interests: ['N/A'],
        university: "N/A",
        isOnline: true,
      });

      // If registration successfull, redirect to setting up the user screen
      if (email.includes(substring)) {
        navigation.navigate('SetUpUser');
      }
    }
    // If any error found, send an alert to the user
    catch (err) {
      console.log(err);
      alert('Something happened :( Please try again');
    }
  }

  // Method to navigate to the Login screen
  const loginScreen = () => {
    navigation.navigate('Login');
  }

  // Substring representing the domain of the University of Aberdeen
  const substring = "@abdn.ac.uk";


  return (
    <KeyboardAvoidingView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ flex: 1 }} bounces={false}>
        <View style={styles.container}>
          <StatusBar style="auto" />
          <View style={styles.inputView}>

            {/*Email field component */}
            <TextInput
              style={styles.TextInput}
              placeholder="University email"
              placeholderTextColor="#003f5c"
              onChangeText={(email) => setEmail(email)}
            />
          </View>

          <View style={styles.inputView}>

            {/*Password field component */}
            <TextInput
              style={styles.TextInput}
              placeholder="Password"
              placeholderTextColor="#003f5c"
              secureTextEntry={true}
              onChangeText={(password) => setPassword(password)}
            />
          </View>

          {/*Password checker module */}
          <PasswordStrengthMeterBar
            password={password}
            unfilledColor={"#98989c"} />

          {/*Continue button going to the SetUpUser screen */}
          <TouchableOpacity style={styles.RegisterBtn} onPress={register} >
            <Text style={styles.loginText}>Continue</Text>
          </TouchableOpacity>

          {/*Disclaimer of the terms and conditions of meep */}
          <Text style={styles.conditions}>By continuing, you agree that you have read and accepted our T&Cs and privacy policy</Text>

          {/*Button for going back to the Login screen */}
          <TouchableOpacity style={styles.backToLogin} onPress={loginScreen}>
            <Text style={styles.forgot_button}>Already have an account?</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
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
    width: "70%",
    height: "5%",
    marginBottom: "1%",
    textAlign: "center",
  },

  backToLogin: {
    marginTop: "3%",
    width: "60%",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF",
    borderColor: "#8E94F2"
  },

  TextInput: {
    height: "50%",
    flex: 1,
    padding: "5%",
    alignItems: "center"
  },

  RegisterBtn: {
    marginTop: "5%",
    width: "60%",
    borderRadius: 25,
    height: "6%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#8E94F2",
  },
  conditions: {
    marginTop: "20%",
    padding: "10%"
  },
});
