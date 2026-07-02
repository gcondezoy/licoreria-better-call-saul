import { SITE, formatPrice } from '../config/site'

// Construye el mensaje de WhatsApp con el resumen del pedido y devuelve el enlace wa.me.
export function buildWhatsappUrl({ order, items, customer, total }) {
  const lines = []
  lines.push(`*Nuevo pedido - ${SITE.name}*`)
  if (order?.id) lines.push(`Pedido: #${String(order.id).slice(-6).toUpperCase()}`)
  lines.push('')
  lines.push('*Productos:*')
  items.forEach((it) => {
    lines.push(`• ${it.quantity} x ${it.name} — ${formatPrice(it.price * it.quantity)}`)
  })
  lines.push('')
  lines.push(`*Total: ${formatPrice(total)}*`)
  lines.push('')
  lines.push('*Datos de entrega:*')
  lines.push(`Nombre: ${customer.name}`)
  lines.push(`Teléfono: ${customer.phone}`)
  lines.push(`Dirección: ${customer.address}`)
  if (customer.notes) lines.push(`Notas: ${customer.notes}`)

  const text = encodeURIComponent(lines.join('\n'))
  return `https://wa.me/${SITE.whatsapp}?text=${text}`
}
