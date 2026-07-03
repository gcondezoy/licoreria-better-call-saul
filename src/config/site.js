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
  // Cloudflare Turnstile (anti-bot en el checkout). Vacío = desactivado.
  turnstileSiteKey: import.meta.env.VITE_TURNSTILE_SITE_KEY || '',
}

// ¿Está activo el CAPTCHA anti-bot?
export const isCaptchaEnabled = Boolean(SITE.turnstileSiteKey)

// Formatea un precio en soles.
export function formatPrice(value) {
  const n = Number(value || 0)
  return `${SITE.currency} ${n.toFixed(2)}`
}

// ¿El producto está en oferta? (tiene "precio antes" mayor al actual)
export function isOnSale(product) {
  const c = Number(product?.compare_at_price || 0)
  return c > Number(product?.price || 0)
}

// % de descuento entero (ej. 25). 0 si no está en oferta.
export function discountPct(product) {
  if (!isOnSale(product)) return 0
  const c = Number(product.compare_at_price)
  const p = Number(product.price)
  return Math.round(((c - p) / c) * 100)
}
