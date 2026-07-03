import { useRef, useState } from 'react'
import { Upload, Loader2, ImageIcon } from 'lucide-react'
import { uploadProductImage } from '../data/api'

// Sube una foto al Storage y devuelve la URL vía onChange. Muestra preview.
export default function ImageUpload({ value, onChange }) {
  const inputRef = useRef(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  async function handleFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('El archivo debe ser una imagen.')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('La imagen no debe superar los 5 MB.')
      return
    }
    setError('')
    setUploading(true)
    try {
      const url = await uploadProductImage(file)
      onChange(url)
    } catch (err) {
      setError(err.message || 'No se pudo subir la imagen.')
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <div>
      <label className="label">Foto del producto</label>
      <div className="flex items-center gap-4">
        <div className="flex h-24 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-ink-700 bg-ink-800">
          {value ? (
            <img src={value} alt="Vista previa" className="h-full w-full object-cover" />
          ) : (
            <ImageIcon size={22} className="text-ink-600" />
          )}
        </div>

        <div className="flex-1">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleFile}
            className="hidden"
          />
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="btn-ghost px-4 py-2 text-sm"
            >
              {uploading ? (
                <>
                  <Loader2 size={15} className="animate-spin" /> Subiendo…
                </>
              ) : (
                <>
                  <Upload size={15} /> {value ? 'Cambiar foto' : 'Subir foto'}
                </>
              )}
            </button>
            {value && !uploading && (
              <button
                type="button"
                onClick={() => onChange('')}
                className="text-sm text-muted hover:text-wine-light"
              >
                Quitar
              </button>
            )}
          </div>
          <p className="mt-2 text-[11px] text-muted">
            JPG o PNG, hasta 5 MB. Si no subes foto, se usa la ilustración.
          </p>
          {error && <p className="mt-1 text-xs text-wine-light">{error}</p>}
        </div>
      </div>
    </div>
  )
}
