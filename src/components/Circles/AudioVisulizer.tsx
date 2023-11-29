import React, { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import LottieView from 'lottie-react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';


type VisualizerProps = {
    onPlay: () => void
    onStop: () => void
    onPause: () => void
    onSubmit: () => void
    isRecording: boolean
    onCancel: () => void
    isPlaying: boolean
}
export default function AudioVisulizer({ onPlay, onStop, onPause, isRecording, onSubmit, onCancel, isPlaying }: VisualizerProps) {

    const animation = useRef<LottieView>(null);

    const handlePlaySound = () => {
        animation.current?.reset()
        animation.current?.play()
        onPlay()
    }
    const handleStop = () => {
        animation.current?.pause()
        onStop()
    }
    const handlePause = () => {
        animation.current?.pause()
        onPause()
    }
    const handlePlayOrPause = isPlaying ? handlePause : handlePlaySound


    useEffect(() => {
        if (!isPlaying) animation.current?.pause()
    }, [isPlaying])

    useEffect(() => {
        animation.current?.play()
    }, [])




    return (<>
        <View style={[styles.row]}>
            {!isRecording && <Pressable onPress={onCancel} style={{ marginHorizontal: 8 }}><MaterialCommunityIcons name="close-circle" size={32} color="black" /></Pressable>}

            <View style={styles.animationContainer}>
                <LottieView
                    ref={animation}
                    style={{
                        backgroundColor: '#eee',
                        borderRadius: 50,
                    }}
                    source={require('../../../assets/audio_waveform.json')}
                />

                {isRecording && (<><Pressable><MaterialIcons name="fiber-manual-record" size={32} color="red" /></Pressable><Pressable onPress={handleStop}><MaterialCommunityIcons name="stop-circle-outline" size={32} color="black" /></Pressable></>)}

                {!isRecording && (<><Pressable onPress={handlePlayOrPause}><MaterialIcons name={!isPlaying ? 'play-circle-outline' : 'pause-circle-outline'} size={32} color="black" /></Pressable><Pressable onPress={onSubmit}>
                    <MaterialCommunityIcons name="send-circle-outline" size={32} color="blue" />
                </Pressable></>)}
            </View>
        </View>
    </>
    );
}

const styles = StyleSheet.create({
    animationContainer: {
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: "space-between",
        height: 40,
        borderRadius: 200,
        marginVertical: 8,
        flex: 1
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 16
    }
});
