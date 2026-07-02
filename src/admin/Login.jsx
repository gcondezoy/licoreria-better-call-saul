import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { Wine, Lock, Loader2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { user, signIn, isDemo } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (user) return <Navigate to="/admin" replace />

  async function submit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signIn(email, password)
    } catch (err) {
      setError(err.message || 'No se pudo iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-950 p-5">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-500 text-ink-950">
            <Wine size={26} />
          </span>
          <h1 className="mt-5 font-display text-2xl font-semibold text-cream">Panel de control</h1>
          <p className="mt-1 text-sm text-muted">Ingresa para gestionar tu licorería</p>
        </div>

        <form onSubmit={submit} className="card space-y-4 p-6">
          <div>
            <label className="label">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
              placeholder="admin@licoreria.pe"
              required
            />
          </div>
          <div>
            <label className="label">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <p className="rounded-lg bg-wine/20 px-3 py-2 text-sm text-wine-light">{error}</p>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Lock size={16} />}
            {loading ? 'Ingresando…' : 'Ingresar'}
          </button>

          {isDemo && (
            <p className="rounded-lg border border-amber-500/20 bg-amber-500/10 px-3 py-2.5 text-center text-xs text-amber-400">
              Modo demo: ingresa cualquier email y una contraseña de 4+ caracteres para explorar el
              panel.
            </p>
          )}
        </form>
      </div>
    </div>
  )
}
