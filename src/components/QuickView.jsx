import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Minus, Plus, ShoppingBag, Check, Package, ArrowRight } from 'lucide-react'
import Modal from './Modal'
import ProductImage from './ProductImage'
import { useCart } from '../store/cartStore'
import { formatPrice, isOnSale, discountPct } from '../config/site'

export default function QuickView({ product, open, onClose }) {
  const addItem = useCart((s) => s.addItem)
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  if (!product) return null
  const onSale = isOnSale(product)
  const pct = discountPct(product)
  const soldOut = (product.stock ?? 0) <= 0
  const maxQty = product.stock ?? 99

  function add() {
    if (soldOut) return
    addItem(product, qty)
    setAdded(true)
    setTimeout(() => setAdded(false), 1400)
  }

  return (
    <Modal open={open} onClose={onClose} title="Vista rápida" size="lg">
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-gradient-to-b from-ink-800 to-ink-900">
          <ProductImage product={product} className="h-full w-full" />
          {onSale && !soldOut && (
            <span className="absolute right-3 top-3 rounded-full bg-wine px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-cream">
              -{pct}%
            </span>
          )}
        </div>

        <div className="flex flex-col">
          {product.is_combo ? (
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-amber-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-ink-950">
              <Package size={12} /> Combo
            </span>
          ) : (
            product.brand?.name && (
              <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                {product.brand.name}
              </p>
            )
          )}

          <h3 className="mt-2 font-display text-2xl font-semibold leading-tight text-cream">
            {product.name}
          </h3>

          {product.is_combo && product.combo_items ? (
            <p className="mt-2 text-sm text-muted">Incluye: {product.combo_items}</p>
          ) : (
            (product.volume_ml || product.abv) && (
              <p className="mt-2 text-sm text-muted">
                {product.volume_ml ? `${product.volume_ml} ml` : ''}
                {product.volume_ml && product.abv ? ' · ' : ''}
                {product.abv ? `${product.abv}°` : ''}
              </p>
            )
          )}

          {product.description && (
            <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted">
              {product.description}
            </p>
          )}

          <div className="mt-4 flex items-end gap-3">
            {onSale && (
              <span className="text-lg text-muted line-through">
                {formatPrice(product.compare_at_price)}
              </span>
            )}
            <span
              className={`font-display text-3xl font-semibold ${onSale ? 'text-wine-light' : 'text-amber-400'}`}
            >
              {formatPrice(product.price)}
            </span>
          </div>

          <div className="mt-auto pt-5">
            {soldOut ? (
              <p className="rounded-xl border border-ink-700 py-3 text-center text-sm font-semibold text-muted">
                Agotado
              </p>
            ) : (
              <div className="flex items-center gap-3">
                <div className="flex items-center rounded-full border border-ink-600">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="flex h-11 w-11 items-center justify-center text-cream hover:text-amber-400"
                    aria-label="Disminuir"
                  >
                    <Minus size={18} />
                  </button>
                  <span className="w-8 text-center font-semibold">{qty}</span>
                  <button
                    onClick={() => setQty((q) => Math.min(maxQty, q + 1))}
                    className="flex h-11 w-11 items-center justify-center text-cream hover:text-amber-400"
                    aria-label="Aumentar"
                  >
                    <Plus size={18} />
                  </button>
                </div>
                <button onClick={add} className="btn-primary flex-1">
                  {added ? (
                    <>
                      <Check size={18} /> Agregado
                    </>
                  ) : (
                    <>
                      <ShoppingBag size={18} /> Agregar
                    </>
                  )}
                </button>
              </div>
            )}

            <Link
              to={`/producto/${product.slug}`}
              onClick={onClose}
              className="mt-3 inline-flex items-center gap-1.5 text-sm text-amber-400 hover:text-amber-300"
            >
              Ver detalle completo <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </div>
    </Modal>
  )
}
