import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2 } from 'lucide-react'
import ImageUpload from './ImageUpload'

const schema = z
  .object({
    name: z.string().min(2, 'Nombre requerido'),
    category_id: z.string().optional(),
    brand_id: z.string().optional().nullable(),
    price: z.coerce.number().min(0, 'Precio inválido'),
    compare_at_price: z.coerce.number().min(0).optional(),
    cost: z.coerce.number().min(0, 'Costo inválido').optional(),
    stock: z.coerce.number().int().min(0, 'Stock inválido'),
    volume_ml: z.coerce.number().int().min(0).optional(),
    abv: z.coerce.number().min(0).max(100).optional(),
    image_url: z.string().url('URL inválida').optional().or(z.literal('')),
    description: z.string().optional(),
    is_combo: z.boolean().optional(),
    combo_items: z.string().optional(),
    is_featured: z.boolean().optional(),
    is_active: z.boolean().optional(),
  })
  // La categoría es obligatoria salvo que sea un combo.
  .refine((d) => d.is_combo || (d.category_id && d.category_id.length > 0), {
    message: 'Elige una categoría',
    path: ['category_id'],
  })

function slugify(str) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export default function ProductForm({ product, categories, brands, onSubmit, saving }) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: product?.name || '',
      category_id: product?.category_id || '',
      brand_id: product?.brand_id || '',
      price: product?.price ?? '',
      compare_at_price: product?.compare_at_price ?? '',
      cost: product?.cost ?? '',
      stock: product?.stock ?? '',
      volume_ml: product?.volume_ml ?? 750,
      abv: product?.abv ?? '',
      image_url: product?.image_url || '',
      description: product?.description || '',
      is_combo: product?.is_combo ?? false,
      combo_items: product?.combo_items || '',
      is_featured: product?.is_featured ?? false,
      is_active: product?.is_active ?? true,
    },
  })

  function submit(values) {
    const payload = {
      ...values,
      slug: product?.slug || slugify(values.name),
      category_id: values.category_id || null,
      brand_id: values.brand_id || null,
      image_url: values.image_url || null,
      compare_at_price: values.compare_at_price > 0 ? values.compare_at_price : null,
      combo_items: values.combo_items || null,
    }
    onSubmit(payload)
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4">
      <div>
        <label className="label">Nombre</label>
        <input {...register('name')} className="input" placeholder="Ej. Whisky Johnnie Walker Black" />
        {errors.name && <p className="mt-1 text-xs text-wine-light">{errors.name.message}</p>}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label">Categoría</label>
          <select {...register('category_id')} className="input">
            <option value="">Selecciona…</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          {errors.category_id && (
            <p className="mt-1 text-xs text-wine-light">{errors.category_id.message}</p>
          )}
        </div>
        <div>
          <label className="label">Marca</label>
          <select {...register('brand_id')} className="input">
            <option value="">Sin marca</option>
            {brands.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label className="label">Precio venta (S/)</label>
          <input type="number" step="0.01" {...register('price')} className="input" />
          {errors.price && <p className="mt-1 text-xs text-wine-light">{errors.price.message}</p>}
        </div>
        <div>
          <label className="label">Precio antes (S/)</label>
          <input type="number" step="0.01" {...register('compare_at_price')} className="input" placeholder="para oferta" />
          <p className="mt-1 text-[11px] text-muted">Mayor al precio = oferta</p>
        </div>
        <div>
          <label className="label">Costo (S/)</label>
          <input type="number" step="0.01" {...register('cost')} className="input" placeholder="para margen" />
          {errors.cost && <p className="mt-1 text-xs text-wine-light">{errors.cost.message}</p>}
        </div>
        <div>
          <label className="label">Stock</label>
          <input type="number" {...register('stock')} className="input" />
          {errors.stock && <p className="mt-1 text-xs text-wine-light">{errors.stock.message}</p>}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label">Volumen (ml)</label>
          <input type="number" {...register('volume_ml')} className="input" />
        </div>
        <div>
          <label className="label">Graduación (°)</label>
          <input type="number" step="0.1" {...register('abv')} className="input" />
        </div>
      </div>

      <input type="hidden" {...register('image_url')} />
      <ImageUpload
        value={watch('image_url')}
        onChange={(url) => setValue('image_url', url, { shouldValidate: true, shouldDirty: true })}
      />
      {errors.image_url && (
        <p className="mt-1 text-xs text-wine-light">{errors.image_url.message}</p>
      )}

      <div>
        <label className="label">Descripción</label>
        <textarea {...register('description')} rows={3} className="input resize-none" />
      </div>

      {/* Combo */}
      <div className="rounded-xl border border-ink-700 bg-ink-800/40 p-4">
        <label className="flex cursor-pointer items-center gap-2.5 text-sm font-semibold text-cream">
          <input type="checkbox" {...register('is_combo')} className="h-4 w-4 accent-amber-500" />
          Es un combo (paquete de productos)
        </label>
        <div className="mt-3">
          <label className="label">Contenido del combo</label>
          <textarea
            {...register('combo_items')}
            rows={2}
            className="input resize-none"
            placeholder="Ej: 1 Ron Cartavio, 2 Coca-Cola 1.5L, Hielo 2kg"
          />
          <p className="mt-1 text-[11px] text-muted">
            Separa cada producto con una coma. Un combo no necesita categoría.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-6 pt-1">
        <label className="flex cursor-pointer items-center gap-2.5 text-sm text-cream">
          <input type="checkbox" {...register('is_featured')} className="h-4 w-4 accent-amber-500" />
          Destacado
        </label>
        <label className="flex cursor-pointer items-center gap-2.5 text-sm text-cream">
          <input type="checkbox" {...register('is_active')} className="h-4 w-4 accent-amber-500" />
          Activo (visible en la web)
        </label>
      </div>

      <div className="flex justify-end gap-3 border-t border-ink-800 pt-5">
        <button type="submit" disabled={saving} className="btn-primary">
          {saving && <Loader2 size={16} className="animate-spin" />}
          {saving ? 'Guardando…' : 'Guardar producto'}
        </button>
      </div>
    </form>
  )
}
