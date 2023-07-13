import * as React from 'react';
import { StyleSheet, Text } from 'react-native';
import { View, ScrollView } from 'react-native';
import UserRecommendation from './UserRecommendation';

// Helper class to display the details of the users
export default class SearchBar extends React.Component {
    render() {
        const recommendations = this.props.users.map(user => {
            return (<UserRecommendation user={user} key={user.id} />)
        });

        return (
            <View style={styles.container}>
                <Text style={styles.paragraph}>
                    Results:
                </Text>
                <ScrollView>
                    {recommendations}
                </ScrollView>
            </View>
        );
    }
}

// Definition of the styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ecf0f1',
        padding: 8,
    },
    paragraph: {
        marginBottom: 16,
        fontSize: 22,
        fontWeight: 'bold',
    },
});
