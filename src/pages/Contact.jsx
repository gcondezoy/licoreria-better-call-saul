import { MapPin, Clock, Phone, Mail, MessageCircle } from 'lucide-react'
import { SITE } from '../config/site'

export default function Contact() {
  const info = [
    { icon: MapPin, title: 'Dirección', value: SITE.address },
    { icon: Clock, title: 'Horario', value: SITE.hours },
    { icon: Phone, title: 'WhatsApp', value: `+${SITE.whatsapp}` },
    { icon: Mail, title: 'Correo', value: SITE.email },
  ]

  return (
    <div className="container-page py-12">
      <header className="max-w-2xl">
        <p className="eyebrow">Estamos para ayudarte</p>
        <h1 className="mt-3 font-display text-4xl font-semibold text-cream sm:text-5xl">Contacto</h1>
        <p className="mt-4 text-muted">
          Escríbenos por WhatsApp para hacer tu pedido o resolver cualquier duda. Respondemos
          rápido dentro de nuestro horario de atención.
        </p>
      </header>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          {info.map(({ icon: Icon, title, value }) => (
            <div key={title} className="card flex items-start gap-4 p-5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-amber-500/15 text-amber-400">
                <Icon size={20} />
              </span>
              <div>
                <p className="text-xs uppercase tracking-wider text-muted">{title}</p>
                <p className="mt-0.5 font-medium text-cream">{value}</p>
              </div>
            </div>
          ))}

          <a
            href={`https://wa.me/${SITE.whatsapp}`}
            target="_blank"
            rel="noreferrer"
            className="btn-primary w-full"
          >
            <MessageCircle size={18} /> Escribir por WhatsApp
          </a>
        </div>

        {/* Mapa (placeholder listo para incrustar el iframe real de Google Maps) */}
        <div className="card flex min-h-[320px] items-center justify-center overflow-hidden bg-ink-800 text-center">
          <div className="p-8">
            <MapPin size={40} className="mx-auto text-amber-500" />
            <p className="mt-4 font-display text-lg text-cream">{SITE.address}</p>
            <p className="mt-2 text-sm text-muted">
              Aquí se incrustará el mapa de Google Maps de la ubicación real.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
