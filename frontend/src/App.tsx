import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Layout from '@/components/layout/Layout'
import Home from '@/pages/Home'
import FeaturesPage from '@/pages/Features'
import ServicesPage from '@/pages/Services'
import ServiceDetailPage from '@/pages/ServiceDetail'
import ForBusinessPage from '@/pages/ForBusiness'
import BusinessDetailPage from '@/pages/BusinessDetail'
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
          <Route path="/"                         element={<Home />} />
          <Route path="/features"                 element={<FeaturesPage />} />
          <Route path="/services"                 element={<ServicesPage />} />
          <Route path="/services/:slug"           element={<ServiceDetailPage />} />
          <Route path="/for-business"             element={<ForBusinessPage />} />
          <Route path="/for-business/:slug"       element={<BusinessDetailPage />} />
          <Route path="/contact"                  element={<ContactPage />} />
          <Route path="*"                         element={<NotFound />} />
        </Route>
      </Routes>
    </>
  )
}
