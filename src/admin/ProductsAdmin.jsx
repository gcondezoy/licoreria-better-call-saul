import { useMemo, useState } from 'react'
import { Plus, Pencil, Trash2, Search, Star } from 'lucide-react'
import { useProducts, useCategories, useBrands } from '../hooks/useCatalog'
import { useProductMutations } from '../hooks/useAdminMutations'
import Modal from '../components/Modal'
import ProductImage from '../components/ProductImage'
import { Spinner, EmptyState } from '../components/ui'
import { formatPrice } from '../config/site'
import ProductForm from './ProductForm'

export default function ProductsAdmin() {
  const [search, setSearch] = useState('')
  const { data: products, isLoading } = useProducts({ activeOnly: false, search, sort: 'name' })
  const { data: categories } = useCategories()
  const { data: brands } = useBrands()
  const { create, update, remove } = useProductMutations()

  const [editing, setEditing] = useState(null) // producto o {} para nuevo
  const [confirmDelete, setConfirmDelete] = useState(null)

  const catName = useMemo(() => {
    const m = {}
    ;(categories || []).forEach((c) => (m[c.id] = c.name))
    return m
  }, [categories])

  async function handleSave(values) {
    if (editing?.id) await update.mutateAsync({ id: editing.id, data: values })
    else await create.mutateAsync(values)
    setEditing(null)
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-cream">Productos</h1>
          <p className="mt-1 text-sm text-muted">{products?.length || 0} productos en catálogo</p>
        </div>
        <button onClick={() => setEditing({})} className="btn-primary">
          <Plus size={18} /> Nuevo producto
        </button>
      </header>

      <div className="relative max-w-sm">
        <Search size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar producto…"
          className="input pl-11"
        />
      </div>

      {isLoading ? (
        <Spinner />
      ) : products?.length ? (
        <div className="card overflow-hidden">
          {/* Encabezados (desktop) */}
          <div className="hidden grid-cols-[1fr_120px_90px_90px_100px] gap-4 border-b border-ink-800 px-5 py-3 text-xs uppercase tracking-wider text-muted md:grid">
            <span>Producto</span>
            <span>Categoría</span>
            <span className="text-right">Precio</span>
            <span className="text-right">Stock</span>
            <span className="text-right">Acciones</span>
          </div>
          <div className="divide-y divide-ink-800">
            {products.map((p) => (
              <div
                key={p.id}
                className="grid grid-cols-2 items-center gap-4 px-5 py-3 md:grid-cols-[1fr_120px_90px_90px_100px]"
              >
                <div className="col-span-2 flex items-center gap-3 md:col-span-1">
                  <div className="h-12 w-10 shrink-0 overflow-hidden rounded-lg bg-ink-800">
                    <ProductImage product={p} className="h-full w-full" />
                  </div>
                  <div className="min-w-0">
                    <p className="flex items-center gap-1.5 truncate text-sm font-medium text-cream">
                      {p.is_featured && <Star size={13} className="shrink-0 text-amber-400" fill="currentColor" />}
                      {p.name}
                    </p>
                    <p className="truncate text-xs text-muted">{p.brand?.name || '—'}</p>
                  </div>
                </div>
                <span className="text-sm text-muted">{catName[p.category_id] || '—'}</span>
                <span className="text-right text-sm font-semibold text-amber-400">
                  {formatPrice(p.price)}
                </span>
                <span className="text-right">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                      (p.stock ?? 0) === 0
                        ? 'bg-wine/30 text-wine-light'
                        : (p.stock ?? 0) <= 5
                          ? 'bg-amber-500/15 text-amber-400'
                          : 'text-cream'
                    }`}
                  >
                    {p.stock ?? 0}
                  </span>
                </span>
                <div className="flex justify-end gap-1">
                  <button
                    onClick={() => setEditing(p)}
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-muted hover:bg-ink-800 hover:text-amber-400"
                    aria-label="Editar"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => setConfirmDelete(p)}
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-muted hover:bg-ink-800 hover:text-wine-light"
                    aria-label="Eliminar"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <EmptyState title="Sin productos" hint="Crea tu primer producto con el botón de arriba." />
      )}

      {/* Modal crear/editar */}
      <Modal
        open={editing !== null}
        onClose={() => setEditing(null)}
        title={editing?.id ? 'Editar producto' : 'Nuevo producto'}
        size="lg"
      >
        {editing !== null && (
          <ProductForm
            product={editing}
            categories={categories || []}
            brands={brands || []}
            onSubmit={handleSave}
            saving={create.isPending || update.isPending}
          />
        )}
      </Modal>

      {/* Confirmación de borrado */}
      <Modal
        open={confirmDelete !== null}
        onClose={() => setConfirmDelete(null)}
        title="Eliminar producto"
        size="sm"
      >
        <p className="text-sm text-muted">
          ¿Seguro que deseas eliminar{' '}
          <span className="font-semibold text-cream">{confirmDelete?.name}</span>? Esta acción no se
          puede deshacer.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={() => setConfirmDelete(null)} className="btn-ghost">
            Cancelar
          </button>
          <button
            onClick={async () => {
              await remove.mutateAsync(confirmDelete.id)
              setConfirmDelete(null)
            }}
            className="btn-wine"
          >
            <Trash2 size={16} /> Eliminar
          </button>
        </div>
      </Modal>
    </div>
  )
}
