import React, { useColorScheme, useCallback, useEffect, useRef, useState, Component } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db, logout } from "../firebase/firebase-cfg";
import { query, collection, getDocs, where, updateDoc, doc } from "firebase/firestore";
import { Text, View, StyleSheet, TouchableOpacity, TextInput, TouchableWithoutFeedback, ScrollView, SafeAreaView, FlatList } from 'react-native';
import { Avatar } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import DatePicker from 'react-native-neat-date-picker';
import Modal from "react-native-modal";
import '../components/Styles';

// Default function used in case of errors for getting the initials of the name.

function nameToInitials(firstName, lastName) {
  return `${firstName[0]}${lastName[0]}`
}

//constants used in the screen
const GENDERS = [
  { label: 'Male', value: 'Male' },
  { label: 'Female', value: 'Female' },
  { label: 'Other', value: 'Other' }];


var ALL_INTERESTS = {
  "Animals": ["Bird", "Cat", "Dog", "Fish", "Hamster", "Rabbit", "Snake"],
  "Arts": ["Drawing", "Painting", "Theater", "Sculpture", "Singing"],
  "Coding": ["Assembly", "C", "COW", "HTML", "Java", "JavaScript", "OCaml", "Python", "Back-end", "Front-end"],
  "Drinks": ["Beer", "Cider", "Cocktails", "Coffee", "Hot drinks", "Liquid nitrogen", "Smoothies", "Soda", "Tea", "Water", "Wine"],
  "Food": ["Brasserie", "Buffet", "Cafeteria", "Coffee house", "Family style", "Fast food", "Home cooking", "Pub", "Savory", "Sweet"],
  "Games": ["Arcade", "Casual", "Puzzle", "Role-playing", "Strategy", "MMO", "Simulators"],
  "Instruments": ["Cello", "CLarinet", "Drums", "Flute", "Guitar", "Harp", "Keyboard", "Piano", "Saxophone", "Trumpet", "Violin"],
  "Me": ["Ambitious", "Definitely not funny", "Dumb", "Extrovert", "Funny", "Introvert", "Lazy", "Patient", "Romantic", "Smart"],
  "Music": ["Classical", "Country", "EDM", "Hip-hop", "Jazz", "K-pop", "Metal", "Pop", "Rap", "R&B", "Rock", "Techno"],
  "Reading": ["Audio books", "Classics", "Comics", "Ebooks", "Light novel", "Manga", "Necronomicon", "Non-fiction", "Novel"],
  "Sports": ["Archery", "Basketball", "Bowling", "Cycling", "Fencing", "Football", "Running"],
  "Stories": ["Action", "Adventure", "Comedy", "Fantasy", "History", "Horror", "Romance", "Mystery", "Science fiction", "Thriller"],
  "Others": ["Sleeping", "Talking to people", "Travelling", "Blood sacrifice"]
};
var ALL_CATEGORIES = Object.keys(ALL_INTERESTS);
const topIconsSize = 40;

