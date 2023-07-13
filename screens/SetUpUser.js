import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, KeyboardAvoidingView, ScrollView, Platform } from "react-native";
import RNPickerSelect from 'react-native-picker-select';
import DatePicker from 'react-native-neat-date-picker';
import { Button } from "react-native-elements";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db, logout } from "../firebase/firebase-cfg";
import { updateDoc, doc } from "firebase/firestore";


export default function SetUpUser({ navigation, route }) {

	{/*	Avatar generation
		The avatars are fetched through the multiavatar API (FREE license): https://api.multiavatar.com/' */ }
	// Default value
	//const avatar = multiavatar('Elton')
	const alphabet = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
	const [avatar_code, setAvatar_code] = useState("");


	// Method to generate an automatic avatar picture using the random function.
	// The function creates a random number between 1 and 26 representing the letter of the English alphabet
	const randomAvatar = () => {
		let random_n = 0;
		random_n = Math.floor(Math.random() * 25) + 1;
		setAvatar_code(alphabet[random_n]);
	}


	// Definition and initialisation of the all data, storing all variables using React hooks
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [gender, setGender] = useState("");
	const [dob, setDOB] = useState("Date of Birth");
	const [user, loading, error] = useAuthState(auth);

	// Definition of the genders
	const genders = [
		{ label: 'Male', value: 'Male' },
		{ label: 'Female', value: 'Female' },
		{ label: 'Other', value: 'Other' }];

	// Date Picker
	const [showDatePicker, setShowDatePicker] = useState(false)

	// Date Picker methods
	const openDatePicker = () => {
		setShowDatePicker(true)
	}
	const onDateCancel = () => {
		setShowDatePicker(false)
	}
	const onDateConfirm = (output) => {
		setShowDatePicker(false);
		setDOB(output.dateString);
	}

	// Method to add all the user information and save into the database
	const confirmAllChanges = async () => {
		try {
			await updateDoc(doc(db, "users", user.uid), {
				gender: gender,
				firstName: firstName,
				lastName: lastName,
				dob: dob,
				description: "Please enter your description",
				categories: ['N/A'],
				interests: ['N/A'],
				university: "University of Aberdeen",
				darkMode: "false",
				avatar: avatar_code,
			});
			if (firstName && lastName && gender && dob) {
				navigation.navigate('Home')
			}
			else
				alert('Please fill all the details')
		}
		catch (err) {
			console.log(err)
		}
	}

	// Fetching UK's university through API
	{/**The following lines of code are still in development.
		THe purpose is to expand the application to all the university across the UK
		and all over the world. Our main goal at the moment is to develop a working version
		of the application mainly focused in Aberdeen for the students at the University of Aberdeen.*/}

	const [isLoading, setLoading] = useState(true);
	const [university, setUniversity] = useState();

	const universities = [
		{ label: 'University of Aberdeen', value: 'abdn' }
	];

	// Method to parse JSON file with all the university
	// TO BE USED in the future

	const [open, setOpen] = useState(false);
	const [value, setValue] = useState();
	const getUniversities = async () => {
		try {
			const universities_url = await fetch("https://raw.githubusercontent.com/Hipo/university-domains-list/master/world_universities_and_domains.json");
			const json = await universities_url.json();
			setUniversity(json.filter(x => x.country === 'United Kingdom'));
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	}

	{/*End of future development of the API */ }



	// Method to call getUniversities() and randomAvatar()
	useEffect(() => {
		//getUniversities();
		randomAvatar();

	}, []);

	return (
		<KeyboardAvoidingView style={{ flex: 1 }}>
			<ScrollView contentContainerStyle={{ flex: 1 }} bounces={false}>

				<View style={styles.container}>
					{/* Avatar displaying the user picture*/}
					<Image
						style={styles.styleAvatar}
						source={{
							uri: 'https://api.multiavatar.com/' + avatar_code + '.png'
						}}
					/>

					<View style={{ marginBottom: '5%' }}>
						{/* Button to re-generate a new Avatar, if the user is not satisfied*/}
						<Button
							onPress={randomAvatar}
							title="Generate your Bitmoji"
							color="#841584"
						/>
					</View>


					<View style={styles.inputView}>

						{/* Name field*/}
						<TextInput
							style={styles.TextInput}
							placeholder="Name"
							placeholderTextColor="#003f5c"
							onChangeText={firstName => setFirstName(firstName)}
						/>
					</View>

					<View style={styles.inputView}>

						{/* Surname field*/}
						<TextInput
							style={styles.TextInput}
							placeholder="Surname"
							placeholderTextColor="#003f5c"
							onChangeText={lastName => setLastName(lastName)}
						/>
					</View>

					<View style={styles.inputView}>

						{/* Gender selector*/}
						<RNPickerSelect
							style={pickerStyle}
							useNativeAndroidPickerStyle={true}
							placeholder={{ label: "Choose your gender", value: null }}
							onValueChange={(itemValue, itemIndex) => setGender(itemValue)}
							items={genders}
						/>
					</View>

					{/* Date of Birth Picker
						The component check only if the date chosen is valid and not in the future*/ }
					<DatePicker
						isVisible={showDatePicker}

						dateStringFormat='dd/MM/yyyy'
						mode={'single'}
						onCancel={onDateCancel}
						onConfirm={onDateConfirm}
						maxDate={new Date()}
					/>

					<View style={styles.inputView}>
						{/* Button to open the Date Picker component*/}
						<TouchableOpacity
							onPress={openDatePicker}>
							<Text style={styles.styleDOB}
								onChangeText={dob => setDOB(dob)}>
								{"  "}{dob}{"  "}
							</Text>
						</TouchableOpacity>

					</View>

					<View style={styles.inputView}>

						{/* University selector. At the moment only University of Aberdeen is available. Therefore is the default value.*/}
						<RNPickerSelect style={pickerStyle}
							useNativeAndroidPickerStyle={true}
							placeholder={{ label: "Choose your university", value: null }}
							onValueChange={(itemValue, itemIndex) => setUniversity(itemValue)}
							items={universities}
						/>
					</View>

					{/* Button to continue and go to the Homepage of the application*/}
					<TouchableOpacity style={styles.continue_button} onPress={confirmAllChanges}>
						<Text>Continue</Text>
					</TouchableOpacity>


				</View>
			</ScrollView>
		</KeyboardAvoidingView>
	);
}

// Defintion of the styles used in SetUpUser screen
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
		height: "50%",
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

// Definition of the style for Date Picker based on IOS or Android device, as recommended in the documentation.
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
