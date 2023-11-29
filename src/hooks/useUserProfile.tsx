import { useState, useEffect } from 'react'
import { supabase } from '@/utils/supabase'
import { Session } from '@supabase/supabase-js'
import useUserSession from './useUserSession'
import { useQueryUserProfile } from '@/utils/queries'


export default function useUserProfile() {
    const { data } = useQueryUserProfile()

    useEffect(() => {

    }, [])

    return { data }
}
