import { Link } from 'react-router-dom'
import { Wine, MapPin, Clock, Phone, Instagram, Facebook } from 'lucide-react'
import { SITE } from '../config/site'

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-ink-800 bg-ink-900">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-500 text-ink-950">
              <Wine size={20} />
            </span>
            <span className="font-display text-lg font-semibold text-cream">{SITE.name}</span>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
            {SITE.tagline}. {SITE.deliveryNote}.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-cream">Navegación</h4>
          <ul className="mt-4 space-y-2.5 text-sm text-muted">
            <li><Link to="/catalogo" className="hover:text-amber-400">Catálogo</Link></li>
            <li><Link to="/nosotros" className="hover:text-amber-400">Nosotros</Link></li>
            <li><Link to="/contacto" className="hover:text-amber-400">Contacto</Link></li>
            <li><Link to="/carrito" className="hover:text-amber-400">Mi carrito</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-cream">Contacto</h4>
          <ul className="mt-4 space-y-3 text-sm text-muted">
            <li className="flex items-start gap-2.5">
              <MapPin size={16} className="mt-0.5 shrink-0 text-amber-500" /> {SITE.address}
            </li>
            <li className="flex items-start gap-2.5">
              <Clock size={16} className="mt-0.5 shrink-0 text-amber-500" /> {SITE.hours}
            </li>
            <li className="flex items-start gap-2.5">
              <Phone size={16} className="mt-0.5 shrink-0 text-amber-500" /> +{SITE.whatsapp}
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-cream">Síguenos</h4>
          <div className="mt-4 flex gap-3">
            <a href={SITE.instagram} target="_blank" rel="noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-ink-600 text-cream/80 hover:border-amber-500/60 hover:text-amber-400">
              <Instagram size={18} />
            </a>
            <a href={SITE.facebook} target="_blank" rel="noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-ink-600 text-cream/80 hover:border-amber-500/60 hover:text-amber-400">
              <Facebook size={18} />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-ink-800">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-5 text-xs text-muted sm:flex-row">
          <p>© {SITE.name}. Todos los derechos reservados.</p>
          <p className="flex items-center gap-1.5">
            <span className="rounded bg-wine px-1.5 py-0.5 font-semibold text-cream">+18</span>
            Beber con moderación. Prohibida la venta a menores de edad.
          </p>
        </div>
      </div>
    </footer>
  )
}
