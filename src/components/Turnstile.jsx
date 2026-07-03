import { useEffect, useRef } from 'react'
import { SITE } from '../config/site'

// Carga el script de Cloudflare Turnstile una sola vez.
let scriptPromise = null
function loadTurnstile() {
  if (typeof window === 'undefined') return Promise.resolve()
  if (window.turnstile) return Promise.resolve()
  if (scriptPromise) return scriptPromise
  scriptPromise = new Promise((resolve) => {
    const s = document.createElement('script')
    s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
    s.async = true
    s.defer = true
    s.onload = () => resolve()
    document.head.appendChild(s)
  })
  return scriptPromise
}

// Widget anti-bot. Llama onToken(token) al resolverse, u onToken('') al expirar.
export default function Turnstile({ onToken }) {
  const containerRef = useRef(null)
  const widgetId = useRef(null)

  useEffect(() => {
    let mounted = true
    loadTurnstile().then(() => {
      if (!mounted || !containerRef.current || !window.turnstile) return
      widgetId.current = window.turnstile.render(containerRef.current, {
        sitekey: SITE.turnstileSiteKey,
        theme: 'dark',
        callback: (token) => onToken(token),
        'expired-callback': () => onToken(''),
        'error-callback': () => onToken(''),
      })
    })
    return () => {
      mounted = false
      if (widgetId.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetId.current)
        } catch {
          /* noop */
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <div ref={containerRef} />
}