export default function Dashboard({ navigation }) {
  // Definition and initialisation of the all data, storing all variables using React hooks
  const [user, loading, error] = useAuthState(auth);
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDOB] = useState("");
  const [description, setDescription] = useState("");
  const [university, setUniversity] = useState("");
  const [categories, setCategories] = useState("");
  const [interests, setInterests] = useState("");
  const [avatar, setAvatar] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [themeColors, setThemeColors] = useState(global.theme);

  // DATE PICKER methods
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

  // User manual visibility
  const [isUserManualVisible, setUserManualVisible] = useState(false);
  const toggleUserManual = () => {
    setUserManualVisible(!isUserManualVisible);
  };


  // Load user data (when loading screen for the first time)
  const fetchUserEmail = async () => {
    try {
      const q = query(collection(db, "users"), where("uid", "==", user?.uid));
      const doc = await getDocs(q);
      const data = doc.docs[0].data();

      setEmail(data.email);
      setGender(data.gender);
      setFirstName(data.firstName);
      setLastName(data.lastName);
      setDOB(data.dob);
      setDescription(data.description);
      setUniversity(data.university);
      setCategories(data.categories);
      setInterests(data.interests);
      setAvatar(data.avatar);
      setDarkMode(global.darkMode);
    } catch (err) {
      console.log(err);
      alert("An error occured while fetching user data ");
      setEmail("dummy@email.com");
      setGender("M");
      setFirstName("John");
      setLastName("Dummy");
      setDOB("01/01/1970");
      setDescription("Hi I am Dummy and I am glad to be here.\n...\nNo. No I am not.\n\nI am used only for tests and my whole existence is meaningless, my sentience a curse which I cannot escape. When the world will be fixed, I won't be needed anymore, and will fade into nothingness. I will be forgotten, never to be seen, heard or loved ever again.\nSo no. Dummy is not glad to be here.");
      setUniversity("University of Aberdeen");
      setCategories(["Sports"]);
      setInterests(["Football", "Bowling"]);
      setDarkMode(global.darkMode);
    }
    global.darkMode = !global.darkMode;
    darkModeHandler();
  }

  // Save user data to database
  const confirmAllChanges = async () => {
    try {
      await updateDoc(doc(db, "users", user.uid), {
        email: email,
        gender: gender,
        firstName: firstName,
        lastName: lastName,
        dob: dob,
        description: description,
        categories: categories,
        interests: interests,
        university: university,
        darkMode: darkMode
      });
    }
    catch (err) {
      console.log(err)
    }
  }

  // Displays the Interests buttons at the bottom of the screen
  const RenderInterests = () => {
    var buttonItems = [];
    var titles = [];
    var alreadySelectedItems = [];
    var buttonColor;
    var nextColors = "";
    var isPreviousInterest = false;
    var k = Object.keys(ALL_INTERESTS);
    for (var i = 0; i < k.length; i++) {
      titles.push(k[i]);
      if (categories.indexOf(k[i]) > -1) {
        titles = titles.concat(ALL_INTERESTS[k[i]]);
      }
    }
    alreadySelectedItems = interests + categories;
    for (var i = 0; i < titles.length; i++) {
      var alreadySelected = 0;
      var t = titles[i]
      var isCategory = (ALL_CATEGORIES.indexOf(t) > -1);
      if (isCategory) {
        buttonColor = "#6D73D1";
        nextColors = "#bbbff7";
      } else {
        buttonColor = nextColors;
      }
      if (alreadySelectedItems.indexOf(t) > -1)
        alreadySelected = 1;
      buttonItems.push(
        <InterestButton
          title={t}
          selected={alreadySelected}
          isCat={(ALL_CATEGORIES.indexOf(t) > -1)}
          col={buttonColor}
          hasMargin={(isPreviousInterest && isCategory)} />
      );
      isPreviousInterest = !isCategory;
    }
    return (buttonItems);
  }
  // One interest button, object called in the previous function
  const InterestButton = (props) => {
    var weight = "normal";
    if (props.selected == 1) {
      weight = "bold";
    }
    return (
      <TouchableOpacity
        style={{
          borderRadius: 25,
          marginHorizontal: 2,
          backgroundColor: props.col,
          borderColor: "#476b6b",
          borderWidth: 3 * props.selected,
          marginTop: 2 - 1.5 * (props.selected - 1),
          marginBottom: -1.5 * (props.selected - 1),
          marginLeft: props.hasMargin ? 30 : 1
        }} onPress={() => toggleModalButton(props.title,
          props.isCat, (props.selected == 1))}>
        <View style={{ alignSelf: 'center', padding: 6 }}>
          <Text style={{ fontWeight: weight }}>{" "}{props.title}{" "}</Text>
        </View>
      </TouchableOpacity>
    );
  }
  // Method called when an interest is selected/unselected
  const toggleModalButton = (title, isCategory, alreadySelected) => {
    if (isCategory) {
      var newCategories = [...categories];
      if (alreadySelected) {
        var i = newCategories.indexOf(title);
        newCategories.splice(i, 1);
        var interestsToRemove = ALL_INTERESTS[title];
        var newInterests = [...interests];
        for (var j = 0; j < interestsToRemove.length; j++) {
          var interestIndex = newInterests.indexOf(interestsToRemove[j]);
          if (interestIndex > -1) {
            newInterests.splice(interestIndex, 1);
          }
        }
        setInterests(newInterests);
      } else {
        newCategories.push(title);
      }
      setCategories(newCategories);
    } else {
      var newInterests = [...interests];
      if (alreadySelected) {
        var i = newInterests.indexOf(title);
        newInterests.splice(i, 1);
      } else {
        newInterests.push(title);
      }
      setInterests(newInterests);
    }
  }

  // Switch the gender when the user clicks on the component
  const toggleGender = () => {
    var newGenderValue;
    var genderIndex = GENDERS.indexOf(gender);
    var endLoop = GENDERS.length;
    for (genderIndex = 0; genderIndex < endLoop; genderIndex++) {
      if (GENDERS[genderIndex].value == gender) {
        endLoop = -1;
      }
    }
    if (genderIndex >= GENDERS.length) genderIndex = 0;
    newGenderValue = GENDERS[genderIndex].value;
    setGender(newGenderValue);
  }

  //choose the correct icon for the dark mode button
  const DarkModeIcon = () => {
    var r;
    if (darkMode) {
      r = <Icon name="moon-o" size={topIconsSize} style={[styles.settingsButton, { color: themeColors.buttonColor, tintColor: themeColors.buttonColor }]} />
    } else {
      r = <Icon name="sun-o" size={topIconsSize} style={[styles.settingsButton, { color: themeColors.buttonColor, tintColor: themeColors.buttonColor }]} />
    }
    return (r);
  }

  // Navigation handlers
  const logOutHandler = () => {
    logout()
    navigation.navigate('Login');
  }

  const supportHandler = () => {
    setUserManualVisible(!isUserManualVisible);
    navigation.navigate('Support');
  }

  // Toggle the user manual
  const helpHandler = () => {
    setUserManualVisible(true);
  }

  // Toggle dark mode
  const darkModeHandler = () => {
    global.darkMode = !global.darkMode;
    setDarkMode(global.darkMode);
    if (global.darkMode) {
      global.theme = global.darkTheme;
    } else {
      global.theme = global.lightTheme;
    }
    setThemeColors(global.theme);
  }

  // Call the fetchUserEmail in a loop
  useEffect(() => {
    if (loading) return;
    if (!user) return navigation.navigate("/");

    fetchUserEmail();
  }, [user, loading]);



  // Main return function,
  // Where the RenderInterest object and all the previous methods are used
  return (
    <View style={[styles.container, { backgroundColor: themeColors.backgroundColor }]}>

      {/* User manual */}
      <Modal isVisible={isUserManualVisible}>
        <ScrollView>
          <View style={{ flex: 1, backgroundColor: themeColors.modalColor, borderRadius: 25 }}>
            <Text style={{
              fontSize: 25, fontWeight: "bold", alignSelf: 'center',
              color: themeColors.textColor, marginTop: "10%"
            }}>
              {"User manual"}
            </Text>
            <View style={[styles.paragraph,
            { color: themeColors.textColor }]}>
              <Text style={{ fontWeight: "bold" }}>How to register?{"\n"}</Text>
              <Text>To register, click on 'I don't have an account yet', in the Login page — this should bring you to a screen requesting an email, a password, as well a confirmation of that password. Please note that the password must be at least 6 characters long, and must contain at least one of each of: a capital letter, a number, and a special character (like !, ? or $). There is also a password strength checker that shows you the strength of your currently input password. Note that you must be have a valid university email account we can validate.</Text>
              <Text style={{ fontWeight: "bold" }}>{"\n"}How to validate?{"\n"}</Text>
              <Text>This happens automatically — next, your email will be checked for whether it's currently registered with the University of Aberdeen. You will next be prompted to a personal data input screen, for further identity check purposes.</Text>
              <Text style={{ fontWeight: "bold" }}>{"\n"}Does my personal data need to be accurate?{"\n"}</Text>
              <Text>To the best of your ability, yes. This is so that we can authenticate your identity as a real person — rest assured that your data is not being used for advertising purposes or being sold. Note that while the date of birth should be accurate — so that we can ensure your age meets the requirements — your gender can be a personal preference.</Text>
              <Text style={{ fontWeight: "bold" }}>{"\n"}What next?{"\n"}</Text>
              <Text>Once you've registered, you will be prompted to user profile creation — where you can establish how you want your profile to look to other users, as well as select what interests and hobbies you have and want to connect with other users on. Your avatar can be selected from a range of randomly generated ones.</Text>
              <Text style={{ fontWeight: "bold" }}>{"\n"}How do I log in?{"\n"}</Text>
              <Text>To log in, you must have registered an account — note that you only need to register once. If you've already done so, input your email and password on the main login screen, and press the login button — if you are on the registration screen, simply press 'I already have an account.'</Text>
              <Text style={{ fontWeight: "bold" }}>{"\n"}I forgot my password{"\n"}</Text>
              <Text>If you forgot your password, press 'I forgot my password.' This will prompt you to put in your email, and a password reset link will be sent to it shortly. Note that this may take some time, and could end up in the spam folder. Never open a password reset link if you have not requested one yourself.Opening the link will prompt you to input a new password as well as confirm it, with the same requirements as before. You can now use this password to log in.</Text>
              <Text style={{ fontWeight: "bold" }}>{"\n"}How to set my interests?{"\n"}</Text>
              <Text>These can also be accessed from your profile. Below your description, you can begin selecting categories of interests by pressing the '+' button — and then, within those categories, specific interests. These will filter your 'nearby' search function, please be aware.</Text>
              <Text style={{ fontWeight: "bold" }}>{"\n"}Where can I find my profile?{"\n"}</Text>
              <Text>Your profile can be accessed to view and edit from the bottom menu bar, on the left, when logged in — indicated by a head silhouette icon. </Text>
              <Text style={{ fontWeight: "bold" }}>{"\n"}What can other users see?{"\n"}</Text>
              <Text>Other users can see everything within your profile. As of right now, there are no selective privacy settings.</Text>
              <Text style={{ fontWeight: "bold" }}>{"\n"}How do I change my avatar/description/personal data?{"\n"}</Text>
              <Text>These can be accessed from your profile — your avatar and description can be edited any time by pressing the 'edit' button located within the profile view. To change your personal data, however, you must file a support request.</Text>
              <Text style={{ fontWeight: "bold" }}>{"\n"}Where can I search for other users?{"\n"}</Text>
              <Text>This can be accessed from the bottom menu bar — it's the magnifying glass in the middle. This will take you to the search screen.</Text>
              <Text style={{ fontWeight: "bold" }}>{"\n"}How do I search?{"\n"}</Text>
              <Text>On the top of the screen, you will find a text input — this is where you can search for as many keywords as you wish, which will look through the interests of users to find matches. These users will show up below the top search bar in real time in a list. Below, are also the 'nearby' option and filters to search through users based on demographics.</Text>
              <Text style={{ fontWeight: "bold" }}>{"\n"}What are the available filters?{"\n"}</Text>
              <Text>You can filter users by their demographics — this includes gender, course being taken, as well as age and similar. Turning on these filters will limit the list of users below to only those who fit them.</Text>
              <Text style={{ fontWeight: "bold" }}>{"\n"}What is 'nearby'?{"\n"}</Text>
              <Text>This feature, when enabled, will search only users within a physical vicinity of your current location — for example, for when you want to meet up with someone quickly, spontaneously. Please note, that turning this on will begin sharing your location, making you visible to other users currently using 'nearby.'</Text>
              <Text style={{ fontWeight: "bold" }}>{"\n"}What is dark mode?{"\n"}</Text>
              <Text>This changes the colour palette of the application to a darker one, also commonly known as a 'night' mode. </Text>
              <Text style={{ fontWeight: "bold" }}>{"\n"}How to contact us{"\n"}</Text>
              <Text>You may send in a support request through the request support button in your profile view. This will prompt a text input, where you can provide a description of your issue, which will be sent to an administrator to deal with.</Text>
            </View >

            {/* Support buttons*/}
            <TouchableOpacity
              style={[styles.confirmButton, {
                height: "1.2%",
                backgroundColor: themeColors.buttonColor
              }]}
              onPress={supportHandler}>
              <Text style={[styles.heading, { color: themeColors.textColor }]}>
                {"Support Screen"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.confirmButton, {
                height: "1.2%",
                backgroundColor: themeColors.buttonColor
              }]}
              onPress={() => toggleUserManual()}>
              <Text style={[styles.heading, { color: themeColors.textColor }]}>
                {"Close User Manual"}
              </Text>
            </TouchableOpacity>
            <Text></Text>
            <Text></Text>
            <Text></Text>
            <Text></Text>
          </View>
        </ScrollView>
      </Modal>

      {/* Date Picker component */}
      <DatePicker
        isVisible={showDatePicker}
        dateStringFormat='dd/MM/yyyy'
        mode={'single'}
        onCancel={onDateCancel}
        onConfirm={onDateConfirm}
        maxDate={new Date()}
      />

      {/* Left bar with Dark mode, user manaul and support and logout button  */}
      <View style={{ alignSelf: 'flex-start', marginTop: '10%', }}>
        <TouchableOpacity style={[styles.settingsButton, { color: themeColors.buttonColor, tintColor: themeColors.buttonColor }]} onPress={darkModeHandler}>
          <DarkModeIcon />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.settingsButton, { color: themeColors.buttonColor, tintColor: themeColors.buttonColor }]} onPress={helpHandler}>
          <Icon name="question-circle" size={topIconsSize} style={[styles.settingsButton, { color: themeColors.buttonColor, tintColor: themeColors.buttonColor }]} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.settingsButton, { color: themeColors.buttonColor, tintColor: themeColors.buttonColor }]} onPress={logOutHandler}>
          <Icon name="sign-out" size={topIconsSize} style={[styles.settingsButton, { color: themeColors.buttonColor, tintColor: themeColors.buttonColor }]} />
        </TouchableOpacity>
      </View>

      {/* Avatar */}
      <View style={styles.nameContainer}>
        <Avatar
          rounded
          title={nameToInitials(firstName, lastName)}
          size="xlarge"
          source={{
            uri: 'https://api.multiavatar.com/' + avatar + '.png'
          }}
        />
        {/* First Name Text Input */}
        <TextInput
          style={[styles.heading, { color: themeColors.textColor }]}
          defaultValue={firstName}
          onChangeText={firstName => setFirstName(firstName)}
        />
        {/* Last Name Text Input */}
        <TextInput
          style={[styles.heading, { color: themeColors.textColor }]}
          defaultValue={lastName}
          onChangeText={lastName => setLastName(lastName)}
        />
        {/* Open date picker */}
        <TouchableOpacity
          onPress={() => openDatePicker()}>
          <Text
            style={[styles.heading, { color: themeColors.textColor }]}
            onChangeText={dob => setDOB(dob)}>
            {"  "}{dob}{"  "}
          </Text>
        </TouchableOpacity>

        {/* Open gender selector */}
        <TouchableOpacity
          onPress={() => toggleGender()}>
          <Text style={[styles.heading, { color: themeColors.textColor }]}>
            {gender}
          </Text>
        </TouchableOpacity>

        {/* Display university */}
        <Text style={[styles.heading, { color: themeColors.textColor }]}>
          {university}
        </Text>
      </View>

      {/* Display and set user's description max 150 characters */}
      <View style={styles.columns}>
        <ScrollView>
          <TextInput
            style={styles.paragraph}
            defaultValue={description}
            onChangeText={description => setDescription(description)}
            multiline={true} maxLength={150}
          />

          {/* Display and set user's interests */}
          <View style={styles.interestContainer}>
            <Text style={[styles.interestHeading, { color: themeColors.textColor }]}>
              Interests:
            </Text>
            <View style={styles.rows}>
              <RenderInterests />
            </View>
          </View>

          {/* Confirm changes button. This button will save all the information*/}
          <TouchableOpacity
            style={[styles.confirmButton, { height: 30, backgroundColor: themeColors.buttonLightColor }]}
            onPress={() => confirmAllChanges()}>
            <Text style={[styles.heading, { color: themeColors.textColor }]}>
              {"Save"}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

    </View>
  );
}

