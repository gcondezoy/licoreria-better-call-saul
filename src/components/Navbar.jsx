import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { ShoppingBag, Menu, X, Wine, Search } from 'lucide-react'
import { useCart } from '../store/cartStore'
import { SITE } from '../config/site'

const links = [
  { to: '/', label: 'Inicio', end: true },
  { to: '/catalogo', label: 'Catálogo' },
  { to: '/nosotros', label: 'Nosotros' },
  { to: '/contacto', label: 'Contacto' },
]

export default function Navbar() {
  const count = useCart((s) => s.count())
  const openDrawer = useCart((s) => s.openDrawer)
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-40 border-b border-ink-800/80 bg-ink-950/85 backdrop-blur-xl">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-500 text-ink-950">
            <Wine size={20} />
          </span>
          <span className="font-display text-lg font-semibold leading-none text-cream">
            {SITE.name}
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                `rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  isActive ? 'text-amber-400' : 'text-cream/80 hover:text-cream'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/catalogo')}
            aria-label="Buscar productos"
            className="hidden h-10 w-10 items-center justify-center rounded-full text-cream/80 hover:bg-ink-800 hover:text-cream sm:inline-flex"
          >
            <Search size={19} />
          </button>

          <button
            onClick={openDrawer}
            aria-label="Ver carrito"
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-full text-cream hover:bg-ink-800"
          >
            <ShoppingBag size={20} />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-500 px-1 text-[11px] font-bold text-ink-950">
                {count}
              </span>
            )}
          </button>

          <button
            onClick={() => setOpen((v) => !v)}
            aria-label="Abrir menú"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-cream hover:bg-ink-800 md:hidden"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Menú móvil */}
      {open && (
        <nav className="border-t border-ink-800 bg-ink-950 md:hidden">
          <div className="container-page flex flex-col py-2">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-3 text-sm font-medium ${
                    isActive ? 'text-amber-400' : 'text-cream/80'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </div>
        </nav>
      )}
    </header>
  )
}
