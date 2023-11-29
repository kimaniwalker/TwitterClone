import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';


export default function useImagePicker() {

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        console.log({ result })
        if (!result.canceled) {
            const cleanFileName = result.assets[0].uri.split('/').pop(); // Extract the filename from the full path
            const sanitizedFileName = cleanFileName?.replace(/[^a-z0-9_.-]/gi, ''); // Remove invalid characters
            const photo = {
                uri: result.assets[0].uri,
                type: result.assets[0].type,
                name: sanitizedFileName,
            }

            const formData = new FormData()
            // @ts-ignore 
            formData.append('file', photo)
            formData.append("upload_preset", "n8iosg9p");
            formData.append("cloud_name", "dnssh6f9x");

            try {
                const res = await fetch("https://api.cloudinary.com/v1_1/dnssh6f9x/upload", {
                    method: "post",
                    body: formData,
                })
                const data = await res.json();
                console.log({ data })
                if (data.secure_url) {
                    return data.secure_url
                }
            } catch (error) {
                console.log(error)
            }
        }
    };

    return { pickImage }
}
