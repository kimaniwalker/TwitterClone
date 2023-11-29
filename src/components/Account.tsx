import { useEffect } from 'react'
import { supabase } from '@/utils/supabase'
import { StyleSheet, View, Alert, ScrollView, Text, ActivityIndicator, KeyboardAvoidingView } from 'react-native'
import { Button, Input, Badge, LinearProgress } from 'react-native-elements'
import { Session } from '@supabase/supabase-js'
import Avatar from '@/components/Avatar'
import { useQueryUserProfile } from '@/utils/queries'
import { useMutationUpdateUserProfile } from '@/utils/mutations'
import { UserUpdateData } from '@/utils/types'
import { useForm, Controller } from "react-hook-form"
import useCurrentLocation from '@/hooks/useCurrentLocation'
import WelcomeAccountSetup from './WelcomeAccountSetup'
import { useIsFetching } from '@tanstack/react-query'


export default function Account({ session }: { session: Session }) {
    const isFetching = useIsFetching()
    const { data, isLoading: loadingUserProfile } = useQueryUserProfile()
    const { mutateAsync: updateUserProfile, isPending: updatingProfileData } = useMutationUpdateUserProfile()

    const {
        control,
        handleSubmit,
        setValue,
        trigger,
        formState: { errors, isValid },
    } = useForm<UserUpdateData>({
        defaultValues: {
            ...data
        }, mode: 'onChange'
    })
    const loading = loadingUserProfile || updatingProfileData || !isValid
    const { currentLocation, errorMsg } = useCurrentLocation()

    const onSubmit = (data: UserUpdateData) => {
        const profileData: UserUpdateData = {
            ...data,
            id: session.user.id
        }
        console.log(data)
        updateUserProfile(profileData)
    }


    useEffect(() => {
        if (data) getProfile()
        trigger()
    }, [data, trigger,])



    async function getProfile() {
        setValue("username", data.username)
        setValue("bio", data.bio)
        setValue("interest", data.interest)
        setValue("avatar_url", data.avatar_url)
        setValue("current_location", currentLocation ?? data.current_location)
    }

    async function updateImageUrl(url: string) {
        const updateData: UserUpdateData = {
            id: session.user.id,
            avatar_url: url,
        }
        console.log({ updateData })
        updateUserProfile(updateData)
    }
    if (isFetching || !currentLocation) return <LinearProgress />
    if (data && !data?.full_name || !data?.dob || !data?.gender) return <WelcomeAccountSetup session={session} />
    return (
        <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={80}>

            <View style={styles.container}>
                <ScrollView>
                    <View>
                        <Avatar avatar={data.avatar_url} full_name={data.full_name} dob={data.dob} current_location={currentLocation} updateProfile={updateImageUrl} />
                    </View>
                    <View style={[styles.verticallySpaced, styles.mt20]}>
                        <Input label="Email" value={session?.user?.email} disabled />
                    </View>

                    <Controller
                        control={control}
                        rules={{
                            required: 'This is a required field',

                        }}
                        render={({ field: { onChange, onBlur, value, }, fieldState: { error } }) => (
                            <View style={styles.verticallySpaced}>
                                <Input disabled
                                    errorMessage={error?.message} label="Username" value={value} onChangeText={onChange} onBlur={onBlur} />
                            </View>
                        )}
                        name="username"
                    />

                    <Controller
                        control={control}
                        rules={{
                            required: 'This field is required',
                            maxLength: {
                                value: 450,
                                message: 'Too many charachters'
                            }
                        }}
                        render={({ field: { onChange, onBlur, value, }, fieldState: { error } }) => (
                            <View style={styles.verticallySpaced}>
                                <Input label="About me" multiline value={value} onChangeText={onChange} onBlur={onBlur} errorMessage={error?.message} />
                            </View>
                        )}
                        name="bio"
                    />

                    <Controller
                        control={control}
                        rules={{
                            required: 'Couldn`t find your location',
                        }}
                        render={({ field: { onChange, onBlur, value, }, fieldState: { error } }) => (
                            <View style={styles.verticallySpaced}>
                                <Input disabled label="Current Location" value={value} onChangeText={onChange} onBlur={onBlur} errorMessage={error?.message} leftIcon={{ type: 'font-awesome', name: 'map-marker' }} />
                            </View>
                        )}
                        name="current_location"
                    />

                    <Controller
                        control={control}
                        rules={{
                            required: 'This field is required'
                        }}
                        render={({ field: { onChange, onBlur, value, }, fieldState: { error } }) => {

                            const tags = value?.split(",")
                            return (
                                <View style={styles.verticallySpaced}>
                                    <Input label="Interest (comma separated values)" multiline value={value} onChangeText={onChange} onBlur={onBlur} errorMessage={error?.message} />
                                    <View style={styles.row}>
                                        {tags?.map((item, index) => (
                                            <Badge key={index} badgeStyle={[styles.badgeStyles]} value={<Text>{item}</Text>} />
                                        ))}
                                    </View>
                                </View>
                            )
                        }}
                        name="interest"
                    />


                    <View style={[styles.verticallySpaced, styles.mt20]}>
                        <Button
                            title={loading ? 'Loading ...' : 'Update'}
                            onPress={handleSubmit(onSubmit)}
                            disabled={loading}
                        />
                    </View>
                    <View style={styles.verticallySpaced}>
                        <Button title="Sign Out" onPress={() => supabase.auth.signOut()} />
                    </View>
                </ScrollView>
            </View>
        </KeyboardAvoidingView>
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

    }

})