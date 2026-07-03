import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Minus, Plus, ShoppingBag, Check, MessageCircle, Package } from 'lucide-react'
import { useProduct, useProducts } from '../hooks/useCatalog'
import ProductImage from '../components/ProductImage'
import ProductCard from '../components/ProductCard'
import { Spinner, EmptyState } from '../components/ui'
import { useCart } from '../store/cartStore'
import { formatPrice, isOnSale, discountPct, SITE } from '../config/site'

export default function ProductDetail() {
  const { slug } = useParams()
  const { data: product, isLoading } = useProduct(slug)
  const addItem = useCart((s) => s.addItem)
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  const { data: related } = useProducts(
    product ? { categorySlug: product.category?.slug } : undefined,
  )

  if (isLoading) return <Spinner label="Cargando producto…" />
  if (!product)
    return (
      <div className="container-page py-16">
        <EmptyState title="Producto no encontrado" hint="Puede que ya no esté disponible." />
        <div className="mt-6 text-center">
          <Link to="/catalogo" className="btn-ghost">Volver al catálogo</Link>
        </div>
      </div>
    )

  const soldOut = (product.stock ?? 0) <= 0
  const onSale = isOnSale(product)
  const pct = discountPct(product)
  const comboList = product.is_combo && product.combo_items
    ? product.combo_items.split(/[,\n]/).map((s) => s.trim()).filter(Boolean)
    : []

  function add() {
    addItem(product, qty)
    setAdded(true)
    setTimeout(() => setAdded(false), 1400)
  }

  return (
    <div className="container-page py-8">
      <Link to="/catalogo" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-cream">
        <ArrowLeft size={16} /> Volver al catálogo
      </Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        {/* Imagen */}
        <div className="card overflow-hidden">
          <div className="relative aspect-square bg-gradient-to-b from-ink-800 to-ink-900">
            <ProductImage product={product} className="h-full w-full" />
            {soldOut && (
              <div className="absolute inset-0 flex items-center justify-center bg-ink-950/60">
                <span className="rounded-full border border-cream/30 px-5 py-2 text-sm font-semibold uppercase tracking-wider text-cream">
                  Agotado
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Info */}
        <div>
          {product.is_combo ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500 px-3 py-1 text-xs font-bold uppercase tracking-wider text-ink-950">
              <Package size={13} /> Combo
            </span>
          ) : (
            product.category?.name && (
              <Link
                to={`/catalogo?categoria=${product.category.slug}`}
                className="eyebrow hover:underline"
              >
                {product.category.name}
              </Link>
            )
          )}
          <h1 className="mt-3 font-display text-3xl font-semibold leading-tight text-cream sm:text-4xl">
            {product.name}
          </h1>
          {product.brand?.name && (
            <p className="mt-2 text-sm font-medium uppercase tracking-wider text-muted">
              {product.brand.name}
            </p>
          )}

          <div className="mt-6 flex flex-wrap gap-2">
            {product.volume_ml && <Spec label="Contenido" value={`${product.volume_ml} ml`} />}
            {product.abv != null && <Spec label="Graduación" value={`${product.abv}°`} />}
            <Spec label="Stock" value={soldOut ? 'Agotado' : `${product.stock} disp.`} />
          </div>

          <p className="mt-6 text-base leading-relaxed text-muted">{product.description}</p>

          {/* Contenido del combo */}
          {comboList.length > 0 && (
            <div className="mt-6 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">
              <p className="flex items-center gap-2 text-sm font-semibold text-cream">
                <Package size={16} className="text-amber-400" /> Este combo incluye:
              </p>
              <ul className="mt-3 space-y-1.5">
                {comboList.map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-muted">
                    <Check size={14} className="shrink-0 text-amber-400" /> {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Precio */}
          <div className="mt-8 flex flex-wrap items-end gap-3">
            {onSale && (
              <span className="font-display text-2xl text-muted line-through">
                {formatPrice(product.compare_at_price)}
              </span>
            )}
            <span
              className={`font-display text-4xl font-semibold ${onSale ? 'text-wine-light' : 'text-amber-400'}`}
            >
              {formatPrice(product.price)}
            </span>
            {onSale && (
              <span className="mb-1 rounded-full bg-wine px-2.5 py-1 text-xs font-bold text-cream">
                -{pct}% · Ahorras {formatPrice(product.compare_at_price - product.price)}
              </span>
            )}
          </div>

          {/* Cantidad + agregar */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
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
                onClick={() => setQty((q) => Math.min(product.stock ?? 99, q + 1))}
                className="flex h-11 w-11 items-center justify-center text-cream hover:text-amber-400"
                aria-label="Aumentar"
              >
                <Plus size={18} />
              </button>
            </div>

            <button onClick={add} disabled={soldOut} className="btn-primary flex-1 sm:flex-none">
              {added ? (
                <>
                  <Check size={18} /> Agregado
                </>
              ) : (
                <>
                  <ShoppingBag size={18} /> Agregar al carrito
                </>
              )}
            </button>
          </div>

          <a
            href={`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(
              `Hola, quiero consultar por: ${product.name}`,
            )}`}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex items-center gap-1.5 text-sm text-muted hover:text-amber-400"
          >
            <MessageCircle size={16} /> Consultar por WhatsApp
          </a>
        </div>
      </div>

      {/* Relacionados */}
      {related && related.filter((p) => p.id !== product.id).length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 font-display text-2xl font-semibold text-cream">
            También te puede gustar
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {related
              .filter((p) => p.id !== product.id)
              .slice(0, 4)
              .map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
          </div>
        </section>
      )}
    </div>
  )
}

function Spec({ label, value }) {
  return (
    <div className="rounded-xl border border-ink-700 bg-ink-800/60 px-4 py-2.5">
      <p className="text-[11px] uppercase tracking-wider text-muted">{label}</p>
      <p className="text-sm font-semibold text-cream">{value}</p>
    </div>
  )
}
