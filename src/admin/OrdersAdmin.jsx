import { useState } from 'react'
import { ChevronDown, Phone, MapPin, Check, X, ArrowRight, Trash2 } from 'lucide-react'
import { useOrders } from '../hooks/useCatalog'
import { useOrderMutations } from '../hooks/useAdminMutations'
import { Spinner, EmptyState } from '../components/ui'
import { formatPrice } from '../config/site'
import { STATUS_META, STATUS_ORDER } from './orderStatus'

export default function OrdersAdmin() {
  const [filter, setFilter] = useState('todos')
  const { data: orders, isLoading } = useOrders(filter)
  const { updateStatus, remove } = useOrderMutations()
  const [expanded, setExpanded] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-3xl font-semibold text-cream">Pedidos</h1>
        <p className="mt-1 text-sm text-muted">Gestiona los pedidos entrantes de la web</p>
      </header>

      {/* Filtros por estado */}
      <div className="flex flex-wrap gap-2">
        {STATUS_ORDER.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`chip capitalize ${filter === s ? 'chip-active' : ''}`}
          >
            {s === 'todos' ? 'Todos' : STATUS_META[s].label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <Spinner />
      ) : orders?.length ? (
        <div className="space-y-3">
          {orders.map((o) => {
            const meta = STATUS_META[o.status] || STATUS_META.pendiente
            const isOpen = expanded === o.id
            return (
              <div key={o.id} className="card overflow-hidden">
                <button
                  onClick={() => setExpanded(isOpen ? null : o.id)}
                  className="flex w-full items-center gap-4 p-4 text-left"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-cream">{o.customer_name}</span>
                      <span className="text-xs text-muted">
                        #{String(o.id).slice(-6).toUpperCase()}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-muted">
                      {new Date(o.created_at).toLocaleString('es-PE', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                      {' · '}
                      {(o.items || []).reduce((n, it) => n + it.quantity, 0)} artículo(s)
                    </p>
                  </div>
                  <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${meta.badge}`}>
                    {meta.label}
                  </span>
                  <span className="shrink-0 font-semibold text-amber-400">{formatPrice(o.total)}</span>
                  <ChevronDown
                    size={18}
                    className={`shrink-0 text-muted transition-transform ${isOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {isOpen && (
                  <div className="border-t border-ink-800 bg-ink-950/40 p-5">
                    <div className="grid gap-6 md:grid-cols-[1fr_260px]">
                      {/* Items */}
                      <div>
                        <h4 className="mb-3 text-xs uppercase tracking-wider text-muted">Productos</h4>
                        <ul className="space-y-2">
                          {(o.items || []).map((it) => (
                            <li key={it.id || it.product_id} className="flex justify-between text-sm">
                              <span className="text-cream">
                                {it.quantity} × {it.product_name}
                              </span>
                              <span className="text-muted">
                                {formatPrice(it.unit_price * it.quantity)}
                              </span>
                            </li>
                          ))}
                        </ul>
                        <div className="mt-3 flex justify-between border-t border-ink-800 pt-3 text-sm font-semibold">
                          <span className="text-cream">Total</span>
                          <span className="text-amber-400">{formatPrice(o.total)}</span>
                        </div>
                      </div>

                      {/* Datos del cliente + acciones */}
                      <div className="space-y-3">
                        <h4 className="text-xs uppercase tracking-wider text-muted">Cliente</h4>
                        <p className="flex items-center gap-2 text-sm text-cream">
                          <Phone size={15} className="text-amber-500" />
                          <a href={`tel:${o.customer_phone}`} className="hover:text-amber-400">
                            {o.customer_phone}
                          </a>
                        </p>
                        <p className="flex items-start gap-2 text-sm text-cream">
                          <MapPin size={15} className="mt-0.5 shrink-0 text-amber-500" />
                          {o.delivery_address}
                        </p>
                        {o.notes && <p className="text-sm text-muted">Nota: {o.notes}</p>}

                        {/* Acciones de estado */}
                        <div className="flex flex-wrap gap-2 pt-2">
                          {meta.next && (
                            <button
                              onClick={() => updateStatus.mutate({ id: o.id, status: meta.next })}
                              className="btn-primary px-4 py-2 text-xs"
                            >
                              <ArrowRight size={14} /> Marcar {STATUS_META[meta.next].label}
                            </button>
                          )}
                          {o.status !== 'entregado' && o.status !== 'cancelado' && (
                            <button
                              onClick={() => updateStatus.mutate({ id: o.id, status: 'cancelado' })}
                              className="btn-ghost px-4 py-2 text-xs"
                            >
                              <X size={14} /> Cancelar
                            </button>
                          )}
                          {o.status === 'entregado' && (
                            <span className="inline-flex items-center gap-1.5 text-xs text-green-300">
                              <Check size={14} /> Pedido completado
                            </span>
                          )}

                          {/* Eliminar: solo en pedidos sin stock aplicado (pendiente/cancelado) */}
                          {(o.status === 'pendiente' || o.status === 'cancelado') &&
                            (confirmDelete === o.id ? (
                              <>
                                <button
                                  onClick={() => {
                                    remove.mutate(o.id)
                                    setConfirmDelete(null)
                                  }}
                                  className="btn-wine px-4 py-2 text-xs"
                                >
                                  <Trash2 size={14} /> Confirmar
                                </button>
                                <button
                                  onClick={() => setConfirmDelete(null)}
                                  className="btn-ghost px-4 py-2 text-xs"
                                >
                                  No
                                </button>
                              </>
                            ) : (
                              <button
                                onClick={() => setConfirmDelete(o.id)}
                                className="inline-flex items-center gap-1.5 px-2 py-2 text-xs text-muted hover:text-wine-light"
                              >
                                <Trash2 size={14} /> Eliminar
                              </button>
                            ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      ) : (
        <EmptyState
          title="No hay pedidos"
          hint={
            filter === 'todos'
              ? 'Los pedidos de la web aparecerán aquí automáticamente.'
              : 'No hay pedidos con este estado.'
          }
        />
      )}
    </div>
  )
}
