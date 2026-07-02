import { useEffect } from 'react'
import { X } from 'lucide-react'

export default function Modal({ open, onClose, title, children, size = 'md' }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  const width = size === 'lg' ? 'max-w-2xl' : size === 'sm' ? 'max-w-sm' : 'max-w-lg'

  return (
    <div className="fixed inset-0 z-[90] flex items-start justify-center overflow-y-auto bg-ink-950/80 p-4 backdrop-blur-sm animate-fade-in sm:p-8">
      <div className={`card w-full ${width} animate-fade-up`} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-ink-800 px-6 py-4">
          <h3 className="font-display text-lg font-semibold text-cream">{title}</h3>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full text-muted hover:bg-ink-800 hover:text-cream"
            aria-label="Cerrar"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
      <div className="fixed inset-0 -z-10" onClick={onClose} />
    </div>
  )
}
