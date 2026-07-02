// Store en memoria para el "modo demo" (sin Supabase).
// Permite que TODA la app —incluido el panel admin— funcione y sea navegable.
// Los cambios persisten durante la sesión del navegador (no en disco).

import { seedProducts, seedCategories, seedBrands } from './seed'

const clone = (x) => JSON.parse(JSON.stringify(x))

// En modo demo estimamos un costo (~68% del precio) para poder mostrar margen.
// En producción el costo real se ingresa desde el panel de productos.
const withCost = (products) =>
  products.map((p) => ({ ...p, cost: p.cost ?? Math.round(p.price * 0.68 * 100) / 100 }))

const DEMO_CUSTOMERS = [
  ['Juan Pérez', '987111222', 'Av. Larco 123, Miraflores'],
  ['María Gómez', '987333444', 'Jr. Unión 456, Cercado de Lima'],
  ['Carlos Ruiz', '987555666', 'Av. Brasil 789, Jesús María'],
  ['Lucía Torres', '987777888', 'Calle Los Pinos 321, San Isidro'],
  ['Diego Salas', '987999000', 'Av. Benavides 654, Surco'],
  ['Ana Flores', '987121314', 'Jr. Puno 147, Barranco'],
]
const DEMO_STATUSES = ['entregado', 'entregado', 'entregado', 'entregado', 'confirmado', 'pendiente', 'cancelado']

// Genera pedidos de ejemplo repartidos en los últimos ~28 días.
function buildSeedOrders(products) {
  const orders = []
  const orderItems = []
  const nowMs = Date.now()
  for (let i = 0; i < 18; i += 1) {
    const id = `seed-ord-${i}`
    const daysAgo = (i * 27) / 18
    const created = new Date(nowMs - daysAgo * 86400000 - ((i * 37) % 12) * 3600000)
    const cust = DEMO_CUSTOMERS[i % DEMO_CUSTOMERS.length]
    const status = DEMO_STATUSES[i % DEMO_STATUSES.length]
    const count = 1 + (i % 3)
    let total = 0
    for (let k = 0; k < count; k += 1) {
      const prod = products[(i * 3 + k * 5) % products.length]
      const qty = 1 + ((i + k) % 3)
      total += prod.price * qty
      orderItems.push({
        id: `seed-oi-${i}-${k}`,
        order_id: id,
        product_id: prod.id,
        product_name: prod.name,
        unit_price: prod.price,
        quantity: qty,
      })
    }
    orders.push({
      id,
      created_at: created.toISOString(),
      customer_name: cust[0],
      customer_phone: cust[1],
      delivery_address: cust[2],
      notes: null,
      total: Math.round(total * 100) / 100,
      status,
    })
  }
  orders.sort((a, b) => b.created_at.localeCompare(a.created_at))
  return { orders, orderItems }
}

const demoProducts = withCost(clone(seedProducts))
const seeded = buildSeedOrders(demoProducts)

export const db = {
  products: demoProducts,
  categories: clone(seedCategories),
  brands: clone(seedBrands),
  orders: seeded.orders,
  orderItems: seeded.orderItems,
}

let counter = 1000
export function genId(prefix = 'id') {
  counter += 1
  return `${prefix}-${counter}`
}

// Marca de tiempo estable-ish para el modo demo.
let clockOffset = 0
export function now() {
  clockOffset += 1000
  return new Date(Date.parse('2026-07-02T12:00:00Z') + clockOffset).toISOString()
}
