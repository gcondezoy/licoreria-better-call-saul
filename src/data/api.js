// Capa de acceso a datos. Usa Supabase cuando está configurado; de lo contrario
// opera sobre el store en memoria (modo demo). La firma de las funciones es la
// misma en ambos modos, así que la UI no cambia.

import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { db, genId, now } from './demoStore'

const PRODUCT_SELECT = '*, category:categories(id,name,slug,color), brand:brands(id,name)'

// --- Helpers modo demo ---
function enrich(p) {
  return {
    ...p,
    category: db.categories.find((c) => c.id === p.category_id) || null,
    brand: db.brands.find((b) => b.id === p.brand_id) || null,
  }
}

function byNewest(a, b) {
  return (b.created_at || '').localeCompare(a.created_at || '')
}

// ============================ PRODUCTOS ============================

// Filtra por categoría real, o por los "slugs especiales" ofertas/combos.
function filterByCategory(rows, categorySlug) {
  if (!categorySlug) return rows
  if (categorySlug === 'ofertas')
    return rows.filter((p) => Number(p.compare_at_price || 0) > Number(p.price || 0))
  if (categorySlug === 'combos') return rows.filter((p) => p.is_combo)
  return rows.filter((p) => p.category?.slug === categorySlug)
}

export async function listProducts({
  categorySlug,
  brandId,
  search,
  sort = 'featured',
  activeOnly = true,
} = {}) {
  if (isSupabaseConfigured) {
    let q = supabase.from('products').select(PRODUCT_SELECT)
    if (activeOnly) q = q.eq('is_active', true)
    if (brandId) q = q.eq('brand_id', brandId)
    if (search) q = q.ilike('name', `%${search}%`)
    const { data, error } = await q
    if (error) throw error
    return sortProducts(filterByCategory(data || [], categorySlug), sort)
  }

  let rows = db.products.map(enrich)
  if (activeOnly) rows = rows.filter((p) => p.is_active)
  rows = filterByCategory(rows, categorySlug)
  if (brandId) rows = rows.filter((p) => p.brand_id === brandId)
  if (search) {
    const s = search.toLowerCase()
    rows = rows.filter(
      (p) =>
        p.name.toLowerCase().includes(s) ||
        (p.brand?.name || '').toLowerCase().includes(s),
    )
  }
  return sortProducts(rows, sort)
}

function sortProducts(rows, sort) {
  const r = [...rows]
  switch (sort) {
    case 'price-asc':
      return r.sort((a, b) => a.price - b.price)
    case 'price-desc':
      return r.sort((a, b) => b.price - a.price)
    case 'name':
      return r.sort((a, b) => a.name.localeCompare(b.name))
    case 'featured':
    default:
      return r.sort((a, b) => Number(b.is_featured) - Number(a.is_featured) || a.price - b.price)
  }
}

export async function getProductBySlug(slug) {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from('products')
      .select(PRODUCT_SELECT)
      .eq('slug', slug)
      .maybeSingle()
    if (error) throw error
    return data
  }
  const p = db.products.find((x) => x.slug === slug)
  return p ? enrich(p) : null
}

export async function listFeatured(limit = 6) {
  const all = await listProducts({ sort: 'featured' })
  return all.filter((p) => p.is_featured).slice(0, limit)
}

export async function createProduct(payload) {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase.from('products').insert(payload).select().single()
    if (error) throw error
    return data
  }
  const row = { id: genId('p'), created_at: now(), is_active: true, is_featured: false, ...payload }
  db.products.unshift(row)
  return enrich(row)
}

export async function updateProduct(id, payload) {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from('products')
      .update(payload)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  }
  const i = db.products.findIndex((p) => p.id === id)
  if (i === -1) throw new Error('Producto no encontrado')
  db.products[i] = { ...db.products[i], ...payload }
  return enrich(db.products[i])
}

export async function deleteProduct(id) {
  if (isSupabaseConfigured) {
    const { error } = await supabase.from('products').delete().eq('id', id)
    if (error) throw error
    return
  }
  db.products = db.products.filter((p) => p.id !== id)
}

