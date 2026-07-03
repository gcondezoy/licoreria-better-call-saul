import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts'
import {
  DollarSign,
  ClipboardList,
  Receipt,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Boxes,
  AlertTriangle,
} from 'lucide-react'
import { useOrders, useProducts } from '../hooks/useCatalog'
import { Spinner } from '../components/ui'
import { formatPrice } from '../config/site'
import { STATUS_META } from './orderStatus'
import { RANGES, getRange, computeAnalytics } from './analytics'

const money0 = (v) => `S/ ${Math.round(v).toLocaleString('es-PE')}`
const CAT_COLORS = ['#c8962c', '#c4202f', '#7fa8bf', '#d8c07a', '#8a2a38', '#a0522d', '#d4b483', '#b8c4cc']

const TOOLTIP_STYLE = {
  background: '#1a1a1e',
  border: '1px solid #3a3a42',
  borderRadius: 12,
  color: '#f4efe6',
  fontSize: 12,
}
// Recharts colorea el texto del label/valor por su cuenta (queda oscuro sobre
// el fondo dark). Forzamos texto claro para que se lea.
const TOOLTIP_LABEL = { color: '#f4efe6', fontWeight: 600, marginBottom: 2 }
const TOOLTIP_ITEM = { color: '#a19a8c' }

