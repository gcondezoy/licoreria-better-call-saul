import { Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import AgeGate from '../components/AgeGate'
import CartDrawer from '../components/CartDrawer'
import WhatsappFab from '../components/WhatsappFab'
import { DemoBadge } from '../components/ui'
import { isSupabaseConfigured } from '../lib/supabase'

export default function PublicLayout() {
  const { pathname } = useLocation()

  // Sube al inicio al cambiar de ruta.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])

  return (
    <div className="flex min-h-screen flex-col">
      {!isSupabaseConfigured && <DemoBadge />}
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
      <WhatsappFab />
      <AgeGate />
    </div>
  )
}
