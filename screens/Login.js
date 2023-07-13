import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { auth, logInWithEmailAndPassword, db } from "../firebase/firebase-cfg";
import { useAuthState } from "react-firebase-hooks/auth";
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, KeyboardAvoidingView, ScrollView} from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { updateDoc, doc} from "firebase/firestore";



export default function Login({ navigation }) {
  {/*Definition of the variables email and password*/ }
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, loading, error] = useAuthState(auth);


//function for logging in and upodating users online status to true
  const logInWithEmailAndPassword = async (email, password) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      await updateDoc(doc(db, "users", result.user.uid), {
        isOnline: true,
      });
      navigation.navigate('Home')
    }
    catch (err) {
      alert('Please try again');
    }
  };

  {/* Navigation handler */ }
  const RegHandler = () => {
    navigation.navigate('Register');
  };
  {/* Navigation handler */ }
  const ForgotHandler = () => {
    navigation.navigate('ForgotPass');
  };

  return (
    <KeyboardAvoidingView style={{ flexGrow: 1 }}>
      <ScrollView contentContainerStyle={{ flex: 1 }} bounces={false}>
        <View style={styles.container}>
          <StatusBar style="auto" />

          {/*Meep logo*/}
          <Image style={styles.logo} source={require('../assets/logo.png')} />

          {/*Email input box*/}
          <View style={styles.inputView}>
            <TextInput
              style={styles.TextInput}
              placeholder="Email"
              placeholderTextColor="#003f5c"
              value={email}
              onChangeText={(email) => setEmail(email)}
            />
          </View>

          {/*Password input box*/}
          <View style={styles.inputView}>
            <TextInput
              style={styles.TextInput}
              placeholder="Password"
              placeholderTextColor="#003f5c"
              secureTextEntry={true}
              value={password}
              onChangeText={(password) => setPassword(password)}
            />
          </View>

          {/*Login button*/}
          <TouchableOpacity style={styles.login_button} onPress={() => logInWithEmailAndPassword(email, password)}>
            <Text>Login</Text>
          </TouchableOpacity>



          {/*Forgot password and create account button*/}
          <TouchableOpacity style={styles.register_button} onPress={RegHandler}>
            <Text style={styles.register_button_text}>Register</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={ForgotHandler}>
            <Text style={styles.forgot_button}>Forgot Password?</Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// Constants
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

  forgot_button: {
    height: "20%",
    marginTop: "3%",
  },

  register_button: {
    marginTop: "3%",
    width: "60%",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF",
    borderColor: "#8E94F2"
  },

  register_button_text: {
    padding: "2%",
    alignContent: 'center'
  },

  login_button: {
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
  }
});
