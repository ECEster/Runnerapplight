import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

/** null zolang .env.local niet is ingevuld — de site gebruikt dan voorbeelddata. */
export const supabase: SupabaseClient | null = url && key ? createClient(url, key) : null

export const EVENTS_TABLE = import.meta.env.VITE_EVENTS_TABLE || 'events'
