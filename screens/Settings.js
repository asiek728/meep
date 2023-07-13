import React, { useCallback, useEffect, useRef, useState } from "react";
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import Modal from "react-native-modal";

{/*Screen with the future implementation of the Settings screen
It was decided to create a stable and reliable version of the application. Therefore, this screen
will not be executed */}

const APP_THEMES = [
  "Normal",
  "Dark"
];

// Settings screen used to edit the profile and all the user experience settings such as the colour, modes (light/dark) etc
export default function App() {
  // Definition and initialisation of the all data, storing all variables using React hooks
  const [reportUserModalVisible, setReportUserModal] = useState(false);
  const [deleteAccountModalVisible, setDeleteAccountModal] = useState(false);
  const [changeThemeModalVisible, setChangeThemeModal] = useState(false);
  const [currentTheme, setCurrentTheme] = useState(0)

  const setNewTheme = (newVal) => {
    if (newVal < 0) {
      setCurrentTheme(APP_THEMES.length - 1);
    } else if (newVal >= (APP_THEMES.length)) {
      setCurrentTheme(0);
    } else {
      setCurrentTheme(newVal);
    }
  }

  return (
    <View style={styles.container}>

      <Modal
        animationType="slide"
        transparent={true}
        visible={reportUserModalVisible}
        onRequestClose={() => {
          setReportUserModal(!reportUserModalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.addingContainer}>
              <Text style={styles.addingHeading}>Enter user name:</Text>
            </View>
            <TouchableOpacity
              style={[styles.button, styles.buttonClose]}
              onPress={() => setReportUserModal(false)}>
              <Text style={styles.textStyle}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={deleteAccountModalVisible}
        onRequestClose={() => {
          setDeleteAccountModal(!deleteAccountModalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.addingContainer}>
              <Text style={styles.addingHeading}>
                {"Are you sure you want to delete your account?"}
                {"\nThis action is irreversible."}
              </Text>
            </View>
            <View style={styles.themeChoice}>
              <TouchableOpacity
                style={[styles.button, styles.buttonClose]}
                onPress={() => setDeleteAccountModal(false)}>
                <Text style={styles.textStyle}>   Yes   </Text>
              </TouchableOpacity>
              <View style={{ width: 50 }}></View>
              <TouchableOpacity
                style={[styles.button, styles.buttonClose]}
                onPress={() => setDeleteAccountModal(false)}>
                <Text style={styles.textStyle}>   No   </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <View style={{ height: 20 }} />

      <Text style={styles.heading}>
        {"myEmailAdress@abdn.ac.uk"}
      </Text>

      <View style={{ height: 20 }} />

      <TouchableOpacity
        style={styles.confirmButton}
        onPress={() => setReportUserModal(true)}>
        <Text style={styles.textButton}>
          {"     Report user     "}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.confirmButton}
        onPress={() => setDeleteAccountModal(true)}>
        <Text style={styles.textButton}>
          {"     Delete account     "}
        </Text>
      </TouchableOpacity>

      <View style={styles.bottomButton}>
        <View style={styles.themeChoice}>
          <TouchableOpacity
            style={styles.themeButton}
            onPress={() => setNewTheme(currentTheme - 1)}>
            <Text style={styles.textButton}>
              {"    <    "}
            </Text>
          </TouchableOpacity>
          <View style={styles.transparentButtonSmol}>
            <Text style={styles.textButton}>
              {APP_THEMES[currentTheme]}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.themeButton}
            onPress={() => setNewTheme(currentTheme + 1)}>
            <Text style={styles.textButton}>
              {"    >    "}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

    </View>
  );
}




// Definiton of the styles
const styles = StyleSheet.create({

  themeChoice: {
    justifyContent: 'space-between',
    flexDirection: 'row',
  },

  bottomButton: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 30,
  },

  themeButton: {
    borderRadius: 5,
    marginHorizontal: 2,
    justifyContent: 'center',
    marginTop: 20,
    backgroundColor: "#7d83e1",
    alignSelf: 'center',
  },

  textButton: {
    fontWeight: 'bold',
    marginVertical: 7,
    alignSelf: "center",
  },

  transparentButtonSmol: {
    borderRadius: 10,
    marginHorizontal: 2,
    //backgroundColor: "#8E94F2",
    borderColor: "#000000",
    borderWidth: 3,
    width: 160,
    marginTop: 20,
    marginHorizontal: 15,
  },



  //
  //repetition from other pages
  //
  container: {
    flex: 1,
    alignItems: 'center',
    /* paddingTop: Constants.statusBarHeight, error with this being 0 right now*/
    paddingTop: 10,

    backgroundColor: '#ecf0f1',
    padding: 8,
  },

  columns: {
    flex: 3,
    marginTop: 250,
    justifyContent: 'flex-start',
    flexDirection: 'column',
  },

  nameContainer: {
    flex: 2,
    margin: -90,
    justifyContent: 'flex-start',
    alignItems: 'center'
  },

  interestContainer: {
    marginTop: 15,
  },

  addingContainer: {
    marginTop: -30,
    marginBottom: 20,
    alignContent: 'center',
    alignItems: 'center',
  },

  heading: {
    margin: 0,
    fontSize: 18,
    paddingHorizontal: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  categoryHeading: {
    marginTop: 20,
    fontSize: 18,
    paddingHorizontal: 10,
    fontWeight: 'bold',
    textAlign: 'left',
  },

  addingHeading: {
    marginTop: 20,
    marginBottom: 20,
    fontSize: 18,
    paddingHorizontal: 10,
    fontWeight: 'bold',
    textAlign: 'left',
  },

  interestHeading: {
    fontSize: 18,
    paddingHorizontal: 10,
    fontWeight: 'bold',
    textAlign: 'left',
  },

  paragraph: {
    marginHorizontal: 20,
    height: 70,
    marginVertical: 20,
    fontSize: 16,
    textAlign: 'center',
  },

  settingsButton: {
    width: 40,
    height: 40,
    alignSelf: 'flex-start',
    margin: 2.5,
    marginBottom: 17,
    resizeMode: 'stretch',
    tintColor: "#0D67B5"
  },
  editButton: {
    width: 100,
    height: 35,
    alignSelf: 'flex-start',
    margin: 2.5,
    marginBottom: 17,
  },

  interest_button: {
    borderRadius: 25,
    marginHorizontal: 2,
    marginTop: 2,
  },

  rows: {
    flex: 1,
    marginTop: 0,
    alignContent: 'center',
    alignSelf: 'flex-start',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    flexDirection: 'row',
  },

  labels: {
    fontSize: 13,
    alignSelf: 'center',
    justifyContent: 'center',
    flex: 1,
  },


  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  centeredView: {
    alignItems: "center",
    marginTop: 10,
  },

  plusButton: {
    borderRadius: 25,
    marginHorizontal: 2,
    marginTop: 2,
    backgroundColor: "#7fffd4",
  },

  confirmButton: {
    borderRadius: 5,
    marginHorizontal: 2,
    alignSelf: 'center',
    justifyContent: 'center',
    marginTop: 20,
    backgroundColor: "#7d83e1",
  },

});
