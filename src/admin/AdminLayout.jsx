import { useState } from 'react'
import { NavLink, Outlet, Navigate, Link, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Package,
  ClipboardList,
  Tags,
  LogOut,
  Wine,
  Menu,
  X,
  ExternalLink,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { Spinner } from '../components/ui'

const nav = [
  { to: '/admin', end: true, icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/productos', icon: Package, label: 'Productos' },
  { to: '/admin/pedidos', icon: ClipboardList, label: 'Pedidos' },
  { to: '/admin/categorias', icon: Tags, label: 'Categorías y marcas' },
]

export default function AdminLayout() {
  const { user, loading, signOut, isDemo } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  if (loading) return <Spinner label="Cargando panel…" />
  if (!user) return <Navigate to="/admin/login" replace />

  async function handleLogout() {
    await signOut()
    navigate('/admin/login')
  }

  const SidebarContent = (
    <>
      <div className="flex items-center gap-2.5 px-6 py-5">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-500 text-ink-950">
          <Wine size={19} />
        </span>
        <span className="font-display text-base font-semibold text-cream">Panel · Licorería</span>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {nav.map(({ to, end, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-amber-500/15 text-amber-400'
                  : 'text-cream/70 hover:bg-ink-800 hover:text-cream'
              }`
            }
          >
            <Icon size={19} /> {label}
          </NavLink>
        ))}
      </nav>

      <div className="space-y-1 border-t border-ink-800 px-3 py-3">
        <Link
          to="/"
          target="_blank"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-cream/70 hover:bg-ink-800 hover:text-cream"
        >
          <ExternalLink size={18} /> Ver la web
        </Link>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-cream/70 hover:bg-ink-800 hover:text-wine-light"
        >
          <LogOut size={18} /> Cerrar sesión
        </button>
        <p className="truncate px-3 pt-2 text-xs text-muted">{user.email}</p>
      </div>
    </>
  )

  return (
    <div className="min-h-screen bg-ink-950 lg:flex">
      {/* Sidebar desktop */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-ink-800 bg-ink-900 lg:flex">
        {SidebarContent}
      </aside>

      {/* Sidebar móvil */}
      {open && (
        <>
          <div className="fixed inset-0 z-40 bg-ink-950/70 lg:hidden" onClick={() => setOpen(false)} />
          <aside className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-ink-800 bg-ink-900 lg:hidden">
            {SidebarContent}
          </aside>
        </>
      )}

      <div className="flex-1">
        {/* Topbar móvil */}
        <div className="flex items-center justify-between border-b border-ink-800 bg-ink-900 px-4 py-3 lg:hidden">
          <button onClick={() => setOpen(true)} className="text-cream" aria-label="Abrir menú">
            <Menu size={22} />
          </button>
          <span className="font-display font-semibold text-cream">Panel</span>
          <div className="w-6" />
        </div>

        {isDemo && (
          <div className="border-b border-amber-500/20 bg-amber-500/10 px-6 py-2 text-center text-xs text-amber-400">
            Modo demo · los cambios se guardan solo en esta sesión. Conecta Supabase para persistir.
          </div>
        )}

        <main className="p-5 sm:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