function DeltaBadge({ value }) {
  if (value == null) return <span className="text-xs text-muted">— sin comparación</span>
  const up = value >= 0
  const Icon = up ? TrendingUp : TrendingDown
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-semibold ${
        up ? 'text-green-400' : 'text-wine-light'
      }`}
    >
      <Icon size={13} />
      {up ? '+' : ''}
      {value.toFixed(0)}% <span className="font-normal text-muted">vs periodo ant.</span>
    </span>
  )
}

export default function Dashboard() {
  const [rangeKey, setRangeKey] = useState('30d')
  const { data: orders, isLoading: lo } = useOrders('todos')
  const { data: products, isLoading: lp } = useProducts({ activeOnly: false })

  const a = useMemo(
    () => computeAnalytics(orders || [], products || [], getRange(rangeKey)),
    [orders, products, rangeKey],
  )

  if (lo || lp) return <Spinner label="Cargando dashboard…" />

  const kpis = [
    { icon: DollarSign, label: 'Ingresos', value: formatPrice(a.current.revenue), delta: a.deltas.revenue },
    { icon: ClipboardList, label: 'Pedidos', value: a.current.orderCount, delta: a.deltas.orderCount },
    { icon: Receipt, label: 'Ticket promedio', value: formatPrice(a.current.aov), delta: a.deltas.aov },
    {
      icon: TrendingUp,
      label: 'Margen',
      value: a.hasCost ? formatPrice(a.current.margin) : '—',
      delta: a.hasCost ? a.deltas.margin : null,
      hint: a.hasCost ? null : 'Ingresa costos en Productos',
    },
  ]

  const recent = (orders || []).slice(0, 6)

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-cream">Dashboard</h1>
          <p className="mt-1 text-sm text-muted">Resumen de tu licorería</p>
        </div>
        {/* Selector de rango */}
        <div className="flex rounded-full border border-ink-700 bg-ink-900 p-1">
          {RANGES.map((r) => (
            <button
              key={r.key}
              onClick={() => setRangeKey(r.key)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                rangeKey === r.key ? 'bg-amber-500 text-ink-950' : 'text-muted hover:text-cream'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </header>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map(({ icon: Icon, label, value, delta, hint }) => (
          <div key={label} className="card p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-muted">{label}</span>
              <Icon size={18} className="text-amber-400" />
            </div>
            <p className="mt-2 font-display text-2xl font-semibold text-cream">{value}</p>
            <div className="mt-1.5">{hint ? <span className="text-xs text-muted">{hint}</span> : <DeltaBadge value={delta} />}</div>
          </div>
        ))}
      </div>

      {/* Ventas en el tiempo + categorías */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card p-6 lg:col-span-2">
          <h2 className="font-display text-lg font-semibold text-cream">Ventas en el tiempo</h2>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={a.series} margin={{ left: -12, right: 8, top: 8 }}>
                <defs>
                  <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#c8962c" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="#c8962c" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="label"
                  tick={{ fill: '#a19a8c', fontSize: 11 }}
                  interval="preserveStartEnd"
                  minTickGap={24}
                />
                <YAxis tick={{ fill: '#a19a8c', fontSize: 11 }} tickFormatter={money0} width={64} />
                <Tooltip
                  contentStyle={TOOLTIP_STYLE}
                  labelStyle={TOOLTIP_LABEL}
                  itemStyle={TOOLTIP_ITEM}
                  formatter={(v) => [formatPrice(v), 'Ventas']}
                  cursor={{ stroke: '#c8962c', strokeOpacity: 0.3 }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#e0b354"
                  strokeWidth={2}
                  fill="url(#salesGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="font-display text-lg font-semibold text-cream">Ingresos por categoría</h2>
          {a.byCategory.length ? (
            <>
              <div className="mt-2 h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={a.byCategory}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={42}
                      outerRadius={68}
                      paddingAngle={2}
                      stroke="none"
                    >
                      {a.byCategory.map((_, i) => (
                        <Cell key={i} fill={CAT_COLORS[i % CAT_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={TOOLTIP_STYLE}
                      labelStyle={TOOLTIP_LABEL}
                      itemStyle={TOOLTIP_ITEM}
                      formatter={(v) => formatPrice(v)}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <ul className="mt-3 space-y-1.5">
                {a.byCategory.slice(0, 5).map((c, i) => (
                  <li key={c.name} className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-cream">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ background: CAT_COLORS[i % CAT_COLORS.length] }}
                      />
                      {c.name}
                    </span>
                    <span className="text-muted">{formatPrice(c.value)}</span>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="mt-6 text-sm text-muted">Aún no hay ventas en este periodo.</p>
          )}
        </div>
      </div>

      {/* Métricas secundarias */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Link to="/admin/pedidos" className="block transition-transform hover:-translate-y-0.5">
          <MiniStat
            icon={ClipboardList}
            label="Por confirmar"
            value={a.pending}
            tone={a.pending ? 'text-amber-400' : 'text-cream'}
          />
        </Link>
        <MiniStat icon={TrendingUp} label="Conversión" value={`${a.conversion.toFixed(0)}%`} tone="text-cream" />
        <MiniStat icon={Boxes} label="Valor de inventario" value={money0(a.inventoryValue)} tone="text-cream" />
        <MiniStat icon={AlertTriangle} label="Stock bajo" value={a.lowStock.length} tone={a.lowStock.length ? 'text-amber-400' : 'text-cream'} />
      </div>

      {/* Top productos por ingreso + stock bajo */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <h2 className="font-display text-lg font-semibold text-cream">Top productos por ingreso</h2>
          {a.topProducts.length ? (
            <div className="mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={a.topProducts} layout="vertical" margin={{ left: 10, right: 16 }}>
                  <XAxis type="number" hide />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={120}
                    tick={{ fill: '#a19a8c', fontSize: 11 }}
                    tickFormatter={(v) => (v.length > 18 ? v.slice(0, 18) + '…' : v)}
                  />
                  <Tooltip
                    contentStyle={TOOLTIP_STYLE}
                    labelStyle={TOOLTIP_LABEL}
                    itemStyle={TOOLTIP_ITEM}
                    formatter={(v) => [formatPrice(v), 'Ingreso']}
                    cursor={{ fill: 'rgba(255,255,255,0.04)' }}
                  />
                  <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                    {a.topProducts.map((_, i) => (
                      <Cell key={i} fill={i === 0 ? '#c8962c' : '#a67a1f'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="mt-6 text-sm text-muted">Aún no hay ventas en este periodo.</p>
          )}
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-cream">Stock bajo</h2>
            <Link to="/admin/productos" className="flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300">
              Gestionar <ArrowRight size={14} />
            </Link>
          </div>
          {a.lowStock.length ? (
            <ul className="mt-4 divide-y divide-ink-800">
              {a.lowStock.slice(0, 7).map((p) => (
                <li key={p.id} className="flex items-center justify-between py-2.5 text-sm">
                  <span className="truncate text-cream">{p.name}</span>
                  <span
                    className={`ml-3 shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      (p.stock ?? 0) === 0 ? 'bg-wine/30 text-wine-light' : 'bg-amber-500/15 text-amber-400'
                    }`}
                  >
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
                <div
                  key={o.id}
                  className="grid grid-cols-[1fr_104px_84px] items-center gap-3 p-4 text-sm sm:grid-cols-[1fr_130px_100px]"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium text-cream">{o.customer_name}</p>
                    <p className="text-xs text-muted">#{String(o.id).slice(-6).toUpperCase()}</p>
                  </div>
                  <span
                    className={`justify-self-start rounded-full px-2.5 py-1 text-xs font-semibold ${meta.badge}`}
                  >
                    {meta.label}
                  </span>
                  <span className="justify-self-end font-semibold text-amber-400">
                    {formatPrice(o.total)}
                  </span>
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

function MiniStat({ icon: Icon, label, value, tone }) {
  return (
    <div className="card flex items-center gap-4 p-5">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-ink-800 text-amber-400">
        <Icon size={20} />
      </span>
      <div>
        <p className="text-xs uppercase tracking-wider text-muted">{label}</p>
        <p className={`mt-0.5 font-display text-xl font-semibold ${tone}`}>{value}</p>
      </div>
    </div>
  )
}
