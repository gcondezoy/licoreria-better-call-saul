import { useEffect, useState } from 'react'
import ProductCard from './ProductCard'
import { getRecent } from '../lib/recentlyViewed'

export default function RecentlyViewed({ excludeSlug, title = 'Vistos recientemente', limit = 4 }) {
  const [items, setItems] = useState([])

  useEffect(() => {
    setItems(getRecent().filter((p) => p.slug !== excludeSlug))
  }, [excludeSlug])

  if (items.length === 0) return null

  return (
    <section className="mt-16">
      <h2 className="mb-6 font-display text-2xl font-semibold text-cream">{title}</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {items.slice(0, limit).map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  )
}
