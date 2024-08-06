import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'
import { supaBaseAnonKey, supaBaseUrl } from '../../helpers/common'

export const supabase = createClient(supaBaseUrl, supaBaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})