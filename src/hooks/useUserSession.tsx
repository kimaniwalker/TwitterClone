
import { useState, useEffect } from 'react'
import { supabase } from '@/utils/supabase'
import { Session } from '@supabase/supabase-js'


export default function useUserSession() {

    const [session, setSession] = useState<Session | null>(null)


    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session)
        })

        supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
        })
    }, [])

    return { session }
}
