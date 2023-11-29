import React from 'react'
import { AVPlaybackStatus, Audio } from 'expo-av';

export default function useAudio() {
    const [recording, setRecording] = React.useState<Audio.Recording>();
    const [sound, setSound] = React.useState<Audio.Sound>();
    const [isPlaying, setIsPlaying] = React.useState(false)

    async function playSound(soundUrl: string) {
        console.log('Loading Sound');
        const { sound } = await Audio.Sound.createAsync({ uri: soundUrl }, { shouldPlay: true });
        setSound(sound);
        setIsPlaying(true)

        console.log('Playing Sound');
        await sound.playAsync();
    }

    async function pauseSound() {
        console.log('pausing Sound');
        setIsPlaying(false)
        await sound?.pauseAsync();
    }


    React.useEffect(() => {
        return sound
            ? () => {
                console.log('Unloading Sound');
                sound.unloadAsync();
            }
            : undefined;
    }, [sound]);

    React.useEffect(() => {
        const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
            if (status.isLoaded) {
                if (status.isPlaying) {
                    setIsPlaying(true)
                    console.log('is playing')
                } else if (status.didJustFinish) {
                    console.log('just finished')
                    setIsPlaying(false)
                    // You can perform any actions you need when the audio finishes here.
                } else if (status.isBuffering) {

                }
            } else {

            }
        };

        sound?.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
    }, [sound]);

    async function startRecording() {
        try {
            console.log('Requesting permissions..');
            await Audio.requestPermissionsAsync();
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });

            console.log('Starting recording..');
            const { recording, status } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY
            )

            setRecording(recording);
            console.log('Recording started');


        } catch (err) {
            console.error('Failed to start recording', err);
        }
    }

    async function stopRecording() {
        console.log('Stopping recording..');
        setRecording(undefined);
        await recording?.stopAndUnloadAsync();
        await Audio.setAudioModeAsync(
            {
                allowsRecordingIOS: false,
            }
        );
        const uri = recording?.getURI();
        console.log('Recording stopped and stored at', uri);
        return uri
    }

    return { startRecording, stopRecording, playSound, recording, pauseSound, isPlaying, }
}



