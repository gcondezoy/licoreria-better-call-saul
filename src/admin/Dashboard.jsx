import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from 'recharts'
import { DollarSign, ClipboardList, Package, AlertTriangle, ArrowRight } from 'lucide-react'
import { useOrders, useProducts } from '../hooks/useCatalog'
import { Spinner } from '../components/ui'
import { formatPrice } from '../config/site'
import { STATUS_META } from './orderStatus'

const LOW_STOCK = 5

export default function Dashboard() {
  const { data: orders, isLoading: lo } = useOrders('todos')
  const { data: products, isLoading: lp } = useProducts({ activeOnly: false })

  const stats = useMemo(() => {
    const os = orders || []
    const ps = products || []
    const revenue = os
      .filter((o) => o.status !== 'cancelado')
      .reduce((s, o) => s + Number(o.total || 0), 0)
    const pending = os.filter((o) => o.status === 'pendiente').length
    const lowStock = ps.filter((p) => (p.stock ?? 0) <= LOW_STOCK)

    // Top productos por unidades vendidas
    const unitMap = {}
    os.forEach((o) =>
      (o.items || []).forEach((it) => {
        unitMap[it.product_name] = (unitMap[it.product_name] || 0) + it.quantity
      }),
    )
    const topProducts = Object.entries(unitMap)
      .map(([name, units]) => ({ name, units }))
      .sort((a, b) => b.units - a.units)
      .slice(0, 6)

    return { revenue, pending, lowStock, topProducts, orderCount: os.length, productCount: ps.length }
  }, [orders, products])

  if (lo || lp) return <Spinner label="Cargando dashboard…" />

  const cards = [
    { icon: DollarSign, label: 'Ventas totales', value: formatPrice(stats.revenue), tone: 'text-amber-400' },
    { icon: ClipboardList, label: 'Pedidos', value: stats.orderCount, sub: `${stats.pending} pendientes`, tone: 'text-cream' },
    { icon: Package, label: 'Productos', value: stats.productCount, tone: 'text-cream' },
    { icon: AlertTriangle, label: 'Stock bajo', value: stats.lowStock.length, tone: stats.lowStock.length ? 'text-wine-light' : 'text-cream' },
  ]

  const recent = (orders || []).slice(0, 6)

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-display text-3xl font-semibold text-cream">Dashboard</h1>
        <p className="mt-1 text-sm text-muted">Resumen de tu licorería</p>
      </header>

      {/* Tarjetas */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ icon: Icon, label, value, sub, tone }) => (
          <div key={label} className="card p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-muted">{label}</span>
              <Icon size={18} className={tone} />
            </div>
            <p className={`mt-3 font-display text-2xl font-semibold ${tone}`}>{value}</p>
            {sub && <p className="mt-1 text-xs text-muted">{sub}</p>}
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top productos */}
        <div className="card p-6">
          <h2 className="font-display text-lg font-semibold text-cream">Más vendidos (unidades)</h2>
          {stats.topProducts.length ? (
            <div className="mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.topProducts} layout="vertical" margin={{ left: 10, right: 20 }}>
                  <XAxis type="number" hide />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={110}
                    tick={{ fill: '#a19a8c', fontSize: 11 }}
                    tickFormatter={(v) => (v.length > 16 ? v.slice(0, 16) + '…' : v)}
                  />
                  <Tooltip
                    cursor={{ fill: 'rgba(255,255,255,0.04)' }}
                    contentStyle={{ background: '#1a1a1e', border: '1px solid #3a3a42', borderRadius: 12, color: '#f4efe6' }}
                  />
                  <Bar dataKey="units" radius={[0, 6, 6, 0]}>
                    {stats.topProducts.map((_, i) => (
                      <Cell key={i} fill={i === 0 ? '#c8962c' : '#a67a1f'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="mt-6 text-sm text-muted">Aún no hay ventas registradas.</p>
          )}
        </div>

        {/* Stock bajo */}
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-cream">Stock bajo</h2>
            <Link to="/admin/productos" className="flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300">
              Gestionar <ArrowRight size={14} />
            </Link>
          </div>
          {stats.lowStock.length ? (
            <ul className="mt-4 divide-y divide-ink-800">
              {stats.lowStock.slice(0, 6).map((p) => (
                <li key={p.id} className="flex items-center justify-between py-2.5 text-sm">
                  <span className="truncate text-cream">{p.name}</span>
                  <span className={`ml-3 shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    (p.stock ?? 0) === 0 ? 'bg-wine/30 text-wine-light' : 'bg-amber-500/15 text-amber-400'
                  }`}>
                    {p.stock ?? 0} und.
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-6 text-sm text-muted">Todo el inventario tiene stock suficiente. 👌</p>
          )}
        </div>
      </div>

      {/* Pedidos recientes */}
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between border-b border-ink-800 p-5">
          <h2 className="font-display text-lg font-semibold text-cream">Pedidos recientes</h2>
          <Link to="/admin/pedidos" className="flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300">
            Ver todos <ArrowRight size={14} />
          </Link>
        </div>
        {recent.length ? (
          <div className="divide-y divide-ink-800">
            {recent.map((o) => {
              const meta = STATUS_META[o.status] || STATUS_META.pendiente
              return (
                <div key={o.id} className="flex items-center justify-between gap-4 p-4 text-sm">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-cream">{o.customer_name}</p>
                    <p className="text-xs text-muted">#{String(o.id).slice(-6).toUpperCase()}</p>
                  </div>
                  <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${meta.badge}`}>
                    {meta.label}
                  </span>
                  <span className="shrink-0 font-semibold text-amber-400">{formatPrice(o.total)}</span>
                </div>
              )
            })}
          </div>
        ) : (
          <p className="p-8 text-center text-sm text-muted">Aún no hay pedidos.</p>
        )}
      </div>
    </div>
  )
}
