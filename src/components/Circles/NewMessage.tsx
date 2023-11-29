import React, { useEffect, useState } from 'react'
import { Platform, Pressable, SafeAreaView, StyleSheet, TextInput, View } from 'react-native'
import { Image, Input } from 'react-native-elements'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { useMutationNewMessage } from '@/utils/mutations';
import { useUserPreferenceContext } from '@/utils/context/userPreferences';
import useUserSession from '@/hooks/useUserSession';
import useImagePicker from '@/hooks/useImagePicker';
import UseAudio from '@/hooks/useAudio';
import AudioVisulizer from './AudioVisulizer';
import { MessageType } from '@/utils/types';
import { Keyboard } from 'react-native';
import { uploadCloudinaryAsset } from '@/utils/fetchers';


export default function NewMessage() {
    const input = React.createRef<TextInput>();
    const [isFocused, setIsFocused] = useState(false)
    const [message, setMessage] = useState('')
    const [imageUrl, setImageUrl] = useState('')
    const [isInAudioMode, setIsInAudioMode] = useState(false)
    const [soundUri, setSoundUri] = useState('')
    const [type, setType] = useState<MessageType["type"]>("text")
    const [content, setContent] = useState("")
    const [keyBoardHeight, setKeyBoardHeight] = useState(0)
    const { pickImage } = useImagePicker()
    const { mutateAsync: createNewMessage } = useMutationNewMessage()
    const { currentMessageId } = useUserPreferenceContext()
    const { session } = useUserSession()

    const { playSound, startRecording, stopRecording, recording, pauseSound, isPlaying } = UseAudio()
    const handlePlaySound = async () => {
        await playSound(soundUri)
    }
    const handlePauseSound = async () => {
        await pauseSound()
    }

    const handleSubmit = async () => {

        await createNewMessage({
            chat_id: currentMessageId,
            user_id: session?.user.id ?? '',
            message: {
                type,
                content: content || message
            },
            delivered: 'true'
        })
        setMessage('')
        setImageUrl('')
        setIsFocused(false)
        setIsInAudioMode(false)
    }

    const handlePickImage = async () => {
        const imageUrl = await pickImage()
        if (imageUrl) {
            setIsFocused(true)
            setImageUrl(imageUrl)
            setContent(imageUrl)
            setType("image")
        }
    }

    const handleRecording = async () => {
        setIsInAudioMode(true)
        if (recording) {
            const uri = await stopRecording()
            setSoundUri(uri!)
            setType("voice")
            setContent(uri!)
        } else {
            await startRecording()
        }
    }
    const handleOnAudioCancel = () => {
        setIsInAudioMode(false)
        setType("text")
        setContent("")
    }
    const handleAudioSubmit = async () => {
        const asset = await uploadCloudinaryAsset(soundUri)
        setType("voice")
        setContent(asset)
        handleSubmit()
    }


    const Icons = (
        <View style={{ flexDirection: "row", columnGap: 4, marginHorizontal: 4 }}>
            {!isFocused && !message.length && (<><MaterialIcons name={!recording ? "record-voice-over" : "fiber-manual-record"} size={24} color={!recording ? "black" : "red"} onPress={handleRecording} />
                <Pressable onPress={handlePickImage}><MaterialCommunityIcons name={"image-multiple-outline"} size={24} color="black" /></Pressable></>)}
            <Pressable onPress={handleSubmit}>
                <MaterialCommunityIcons name="send-circle-outline" size={!isFocused ? 24 : 32} color="black" />
            </Pressable>
        </View>
    )

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', (event) => {
            // Extract the keyboard height from the event
            const keyboardHeight = event.endCoordinates.height;
            console.log('Keyboard Height:', keyboardHeight);
            setKeyBoardHeight(prevKeyboardHeight => prevKeyboardHeight | keyboardHeight + 60)
        });
        const keyboardDidHide = Keyboard.addListener('keyboardDidHide', (event) => {
            // Extract the keyboard height from the event
            const keyboardHeight = event.endCoordinates.height;
            console.log('Keyboard Height:', keyboardHeight);
            setKeyBoardHeight(0)
        });

        // Clean up the event listener when the component unmounts
        return () => {
            console.log('Cleaning up')
            keyboardDidShowListener.remove();
            keyboardDidHide.remove()
        };
    }, []);

    return (
        <SafeAreaView>
            <View style={[styles.row, styles.maxHeight, { minHeight: keyBoardHeight > 0 ? keyBoardHeight : "auto" }]}>
                <View style={[styles.row]}>
                    <View style={{ width: '100%' }}>

                        {imageUrl && (<><Pressable style={{ position: "relative" }} onPress={() => setImageUrl('')}>
                            <Image source={{ uri: imageUrl }} style={[styles.imagePreview]} /></Pressable>
                            <MaterialCommunityIcons onPress={() => setImageUrl('')} style={styles.imageIcon} name="close-circle" size={24} color="black" /></>)}

                        {isInAudioMode && <AudioVisulizer isPlaying={isPlaying} onCancel={handleOnAudioCancel} onPlay={handlePlaySound} onPause={handlePauseSound} isRecording={Boolean(recording)} onStop={handleRecording} onSubmit={handleAudioSubmit} />}

                        {!isInAudioMode && <Input multiline numberOfLines={3} value={message} onChangeText={setMessage} onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(!isFocused)
                        } ref={input} containerStyle={styles.container} inputContainerStyle={styles.max} placeholder='Type your message ...' rightIcon={Icons} />}
                    </View>
                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
        width: "100%",
        alignItems: "flex-start",
        justifyContent: "center",
    },
    max: {
        borderWidth: 1,
        backgroundColor: 'white',
        borderRadius: 16,
        paddingHorizontal: 4,
        borderColor: '#ccc',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
            },
            android: {
                elevation: 2,
            },
        }),
    },
    maxHeight: {
        marginTop: 16,
        paddingHorizontal: 4
    },
    container: {
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        maxHeight: 100
    },
    imagePreview: {
        height: 100,
        width: 50,
        borderRadius: 8,
        marginLeft: 16,
        marginBottom: 8
    },
    imageIcon: {
        position: "absolute",
        top: -10,
        left: 50
    },
})
