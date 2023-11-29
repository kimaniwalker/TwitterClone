import React, { useRef, useState } from 'react'
import { Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Video, Audio } from 'expo-av';
import { MessageType } from '@/utils/types';
import LottieView from 'lottie-react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function MessageBubble({ type, content, isFriendBubble = false }: MessageType & { isFriendBubble?: boolean }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const animation = useRef<LottieView>(null);

    const sound = new Audio.Sound();


    const TextBubble = () => (
        <View style={[styles.messageBubble, isFriendBubble && styles.friendBubble]}>
            <Text style={{ color: '#241239' }}>{content}</Text>
        </View>
    )
    const ImageBubble = () => (
        <View style={[styles.messageBubble, isFriendBubble && styles.friendBubble]}>
            <Image style={{ borderRadius: 35 }} width={200} height={200} resizeMode="contain" source={{ uri: content }} />
        </View>
    )
    const VideoBubble = () => (
        <View style={[styles.messageBubble, isFriendBubble && styles.friendBubble]}>
            <Video
                source={{ uri: content }}
                rate={1.0}
                volume={1.0}
                isMuted={false}
                shouldPlay={false}
                isLooping={false}
                style={styles.video}
            />
        </View>
    )
    const togglePlayback = async () => {
        if (isPlaying) {
            await sound.unloadAsync();
            animation?.current?.pause()
        } else {
            animation?.current?.play()
            await sound.loadAsync({ uri: content });
            await sound.playAsync();
        }
        setIsPlaying(!isPlaying);
    }

    const AudioMessageBubble = () => (
        <TouchableOpacity onPress={togglePlayback}>
            <View style={[styles.messageBubble, isFriendBubble && styles.friendBubble, styles.row]}>
                <><Pressable onPress={togglePlayback}><MaterialIcons name={!isPlaying ? 'play-circle-outline' : 'pause-circle-outline'} size={24} color="black" /></Pressable></>
                <LottieView
                    autoPlay={isPlaying ? true : false}
                    progress={isPlaying ? 0 : 1}
                    ref={animation}
                    style={{
                        width: '100%',
                        height: 'auto'
                    }}
                    source={require('../../../assets/audio_waveform.json')}
                />
            </View>
        </TouchableOpacity>
    )


    const getMessageBubbleStyle = (type: MessageType['type']) => {
        switch (type) {
            case 'voice':
                return <AudioMessageBubble />
            case 'video':
                return <VideoBubble />
            case 'image':
                return <ImageBubble />
            default:
                return <TextBubble />
        }

    };

    const Message = getMessageBubbleStyle(type)
    return Message
}

const styles = StyleSheet.create({
    messageBubble: {
        minHeight: 47,
        padding: 8,
        margin: 8,
        borderRadius: 8,
        backgroundColor: "whitesmoke",
        justifyContent: "center",
        maxWidth: 275,
        borderBottomLeftRadius: 2,
    },
    video: {
        width: '100%',
        height: 150, // Adjust the height as needed
        borderRadius: 10,
    },
    friendBubble: {
        backgroundColor: "lightblue",
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    }

})