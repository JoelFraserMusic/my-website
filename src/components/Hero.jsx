import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import DataNetwork from './DataNetwork'

export default function Hero() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '14%'])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0])

  return (
    <section
      ref={ref}
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        background: '#122159',
        padding: '120px 32px 100px',
      }}
    >
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 70% 55% at 50% 10%, rgba(47,90,240,0.22) 0%, transparent 70%)',
      }} />
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '160px', pointerEvents: 'none',
        background: 'linear-gradient(to bottom, transparent, #122159)',
        zIndex: 1,
      }} />

      <DataNetwork />

      <motion.div style={{ y: contentY, opacity: contentOpacity, position: 'relative', zIndex: 2 }}>
        <div style={{ maxWidth: '860px', margin: '0 auto', textAlign: 'center' }}>
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.55, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '6px 14px 6px 10px', borderRadius: '100px',
              border: '1px solid rgba(107,143,245,0.35)',
              background: 'rgba(47,90,240,0.12)',
              color: 'rgba(180,200,255,0.9)', fontSize: '13px', fontWeight: 500,
              marginBottom: '36px', letterSpacing: '0.01em', fontFamily: 'var(--font)',
            }}
          >
            <span style={{
              width: '7px', height: '7px', borderRadius: '50%',
              background: '#6B8FF5', boxShadow: '0 0 10px rgba(107,143,245,0.9)',
              display: 'inline-block', animation: 'heroPulse 2.2s ease-in-out infinite',
            }} />
            Introducing The Spatial Cloud
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
            style={{
              fontFamily: 'var(--font)', fontWeight: 800,
              fontSize: 'clamp(48px, 8vw, 92px)',
              lineHeight: 1.0, letterSpacing: '-0.03em',
              color: '#fff', marginBottom: '28px',
            }}
          >
            The world's spatial data.{' '}
            <span style={{
              background: 'linear-gradient(135deg, #6B8FF5 0%, #A3BFFC 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>
              Delivered.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.42, ease: [0.22, 1, 0.36, 1] }}
            style={{
              fontFamily: 'var(--font)', fontWeight: 400,
              fontSize: 'clamp(17px, 2.4vw, 21px)',
              color: 'rgba(180,198,255,0.82)', lineHeight: 1.65,
              maxWidth: '620px', margin: '0 auto 52px', letterSpacing: '-0.01em',
            }}
          >
            We help companies manage and access the world's spatial data, any size, any slice,
            any insight, delivered in seconds.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
            style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}
          >
            <motion.button
              whileHover={{ scale: 1.05, background: '#1C40C1', boxShadow: '0 6px 32px rgba(47,90,240,0.55)' }}
              whileTap={{ scale: 0.97 }}
              style={{
                fontFamily: 'var(--font)', fontWeight: 600, fontSize: '16px',
                color: '#fff', background: '#2F5AF0', border: 'none',
                borderRadius: '12px', padding: '16px 36px', cursor: 'pointer',
                boxShadow: '0 4px 24px rgba(47,90,240,0.4)',
                transition: 'background 0.2s, box-shadow 0.2s',
              }}
            >
              Get Started
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03, borderColor: 'rgba(107,143,245,0.6)', color: '#fff' }}
              whileTap={{ scale: 0.97 }}
              style={{
                fontFamily: 'var(--font)', fontWeight: 600, fontSize: '16px',
                color: 'rgba(180,198,255,0.85)',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(107,143,245,0.3)',
                borderRadius: '12px', padding: '16px 36px', cursor: 'pointer',
                backdropFilter: 'blur(8px)',
                transition: 'border-color 0.2s, color 0.2s',
              }}
            >
              See How It Works
            </motion.button>
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 1 }}
        style={{
          position: 'absolute', bottom: '36px', left: '50%',
          transform: 'translateX(-50%)', zIndex: 2,
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
          color: 'rgba(149,157,188,0.5)', fontSize: '11px', letterSpacing: '0.12em',
          textTransform: 'uppercase', fontFamily: 'var(--font)',
        }}
      >
        <motion.div
          animate={{ y: [0, 7, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </motion.div>
      </motion.div>

      <style>{`
        @keyframes heroPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.45; transform: scale(0.8); }
        }
      `}</style>
    </section>
  )
}
