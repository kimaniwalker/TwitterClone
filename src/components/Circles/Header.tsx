import React from 'react'
import { SafeAreaView, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet } from 'react-native';

export default function Header({ navigation }: { navigation: any }) {


    return (
        <SafeAreaView>
            <View style={styles.row}>
                <Ionicons onPress={() => navigation.navigate('CreateNewChat')} name="ios-create-outline" size={32} color="black" />
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingHorizontal: 16
    }
})
