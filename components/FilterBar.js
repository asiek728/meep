import * as React from 'react';
import { View, Switch, Text, StyleSheet } from "react-native";
import SelectDropdown from 'react-native-select-dropdown'
import Icon from 'react-native-vector-icons/FontAwesome';

// Helper file to filter the research from an user based on the nearby function, gender and degree
export default class FilterBar extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            isNearby: true,
            //Arbitrary value for now
            isNearbyDistance: 20,
            fieldOfStudy: [
                { label: 'all', value: 'all' },
                { label: 'Computer Science', value: 'computerScience' },
                { label: 'Biology', value: 'biology' },
                { label: 'Music', value: 'music' },
                { label: 'Sports', value: 'sports' },
                { label: 'Mechanical Engineering', value: 'mechanicalEngineering' },
                { label: 'Law', value: 'law' },
                { label: 'Psychology', value: 'psychology' }
            ],
            genders: [
                { label: 'all', value: 'all' },
                { label: 'Male', value: 'male' },
                { label: 'Female', value: 'female' },
                { label: 'Non-Binary', value: 'non-binary' },
                { label: 'Other', value: 'other' },
                { label: 'I prefer not to say', value: 'notSpecified' }]
        }
    }

    toggleSwitch = () => {
        this.setState({ isNearby: !this.state.isNearby })
        if (this.state.isNearby) {
            console.log('nearby')
            this.props.updateDistance(this.state.isNearbyDistance)
        } else {
            this.props.updateDistance(-1)
        }
    }

    render() {
        return (
            <View style={styles.filterBar}>
                <View style={{flexDirection:'row'}}>
                    <View style={styles.filterSection}>
                        <Text>Gender: </Text>
                        <SelectDropdown
                            defaultButtonText={'all'}
                            renderDropdownIcon={() => {
                                return (
                                    <Icon
                                        name="chevron-down"
                                        size={18}
                                        color="#444"
                                    />
                                );
                            }}
                            dropdownIconPosition={"right"}
                            data={this.state.genders}
                            onSelect={(selectedItem, index) => {
                                this.props.updateGender([selectedItem.value])
                            }}
                            buttonTextAfterSelection={(selectedItem, index) => {
                                return selectedItem.label
                            }}
                            rowTextForSelection={(item, index) => {
                                return item.label
                            }}
                            buttonStyle={styles.dropdown1BtnStyle}
                            buttonTextStyle={styles.dropdown1BtnTxtStyle}
                            dropdownStyle={styles.dropdown1DropdownStyle}
                            rowStyle={styles.dropdown1RowStyle}
                            rowTextStyle={styles.dropdown1RowTxtStyle}
                        />
                    </View>
                    <View style={styles.filterSection}>
                        <Text>only nearby: </Text>
                        <Switch style={styles.switch}
                            trackColor={{ false: "#767577", true: "lightgrey" }}
                            thumbColor={!this.state.isNearby ? "blue" : "#f4f3f4"}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={this.toggleSwitch}
                            value={!this.state.isNearby}/>
                    </View>
                </View>
                <View style={styles.filterSection}>
                    <Text>Field of study: </Text>
                    <SelectDropdown
                        defaultButtonText={'all'}
                        renderDropdownIcon={() => {
                            return (
                                <Icon
                                    name="chevron-down"
                                    size={18}
                                    color="#444"
                                />
                            );
                        }}
                        dropdownIconPosition={"right"}
                        data={this.state.fieldOfStudy}
                        onSelect={(selectedItem, index) => {
                            this.props.updateFieldOfStudy([selectedItem.value])
                        }}
                        buttonTextAfterSelection={(selectedItem, index) => {
                            return selectedItem.label
                        }}
                        rowTextForSelection={(item, index) => {
                            return item.label
                        }}
                        buttonStyle={styles.dropdown1BtnStyle}
                        buttonTextStyle={styles.dropdown1BtnTxtStyle}
                        dropdownStyle={styles.dropdown1DropdownStyle}
                        rowStyle={styles.dropdown1RowStyle}
                        rowTextStyle={styles.dropdown1RowTxtStyle}
                    />
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    filterBar: {
        alignSelf: 'center',
        marginLeft: 40,
        marginRight: 40,
        marginBottom: 40,
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        padding: 10,
        width: '95%',
        minHeight: 50
    },
    filterSection: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8
    },
    switch: {
        marginRight: 40
    },
    dropdown1BtnStyle: {
        height: 35,
        backgroundColor: "#FFF",
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#444",
        width: 210,
        marginRight: 40
    },
    dropdown1BtnTxtStyle: { color: "#444", fontSize: 18, textAlign: "left" },
    dropdown1DropdownStyle: { backgroundColor: "#EFEFEF", },
    dropdown1RowStyle: {
        backgroundColor: "#EFEFEF",
        borderBottomColor: "#C5C5C5",
    },
    dropdown1RowTxtStyle: { color: "#444", textAlign: "left" },
})