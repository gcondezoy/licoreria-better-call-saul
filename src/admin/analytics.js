// Cálculo de métricas del dashboard. Funciones puras sobre pedidos + productos.
// (En una fase posterior esto se moverá a agregaciones SQL en Supabase para
//  escalar; por ahora se calcula en el cliente.)

export const RANGES = [
  { key: 'today', label: 'Hoy' },
  { key: '7d', label: '7 días' },
  { key: '30d', label: '30 días' },
  { key: 'all', label: 'Todo' },
]

// Devuelve el rango [from, to) actual y el periodo anterior equivalente.
export function getRange(key) {
  const now = new Date()
  const to = new Date(now)
  let from
  let prevFrom = null
  let prevTo = null
  let groupBy = 'day'

  if (key === 'today') {
    from = new Date(now)
    from.setHours(0, 0, 0, 0)
    prevTo = new Date(from)
    prevFrom = new Date(from)
    prevFrom.setDate(prevFrom.getDate() - 1)
    groupBy = 'hour'
  } else if (key === '7d') {
    from = new Date(now)
    from.setDate(from.getDate() - 7)
    prevTo = new Date(from)
    prevFrom = new Date(from)
    prevFrom.setDate(prevFrom.getDate() - 7)
  } else if (key === '30d') {
    from = new Date(now)
    from.setDate(from.getDate() - 30)
    prevTo = new Date(from)
    prevFrom = new Date(from)
    prevFrom.setDate(prevFrom.getDate() - 30)
  } else {
    from = new Date(0) // Todo
  }
  return { from, to, prevFrom, prevTo, groupBy }
}

function pct(cur, prev) {
  if (!prev) return null // sin base de comparación
  return ((cur - prev) / prev) * 100
}

const dayKey = (d) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`

// Una VENTA cuenta solo si el pedido fue confirmado o entregado.
// Los pendientes son leads (no tocan ventas) y los cancelados no cuentan.
const isSold = (o) => o.status === 'confirmado' || o.status === 'entregado'

function summarize(list, prodById) {
  const sold = list.filter(isSold)
  const revenue = sold.reduce((s, o) => s + Number(o.total || 0), 0)
  let cogs = 0
  sold.forEach((o) =>
    (o.items || []).forEach((it) => {
      const cost = prodById[it.product_id]?.cost ?? 0
      cogs += cost * it.quantity
    }),
  )
  return {
    revenue,
    orderCount: list.length,
    pending: list.filter((o) => o.status === 'pendiente').length,
    cancelled: list.filter((o) => o.status === 'cancelado').length,
    aov: sold.length ? revenue / sold.length : 0,
    cogs,
    margin: revenue - cogs,
    soldCount: sold.length,
  }
}

function buildSeries(orders, range) {
  const points = []
  if (range.groupBy === 'hour') {
    const map = {}
    orders.forEach((o) => {
      const h = new Date(o.created_at).getHours()
      map[h] = (map[h] || 0) + Number(o.total || 0)
    })
    for (let h = 0; h < 24; h += 1) {
      points.push({ label: `${String(h).padStart(2, '0')}h`, value: map[h] || 0 })
    }
    return points
  }

  // Modo diario (o mensual si el rango es muy amplio).
  let start = range.from
  if (start.getTime() === 0) {
    const times = orders.map((o) => new Date(o.created_at).getTime())
    start = times.length ? new Date(Math.min(...times)) : new Date(range.to)
  }
  start = new Date(start)
  start.setHours(0, 0, 0, 0)
  const end = new Date(range.to)
  end.setHours(0, 0, 0, 0)
  const spanDays = Math.round((end - start) / 86400000) + 1
  const monthly = spanDays > 92

  const map = {}
  orders.forEach((o) => {
    const d = new Date(o.created_at)
    const key = monthly ? `${d.getFullYear()}-${d.getMonth()}` : dayKey(d)
    map[key] = (map[key] || 0) + Number(o.total || 0)
  })

  const cur = new Date(start)
  if (monthly) cur.setDate(1)
  while (cur <= end) {
    if (monthly) {
      points.push({
        label: cur.toLocaleDateString('es-PE', { month: 'short', year: '2-digit' }),
        value: map[`${cur.getFullYear()}-${cur.getMonth()}`] || 0,
      })
      cur.setMonth(cur.getMonth() + 1)
    } else {
      points.push({
        label: cur.toLocaleDateString('es-PE', { day: '2-digit', month: 'short' }),
        value: map[dayKey(cur)] || 0,
      })
      cur.setDate(cur.getDate() + 1)
    }
  }
  return points
}

export function computeAnalytics(orders = [], products = [], range) {
  const prodById = {}
  products.forEach((p) => {
    prodById[p.id] = p
  })

  const inRange = (o, from, to) => {
    if (!from) return false
    const t = new Date(o.created_at).getTime()
    return t >= from.getTime() && t < to.getTime()
  }

  const cur = orders.filter((o) => inRange(o, range.from, range.to))
  const prev = range.prevFrom ? orders.filter((o) => inRange(o, range.prevFrom, range.prevTo)) : []
  const soldCur = cur.filter(isSold) // solo ventas reales para categorías/top/serie

  const c = summarize(cur, prodById)
  const p = summarize(prev, prodById)

  // Ingresos por categoría
  const catMap = {}
  soldCur.forEach((o) =>
    (o.items || []).forEach((it) => {
      const cat = prodById[it.product_id]?.category?.name || 'Otros'
      catMap[cat] = (catMap[cat] || 0) + it.unit_price * it.quantity
    }),
  )
  const byCategory = Object.entries(catMap)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)

  // Top productos por INGRESO (no solo unidades)
  const prodMap = {}
  soldCur.forEach((o) =>
    (o.items || []).forEach((it) => {
      prodMap[it.product_name] = (prodMap[it.product_name] || 0) + it.unit_price * it.quantity
    }),
  )
  const topProducts = Object.entries(prodMap)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6)

  // Conversión: de los pedidos ya resueltos (vendidos o cancelados), % que se vendió.
  const resolved = c.soldCount + c.cancelled
  const conversion = resolved ? (c.soldCount / resolved) * 100 : 0

  return {
    current: c,
    previous: p,
    deltas: {
      revenue: pct(c.revenue, p.revenue),
      orderCount: pct(c.orderCount, p.orderCount),
      aov: pct(c.aov, p.aov),
      margin: pct(c.margin, p.margin),
    },
    byCategory,
    topProducts,
    series: buildSeries(soldCur, range),
    pending: c.pending,
    conversion,
    cancelRate: c.orderCount ? (c.cancelled / c.orderCount) * 100 : 0,
    inventoryValue: products.reduce((s, p2) => s + (p2.stock ?? 0) * (p2.price ?? 0), 0),
    lowStock: products.filter((p2) => (p2.stock ?? 0) <= 5),
    hasComparison: Boolean(range.prevFrom),
    hasCost: products.some((p2) => (p2.cost ?? 0) > 0),
  }
}
