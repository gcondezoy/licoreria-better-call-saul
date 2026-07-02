import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { useProducts, useCategories, useBrands } from '../hooks/useCatalog'
import ProductCard from '../components/ProductCard'
import { SkeletonGrid, EmptyState } from '../components/ui'

const SORTS = [
  { value: 'featured', label: 'Destacados' },
  { value: 'price-asc', label: 'Precio: menor' },
  { value: 'price-desc', label: 'Precio: mayor' },
  { value: 'name', label: 'Nombre A-Z' },
]

export default function Catalog() {
  const [params, setParams] = useSearchParams()
  const categoria = params.get('categoria') || ''
  const marca = params.get('marca') || ''
  const search = params.get('q') || ''
  const sort = params.get('sort') || 'featured'

  const { data: categories } = useCategories()
  const { data: allBrands } = useBrands()
  // Todos los productos activos: sirve para saber qué marcas existen por categoría.
  const { data: allProducts } = useProducts({ activeOnly: true })

  const filters = useMemo(
    () => ({ categorySlug: categoria, brandId: marca, search, sort }),
    [categoria, marca, search, sort],
  )
  const { data: products, isLoading } = useProducts(filters)

  // Marcas disponibles según la categoría elegida (solo las que tienen productos).
  const availableBrands = useMemo(() => {
    const source = categoria
      ? (allProducts || []).filter((p) => p.category?.slug === categoria)
      : allProducts || []
    const ids = new Set(source.map((p) => p.brand_id).filter(Boolean))
    return (allBrands || []).filter((b) => ids.has(b.id))
  }, [categoria, allProducts, allBrands])

  const categoryName = categories?.find((c) => c.slug === categoria)?.name || ''

  function update(key, value) {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    // Las marcas dependen de la categoría: al cambiar de categoría, limpiamos la marca.
    if (key === 'categoria') next.delete('marca')
    setParams(next, { replace: true })
  }

  const hasFilters = categoria || marca || search

  return (
    <div className="container-page py-10">
      <header className="mb-8">
        <p className="eyebrow">Nuestra selección</p>
        <h1 className="mt-2 font-display text-4xl font-semibold text-cream">Catálogo</h1>
      </header>

      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        {/* Sidebar de filtros */}
        <aside className="space-y-6 lg:sticky lg:top-24 lg:h-fit">
          {/* Búsqueda */}
          <div className="relative">
            <Search size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
            <input
              value={search}
              onChange={(e) => update('q', e.target.value)}
              placeholder="Buscar licor o marca…"
              className="input pl-11"
            />
          </div>

          <div>
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-cream">
              <SlidersHorizontal size={16} className="text-amber-500" /> Categorías
            </h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => update('categoria', '')}
                className={`chip ${!categoria ? 'chip-active' : ''}`}
              >
                Todas
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
                Marcas{categoria ? ` de ${categoryName}` : ''}
              </h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => update('marca', '')}
                  className={`chip ${!marca ? 'chip-active' : ''}`}
                >
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

          {hasFilters && (
            <button
              onClick={() => setParams({}, { replace: true })}
              className="inline-flex items-center gap-1.5 text-sm text-amber-400 hover:text-amber-300"
            >
              <X size={15} /> Limpiar filtros
            </button>
          )}
        </aside>

        {/* Resultados */}
        <section>
          <div className="mb-5 flex items-center justify-between gap-4">
            <p className="text-sm text-muted">
              {isLoading ? 'Cargando…' : `${products?.length || 0} producto(s)`}
            </p>
            <label className="flex items-center gap-2 text-sm">
              <span className="hidden text-muted sm:inline">Ordenar:</span>
              <select
                value={sort}
                onChange={(e) => update('sort', e.target.value)}
                className="input w-auto py-2"
              >
                {SORTS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {isLoading ? (
            <SkeletonGrid count={9} />
          ) : products?.length ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No encontramos productos"
              hint="Prueba con otra categoría, marca o término de búsqueda."
            />
          )}
        </section>
      </div>
    </div>
  )
}
