import React, { useState, useEffect } from 'react';
import { Platform, } from 'react-native';
import Device from 'expo-device';
import * as Location from 'expo-location';

export default function useCurrentLocation() {
    const [location, setLocation] = useState<Location.LocationObject>();
    const [errorMsg, setErrorMsg] = useState('');
    const [status, setStatus] = useState<Location.PermissionStatus>();
    const [reverseLocation, setReverseLocation] = useState<Location.LocationGeocodedAddress[]>()

    useEffect(() => {
        (async () => {
            if (Platform.OS === 'android' && !Device.isDevice) {
                setErrorMsg(
                    'Oops, this will not work on Snack in an Android Emulator. Try it on your device!'
                );
                return;
            }
            let { status } = await Location.requestForegroundPermissionsAsync();
            setStatus(status)
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);
            let reverseLocation = location && await Location.reverseGeocodeAsync({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude
            })
            setReverseLocation(reverseLocation)
        })();
    }, []);


    const currentLocation = reverseLocation && `${reverseLocation[0].city}, ${reverseLocation[0].region}`


    return { location, errorMsg, status, currentLocation }
}