// Sube una imagen de producto al Storage de Supabase y devuelve su URL pública.
// En modo demo devuelve un data URL local para poder previsualizar.
export async function uploadProductImage(file) {
  if (isSupabaseConfigured) {
    const ext = (file.name.split('.').pop() || 'jpg').toLowerCase()
    const rand =
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.round(Math.random() * 1e9)}`
    const path = `${rand}.${ext}`
    const { error } = await supabase.storage
      .from('product-images')
      .upload(path, file, { cacheControl: '3600', upsert: false })
    if (error) throw error
    const { data } = supabase.storage.from('product-images').getPublicUrl(path)
    return data.publicUrl
  }
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

// ============================ CATEGORÍAS ============================

export async function listCategories() {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('sort_order', { ascending: true })
    if (error) throw error
    return data || []
  }
  return [...db.categories].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
}

export async function createCategory(payload) {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase.from('categories').insert(payload).select().single()
    if (error) throw error
    return data
  }
  const row = { id: genId('c'), sort_order: db.categories.length + 1, ...payload }
  db.categories.push(row)
  return row
}

export async function updateCategory(id, payload) {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from('categories')
      .update(payload)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  }
  const i = db.categories.findIndex((c) => c.id === id)
  db.categories[i] = { ...db.categories[i], ...payload }
  return db.categories[i]
}

export async function deleteCategory(id) {
  if (isSupabaseConfigured) {
    const { error } = await supabase.from('categories').delete().eq('id', id)
    if (error) throw error
    return
  }
  db.categories = db.categories.filter((c) => c.id !== id)
}

// ============================ MARCAS ============================

export async function listBrands() {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase.from('brands').select('*').order('name')
    if (error) throw error
    return data || []
  }
  return [...db.brands].sort((a, b) => a.name.localeCompare(b.name))
}

export async function createBrand(payload) {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase.from('brands').insert(payload).select().single()
    if (error) throw error
    return data
  }
  const row = { id: genId('b'), ...payload }
  db.brands.push(row)
  return row
}

export async function deleteBrand(id) {
  if (isSupabaseConfigured) {
    const { error } = await supabase.from('brands').delete().eq('id', id)
    if (error) throw error
    return
  }
  db.brands = db.brands.filter((b) => b.id !== id)
}

// ============================ PEDIDOS ============================

export async function createOrder({ customer, items, total, notes }) {
  if (isSupabaseConfigured) {
    // Camino ideal: función atómica que crea el pedido y descuenta stock.
    const { data, error } = await supabase.rpc('place_order', {
      p_customer: { name: customer.name, phone: customer.phone, address: customer.address },
      p_items: items.map((it) => ({ id: it.id, quantity: it.quantity })),
      p_notes: notes || null,
    })
    if (!error && data) return { id: data }

    // Si la función aún no está desplegada (no corriste la migración), caemos
    // al método anterior para no romper la tienda. Errores reales de negocio
    // (p. ej. "stock insuficiente") sí se propagan.
    const missingFn =
      error &&
      (error.code === 'PGRST202' ||
        /place_order|function|does not exist|not find/i.test(error.message || ''))
    if (error && !missingFn) throw error

    const orderId =
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.round(Math.random() * 1e9)}`
    const { error: e1 } = await supabase.from('orders').insert({
      id: orderId,
      customer_name: customer.name,
      customer_phone: customer.phone,
      delivery_address: customer.address,
      notes: notes || null,
      total,
      status: 'pendiente',
    })
    if (e1) throw e1
    const rows = items.map((it) => ({
      order_id: orderId,
      product_id: it.id,
      product_name: it.name,
      unit_price: it.price,
      quantity: it.quantity,
    }))
    const { error: e2 } = await supabase.from('order_items').insert(rows)
    if (e2) throw e2
    return { id: orderId }
  }

  // Modo demo: crea el pedido como solicitud (sin tocar stock).
  const order = {
    id: genId('ord'),
    created_at: now(),
    customer_name: customer.name,
    customer_phone: customer.phone,
    delivery_address: customer.address,
    notes: notes || null,
    total,
    status: 'pendiente',
    stock_applied: false,
  }
  db.orders.unshift(order)
  items.forEach((it) =>
    db.orderItems.push({
      id: genId('oi'),
      order_id: order.id,
      product_id: it.id,
      product_name: it.name,
      unit_price: it.price,
      quantity: it.quantity,
    }),
  )
  return order
}

export async function listOrders({ status } = {}) {
  if (isSupabaseConfigured) {
    let q = supabase
      .from('orders')
      .select('*, items:order_items(*)')
      .order('created_at', { ascending: false })
    if (status && status !== 'todos') q = q.eq('status', status)
    const { data, error } = await q
    if (error) throw error
    return data || []
  }
  let rows = db.orders.map((o) => ({
    ...o,
    items: db.orderItems.filter((it) => it.order_id === o.id),
  }))
  if (status && status !== 'todos') rows = rows.filter((o) => o.status === status)
  return rows.sort(byNewest)
}

export async function updateOrderStatus(id, status) {
  if (isSupabaseConfigured) {
    // RPC que ajusta el stock según la transición (descuenta al confirmar,
    // devuelve al cancelar un confirmado). Fallback si aún no está desplegada.
    const { error } = await supabase.rpc('set_order_status', {
      p_order_id: id,
      p_status: status,
    })
    if (!error) return { id, status }
    const missingFn =
      error.code === 'PGRST202' ||
      /set_order_status|function|does not exist|not find/i.test(error.message || '')
    if (!missingFn) throw error
    const { data, error: e2 } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', id)
      .select()
      .single()
    if (e2) throw e2
    return data
  }

  // Modo demo: replica el manejo de stock del RPC.
  const i = db.orders.findIndex((o) => o.id === id)
  if (i === -1) return null
  const order = db.orders[i]
  const committed = status === 'confirmado' || status === 'entregado'
  const applied = Boolean(order.stock_applied)
  const items = db.orderItems.filter((it) => it.order_id === id)

  if (committed && !applied) {
    items.forEach((it) => {
      const p = db.products.find((x) => x.id === it.product_id)
      if (p) p.stock = Math.max(0, (p.stock ?? 0) - it.quantity)
    })
    order.stock_applied = true
  } else if (!committed && applied) {
    items.forEach((it) => {
      const p = db.products.find((x) => x.id === it.product_id)
      if (p) p.stock = (p.stock ?? 0) + it.quantity
    })
    order.stock_applied = false
  }
  order.status = status
  db.orders[i] = { ...order }
  return db.orders[i]
}

// Elimina un pedido. Solo lo permitimos sobre pedidos cancelados (el stock ya
// fue devuelto), útil para limpiar pruebas/spam sin afectar inventario.
export async function deleteOrder(id) {
  if (isSupabaseConfigured) {
    const { error } = await supabase.from('orders').delete().eq('id', id)
    if (error) throw error
    return
  }
  db.orders = db.orders.filter((o) => o.id !== id)
  db.orderItems = db.orderItems.filter((it) => it.order_id !== id)
}
