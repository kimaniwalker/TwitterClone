import MessageThumbnail from '@/components/Circles/MessageThumbnail'
import { useQueryGetUserChats } from '@/utils/queries'
import { ChatScreenProps, Circles } from '@/utils/types'
import React from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import { Text } from 'react-native-elements'

export default function CirclesScreen({ navigation }: ChatScreenProps) {
    const { data: chats } = useQueryGetUserChats()
    return (
        <ScrollView>
            <View style={styles.wrapper}>
                <Text h3 style={styles.heading}>Messages</Text>
                {chats?.map((item: Circles) => (
                    <MessageThumbnail key={item.id} {...item} />
                ))}
            </View>
        </ScrollView>
    )
}


const styles = StyleSheet.create({
    wrapper: {
        padding: 8
    },
    heading: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 8,
        marginTop: 8
    }
})