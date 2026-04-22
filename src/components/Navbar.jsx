import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'

const products = [
  {
    name: 'Datascape',
    path: '/datascape',
    desc: 'Explore spatial data without the complexity',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
      </svg>
    ),
  },
  {
    name: 'Datalab',
    path: '/datalab',
    desc: 'Build spatial applications with our APIs & SDKs',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" />
      </svg>
    ),
  },
  {
    name: 'Marketplace',
    path: '/marketplace',
    desc: "Access the world's licensed spatial datasets",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0l4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0l-5.571 3-5.571-3" />
      </svg>
    ),
  },
]

const otherLinks = [
  { label: 'Data Providers', href: '#' },
  { label: 'Developers', href: '#' },
  { label: 'Pricing', href: '#' },
  { label: 'Contact', href: '/contact', isRoute: true },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [productOpen, setProductOpen] = useState(false)
  const dropdownRef = useRef(null)
  const location = useLocation()

  const isHome = location.pathname === '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProductOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Close dropdown on route change
  useEffect(() => { setProductOpen(false) }, [location.pathname])

  // On non-home pages the nav is always "scrolled" (white bg)
  const solidNav = scrolled || !isHome

  const linkColor = solidNav ? '#1E1E1E' : 'rgba(255,255,255,0.82)'

  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        zIndex: 100,
        height: '68px',
        display: 'flex',
        alignItems: 'center',
        padding: '0 clamp(20px, 5vw, 64px)',
        transition: 'background 0.35s, backdrop-filter 0.35s, box-shadow 0.35s',
        background: solidNav ? 'rgba(255,255,255,0.93)' : 'transparent',
        backdropFilter: solidNav ? 'blur(18px)' : 'none',
        boxShadow: solidNav ? '0 1px 0 rgba(149,157,188,0.18)' : 'none',
      }}
    >
      <div style={{
        width: '100%', maxWidth: '1200px', margin: '0 auto',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
          <img
            src={
              solidNav
                ? 'https://sabiggeomedia01.blob.core.windows.net/media/467c0531-1db4-478f-810e-f2f7bb5253df'
                : 'https://sabiggeomedia01.blob.core.windows.net/media/b2982766-96ac-4fb2-a645-2194b432df4a'
            }
            alt="BigGeo"
            style={{ height: '32px', width: 'auto', display: 'block' }}
          />
        </Link>

        {/* Nav */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '2px', position: 'relative' }}>

          {/* Product dropdown trigger */}
          <div ref={dropdownRef} style={{ position: 'relative' }}>
            <motion.button
              onClick={() => setProductOpen((o) => !o)}
              style={{
                fontFamily: 'var(--font)', fontWeight: 500, fontSize: '15px',
                color: productOpen ? '#2F5AF0' : linkColor,
                padding: '8px 14px', borderRadius: '8px',
                background: productOpen
                  ? solidNav ? 'rgba(47,90,240,0.07)' : 'rgba(255,255,255,0.1)'
                  : 'none',
                border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '5px',
                transition: 'color 0.2s, background 0.15s',
              }}
              whileHover={{
                color: '#2F5AF0',
                backgroundColor: solidNav ? 'rgba(47,90,240,0.07)' : 'rgba(255,255,255,0.09)',
              }}
              transition={{ duration: 0.15 }}
            >
              Product
              <motion.span
                animate={{ rotate: productOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                style={{ display: 'flex', alignItems: 'center' }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </motion.span>
            </motion.button>

            {/* Dropdown panel */}
            <AnimatePresence>
              {productOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.97 }}
                  transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                    position: 'absolute', top: 'calc(100% + 10px)', left: '50%',
                    transform: 'translateX(-50%)',
                    width: '320px',
                    background: '#fff',
                    border: '1px solid rgba(149,157,188,0.18)',
                    borderRadius: '16px',
                    boxShadow: '0 16px 48px rgba(18,33,89,0.14), 0 2px 8px rgba(47,90,240,0.08)',
                    overflow: 'hidden',
                    padding: '8px',
                  }}
                >
                  {products.map((p) => (
                    <Link
                      key={p.name}
                      to={p.path}
                      style={{ textDecoration: 'none', display: 'block' }}
                    >
                      <motion.div
                        whileHover={{ background: 'rgba(47,90,240,0.05)' }}
                        style={{
                          display: 'flex', alignItems: 'flex-start', gap: '14px',
                          padding: '14px 16px', borderRadius: '10px',
                          cursor: 'pointer',
                        }}
                      >
                        <div style={{
                          flexShrink: 0, width: '36px', height: '36px',
                          borderRadius: '9px', background: 'rgba(47,90,240,0.08)',
                          color: '#2F5AF0', display: 'flex',
                          alignItems: 'center', justifyContent: 'center',
                          marginTop: '1px',
                        }}>
                          {p.icon}
                        </div>
                        <div>
                          <div style={{
                            fontFamily: 'var(--font)', fontWeight: 600, fontSize: '14px',
                            color: '#1E1E1E', marginBottom: '3px', letterSpacing: '-0.01em',
                          }}>
                            {p.name}
                          </div>
                          <div style={{
                            fontFamily: 'var(--font)', fontWeight: 400, fontSize: '13px',
                            color: '#959DBC', lineHeight: 1.4,
                          }}>
                            {p.desc}
                          </div>
                        </div>
                      </motion.div>
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Other links */}
          {otherLinks.map(({ label, href, isRoute }) =>
            isRoute ? (
              <Link key={label} to={href} style={{ textDecoration: 'none' }}>
                <motion.span
                  style={{
                    fontFamily: 'var(--font)', fontWeight: 500, fontSize: '15px',
                    color: location.pathname === href ? '#2F5AF0' : linkColor,
                    padding: '8px 14px', borderRadius: '8px',
                    display: 'block', transition: 'color 0.2s',
                  }}
                  whileHover={{
                    color: '#2F5AF0',
                    backgroundColor: solidNav ? 'rgba(47,90,240,0.07)' : 'rgba(255,255,255,0.09)',
                  }}
                  transition={{ duration: 0.15 }}
                >
                  {label}
                </motion.span>
              </Link>
            ) : (
              <motion.a
                key={label}
                href={href}
                style={{
                  fontFamily: 'var(--font)', fontWeight: 500, fontSize: '15px',
                  color: linkColor,
                  padding: '8px 14px', borderRadius: '8px',
                  textDecoration: 'none', transition: 'color 0.2s',
                  display: 'block',
                }}
                whileHover={{
                  color: '#2F5AF0',
                  backgroundColor: solidNav ? 'rgba(47,90,240,0.07)' : 'rgba(255,255,255,0.09)',
                }}
                transition={{ duration: 0.15 }}
              >
                {label}
              </motion.a>
            )
          )}
        </nav>

        {/* CTA */}
        <Link to="/get-started" style={{ textDecoration: 'none' }}>
          <motion.button
            whileHover={{ scale: 1.04, background: '#1C40C1' }}
            whileTap={{ scale: 0.97 }}
            style={{
              fontFamily: 'var(--font)', fontWeight: 600, fontSize: '14px',
              color: '#fff', background: '#2F5AF0', border: 'none',
              borderRadius: '10px', padding: '10px 22px', cursor: 'pointer',
              letterSpacing: '-0.01em',
              boxShadow: '0 2px 14px rgba(47,90,240,0.32)',
              transition: 'background 0.2s',
            }}
          >
            Get Started
          </motion.button>
        </Link>
      </div>
    </motion.header>
  )
}
