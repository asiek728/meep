import React, { useState } from "react";
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Avatar, Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { nameToInitials } from '../helper/helper'

// Helper function to create a user and display in the Home screen
export default (props) => {
    const deviceWidth = Dimensions.get('window').width
    const iconSize = deviceWidth > 700 ? 'large' : 'medium'

    return (
        <View style={styles.itemContainer}>
            <View style={styles.nameContainer}>
                <Avatar
                    rounded
                    title={nameToInitials(props.user.name)}
                    size={iconSize}
                    source={{
                        uri:
                            'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
                    }}
                />
                <View style={styles.infoContainer}>
                    <Text style={styles.name}>{props.user.name}</Text>
                    <Text>{props.user.university}</Text>
                </View>
            </View>

            <View style={styles.interestsContainer}>
                {props.user.interests.map((name, index) => (
                    <Text key={index}>{name}</Text>
                ))}
            </View>

            <View style={styles.actionContainer}>
                <Button
                    type="clear"
                    icon={
                        <Icon
                            name="envelope"
                            size={20}
                            color="grey"
                        />
                    }
                    onPress={() => { alert('Chat request has been sent!') }}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    itemContainer: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        backgroundColor: '#ecf0f1',
        paddingTop: 12,
        paddingBottom: 12,
        borderColor: 'lightgrey',
        borderBottomWidth: 1,
    },
    nameContainer: {
        flex: 9,
        flexDirection: 'row',
        alignItems: 'center',
    },
    infoContainer: {
        justifyContent: 'center',
        marginLeft: 16,
    },
    name: {
        fontSize: 18,
        fontWeight: '600'
    },
    interestsContainer: {
        flex: 4,
        justifyContent: 'center',
    },
    actionContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    }

});