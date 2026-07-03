import { Link } from 'react-router-dom'
import { Plus, Check, Package, Flame, Eye } from 'lucide-react'
import { useState } from 'react'
import ProductImage from './ProductImage'
import QuickView from './QuickView'
import { formatPrice, isOnSale, discountPct } from '../config/site'
import { useCart } from '../store/cartStore'

const LOW_STOCK = 5

export default function ProductCard({ product }) {
  const addItem = useCart((s) => s.addItem)
  const [added, setAdded] = useState(false)
  const [quick, setQuick] = useState(false)
  const stock = product.stock ?? 0
  const soldOut = stock <= 0
  const lowStock = !soldOut && stock <= LOW_STOCK
  const onSale = isOnSale(product)
  const pct = discountPct(product)
  const combo = product.is_combo

  function handleAdd(e) {
    e.preventDefault()
    if (soldOut) return
    addItem(product, 1)
    setAdded(true)
    setTimeout(() => setAdded(false), 1200)
  }

  return (
    <>
    <Link
      to={`/producto/${product.slug}`}
      className="card group relative flex flex-col overflow-hidden transition-transform duration-300 hover:-translate-y-1 hover:border-amber-500/40"
    >
      <div className="relative aspect-[4/5] bg-gradient-to-b from-ink-800 to-ink-900">
        <ProductImage product={product} className="h-full w-full" />

        {/* Badge izquierdo: combo o categoría */}
        {combo ? (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-amber-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-ink-950">
            <Package size={12} /> Combo
          </span>
        ) : (
          product.category?.name && (
            <span className="absolute left-3 top-3 rounded-full bg-ink-950/70 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-cream/80 backdrop-blur">
              {product.category.name}
            </span>
          )
        )}

        {/* Badge derecho: oferta o destacado */}
        {onSale && !soldOut ? (
          <span className="absolute right-3 top-3 rounded-full bg-wine px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-cream">
            -{pct}%
          </span>
        ) : (
          product.is_featured &&
          !soldOut && (
            <span className="absolute right-3 top-3 rounded-full bg-amber-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-ink-950">
              Destacado
            </span>
          )
        )}

        {/* Vista rápida (aparece al pasar el mouse) */}
        {!soldOut && (
          <button
            onClick={(e) => {
              e.preventDefault()
              setQuick(true)
            }}
            className="absolute bottom-3 left-1/2 -translate-x-1/2 translate-y-2 rounded-full bg-ink-950/80 px-4 py-2 text-xs font-semibold text-cream opacity-0 backdrop-blur transition-all duration-200 hover:bg-ink-950 group-hover:translate-y-0 group-hover:opacity-100 motion-reduce:transition-none"
          >
            <span className="inline-flex items-center gap-1.5">
              <Eye size={14} /> Vista rápida
            </span>
          </button>
        )}

        {soldOut && (
          <div className="absolute inset-0 flex items-center justify-center bg-ink-950/60 backdrop-blur-[1px]">
            <span className="rounded-full border border-cream/30 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-cream">
              Agotado
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1 p-4">
        {product.brand?.name && (
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">
            {product.brand.name}
          </p>
        )}
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-cream">
          {product.name}
        </h3>

        {combo && product.combo_items ? (
          <p className="line-clamp-2 text-xs text-muted">Incluye: {product.combo_items}</p>
        ) : (
          (product.volume_ml || product.abv) && (
            <p className="text-xs text-muted">
              {product.volume_ml ? `${product.volume_ml} ml` : ''}
              {product.volume_ml && product.abv ? ' · ' : ''}
              {product.abv ? `${product.abv}°` : ''}
            </p>
          )
        )}

        {lowStock && (
          <p className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-semibold text-wine-light">
            <Flame size={12} /> ¡Solo quedan {stock}!
          </p>
        )}

        <div className="mt-auto flex items-end justify-between pt-3">
          <div className="flex flex-col leading-none">
            {onSale && (
              <span className="text-xs text-muted line-through">
                {formatPrice(product.compare_at_price)}
              </span>
            )}
            <span
              className={`font-display text-lg font-semibold ${onSale ? 'text-wine-light' : 'text-amber-400'}`}
            >
              {formatPrice(product.price)}
            </span>
          </div>
          <button
            onClick={handleAdd}
            disabled={soldOut}
            aria-label={`Agregar ${product.name} al carrito`}
            className={`inline-flex h-9 w-9 items-center justify-center rounded-full transition-all
              ${
                soldOut
                  ? 'cursor-not-allowed border border-ink-600 text-muted'
                  : added
                    ? 'bg-green-500 text-ink-950'
                    : 'bg-amber-500 text-ink-950 hover:bg-amber-400 hover:scale-105 active:scale-95'
              }`}
          >
            {added ? <Check size={18} /> : <Plus size={18} />}
          </button>
        </div>
      </div>
    </Link>
    <QuickView product={product} open={quick} onClose={() => setQuick(false)} />
    </>
  )
}
