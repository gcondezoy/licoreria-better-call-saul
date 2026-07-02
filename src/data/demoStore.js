// Store en memoria para el "modo demo" (sin Supabase).
// Permite que TODA la app —incluido el panel admin— funcione y sea navegable.
// Los cambios persisten durante la sesión del navegador (no en disco).

import { seedProducts, seedCategories, seedBrands } from './seed'

const clone = (x) => JSON.parse(JSON.stringify(x))

export const db = {
  products: clone(seedProducts),
  categories: clone(seedCategories),
  brands: clone(seedBrands),
  orders: [],
  orderItems: [],
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
