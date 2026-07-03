import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  Check,
  User,
  Phone,
  MapPin,
  Loader2,
} from 'lucide-react'
import { useCart } from '../store/cartStore'
import { createOrder } from '../data/api'
import { buildWhatsappUrl } from '../lib/whatsapp'
import ProductImage from '../components/ProductImage'
import WhatsappGlyph from '../components/WhatsappGlyph'
import Turnstile from '../components/Turnstile'
import { EmptyState } from '../components/ui'
import { formatPrice, isCaptchaEnabled, SITE } from '../config/site'

const schema = z.object({
  name: z.string().min(3, 'Ingresa tu nombre completo'),
  phone: z
    .string()
    .min(6, 'Ingresa un teléfono válido')
    .regex(/^[0-9+\s-]+$/, 'Solo números'),
  address: z.string().min(6, 'Ingresa tu dirección de entrega'),
  notes: z.string().optional(),
})

export default function Cart() {
  const { items, setQuantity, removeItem, total, clear } = useCart()
  const [sent, setSent] = useState(null)
  const [captchaToken, setCaptchaToken] = useState('')
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) })

  const totalValue = total()

  async function onSubmit(values) {
    // Guardamos una copia del pedido para mostrarlo en la confirmación,
    // ya que el carrito se vacía después.
    const orderedItems = items
    const orderedTotal = totalValue

    let order
    try {
      order = await createOrder({
        customer: values,
        items: orderedItems,
        total: orderedTotal,
        notes: values.notes,
        captchaToken,
      })
    } catch (e) {
      // Aunque falle guardar en la BD, dejamos que el cliente igual nos escriba.
      console.error('No se pudo guardar el pedido en la base de datos:', e)
      order = { id: `local-${Date.now()}` }
    }

    const url = buildWhatsappUrl({ order, items: orderedItems, customer: values, total: orderedTotal })
    clear()
    setSent({ order, url, items: orderedItems, total: orderedTotal, customer: values })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // ---------- Pantalla de confirmación ----------
  if (sent) {
    const orderNum = `#${String(sent.order.id).slice(-6).toUpperCase()}`
    const firstName = sent.customer.name.split(' ')[0]
    return (
      <div className="container-page py-14 sm:py-20">
        <div className="mx-auto max-w-lg">
          <div className="text-center">
            <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-500/15 animate-fade-in">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-ink-950 animate-fade-up">
                <Check size={30} strokeWidth={3} />
              </span>
            </span>
            <p className="eyebrow mt-6 text-green-400">Pedido registrado · {orderNum}</p>
            <h1 className="mt-2 font-display text-3xl font-semibold text-cream sm:text-4xl">
              ¡Gracias, {firstName}!
            </h1>
            <p className="mx-auto mt-3 max-w-md text-muted">
              Guardamos tu pedido. Para confirmarlo y coordinar el pago y la entrega, envíanoslo
              por WhatsApp — te respondemos en minutos.
            </p>
          </div>

          {/* CTA principal: WhatsApp */}
          <a
            href={sent.url}
            target="_blank"
            rel="noreferrer"
            className="btn-whatsapp mt-8 w-full text-base"
          >
            <WhatsappGlyph size={22} /> Enviar pedido por WhatsApp
          </a>

          {/* Resumen del pedido */}
          <div className="card mt-6 p-6">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted">
              Resumen del pedido
            </h2>
            <ul className="mt-4 divide-y divide-ink-800">
              {sent.items.map((it) => (
                <li key={it.id} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                  <span className="text-cream">
                    <span className="text-amber-400">{it.quantity}×</span> {it.name}
                  </span>
                  <span className="shrink-0 text-muted">
                    {formatPrice(it.price * it.quantity)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex justify-between border-t border-ink-800 pt-3 font-semibold">
              <span className="text-cream">Total</span>
              <span className="text-amber-400">{formatPrice(sent.total)}</span>
            </div>

            <div className="mt-5 space-y-2 border-t border-ink-800 pt-4 text-sm text-muted">
              <p className="flex items-center gap-2.5">
                <User size={15} className="shrink-0 text-amber-500" /> {sent.customer.name}
              </p>
              <p className="flex items-center gap-2.5">
                <Phone size={15} className="shrink-0 text-amber-500" /> {sent.customer.phone}
              </p>
              <p className="flex items-start gap-2.5">
                <MapPin size={15} className="mt-0.5 shrink-0 text-amber-500" />
                {sent.customer.address}
              </p>
            </div>
          </div>

          <div className="mt-6 text-center">
            <Link to="/catalogo" className="text-sm text-amber-400 hover:text-amber-300">
              Seguir comprando
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // ---------- Carrito vacío ----------
  if (items.length === 0) {
    return (
      <div className="container-page py-16">
        <EmptyState
          title="Tu carrito está vacío"
          hint="Agrega productos del catálogo para empezar tu pedido."
        />
        <div className="mt-6 text-center">
          <Link to="/catalogo" className="btn-primary">
            <ShoppingBag size={18} /> Ir al catálogo
          </Link>
        </div>
      </div>
    )
  }

  // ---------- Carrito con items ----------
  const itemCount = items.reduce((n, i) => n + i.quantity, 0)

  return (
    <div className="container-page py-10">
      <div className="flex items-end justify-between">
        <h1 className="font-display text-4xl font-semibold text-cream">Mi carrito</h1>
        <span className="text-sm text-muted">{itemCount} artículo(s)</span>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_400px]">
        {/* Lista de items */}
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="card flex gap-4 p-4">
              <Link
                to={`/producto/${item.slug}`}
                className="h-24 w-20 shrink-0 overflow-hidden rounded-xl bg-ink-800"
              >
                <ProductImage product={item} className="h-full w-full" />
              </Link>

              <div className="flex flex-1 flex-col">
                <div className="flex justify-between gap-3">
                  <Link
                    to={`/producto/${item.slug}`}
                    className="text-sm font-semibold leading-snug text-cream hover:text-amber-400"
                  >
                    {item.name}
                  </Link>
                  <button
                    onClick={() => removeItem(item.id)}
                    aria-label="Eliminar"
                    className="text-muted transition-colors hover:text-wine-light"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                {item.category && <p className="text-xs text-muted">{item.category}</p>}

                <div className="mt-auto flex items-center justify-between pt-3">
                  <div className="flex items-center rounded-full border border-ink-600">
                    <button
                      onClick={() => setQuantity(item.id, item.quantity - 1)}
                      className="flex h-8 w-8 items-center justify-center text-cream hover:text-amber-400"
                      aria-label="Disminuir"
                    >
                      <Minus size={15} />
                    </button>
                    <span className="w-7 text-center text-sm font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => setQuantity(item.id, item.quantity + 1)}
                      className="flex h-8 w-8 items-center justify-center text-cream hover:text-amber-400"
                      aria-label="Aumentar"
                    >
                      <Plus size={15} />
                    </button>
                  </div>
                  <span className="font-semibold text-amber-400">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Resumen + checkout */}
        <div className="lg:sticky lg:top-24 lg:h-fit">
          <form onSubmit={handleSubmit(onSubmit)} className="card space-y-5 p-6">
            <h2 className="font-display text-xl font-semibold text-cream">Datos de entrega</h2>

            <div>
              <label className="label">Nombre completo</label>
              <input {...register('name')} className="input" placeholder="Juan Pérez" />
              {errors.name && <p className="mt-1 text-xs text-wine-light">{errors.name.message}</p>}
            </div>

            <div>
              <label className="label">Teléfono / WhatsApp</label>
              <input {...register('phone')} className="input" placeholder="987 654 321" />
              {errors.phone && <p className="mt-1 text-xs text-wine-light">{errors.phone.message}</p>}
            </div>

            <div>
              <label className="label">Dirección de entrega</label>
              <input
                {...register('address')}
                className="input"
                placeholder="Av. ..., distrito, referencia"
              />
              {errors.address && (
                <p className="mt-1 text-xs text-wine-light">{errors.address.message}</p>
              )}
            </div>

            <div>
              <label className="label">Notas (opcional)</label>
              <textarea
                {...register('notes')}
                rows={2}
                className="input resize-none"
                placeholder="Ej. tocar el timbre 2 veces"
              />
            </div>

            <div className="space-y-2 border-t border-ink-700 pt-4 text-sm">
              <div className="flex justify-between text-muted">
                <span>Subtotal</span>
                <span>{formatPrice(totalValue)}</span>
              </div>
              <div className="flex justify-between text-muted">
                <span>Delivery</span>
                <span>A coordinar</span>
              </div>
              <div className="flex justify-between pt-2 text-lg font-semibold text-cream">
                <span>Total</span>
                <span className="text-amber-400">{formatPrice(totalValue)}</span>
              </div>
            </div>

            {isCaptchaEnabled && (
              <div className="flex justify-center">
                <Turnstile onToken={setCaptchaToken} />
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting || (isCaptchaEnabled && !captchaToken)}
              className="btn-primary w-full"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" /> Procesando…
                </>
              ) : (
                <>
                  <ShoppingBag size={18} /> Realizar pedido
                </>
              )}
            </button>
            <p className="text-center text-xs text-muted">
              Coordinamos el pago (Yape, Plin, tarjeta o efectivo) y la entrega por WhatsApp.
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
