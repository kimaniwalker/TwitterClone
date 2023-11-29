import { useState } from 'react'
import { View, Image, StyleSheet, Pressable, } from 'react-native'
import { Text } from 'react-native-elements';
import { MaterialIcons } from '@expo/vector-icons';
import useImagePicker from '@/hooks/useImagePicker';




export default function Avatar({ avatar, updateProfile, dob, current_location, full_name }: { avatar: string, updateProfile: (url: string) => void, dob: string, current_location: string, full_name: string }) {

    const [avatarUrl, setAvatarUrl] = useState(avatar)
    const { pickImage } = useImagePicker()

    const handleImageUpload = async () => {
        const image = await pickImage()
        setAvatarUrl(image)
        updateProfile(image)
    }
    function calculateAge(dateOfBirth: string) {
        const dob = new Date(dateOfBirth);
        const today = new Date();

        // Calculate age based on the year difference
        let age = today.getFullYear() - dob.getFullYear();

        // Check if the birthday has occurred this year
        const monthDiff = today.getMonth() - dob.getMonth();
        const dayDiff = today.getDate() - dob.getDate();

        if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
            age--;
        }

        return age;
    }

    return (
        <>
            <View style={styles.row}>
                <Pressable onPress={handleImageUpload} style={styles.container}>
                    {avatarUrl && <Image source={{ uri: avatarUrl }} style={styles.avatar} />}
                    {!avatarUrl && <Image source={require('../../assets/blank_profile.png')} style={styles.avatar} />}
                    <View style={styles.plusIcon}><MaterialIcons name="add-circle" size={48} color="black" />
                    </View>
                </Pressable>
                <View style={styles.content}>
                    <Text h4>{full_name}</Text>
                    <Text h4 h4Style={styles.textContent}>{calculateAge(dob)}</Text>
                    <Text h4 h4Style={styles.textContent}>{current_location}</Text>
                </View>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 12,
        position: 'relative',
        maxWidth: 112,
        marginRight: 40
    },
    shadow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    avatar: { width: 100, height: 100, borderRadius: 50, },
    plusIcon: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: 'white',
        borderRadius: 24
    },
    row: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    content: {
        justifyContent: "center"
    },
    textContent: {
        fontSize: 18
    }
})

