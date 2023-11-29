import React, { useEffect, useState } from 'react'
import { View, StyleSheet, Text } from 'react-native'
import { Avatar, Badge } from 'react-native-elements';

type Members = {
    avatar_url: string
}
export default function MessageAvatar({ members }: { members: Members[] }) {


    return (
        <View style={styles.row}>
            {members.slice(0, 3).map((item, index) => (
                <Avatar key={index} size="medium" rounded source={{ uri: item.avatar_url }} containerStyle={{
                    position: index > 0 ? "absolute" : "relative",
                    left: index * 20
                }} />
            ))}
        </View>
    )

}

const styles = StyleSheet.create({
    row: {
        display: "flex",
        flexDirection: "row",
        minHeight: 75,
        minWidth: 100,
        justifyContent: "flex-start",
        alignItems: "center",
    },
})