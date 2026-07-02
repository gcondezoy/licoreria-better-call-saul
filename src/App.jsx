import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import PublicLayout from './layouts/PublicLayout'
import Home from './pages/Home'
import Catalog from './pages/Catalog'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import About from './pages/About'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'
import { Spinner } from './components/ui'

// El panel admin (con Recharts, formularios, etc.) se carga aparte: los
// visitantes de la tienda no descargan ese código.
const AdminLayout = lazy(() => import('./admin/AdminLayout'))
const Login = lazy(() => import('./admin/Login'))
const Dashboard = lazy(() => import('./admin/Dashboard'))
const ProductsAdmin = lazy(() => import('./admin/ProductsAdmin'))
const OrdersAdmin = lazy(() => import('./admin/OrdersAdmin'))
const CategoriesAdmin = lazy(() => import('./admin/CategoriesAdmin'))

export default function App() {
  return (
    <Routes>
      {/* Sitio público */}
      <Route element={<PublicLayout />}>
        <Route index element={<Home />} />
        <Route path="catalogo" element={<Catalog />} />
        <Route path="producto/:slug" element={<ProductDetail />} />
        <Route path="carrito" element={<Cart />} />
        <Route path="nosotros" element={<About />} />
        <Route path="contacto" element={<Contact />} />
      </Route>

      {/* Panel admin */}
      <Route
        path="/admin/login"
        element={
          <Suspense fallback={<Spinner label="Cargando…" />}>
            <Login />
          </Suspense>
        }
      />
      <Route
        path="/admin"
        element={
          <Suspense fallback={<Spinner label="Cargando…" />}>
            <AdminLayout />
          </Suspense>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="productos" element={<ProductsAdmin />} />
        <Route path="pedidos" element={<OrdersAdmin />} />
        <Route path="categorias" element={<CategoriesAdmin />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
