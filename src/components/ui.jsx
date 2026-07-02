import { Loader2, PackageOpen } from 'lucide-react'

export function Spinner({ label = 'Cargando…' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20 text-muted">
      <Loader2 className="animate-spin text-amber-500" size={28} />
      <p className="text-sm">{label}</p>
    </div>
  )
}

export function EmptyState({ title = 'Sin resultados', hint }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
      <PackageOpen className="text-ink-600" size={40} />
      <p className="font-display text-lg text-cream">{title}</p>
      {hint && <p className="max-w-sm text-sm text-muted">{hint}</p>}
    </div>
  )
}

export function SkeletonGrid({ count = 8 }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card overflow-hidden">
          <div className="aspect-[4/5] animate-pulse bg-ink-800" />
          <div className="space-y-2 p-4">
            <div className="h-3 w-1/2 animate-pulse rounded bg-ink-800" />
            <div className="h-4 w-3/4 animate-pulse rounded bg-ink-800" />
            <div className="h-5 w-1/3 animate-pulse rounded bg-ink-800" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function DemoBadge() {
  return (
    <div className="border-b border-amber-500/20 bg-amber-500/10 py-2 text-center text-xs text-amber-400">
      Modo demo · datos de ejemplo. Conecta Supabase en <code className="font-mono">.env</code> para usar tu base de datos real.
    </div>
  )
}
