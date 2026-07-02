import { Truck, ShieldCheck, Clock, Wallet } from 'lucide-react'
import { SITE } from '../config/site'

const features = [
  { icon: Truck, title: 'Delivery a tu puerta', text: SITE.deliveryNote },
  { icon: Clock, title: 'Entrega rápida', text: 'Coordinamos al instante por WhatsApp' },
  { icon: ShieldCheck, title: '100% originales', text: 'Solo productos garantizados' },
  { icon: Wallet, title: 'Paga como quieras', text: 'Yape, Plin, tarjeta o efectivo' },
]

const methods = ['Yape', 'Plin', 'Visa', 'Mastercard', 'Efectivo']

export default function TrustStrip() {
  return (
    <section className="container-page py-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {features.map(({ icon: Icon, title, text }) => (
          <div key={title} className="card flex items-start gap-3.5 p-5">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-500/15 text-amber-400">
              <Icon size={22} />
            </span>
            <div>
              <p className="text-sm font-semibold text-cream">{title}</p>
              <p className="mt-0.5 text-xs leading-relaxed text-muted">{text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Métodos de pago */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
        <span className="text-xs uppercase tracking-wider text-muted">Aceptamos:</span>
        {methods.map((m) => (
          <span
            key={m}
            className="rounded-lg border border-ink-700 bg-ink-800/60 px-3 py-1.5 text-xs font-semibold text-cream/80"
          >
            {m}
          </span>
        ))}
      </div>
    </section>
  )
}
