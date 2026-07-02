import { useEffect, useState } from 'react'
import { SITE } from '../config/site'

const KEY = 'licoreria_age_ok'

export default function AgeGate() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem(KEY)) setShow(true)
  }, [])

  if (!show) return null

  function accept() {
    localStorage.setItem(KEY, '1')
    setShow(false)
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-ink-950/95 p-5 backdrop-blur-md animate-fade-in">
      <div className="card w-full max-w-md p-8 text-center animate-fade-up">
        <img
          src="/licoreria-better-call-saul.jpg"
          alt={SITE.name}
          className="mx-auto h-24 w-auto mix-blend-screen"
        />
        <h2 className="mt-4 font-display text-2xl font-semibold text-cream">
          ¿Eres mayor de edad?
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Para ingresar a <span className="text-cream">{SITE.name}</span> debes tener
          <span className="font-semibold text-amber-400"> 18 años o más</span>. La venta de
          bebidas alcohólicas a menores de edad está prohibida.
        </p>
        <div className="mt-7 flex flex-col gap-3">
          <button onClick={accept} className="btn-primary w-full">
            Sí, soy mayor de 18 años
          </button>
          <a href="https://www.google.com" className="btn-ghost w-full">
            No, soy menor de edad
          </a>
        </div>
        <p className="mt-5 text-xs text-muted">Beber con moderación.</p>
      </div>
    </div>
  )
}
