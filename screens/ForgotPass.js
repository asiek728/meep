import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from '../firebase/firebase-cfg';


export default function ForgotPass({navigation}) {
  // Definition and initialisation of the all data, storing all variables using React hooks
  const [email, setEmail] = useState("");
//Function to send an email to change password
  const ResetPassword = () => {
    sendPasswordResetEmail(auth, email)
    .then((re)=> {
        loginScreen();
        alert("If an account is associated with that email, a reset password link will have been sent.");
    })
    .catch((err)=>{
        console.log(err);
        alert("Ops....Something happened.");
    })
  };
//Navigation
  const loginScreen = () => {
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />

      {/*Meep logo*/}
      <Image style={styles.logo} source={require('../assets/logo.png')}/>

      {/*Email input box*/}
      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholder="Start by typing your email address"
          placeholderTextColor="#003f5c"
          value={email}
          onChangeText={(email) => setEmail(email)}
        />
      </View>

      {/*Reset button*/}
      <TouchableOpacity style={styles.resetBtn} onPress={ResetPassword}>
        <Text style={styles.loginText}>Reset Password</Text>
      </TouchableOpacity>

      {/*Go back button*/}
      <TouchableOpacity style={styles.goBackBtn} onPress={loginScreen}>
        <Text style={styles.forgot_button}>Go back</Text>
      </TouchableOpacity>

    </View>
  );
}

// Style used in ForgotPass screen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ecf0f1",
    alignItems: "center",
    justifyContent: "center",
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

  TextInput: {
    height: "50%",
    flex: 1,
    padding: "5%",
    alignItems: "center"
  },

  resetBtn: {
    marginTop: "5%",
    width: "60%",
    borderRadius: 25,
    height: "6%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#8E94F2",
  },

  logo: {
    height: "30%",
    width: "50%",
    marginBottom: "2%"
  },

  goBackBtn: {
    height: "20%",
    marginTop: "3%",
  },
});
