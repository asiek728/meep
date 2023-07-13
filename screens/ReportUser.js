import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, KeyboardAvoidingView, ScrollView, FlatList, Platform } from "react-native";
import RNPickerSelect from 'react-native-picker-select';
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db, logout } from "../firebase/firebase-cfg";
import { query, collection, getDocs, where, updateDoc, doc, addDoc } from "firebase/firestore";


export default function ReportUser({ navigation, route }) {
	// Definition and initialisation of the all data, storing all variables using React hooks
	const [description, setDescription] = useState("");
	const [report, setReport] = useState("");
	const user1 = auth.currentUser.uid;

	const { uid } = route.params;

	{/*Definition of the types*/ }
	const type = [
		{ label: 'Nudes', value: 'Nudes' },
		{ label: 'Language', value: 'Language' },
		{ label: 'Fake Information', value: 'Fake Information' },
		{ label: 'Other', value: 'Other' },];


	//Navigation
	const loginScreen = () => {
		navigation.navigate('Home');
	}

	// Function to add document to report colelction, so later on we can see in admin app
	const sendReport = async () => {
		try {
			await addDoc(collection(db, "reports"), {
				from: user1,
				to: uid,
				reason: report,
				description: description,
			});
			if (description && report) {
				loginScreen()
				alert("User has been reported")
			}
			else
				alert('Failed to submit the report. Please try again.')
		}
		catch (err) {
			console.error(err)
		}
	}


	//Main function to send reports and navigate back to main screen
	return (

		<View style={styles.container}>
			<View style={styles.inputView}>
				{/*Description of the report */}
				<TextInput
					style={styles.TextInput}
					placeholder="Please provide a description of a problem"
					placeholderTextColor="#003f5c"
					onChangeText={description => setDescription(description)}
				/>
			</View>


			<View style={styles.inputView}>
				{/*Category of the report */}
				<RNPickerSelect
					style={pickerStyle}
					useNativeAndroidPickerStyle={true}
					placeholder={{ label: "Choose category", value: null }}
					onValueChange={(itemValue, itemIndex) => setReport(itemValue)}
					items={type}
				/>
			</View>

			{/*Button for sending the report */}
			<TouchableOpacity style={styles.continue_button} onPress={sendReport}>
				<Text>Continue</Text>
			</TouchableOpacity>
		</View>

	);
}

// Style used in the ReportUser screen
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#ecf0f1",
		alignItems: "center",
		justifyContent: "center",
	},

	styleAvatar: {
		width: '70%',
		height: '32%',
		marginBottom: '5%',
	},

	inputView: {
		backgroundColor: "#FFFFFF",
		borderRadius: 5,
		borderColor: "#A9A9A9",
		width: "70%",
		height: "6%",
		marginBottom: "1%",
		textAlign: "center",
	},

	TextInput: {
		height: "70%",
		flex: 1,
		padding: "5%",
		alignItems: "center"
	},

	continue_button: {
		marginTop: "5%",
		width: "40%",
		borderRadius: 25,
		height: "6%",
		alignItems: "center",
		justifyContent: "center",
		marginLeft: '30%',
		backgroundColor: "#8E94F2",
	},

	styleDOB: {
		marginTop: '5%',
		marginLeft: '2%'
	}

});
const pickerStyle = StyleSheet.create({
	inputIOS: {
		padding: "5%",
		marginTop: '1%',
		borderRadius: 5,

	},
	inputAndroid: {
		padding: "5%",
		marginTop: '1%',
		borderRadius: 5,
		color: 'black',
	}
});
