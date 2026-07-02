import { createContext, useContext, useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

const AuthContext = createContext(null)
const DEMO_KEY = 'licoreria_demo_admin'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isSupabaseConfigured) {
      // Modo demo: recuperar sesión falsa de localStorage.
      const saved = localStorage.getItem(DEMO_KEY)
      if (saved) setUser(JSON.parse(saved))
      setLoading(false)
      return
    }
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null)
      setLoading(false)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
    })
    return () => sub.subscription.unsubscribe()
  }, [])

  async function signIn(email, password) {
    if (!isSupabaseConfigured) {
      // Demo: acepta cualquier email/clave (mín. 4 caracteres) para explorar el panel.
      if (!email || (password || '').length < 4) {
        throw new Error('Ingresa un email y una contraseña de al menos 4 caracteres.')
      }
      const demoUser = { id: 'demo-admin', email, demo: true }
      localStorage.setItem(DEMO_KEY, JSON.stringify(demoUser))
      setUser(demoUser)
      return demoUser
    }
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return data.user
  }

  async function signOut() {
    if (!isSupabaseConfigured) {
      localStorage.removeItem(DEMO_KEY)
      setUser(null)
      return
    }
    await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut, isDemo: !isSupabaseConfigured }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>')
  return ctx
}
