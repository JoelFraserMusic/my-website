import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import datascapeLogo from '../assets/datascape-logo.png'
import datalabLogo from '../assets/datalab-logo.png'
import marketplaceLogo from '../assets/marketplace-logo.png'

const products = [
  {
    name: 'Datascape',
    path: '/datascape',
    desc: 'Explore spatial data without the complexity',
    icon: (
      <svg width="24" height="24" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M21.6909 43.0577L10 49.8074L33.4783 63.3626C37.0801 65.4421 42.9199 65.4421 46.5217 63.3626L70 49.8074L58.2126 43.002L46.4252 49.8074C42.8233 51.8869 36.9836 51.8869 33.3817 49.8074L21.6909 43.0577Z" fill="#122159"/>
        <path d="M26.9626 30.9258L15.1211 37.7625L33.382 48.3054C36.9838 50.3849 42.8236 50.3849 46.4254 48.3054L64.6863 37.7625L53.0495 31.044L46.6301 34.7502C43.0283 36.8297 37.1885 36.8297 33.5866 34.7502L26.9626 30.9258Z" fill="#2F5AF0"/>
        <path d="M20.541 25.71L40.1062 14.4141L59.6714 25.71L46.628 33.2407C43.0261 35.3202 37.1863 35.3202 33.5845 33.2407L20.541 25.71Z" fill="#2F5AF0"/>
      </svg>
    ),
  },
  {
    name: 'Datalab',
    path: '/datalab',
    desc: 'Build spatial applications with our APIs & SDKs',
    icon: (
      <svg width="24" height="24" viewBox="0 0 111 111" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M97.9764 12.0217L28.8516 0L34.6164 33.1476L70.5958 39.4049L76.8527 75.3821L109.998 81.1466L97.9764 12.0217Z" fill="#122159"/>
        <path fillRule="evenodd" clipRule="evenodd" d="M68.1856 41.8033L14.4219 32.4531L20.1867 65.6007L40.805 69.1865L44.3905 89.8027L77.5359 95.5671L68.1856 41.8033Z" fill="#1C40C1"/>
        <path d="M0 64.9141L38.4027 71.5928L45.0814 109.995L6.67873 103.317L0 64.9141Z" fill="#2F5AF0"/>
      </svg>
    ),
  },
  {
    name: 'Marketplace',
    path: '/marketplace',
    desc: "Access the world's licensed spatial datasets",
    icon: (
      <svg width="24" height="24" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M25.0469 43.9998C34.8899 34.1568 46.5752 26.3489 59.4358 21.0219C72.2963 15.6949 86.0801 12.9531 100 12.9531C113.92 12.9531 127.704 15.6949 140.565 21.0219C153.425 26.3489 165.111 34.1568 174.954 43.9998L152.468 66.4858C145.577 59.5957 137.398 54.1302 128.395 50.4013C119.393 46.6724 109.744 44.7531 100 44.7531C90.2561 44.7531 80.6074 46.6724 71.6051 50.4013C62.6027 54.1302 54.423 59.5957 47.5329 66.4858L25.0469 43.9998Z" fill="#122159"/>
        <path fillRule="evenodd" clipRule="evenodd" d="M100 87H10L40 187H100H160L190 87H100ZM100 87C100 114.612 122.38 137 150 137C122.38 137 100 159.388 100 187C100 159.388 77.6204 137 50 137C77.6204 137 100 114.612 100 87Z" fill="#2F5AF0"/>
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

  const linkColor = '#1E1E1E'

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
            src="https://sabiggeomedia01.blob.core.windows.net/media/467c0531-1db4-478f-810e-f2f7bb5253df"
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
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
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
