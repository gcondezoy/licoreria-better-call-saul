import { Link } from 'react-router-dom'
import { Truck, ShieldCheck, Heart, Award } from 'lucide-react'
import { SITE } from '../config/site'

const values = [
  { icon: Award, title: 'Selección premium', text: 'Trabajamos con las mejores marcas nacionales e importadas, siempre originales.' },
  { icon: Truck, title: 'Delivery confiable', text: 'Llevamos tu pedido rápido y bien cuidado hasta la puerta de tu casa.' },
  { icon: ShieldCheck, title: 'Compra segura', text: 'Coordinamos por WhatsApp con pago flexible: Yape, Plin, tarjeta o efectivo.' },
  { icon: Heart, title: 'Atención cercana', text: 'Te asesoramos para elegir el trago perfecto para cada ocasión.' },
]

export default function About() {
  return (
    <div className="container-page py-12">
      <section className="mx-auto max-w-3xl text-center">
        <p className="eyebrow">Nuestra historia</p>
        <h1 className="mt-3 font-display text-4xl font-semibold text-cream sm:text-5xl">
          Sobre {SITE.name}
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-muted">
          Somos una licorería pensada para hacerte la vida más fácil. Nació con una idea simple:
          que consigas los mejores licores sin salir de casa, con la confianza de recibir productos
          originales y una atención cercana. Desde una reunión improvisada hasta una celebración
          especial, estamos para acompañarte.
        </p>
      </section>

      <section className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {values.map(({ icon: Icon, title, text }) => (
          <div key={title} className="card p-6">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-amber-500/15 text-amber-400">
              <Icon size={22} />
            </span>
            <h3 className="mt-4 font-display text-lg font-semibold text-cream">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{text}</p>
          </div>
        ))}
      </section>

      <section className="mt-16 overflow-hidden rounded-3xl border border-amber-500/20 bg-gradient-to-r from-ink-900 via-ink-900 to-wine/30 p-10 text-center">
        <h2 className="font-display text-2xl font-semibold text-cream sm:text-3xl">
          ¿Listo para tu próximo pedido?
        </h2>
        <p className="mx-auto mt-3 max-w-md text-muted">
          Explora el catálogo y arma tu pedido en minutos.
        </p>
        <Link to="/catalogo" className="btn-primary mt-6">
          Ver catálogo
        </Link>
      </section>
    </div>
  )
}
