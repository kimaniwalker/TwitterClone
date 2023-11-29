import { useState, useEffect } from 'react'
import { supabase } from '@/utils/supabase'
import { StyleSheet, View, Alert, ScrollView, Text } from 'react-native'
import { Button, Input, Badge } from 'react-native-elements'
import { Session } from '@supabase/supabase-js'
import Avatar from '@/components/Avatar'
import { useQueryUserProfile } from '@/utils/queries'
import { useMutationUpdateUserProfile } from '@/utils/mutations'
import { UserUpdateData } from '@/utils/types'
import { useForm, Controller } from "react-hook-form"
import useCurrentLocation from '@/hooks/useCurrentLocation'

export default function WelcomeAccountSetup({ session }: { session: Session }) {
    const { mutateAsync: updateUserProfile, isPending: updatingProfileData } = useMutationUpdateUserProfile()
    const { currentLocation, errorMsg } = useCurrentLocation()

    const {
        control,
        handleSubmit,
        setValue,
        trigger,
        formState: { errors, isValid },
    } = useForm<UserUpdateData>({
        defaultValues: {
            id: session.user.id,
            current_location: currentLocation
        }, mode: 'onChange'
    })
    const onSubmit = (data: UserUpdateData) => {
        updateUserProfile({ ...data })
    }
    const validateGender = (value: string | undefined) => {
        if (value === 'M' || value === 'F') {
            return true; // Valid input
        }
        return 'Invalid gender. Please enter "M" or "F".';
    };

    useEffect(() => {
        setValue('id', session.user.id)
        setValue('current_location', currentLocation)
        trigger()
    }, [trigger, currentLocation])

    return (
        <>
            <View style={styles.container}>
                <ScrollView>
                    <Text style={styles.heading}>Welcome</Text>
                    <Text style={[styles.subheading, styles.mt20]}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsum odio magni dolores quidem voluptatem perspiciatis aliquam error enim tempore deserunt, maxime ducimus sequi eos accusantium necessitatibus maiores, quasi tempora. Numquam.</Text>
                    <Controller
                        control={control}
                        rules={{
                            required: 'This is a required field',
                            minLength: {
                                value: 8,
                                message: 'Must be at least 8 charachters'
                            }

                        }}
                        render={({ field: { onChange, onBlur, value, }, fieldState: { error } }) => (
                            <View style={[styles.verticallySpaced, styles.mt20]}>
                                <Input
                                    errorMessage={error?.message} label="Full Name" value={value} onChangeText={onChange} onBlur={onBlur} />
                            </View>
                        )}
                        name="full_name"
                    />
                    <Controller
                        control={control}
                        rules={{
                            required: 'This is a required field',
                            maxLength: {
                                value: 1,
                                message: 'To many charachters must be M or F ',
                            },
                            validate: validateGender,

                        }}
                        render={({ field: { onChange, onBlur, value, }, fieldState: { error } }) => (
                            <View style={styles.verticallySpaced}>
                                <Input
                                    errorMessage={error?.message} label="Gender" value={value} onChangeText={onChange} onBlur={onBlur} />
                            </View>
                        )}
                        name="gender"
                    />
                    <Controller
                        control={control}
                        rules={{
                            required: 'This is a required field',
                            pattern: {
                                value: /^(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])-\d{4}$/,
                                message: 'Date should be in the following format MM-DD-YYYY'
                            }
                        }}
                        render={({ field: { onChange, onBlur, value, }, fieldState: { error } }) => (
                            <View style={styles.verticallySpaced}>
                                <Input
                                    errorMessage={error?.message} label="Birthday" value={value} onChangeText={onChange} onBlur={onBlur} />
                            </View>
                        )}
                        name="dob"
                    />
                    <Controller
                        control={control}
                        defaultValue={currentLocation}
                        rules={{
                            required: 'Couldn`t find your location',
                        }}
                        render={({ field: { onChange, onBlur, value, }, fieldState: { error, } }) => (
                            <View style={styles.verticallySpaced}>
                                <Input disabled label="Current Location" value={value} onChangeText={onChange} onBlur={onBlur} errorMessage={error?.message} leftIcon={{ type: 'font-awesome', name: 'map-marker' }} />
                            </View>
                        )}
                        name="current_location"
                    />
                    <View style={[styles.verticallySpaced, styles.mt20]}>
                        <Button
                            title={'Continue'}
                            onPress={handleSubmit(onSubmit)}
                            disabled={false}
                        />
                    </View>
                    <View style={styles.verticallySpaced}>
                        <Button title="Sign Out" onPress={() => supabase.auth.signOut()} />
                    </View>
                </ScrollView>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 12,
    },
    verticallySpaced: {
        paddingTop: 4,
        paddingBottom: 4,
        alignSelf: 'stretch',
    },
    mt20: {
        marginTop: 20,
    },
    row: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    badgeStyles: {
        margin: 4,
        padding: 8,
        height: 32,
        borderRadius: 16
    },
    heading: {
        fontSize: 24
    },
    subheading: {
        fontSize: 16
    }

})
