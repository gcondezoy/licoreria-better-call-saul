import { Link } from 'react-router-dom'
import { ArrowRight, Truck, ShieldCheck, Clock, MessageCircle } from 'lucide-react'
import { useFeatured, useCategories } from '../hooks/useCatalog'
import ProductCard from '../components/ProductCard'
import ProductImage from '../components/ProductImage'
import TrustStrip from '../components/TrustStrip'
import Reveal from '../components/Reveal'
import { SkeletonGrid } from '../components/ui'
import { SITE } from '../config/site'

export default function Home() {
  const { data: featured, isLoading } = useFeatured(8)
  const { data: categories } = useCategories()

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(70% 60% at 75% 20%, rgba(200,150,44,0.18), transparent 60%), radial-gradient(50% 50% at 15% 90%, rgba(107,31,42,0.25), transparent 60%)',
          }}
        />
        <div className="container-page relative grid items-center gap-10 py-16 lg:grid-cols-2 lg:py-24">
          <div className="animate-fade-up">
            <p className="eyebrow">{SITE.deliveryNote}</p>
            <h1 className="mt-4 font-display text-4xl font-semibold leading-[1.05] text-cream sm:text-5xl lg:text-6xl">
              Los mejores licores,{' '}
              <span className="text-amber-400">en la puerta de tu casa</span>.
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-muted">
              Whisky, ron, pisco, vinos y más. Arma tu pedido y lo coordinamos al instante por
              WhatsApp. Rápido, fácil y con la mejor selección.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/catalogo" className="btn-primary">
                Ver catálogo <ArrowRight size={18} />
              </Link>
              <a
                href={`https://wa.me/${SITE.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="btn-ghost"
              >
                <MessageCircle size={18} /> Escríbenos
              </a>
            </div>

            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-4">
              {[
                { icon: Truck, text: 'Delivery rápido' },
                { icon: Clock, text: SITE.hours.split('·')[0] },
                { icon: ShieldCheck, text: 'Productos originales' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2 text-sm text-cream/80">
                  <Icon size={18} className="text-amber-500" /> {text}
                </div>
              ))}
            </div>
          </div>

          {/* Bloque visual del hero */}
          <div className="relative hidden lg:block">
            <div className="mx-auto grid max-w-md grid-cols-2 gap-4">
              {featured?.slice(0, 4).map((p, i) => (
                <Link
                  key={p.id}
                  to={`/producto/${p.slug}`}
                  className={`card overflow-hidden ${i % 2 ? 'mt-8' : ''} animate-fade-up`}
                  style={{ animationDelay: `${i * 90}ms` }}
                >
                  <div className="aspect-[3/4] bg-gradient-to-b from-ink-800 to-ink-900">
                    <ProductImage product={p} className="h-full w-full" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FRANJA DE CONFIANZA */}
      <Reveal>
        <TrustStrip />
      </Reveal>

      {/* CATEGORÍAS */}
      <section className="container-page pt-12 pb-2">
        <Reveal>
          <p className="eyebrow">Explora por categoría</p>
          <div className="mt-4 flex flex-wrap gap-2.5">
            {categories?.map((c) => (
              <Link
                key={c.id}
                to={`/catalogo?categoria=${c.slug}`}
                className="chip hover:scale-[1.03]"
                style={{ borderColor: `${c.color}55` }}
              >
                <span className="h-2 w-2 rounded-full" style={{ background: c.color }} />
                {c.name}
              </Link>
            ))}
          </div>
        </Reveal>
      </section>

      {/* DESTACADOS */}
      <section className="container-page pb-12 pt-10">
        <Reveal className="mb-8 flex items-end justify-between">
          <div>
            <p className="eyebrow">Selección de la casa</p>
            <h2 className="mt-2 font-display text-3xl font-semibold text-cream">Destacados</h2>
          </div>
          <Link to="/catalogo" className="hidden items-center gap-1.5 text-sm text-amber-400 hover:text-amber-300 sm:flex">
            Ver todo <ArrowRight size={16} />
          </Link>
        </Reveal>

        {isLoading ? (
          <SkeletonGrid count={8} />
        ) : (
          <Reveal delay={80} className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {featured?.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </Reveal>
        )}
      </section>

      {/* BANNER DELIVERY */}
      <section className="container-page py-6">
        <Reveal className="relative overflow-hidden rounded-3xl border border-amber-500/20 bg-gradient-to-r from-wine/40 via-ink-900 to-ink-900 p-8 sm:p-12">
          <div className="relative max-w-xl">
            <h3 className="font-display text-2xl font-semibold text-cream sm:text-3xl">
              ¿Se acabó la reunión sin trago?
            </h3>
            <p className="mt-3 text-muted">
              Pídelo ahora y te lo llevamos. Coordinamos todo por WhatsApp: pago con Yape, Plin,
              tarjeta o efectivo contra entrega.
            </p>
            <a
              href={`https://wa.me/${SITE.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              className="btn-primary mt-6"
            >
              <MessageCircle size={18} /> Pedir por WhatsApp
            </a>
          </div>
        </Reveal>
      </section>
    </div>
  )
}
