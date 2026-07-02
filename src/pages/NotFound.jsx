import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="font-display text-7xl font-semibold text-amber-500">404</p>
      <h1 className="mt-4 font-display text-2xl font-semibold text-cream">Página no encontrada</h1>
      <p className="mt-2 text-muted">La página que buscas no existe o fue movida.</p>
      <Link to="/" className="btn-primary mt-8">
        Volver al inicio
      </Link>
    </div>
  )
}
