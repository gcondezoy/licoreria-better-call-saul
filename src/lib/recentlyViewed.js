// Guarda los últimos productos vistos por el cliente (localStorage).

const KEY = 'licoreria_recent'
const MAX = 10

function slim(p) {
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: p.price,
    compare_at_price: p.compare_at_price ?? null,
    is_combo: p.is_combo ?? false,
    combo_items: p.combo_items ?? null,
    stock: p.stock ?? 0,
    image_url: p.image_url ?? null,
    volume_ml: p.volume_ml ?? null,
    abv: p.abv ?? null,
    category: p.category
      ? { name: p.category.name, slug: p.category.slug, color: p.category.color }
      : null,
    brand: p.brand ? { name: p.brand.name } : null,
  }
}

export function getRecent() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]')
  } catch {
    return []
  }
}

export function addRecent(product) {
  if (!product?.slug) return
  try {
    const list = getRecent().filter((p) => p.slug !== product.slug)
    list.unshift(slim(product))
    localStorage.setItem(KEY, JSON.stringify(list.slice(0, MAX)))
  } catch {
    /* almacenamiento no disponible */
  }
}
