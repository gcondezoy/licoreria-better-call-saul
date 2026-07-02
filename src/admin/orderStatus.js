// Metadatos de los estados de pedido (etiqueta, colores del badge, siguiente estado).

export const STATUS_META = {
  pendiente: {
    label: 'Pendiente',
    badge: 'bg-amber-500/15 text-amber-400',
    next: 'confirmado',
  },
  confirmado: {
    label: 'Confirmado',
    badge: 'bg-blue-500/15 text-blue-300',
    next: 'entregado',
  },
  entregado: {
    label: 'Entregado',
    badge: 'bg-green-500/15 text-green-300',
    next: null,
  },
  cancelado: {
    label: 'Cancelado',
    badge: 'bg-wine/30 text-wine-light',
    next: null,
  },
}

export const STATUS_ORDER = ['todos', 'pendiente', 'confirmado', 'entregado', 'cancelado']
