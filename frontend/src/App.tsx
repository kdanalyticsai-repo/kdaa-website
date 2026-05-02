import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Layout from '@/components/layout/Layout'
import Home from '@/pages/Home'
import ServicesPage from '@/pages/Services'
import ServiceDetailPage from '@/pages/ServiceDetail'
import ProductsPage from '@/pages/Products'
import AboutPage from '@/pages/About'
import ContactPage from '@/pages/Contact'
import NotFound from '@/pages/NotFound'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/"               element={<Home />} />
          <Route path="/about"          element={<AboutPage />} />
          <Route path="/services"       element={<ServicesPage />} />
          <Route path="/services/:slug" element={<ServiceDetailPage />} />
          <Route path="/products"       element={<ProductsPage />} />
          <Route path="/contact"        element={<ContactPage />} />
          <Route path="*"               element={<NotFound />} />
        </Route>
      </Routes>
    </>
  )
}
