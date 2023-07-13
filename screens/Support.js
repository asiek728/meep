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


	{/*Definition of the reasons*/ }
	const reasons = [
		{ label: 'Improving ideas', value: 'Improving ideas' },
		{ label: 'Found an error', value: 'Found an error' },
		{ label: 'Other', value: 'Other' },];


	const loginScreen = () => {
		navigation.navigate('Home');
	}

	{/*Send report function, sends data to db, so later we can fetch it in admin app */ }
	const sendReport = async () => {
		try {
			await addDoc(collection(db, "support"), {
				from: user1,
				reason: report,
				description: description,
			});
			if (description && report) {
				loginScreen()
				alert("Thanks for improving application. (c) Development team")
			}
			else
				alert('Failed to submit the report. Please try again.')
		}
		catch (err) {
			console.error(err)
		}
	}



	// Fetching UK's university through API

	const [isLoading, setLoading] = useState(true);
	const [university, setUniversity] = useState();


	// Method to parse JSON file with all the university
	// TO BE USED in the future

	const [open, setOpen] = useState(false);
	const [value, setValue] = useState();



	return (

		<View style={styles.container}>
			{/*Disclaimer of the terms and conditions of meep */}
			<Text style={styles.conditions}>To make meep better please share your ideas with us. Anything you find will be carefully considered by development team. Thank you for your co-operation</Text>
			{/*field for giving description  */}
			<View style={styles.inputView}>
				<TextInput
					style={styles.TextInput}
					placeholder="Please provide a description"
					placeholderTextColor="#003f5c"
					onChangeText={firstName => setDescription(firstName)}
				/>
			</View>

			{/* Category picker */}
			<View style={styles.inputView}>
				<RNPickerSelect
					style={pickerStyle}
					useNativeAndroidPickerStyle={true}
					placeholder={{ label: "Choose a category", value: null }}
					onValueChange={(itemValue, itemIndex) => setReport(itemValue)}
					items={reasons}
				/>
			</View>

			{/* Send report and comeback to main screen  */}
			<TouchableOpacity style={styles.continue_button} onPress={sendReport}>
				<Text>Continue</Text>
			</TouchableOpacity>
		</View>

	);
}

// Styles used in the Support screen
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
	},
	conditions: {
		marginTop: "5%",
		padding: "10%"
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
		marginTop: '1%',
		borderRadius: 5,
		color: 'black',
	}
});
