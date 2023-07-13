import * as React from 'react';
import { TextInput, StyleSheet } from 'react-native';

// Search bar class used to find people according to the keywords
export default class SearchBar extends React.Component {

    constructor(props) {
        super(props)
    }

    render() {
        return (
            <TextInput style={styles.searchbar} onChangeText={(e) => { this.props.updateSearchTerm(e) }}
                placeholder='Search for new friends! What are your interests?'
            />
        )
    }
}

const styles = StyleSheet.create({
    searchbar: {
        alignSelf: 'center',
        margin: 40,
        marginBottom: 0,
        padding: 10,
        borderRadius: 25,
        backgroundColor: "#fff",
        width: '95%',
        height: 50
    },
})