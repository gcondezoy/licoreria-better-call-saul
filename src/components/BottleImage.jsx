// Ilustración de botella en SVG, teñida por el color de la categoría.
// Se usa como imagen del producto cuando aún no hay una foto real (image_url).

function hashHue(str = '') {
  let h = 0
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) % 360
  return h
}

export default function BottleImage({ product, className = '' }) {
  const color = product?.category?.color || product?.color || '#c8962c'
  const uid = (product?.id || product?.slug || product?.name || 'x').toString()
  const gradId = `g-${uid.replace(/[^a-z0-9]/gi, '')}`
  const initials = (product?.brand?.name || product?.name || '?')
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()

  return (
    <div className={`relative flex items-center justify-center overflow-hidden ${className}`}>
      {/* Halo de fondo */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(60% 55% at 50% 35%, ${color}22, transparent 70%)`,
        }}
      />
      <svg
        viewBox="0 0 120 220"
        className="relative h-full w-auto max-h-[85%] drop-shadow-[0_18px_28px_rgba(0,0,0,0.55)]"
        role="img"
        aria-label={product?.name || 'Botella'}
        style={{ filter: `hue-rotate(${hashHue(uid) % 12}deg)` }}
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.95" />
            <stop offset="55%" stopColor={color} stopOpacity="0.7" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.85" />
          </linearGradient>
        </defs>
        {/* Cuerpo de la botella */}
        <path
          d="M48 8 h24 v22 c0 6 6 8 6 20 v150 c0 8 -6 12 -18 12 h-6 c-12 0 -18 -4 -18 -12 V50 c0 -12 6 -14 6 -20 z"
          fill={`url(#${gradId})`}
          stroke="rgba(255,255,255,0.10)"
          strokeWidth="1.5"
        />
        {/* Tapa */}
        <rect x="50" y="2" width="20" height="10" rx="2" fill="#0a0a0b" />
        {/* Brillo lateral */}
        <path
          d="M52 60 q-4 60 0 130"
          fill="none"
          stroke="rgba(255,255,255,0.28)"
          strokeWidth="3"
          strokeLinecap="round"
        />
        {/* Etiqueta */}
        <rect x="42" y="112" width="36" height="52" rx="4" fill="#f4efe6" opacity="0.94" />
        <text
          x="60"
          y="140"
          textAnchor="middle"
          fontFamily="Fraunces, serif"
          fontSize="15"
          fontWeight="700"
          fill="#1a1a1e"
        >
          {initials}
        </text>
        <line x1="47" y1="150" x2="73" y2="150" stroke={color} strokeWidth="2" />
      </svg>
    </div>
  )
}
