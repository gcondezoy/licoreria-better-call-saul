import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, SlidersHorizontal, X, Plus } from 'lucide-react'
import { useProducts, useCategories, useBrands } from '../hooks/useCatalog'
import ProductCard from '../components/ProductCard'
import { SkeletonGrid, EmptyState } from '../components/ui'
import { SITE } from '../config/site'

const SORTS = [
  { value: 'featured', label: 'Destacados' },
  { value: 'price-asc', label: 'Precio: menor' },
  { value: 'price-desc', label: 'Precio: mayor' },
  { value: 'name', label: 'Nombre A-Z' },
]

const PAGE = 12

export default function Catalog() {
  const [params, setParams] = useSearchParams()
  const categoria = params.get('categoria') || ''
  const marca = params.get('marca') || ''
  const search = params.get('q') || ''
  const sort = params.get('sort') || 'featured'
  const min = Number(params.get('min')) || 0
  const max = Number(params.get('max')) || 0

  const { data: categories } = useCategories()
  const { data: allBrands } = useBrands()
  const { data: allProducts } = useProducts({ activeOnly: true })

  const filters = useMemo(
    () => ({ categorySlug: categoria, brandId: marca, search, sort }),
    [categoria, marca, search, sort],
  )
  const { data: products, isLoading } = useProducts(filters)

  // Filtro de precio (cliente). El resto lo resuelve la query.
  const filtered = useMemo(() => {
    let r = products || []
    if (min) r = r.filter((p) => Number(p.price) >= min)
    if (max) r = r.filter((p) => Number(p.price) <= max)
    return r
  }, [products, min, max])

  const availableBrands = useMemo(() => {
    const source = categoria
      ? (allProducts || []).filter((p) => p.category?.slug === categoria)
      : allProducts || []
    const ids = new Set(source.map((p) => p.brand_id).filter(Boolean))
    return (allBrands || []).filter((b) => ids.has(b.id))
  }, [categoria, allProducts, allBrands])

  const categoryName = categories?.find((c) => c.slug === categoria)?.name || ''
  const brandName = allBrands?.find((b) => b.id === marca)?.name || ''

  // Paginación "cargar más": se reinicia al cambiar cualquier filtro.
  const [visible, setVisible] = useState(PAGE)
  const [drawerOpen, setDrawerOpen] = useState(false)
  useEffect(() => setVisible(PAGE), [categoria, marca, search, sort, min, max])

  // Bloqueo de scroll + Escape cuando el panel móvil está abierto.
  useEffect(() => {
    if (!drawerOpen) return
    const onKey = (e) => e.key === 'Escape' && setDrawerOpen(false)
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [drawerOpen])

  function update(key, value) {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    if (key === 'categoria') next.delete('marca')
    setParams(next, { replace: true })
  }

  const catLabel =
    categoria === 'ofertas' ? 'Ofertas' : categoria === 'combos' ? 'Combos' : categoryName
  const activeChips = [
    categoria && { key: 'categoria', label: catLabel },
    marca && { key: 'marca', label: brandName },
    search && { key: 'q', label: `“${search}”` },
    min && { key: 'min', label: `Desde ${SITE.currency} ${min}` },
    max && { key: 'max', label: `Hasta ${SITE.currency} ${max}` },
  ].filter(Boolean)
  const activeCount = activeChips.length

  const shown = filtered.slice(0, visible)

  const renderFilters = () => (
    <div className="space-y-6">
      <div className="relative">
        <Search size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
        <input
          value={search}
          onChange={(e) => update('q', e.target.value)}
          placeholder="Buscar licor o marca…"
          className="input pl-11"
          aria-label="Buscar productos"
        />
      </div>

      <div>
        <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-cream">
          <SlidersHorizontal size={16} className="text-amber-500" /> Categorías
        </h3>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => update('categoria', '')} className={`chip ${!categoria ? 'chip-active' : ''}`}>
            Todas
          </button>
          <button
            onClick={() => update('categoria', 'ofertas')}
            className={`chip ${categoria === 'ofertas' ? 'chip-active' : '!border-wine/60 !text-wine-light'}`}
          >
            🔥 Ofertas
          </button>
          <button
            onClick={() => update('categoria', 'combos')}
            className={`chip ${categoria === 'combos' ? 'chip-active' : ''}`}
          >
            📦 Combos
          </button>
          {categories?.map((c) => (
            <button
              key={c.id}
              onClick={() => update('categoria', c.slug)}
              className={`chip ${categoria === c.slug ? 'chip-active' : ''}`}
            >
              <span className="h-2 w-2 rounded-full" style={{ background: c.color }} />
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {availableBrands.length > 0 && (
        <div>
          <h3 className="mb-3 text-sm font-semibold text-cream">
            Marcas{categoria && categoryName ? ` de ${categoryName}` : ''}
          </h3>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => update('marca', '')} className={`chip ${!marca ? 'chip-active' : ''}`}>
              Todas
            </button>
            {availableBrands.map((b) => (
              <button
                key={b.id}
                onClick={() => update('marca', b.id)}
                className={`chip ${marca === b.id ? 'chip-active' : ''}`}
              >
                {b.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <h3 className="mb-3 text-sm font-semibold text-cream">Precio</h3>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted">
              {SITE.currency}
            </span>
            <input
              type="number"
              min="0"
              inputMode="numeric"
              value={params.get('min') || ''}
              onChange={(e) => update('min', e.target.value)}
              placeholder="Desde"
              className="input pl-8"
              aria-label="Precio desde"
            />
          </div>
          <span className="text-muted">–</span>
          <div className="relative flex-1">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted">
              {SITE.currency}
            </span>
            <input
              type="number"
              min="0"
              inputMode="numeric"
              value={params.get('max') || ''}
              onChange={(e) => update('max', e.target.value)}
              placeholder="Hasta"
              className="input pl-8"
              aria-label="Precio hasta"
            />
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="container-page py-10">
      <header className="mb-8">
        <p className="eyebrow">Nuestra selección</p>
        <h1 className="mt-2 font-display text-4xl font-semibold text-cream">Catálogo</h1>
      </header>

      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        {/* Sidebar de filtros (escritorio) */}
        <aside className="hidden lg:sticky lg:top-24 lg:block lg:h-fit">{renderFilters()}</aside>

        {/* Resultados */}
        <section>
          <div className="mb-4 flex items-center justify-between gap-3">
            <button
              onClick={() => setDrawerOpen(true)}
              className="btn-ghost px-4 py-2 text-sm lg:hidden"
            >
              <SlidersHorizontal size={16} /> Filtros
              {activeCount > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-500 px-1 text-[11px] font-bold text-ink-950">
                  {activeCount}
                </span>
              )}
            </button>
            <p className="hidden text-sm text-muted lg:block">
              {isLoading ? 'Cargando…' : `${filtered.length} producto(s)`}
            </p>
            <label className="flex items-center gap-2 text-sm">
              <span className="hidden text-muted sm:inline">Ordenar:</span>
              <select
                value={sort}
                onChange={(e) => update('sort', e.target.value)}
                className="input w-auto py-2"
                aria-label="Ordenar productos"
              >
                {SORTS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {/* Chips de filtros activos */}
          {activeChips.length > 0 && (
            <div className="mb-5 flex flex-wrap items-center gap-2">
              {activeChips.map((c) => (
                <button
                  key={c.key}
                  onClick={() => update(c.key, '')}
                  className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1.5 text-xs font-medium text-amber-300 transition-colors hover:bg-amber-500/20"
                >
                  {c.label} <X size={13} />
                </button>
              ))}
              <button
                onClick={() => setParams({}, { replace: true })}
                className="text-xs text-muted underline-offset-2 hover:text-cream hover:underline"
              >
                Limpiar todo
              </button>
            </div>
          )}

          {isLoading ? (
            <SkeletonGrid count={9} />
          ) : shown.length ? (
            <>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {shown.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
              {visible < filtered.length && (
                <div className="mt-8 flex flex-col items-center gap-2">
                  <button onClick={() => setVisible((v) => v + PAGE)} className="btn-ghost">
                    <Plus size={16} /> Cargar más
                  </button>
                  <span className="text-xs text-muted">
                    Mostrando {shown.length} de {filtered.length}
                  </span>
                </div>
              )}
            </>
          ) : (
            <EmptyState
              title="No encontramos productos"
              hint="Prueba con otra categoría, marca, precio o término de búsqueda."
            />
          )}
        </section>
      </div>

      {/* Panel de filtros móvil (bottom sheet) */}
      <div
        onClick={() => setDrawerOpen(false)}
        className={`fixed inset-0 z-[70] bg-ink-950/70 backdrop-blur-sm transition-opacity duration-300 motion-reduce:transition-none lg:hidden ${
          drawerOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Filtros"
        className={`fixed inset-x-0 bottom-0 z-[80] max-h-[85vh] overflow-y-auto rounded-t-3xl border-t border-ink-700 bg-ink-900 p-5 shadow-2xl transition-transform duration-300 ease-out motion-reduce:transition-none lg:hidden ${
          drawerOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-ink-600" />
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-cream">Filtros</h2>
          <button
            onClick={() => setDrawerOpen(false)}
            aria-label="Cerrar"
            className="flex h-9 w-9 items-center justify-center rounded-full text-muted hover:bg-ink-800 hover:text-cream"
          >
            <X size={20} />
          </button>
        </div>
        {renderFilters()}
        <button onClick={() => setDrawerOpen(false)} className="btn-primary mt-6 w-full">
          Ver {filtered.length} producto(s)
        </button>
      </div>
    </div>
  )
}
