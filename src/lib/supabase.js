import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL?.trim()
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim()

// La app funciona en "modo demo" con datos de ejemplo cuando Supabase no está
// configurado. En cuanto completes las variables en .env, se conecta a la BD real.
export const isSupabaseConfigured = Boolean(
  url && anonKey && url.startsWith('http') && !url.includes('TU-PROYECTO'),
)

export const supabase = isSupabaseConfigured
  ? createClient(url, anonKey, {
      auth: { persistSession: true, autoRefreshToken: true },
    })
  : null
