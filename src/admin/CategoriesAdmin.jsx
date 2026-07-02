import { useState } from 'react'
import { Plus, Trash2, Tag } from 'lucide-react'
import { useCategories, useBrands } from '../hooks/useCatalog'
import { useCategoryMutations, useBrandMutations } from '../hooks/useAdminMutations'
import { Spinner } from '../components/ui'

function slugify(str) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export default function CategoriesAdmin() {
  const { data: categories, isLoading: lc } = useCategories()
  const { data: brands, isLoading: lb } = useBrands()
  const cat = useCategoryMutations()
  const brand = useBrandMutations()

  const [catName, setCatName] = useState('')
  const [catColor, setCatColor] = useState('#c8962c')
  const [brandName, setBrandName] = useState('')

  async function addCategory(e) {
    e.preventDefault()
    if (!catName.trim()) return
    await cat.create.mutateAsync({ name: catName.trim(), slug: slugify(catName), color: catColor })
    setCatName('')
  }

  async function addBrand(e) {
    e.preventDefault()
    if (!brandName.trim()) return
    await brand.create.mutateAsync({ name: brandName.trim() })
    setBrandName('')
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-3xl font-semibold text-cream">Categorías y marcas</h1>
        <p className="mt-1 text-sm text-muted">Organiza cómo se muestra tu catálogo</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Categorías */}
        <div className="card p-6">
          <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-cream">
            <Tag size={18} className="text-amber-500" /> Categorías
          </h2>

          <form onSubmit={addCategory} className="mt-4 flex gap-2">
            <input
              value={catName}
              onChange={(e) => setCatName(e.target.value)}
              placeholder="Nueva categoría"
              className="input"
            />
            <input
              type="color"
              value={catColor}
              onChange={(e) => setCatColor(e.target.value)}
              className="h-12 w-14 shrink-0 cursor-pointer rounded-xl border border-ink-600 bg-ink-800"
              title="Color de la categoría"
            />
            <button type="submit" className="btn-primary shrink-0 px-4" disabled={cat.create.isPending}>
              <Plus size={18} />
            </button>
          </form>

          {lc ? (
            <Spinner />
          ) : (
            <ul className="mt-5 divide-y divide-ink-800">
              {categories?.map((c) => (
                <li key={c.id} className="flex items-center justify-between py-3">
                  <span className="flex items-center gap-3 text-sm text-cream">
                    <span className="h-4 w-4 rounded-full" style={{ background: c.color }} />
                    {c.name}
                  </span>
                  <button
                    onClick={() => cat.remove.mutate(c.id)}
                    className="text-muted hover:text-wine-light"
                    aria-label="Eliminar categoría"
                  >
                    <Trash2 size={16} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Marcas */}
        <div className="card p-6">
          <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-cream">
            <Tag size={18} className="text-amber-500" /> Marcas
          </h2>

          <form onSubmit={addBrand} className="mt-4 flex gap-2">
            <input
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              placeholder="Nueva marca"
              className="input"
            />
            <button type="submit" className="btn-primary shrink-0 px-4" disabled={brand.create.isPending}>
              <Plus size={18} />
            </button>
          </form>

          {lb ? (
            <Spinner />
          ) : (
            <ul className="mt-5 divide-y divide-ink-800">
              {brands?.map((b) => (
                <li key={b.id} className="flex items-center justify-between py-3">
                  <span className="text-sm text-cream">{b.name}</span>
                  <button
                    onClick={() => brand.remove.mutate(b.id)}
                    className="text-muted hover:text-wine-light"
                    aria-label="Eliminar marca"
                  >
                    <Trash2 size={16} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
