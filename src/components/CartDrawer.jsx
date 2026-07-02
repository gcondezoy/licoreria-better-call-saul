import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { X, Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react'
import { useCart } from '../store/cartStore'
import ProductImage from './ProductImage'
import { formatPrice, SITE } from '../config/site'

export default function CartDrawer() {
  const { items, drawerOpen, closeDrawer, setQuantity, removeItem, total, count } = useCart()
  const navigate = useNavigate()

  // Bloquea el scroll del fondo y permite cerrar con Escape.
  useEffect(() => {
    if (!drawerOpen) return
    const onKey = (e) => e.key === 'Escape' && closeDrawer()
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [drawerOpen, closeDrawer])

  const totalValue = total()
  const itemCount = count()

  function goCheckout() {
    closeDrawer()
    navigate('/carrito')
  }

  return (
    <>
      {/* Fondo oscuro */}
      <div
        onClick={closeDrawer}
        className={`fixed inset-0 z-[70] bg-ink-950/70 backdrop-blur-sm transition-opacity duration-300 ${
          drawerOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      {/* Panel */}
      <aside
        className={`fixed right-0 top-0 z-[80] flex h-full w-full max-w-md flex-col border-l border-ink-700 bg-ink-900 shadow-2xl transition-transform duration-300 ease-out ${
          drawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-hidden={!drawerOpen}
      >
        {/* Encabezado */}
        <div className="flex items-center justify-between border-b border-ink-800 px-5 py-4">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} className="text-amber-500" />
            <h2 className="font-display text-lg font-semibold text-cream">Tu pedido</h2>
            {itemCount > 0 && (
              <span className="rounded-full bg-amber-500 px-2 py-0.5 text-xs font-bold text-ink-950">
                {itemCount}
              </span>
            )}
          </div>
          <button
            onClick={closeDrawer}
            aria-label="Cerrar"
            className="flex h-9 w-9 items-center justify-center rounded-full text-muted hover:bg-ink-800 hover:text-cream"
          >
            <X size={20} />
          </button>
        </div>

        {/* Contenido */}
        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <ShoppingBag size={40} className="text-ink-600" />
            <p className="text-muted">Tu carrito está vacío.</p>
            <button onClick={closeDrawer} className="btn-ghost">
              Ver productos
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3 rounded-xl border border-ink-800 p-3">
                  <div className="h-20 w-16 shrink-0 overflow-hidden rounded-lg bg-ink-800">
                    <ProductImage product={item} className="h-full w-full" />
                  </div>
                  <div className="flex flex-1 flex-col">
                    <div className="flex justify-between gap-2">
                      <p className="text-sm font-semibold leading-snug text-cream line-clamp-2">
                        {item.name}
                      </p>
                      <button
                        onClick={() => removeItem(item.id)}
                        aria-label="Eliminar"
                        className="h-fit text-muted hover:text-wine-light"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div className="mt-auto flex items-center justify-between pt-2">
                      <div className="flex items-center rounded-full border border-ink-600">
                        <button
                          onClick={() => setQuantity(item.id, item.quantity - 1)}
                          className="flex h-7 w-7 items-center justify-center text-cream hover:text-amber-400"
                          aria-label="Disminuir"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-6 text-center text-sm font-semibold">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => setQuantity(item.id, item.quantity + 1)}
                          className="flex h-7 w-7 items-center justify-center text-cream hover:text-amber-400"
                          aria-label="Aumentar"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <span className="text-sm font-semibold text-amber-400">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pie */}
            <div className="border-t border-ink-800 px-5 py-4">
              <div className="mb-1 flex items-center justify-between text-sm text-muted">
                <span>Delivery</span>
                <span>A coordinar</span>
              </div>
              <div className="mb-4 flex items-center justify-between">
                <span className="font-semibold text-cream">Total</span>
                <span className="font-display text-xl font-semibold text-amber-400">
                  {formatPrice(totalValue)}
                </span>
              </div>
              <button onClick={goCheckout} className="btn-primary w-full">
                Finalizar pedido <ArrowRight size={18} />
              </button>
              <button
                onClick={closeDrawer}
                className="mt-2 w-full text-center text-sm text-muted hover:text-cream"
              >
                Seguir comprando
              </button>
              <p className="mt-3 text-center text-xs text-muted">
                Pago por Yape, Plin, tarjeta o efectivo · {SITE.deliveryNote}
              </p>
            </div>
          </>
        )}
      </aside>
    </>
  )
}