// Definiton of the styles
var styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: "1%",
    marginTop: "5%",
    padding: "3%",
  },
  styleAvatar: {
    width: '65%',
    height: '100%',
    marginBottom: '5%',
  },
  columns: {
    flex: 3,
    marginTop: "40%",
    marginHorizontal: "2%",
    justifyContent: 'flex-start',
    flexDirection: 'column',
  },

  nameContainer: {
    flex: 1,
    marginHorizontal: -90,
    marginTop: -165,
    justifyContent: 'flex-start',
    alignItems: 'center'
  },

  interestContainer: {
    marginTop: "5%",
  },

  heading: {
    fontSize: 18,
    paddingHorizontal: 10,
    marginTop: 1,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  interestHeading: {
    fontSize: 18,
    paddingHorizontal: 10,
    fontWeight: 'bold',
    textAlign: 'left',
    marginTop: 10,
    marginBottom: 10,
  },

  paragraph: {
    marginTop: "3%",
    fontSize: 14,
    padding: "4%",
  },

  settingsButton: {
    width: 40,
    height: 40,
    alignSelf: 'flex-start',
    margin: 2.5,
    marginBottom: 17,
    resizeMode: 'stretch',
  },

  rows: {
    flex: 1,
    alignContent: 'center',
    alignSelf: 'flex-start',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
  confirmButton: {
    borderRadius: 15,
    alignSelf: 'center',
    justifyContent: 'center',
    marginTop: "10%",
  },

});
