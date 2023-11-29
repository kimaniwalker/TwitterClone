import 'react-native-url-polyfill/auto'
import Account from '@/components/Account'
import { View } from 'react-native'
import Auth from '@/components/Auth'
import useUserSession from '@/hooks/useUserSession'

export default function AccountScreen() {

    const { session } = useUserSession()

    return (
        <View>
            {session && session.user ? <Account key={session.user.id} session={session} /> : <Auth />}
        </View>
    )
}
