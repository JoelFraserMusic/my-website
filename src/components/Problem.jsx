import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const pains = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M3.75 9h16.5m-16.5 6.75h16.5M9 3.75v16.5m6.75-16.5v16.5" />
      </svg>
    ),
    label: 'Fragmented pipelines',
    desc: 'Spatial data is locked in formats, vendors, and silos. Every new query means more engineering, more waiting, more cost.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    label: 'Queries that take hours',
    desc: 'Legacy systems were never designed for spatial scale. A question that should take seconds costs you an afternoon, or a day.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    ),
    label: 'GIS expertise required',
    desc: 'Today\'s spatial tools demand specialists. That bottleneck slows every product team, analyst, and decision that depends on location data.',
  },
]

const cardVars = {
  hidden: { opacity: 0, y: 32 },
  visible: (i) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.62, delay: i * 0.13, ease: [0.22, 1, 0.36, 1] },
  }),
}

export default function Problem() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section style={{
      padding: 'clamp(80px, 10vw, 140px) clamp(20px, 5vw, 64px)',
      background: '#f5f7ff',
    }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }} ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{ marginBottom: '64px', maxWidth: '640px' }}
        >
          <div style={{
            display: 'inline-block',
            fontFamily: 'var(--font)', fontWeight: 600, fontSize: '12px',
            letterSpacing: '0.1em', textTransform: 'uppercase',
            color: '#2F5AF0', marginBottom: '16px',
          }}>
            The Problem
          </div>
          <h2 style={{
            fontFamily: 'var(--font)', fontWeight: 700,
            fontSize: 'clamp(32px, 4.5vw, 52px)',
            color: '#1E1E1E', lineHeight: 1.1, letterSpacing: '-0.025em',
            marginBottom: '20px',
          }}>
            Spatial data is powerful.<br />Getting to it shouldn't be this hard.
          </h2>
          <p style={{
            fontFamily: 'var(--font)', fontWeight: 400,
            fontSize: 'clamp(15px, 1.8vw, 18px)',
            color: '#959DBC', lineHeight: 1.7,
          }}>
            The world runs on location. But the infrastructure built to manage it
            hasn't kept up. The result: spatial friction, the lag, silos, and complexity
            that keep your data locked in disconnected systems.
          </p>
        </motion.div>

        {/* Pain point cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px',
        }}>
          {pains.map((pain, i) => (
            <motion.div
              key={pain.label}
              custom={i}
              variants={cardVars}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              style={{
                background: '#fff',
                border: '1px solid rgba(149,157,188,0.16)',
                borderRadius: '16px',
                padding: '32px 28px',
                cursor: 'default',
              }}
            >
              <div style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: '48px', height: '48px', borderRadius: '12px',
                background: 'rgba(47,90,240,0.08)',
                color: '#2F5AF0', marginBottom: '20px',
              }}>
                {pain.icon}
              </div>
              <h3 style={{
                fontFamily: 'var(--font)', fontWeight: 600, fontSize: '18px',
                color: '#1E1E1E', letterSpacing: '-0.02em', marginBottom: '10px',
              }}>
                {pain.label}
              </h3>
              <p style={{
                fontFamily: 'var(--font)', fontWeight: 400, fontSize: '15px',
                color: '#959DBC', lineHeight: 1.7,
              }}>
                {pain.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Contrast line */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{
            marginTop: '56px',
            padding: '28px 36px',
            background: '#122159',
            borderRadius: '16px',
            display: 'flex', alignItems: 'center', gap: '16px',
          }}
        >
          <div style={{
            width: '3px', height: '44px', borderRadius: '2px',
            background: 'linear-gradient(to bottom, #2F5AF0, #6B8FF5)',
            flexShrink: 0,
          }} />
          <p style={{
            fontFamily: 'var(--font)', fontWeight: 500,
            fontSize: 'clamp(16px, 2vw, 20px)',
            color: 'rgba(200,213,255,0.9)', lineHeight: 1.5,
            letterSpacing: '-0.01em',
          }}>
            While others archive the past, we power the present.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
