import { Link } from 'react-router-dom'
import { Plus, Check } from 'lucide-react'
import { useState } from 'react'
import ProductImage from './ProductImage'
import { formatPrice } from '../config/site'
import { useCart } from '../store/cartStore'

export default function ProductCard({ product }) {
  const addItem = useCart((s) => s.addItem)
  const [added, setAdded] = useState(false)
  const soldOut = (product.stock ?? 0) <= 0

  function handleAdd(e) {
    e.preventDefault()
    if (soldOut) return
    addItem(product, 1)
    setAdded(true)
    setTimeout(() => setAdded(false), 1200)
  }

  return (
    <Link
      to={`/producto/${product.slug}`}
      className="card group relative flex flex-col overflow-hidden transition-transform duration-300 hover:-translate-y-1 hover:border-amber-500/40"
    >
      <div className="relative aspect-[4/5] bg-gradient-to-b from-ink-800 to-ink-900">
        <ProductImage product={product} className="h-full w-full" />

        {product.category?.name && (
          <span className="absolute left-3 top-3 rounded-full bg-ink-950/70 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-cream/80 backdrop-blur">
            {product.category.name}
          </span>
        )}
        {product.is_featured && !soldOut && (
          <span className="absolute right-3 top-3 rounded-full bg-amber-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-ink-950">
            Destacado
          </span>
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
        {(product.volume_ml || product.abv) && (
          <p className="text-xs text-muted">
            {product.volume_ml ? `${product.volume_ml} ml` : ''}
            {product.volume_ml && product.abv ? ' · ' : ''}
            {product.abv ? `${product.abv}°` : ''}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between pt-3">
          <span className="font-display text-lg font-semibold text-amber-400">
            {formatPrice(product.price)}
          </span>
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
  )
}
