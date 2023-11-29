import useUserSession from '@/hooks/useUserSession';
import { MessagesByChatId, getChatAvatarsQueryKey, getMessagesByChatIdQueryKey, useQueryGetChatAvatars, useQueryGetMessagesByChatId } from '@/utils/queries';
import { supabase } from '@/utils/supabase';
import { MessageScreenProps } from '@/utils/types';
import React from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { queryClient } from '@/utils/queryClient';
import MessageAvatar from '@/components/Avatar/MessageAvatar';
import { Avatar, LinearProgress } from 'react-native-elements';
import { useUserPreferenceContext } from '@/utils/context/userPreferences';
import { useFocusEffect } from '@react-navigation/native';
import MessageBubble from '@/components/Circles/MessageBubble';



type AvatarImages = {
    avatar_url: string
    id: string
}
export default function MessagesScreen({ route, navigation }: MessageScreenProps) {
    const { id, members } = route.params;
    const { data } = useQueryGetMessagesByChatId(id)
    const avatars: AvatarImages[] | undefined = queryClient.getQueryData(getChatAvatarsQueryKey(members.split(','), id)) ?? []
    const { session } = useUserSession()
    const { setHideTabNavigation, setCurrentMessageId } = useUserPreferenceContext()

    useFocusEffect(
        React.useCallback(() => {
            setHideTabNavigation(true)
            setCurrentMessageId(id)
            const channel = supabase
                .channel(`${id}`)
                .on(
                    'postgres_changes',
                    {
                        event: '*',
                        schema: 'public',
                        table: 'messages',
                        filter: `chat_id=eq.${id}`,
                    },
                    (payload) => {
                        console.log(payload)
                        queryClient.invalidateQueries({ queryKey: [MessagesByChatId] })
                    }
                )
                .subscribe()

            return () => {
                setHideTabNavigation(false)
                setCurrentMessageId('')
                channel.unsubscribe()
            };
        }, [setHideTabNavigation])
    );

    const getAvatar = (id: string) => {
        const avatar = avatars.find((item) => item.id === id)
        return avatar?.avatar_url
    }

    if (!data || !avatars) return <LinearProgress />
    return (
        <>
            <View style={{ flexDirection: "row", alignItems: "center" }}><MessageAvatar members={avatars!} /><Text style={styles.font}>Members</Text></View>
            <ScrollView style={styles.pad}>
                {data.map((item) => {
                    const avatar = getAvatar(item.user_id)
                    console.log({ avatar })
                    if (item.user_id === session?.user.id) return (<View key={item.id} style={styles.row} >
                        <Avatar source={{ uri: avatar }} size="small" rounded />
                        <MessageBubble type={item.message.type} content={item.message.content} />
                    </View>
                    )
                    return <View key={item.id} style={[styles.row, styles.end]} >
                        <MessageBubble type={item.message.type} content={item.message.content} isFriendBubble />
                        <Avatar source={{ uri: avatar }} size="small" rounded />
                    </View>

                })}
            </ScrollView>
        </>
    )
}

const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
        position: "relative",
        alignItems: "center",
    },
    end: {
        alignSelf: "flex-end",
    },
    pad: {
        padding: 8
    },
    font: {
        fontSize: 24
    }
})
