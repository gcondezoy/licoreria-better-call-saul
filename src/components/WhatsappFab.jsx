import WhatsappGlyph from './WhatsappGlyph'
import { SITE } from '../config/site'

// Botón flotante de WhatsApp, presente en todas las páginas públicas.
export default function WhatsappFab() {
  const href = `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(
    `Hola ${SITE.name}, quiero hacer una consulta 👋`,
  )}`

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label="Escríbenos por WhatsApp"
      className="group fixed bottom-5 right-5 z-50 flex items-center gap-0 rounded-full bg-[#25D366] py-3.5 pl-3.5 pr-3.5 text-ink-950 shadow-[0_10px_30px_rgba(37,211,102,0.35)] transition-all hover:pr-5 hover:shadow-[0_12px_38px_rgba(37,211,102,0.5)] active:scale-95"
    >
      {/* Anillo de pulso */}
      <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-[#25D366] opacity-20" />
      <WhatsappGlyph size={26} />
      <span className="max-w-0 overflow-hidden whitespace-nowrap text-sm font-semibold opacity-0 transition-all duration-300 group-hover:ml-2 group-hover:max-w-[140px] group-hover:opacity-100">
        Escríbenos
      </span>
    </a>
  )
}
