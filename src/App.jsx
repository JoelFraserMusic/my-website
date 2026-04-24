import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import AnnouncementBanner from './components/AnnouncementBanner'

function NavbarOnly() {
  useEffect(() => {
    document.body.style.background = '#fff'
    document.body.style.overflow = 'hidden'
    document.body.style.margin = '0'
    return () => {
      document.body.style.background = ''
      document.body.style.overflow = ''
      document.body.style.margin = ''
    }
  }, [])
  return <Navbar />
}
import Footer from './components/Footer'
import Home from './pages/Home'
import Datascape from './pages/Datascape'
import Datalab from './pages/Datalab'
import Marketplace from './pages/Marketplace'
import Contact from './pages/Contact'
import GetStarted from './pages/GetStarted'
import GlobePage from './pages/GlobePage'
import GlobeRevamp from './pages/GlobeRevamp'
import TerrainPage from './pages/TerrainPage'
import WarpPage from './pages/WarpPage'
import BlobPage from './pages/BlobPage'

function Layout() {
  const location = useLocation()
  const standalone = location.pathname === '/get-started' || location.pathname === '/navbar-only'

  if (standalone) {
    return (
      <Routes>
        <Route path="/get-started" element={<GetStarted />} />
        <Route path="/navbar-only" element={<NavbarOnly />} />
      </Routes>
    )
  }

  return (
    <>
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100 }}>
        <AnnouncementBanner />
        <Navbar />
      </div>
      <main>
        <Routes>
          <Route path="/" element={<GlobeRevamp />} />
          <Route path="/old-home" element={<Home />} />
          <Route path="/datascape" element={<Datascape />} />
          <Route path="/datalab" element={<Datalab />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/globe" element={<GlobeRevamp />} />
          <Route path="/exp/globe" element={<GlobePage />} />
          <Route path="/exp/terrain" element={<TerrainPage />} />
          <Route path="/exp/warp" element={<WarpPage />} />
          <Route path="/exp/blob" element={<BlobPage />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  )
}
