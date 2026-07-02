// Configuración central del negocio.
// Cambia estos valores en un solo lugar para personalizar toda la web.

export const SITE = {
  name: 'Licorería Better Call Saul',
  tagline: 'Licores premium con delivery',
  // WhatsApp en formato internacional, solo dígitos. Se lee de .env si existe.
  whatsapp: import.meta.env.VITE_WHATSAPP_NUMBER || '51999999999',
  email: 'pedidos@bettercallsaul.pe',
  address: 'Av. Ejemplo 123, Lima, Perú',
  hours: 'Lun a Dom · 10:00 a.m. – 11:00 p.m.',
  deliveryNote: 'Delivery en Lima Metropolitana · Pedido mínimo S/ 30',
  currency: 'S/',
  // Redes (opcional)
  instagram: 'https://instagram.com',
  facebook: 'https://facebook.com',
}

// Formatea un precio en soles.
export function formatPrice(value) {
  const n = Number(value || 0)
  return `${SITE.currency} ${n.toFixed(2)}`
}
