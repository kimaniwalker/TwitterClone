import 'react-native-url-polyfill/auto'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tiqwkxuqkelipjmvfweg.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRpcXdreHVxa2VsaXBqbXZmd2VnIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTcxNjYyMjEsImV4cCI6MjAxMjc0MjIyMX0.eOswcd5z4Sbf2f2tN_9E1RuYtdJZ_udnM7Zl0iQqpvI'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})