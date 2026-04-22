import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Datascape from './pages/Datascape'
import Datalab from './pages/Datalab'
import Marketplace from './pages/Marketplace'
import Contact from './pages/Contact'
import GetStarted from './pages/GetStarted'

function Layout() {
  const location = useLocation()
  const standalone = location.pathname === '/get-started'

  if (standalone) {
    return (
      <Routes>
        <Route path="/get-started" element={<GetStarted />} />
      </Routes>
    )
  }

  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/datascape" element={<Datascape />} />
          <Route path="/datalab" element={<Datalab />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/contact" element={<Contact />} />
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
