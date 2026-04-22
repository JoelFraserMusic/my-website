import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

export default function CTASection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section style={{
      background: '#122159',
      padding: 'clamp(80px, 10vw, 140px) clamp(20px, 5vw, 64px)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background radial */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 60% 70% at 50% 50%, rgba(47,90,240,0.18) 0%, transparent 70%)',
      }} />
      {/* Grid overlay */}
      <svg
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.12, pointerEvents: 'none' }}
      >
        <defs>
          <pattern id="ctaGrid" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M 48 0 L 0 0 0 48" fill="none" stroke="rgba(47,90,240,1)" strokeWidth="0.5"/>
          </pattern>
          <radialGradient id="ctaFade" cx="50%" cy="50%" r="55%">
            <stop offset="0%" stopColor="white" stopOpacity="1"/>
            <stop offset="100%" stopColor="white" stopOpacity="0"/>
          </radialGradient>
          <mask id="ctaMask">
            <rect width="100%" height="100%" fill="url(#ctaFade)"/>
          </mask>
        </defs>
        <rect width="100%" height="100%" fill="url(#ctaGrid)" mask="url(#ctaMask)"/>
      </svg>

      <div
        ref={ref}
        style={{ maxWidth: '760px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{
            display: 'inline-block',
            fontFamily: 'var(--font)', fontWeight: 600, fontSize: '12px',
            letterSpacing: '0.1em', textTransform: 'uppercase',
            color: '#6B8FF5', marginBottom: '24px',
          }}
        >
          The Spatial Cloud
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontFamily: 'var(--font)', fontWeight: 800,
            fontSize: 'clamp(36px, 6vw, 68px)',
            color: '#fff', lineHeight: 1.05,
            letterSpacing: '-0.03em', marginBottom: '24px',
          }}
        >
          Your spatial data,<br />
          <span style={{
            background: 'linear-gradient(135deg, #6B8FF5 0%, #A3BFFC 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>
            ready when you are.
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontFamily: 'var(--font)', fontWeight: 400,
            fontSize: 'clamp(16px, 2vw, 19px)',
            color: 'rgba(149,157,188,0.85)', lineHeight: 1.7,
            maxWidth: '520px', margin: '0 auto 44px',
          }}
        >
          Stop building pipelines around your data. Start building products on top of it.
          BigGeo handles the infrastructure so you don't have to.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.34, ease: [0.22, 1, 0.36, 1] }}
          style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}
        >
          <motion.button
            whileHover={{ scale: 1.05, background: '#1C40C1', boxShadow: '0 8px 40px rgba(47,90,240,0.6)' }}
            whileTap={{ scale: 0.97 }}
            style={{
              fontFamily: 'var(--font)', fontWeight: 600, fontSize: '16px',
              color: '#fff', background: '#2F5AF0', border: 'none',
              borderRadius: '12px', padding: '16px 40px', cursor: 'pointer',
              letterSpacing: '-0.01em',
              boxShadow: '0 4px 28px rgba(47,90,240,0.45)',
              transition: 'background 0.2s, box-shadow 0.2s',
            }}
          >
            Get Started
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03, borderColor: 'rgba(107,143,245,0.55)', color: '#fff' }}
            whileTap={{ scale: 0.97 }}
            style={{
              fontFamily: 'var(--font)', fontWeight: 600, fontSize: '16px',
              color: 'rgba(180,198,255,0.8)',
              background: 'rgba(47,90,240,0.08)',
              border: '1px solid rgba(107,143,245,0.28)',
              borderRadius: '12px', padding: '16px 40px', cursor: 'pointer',
              letterSpacing: '-0.01em', backdropFilter: 'blur(8px)',
              transition: 'border-color 0.2s, color 0.2s',
            }}
          >
            Read the Docs
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}
