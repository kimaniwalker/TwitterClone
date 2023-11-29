import React from 'react'
import { StyleSheet, View, Text, Pressable } from 'react-native'
import { Badge, LinearProgress } from 'react-native-elements';
import MessageAvatar from '../Avatar/MessageAvatar';
import { Circles, MessagesScreenNavigationProp } from '@/utils/types';
import { useNavigation } from '@react-navigation/native';
import { useQueryGetChatAvatars } from '@/utils/queries';

type MessageThumbnailProps = Circles

export default function MessageThumbnail({ members, name, created_at, id }: MessageThumbnailProps) {
    const navigation = useNavigation<MessagesScreenNavigationProp>();
    const { data: avatars, isLoading } = useQueryGetChatAvatars(members.split(','), id)

    if (!avatars || isLoading) return <LinearProgress />
    return (
        <View style={styles.card}>
            <Pressable onPress={() => navigation.navigate("Messages", {
                id,
                members
            })}>
                <View style={[styles.row, styles.borderBottom]}>
                    <MessageAvatar members={avatars} />
                    <View style={[styles.row, styles.spaceBetween]}>
                        <Text style={styles.messagePreviewText}>{name.substring(0, 35)}</Text>
                        <View style={styles.alignEnd}>
                            <Text>{created_at.substring(10, 18)}</Text>
                            <Badge value={10} status="primary" />
                        </View>
                    </View>
                </View>
            </Pressable>
        </View>
    )



}

const styles = StyleSheet.create({
    row: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        padding: 8,
    },
    spaceBetween: {
        flex: 1,
        justifyContent: "space-between",
    },
    alignEnd: {
        alignItems: "flex-end"
    },
    borderBottom: {
        borderBottomWidth: 2,
        borderColor: "lightgray",
        borderRadius: 16
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        margin: 16
    },
    messagePreviewText: {
        maxWidth: 175
    },
    card: {
        backgroundColor: "white",
        borderRadius: 16,
        marginTop: 8,
        marginBottom: 8
    }
})