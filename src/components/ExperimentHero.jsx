import { motion } from 'framer-motion'

export default function ExperimentHero({ Bg, eyebrow, headline, accent, sub, cta1 = 'Get Started', cta2 = 'Learn More' }) {
  return (
    <section style={{
      position: 'relative', minHeight: '100vh', overflow: 'hidden',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '140px clamp(20px,5vw,64px) 100px',
      background: '#122159',
    }}>
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1,
        background: 'radial-gradient(ellipse 65% 50% at 50% 10%, rgba(47,90,240,0.16) 0%, transparent 70%)',
      }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '140px', pointerEvents: 'none', zIndex: 1,
        background: 'linear-gradient(to bottom, transparent, #122159)' }} />

      <Bg />

      <div style={{ maxWidth: '820px', textAlign: 'center', position: 'relative', zIndex: 2 }}>
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          style={{
            display: 'inline-block', fontFamily: 'var(--font)', fontWeight: 600,
            fontSize: '12px', letterSpacing: '0.12em', textTransform: 'uppercase',
            color: '#6B8FF5', marginBottom: '20px', padding: '6px 14px',
            borderRadius: '100px', border: '1px solid rgba(107,143,245,0.3)',
            background: 'rgba(47,90,240,0.1)',
          }}>
          {eyebrow}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.72, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontFamily: 'var(--font)', fontWeight: 800,
            fontSize: 'clamp(42px,7vw,80px)',
            color: '#fff', lineHeight: 1.05, letterSpacing: '-0.03em', marginBottom: '24px',
          }}>
          {headline}{' '}
          <span style={{
            background: 'linear-gradient(135deg,#6B8FF5 0%,#A3BFFC 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>{accent}</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.32, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontFamily: 'var(--font)', fontWeight: 400,
            fontSize: 'clamp(16px,2.2vw,20px)',
            color: 'rgba(180,198,255,0.8)', lineHeight: 1.7,
            maxWidth: '580px', margin: '0 auto 44px',
          }}>
          {sub}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.46, ease: [0.22, 1, 0.36, 1] }}
          style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <motion.button
            whileHover={{ scale: 1.05, background: '#1C40C1', boxShadow: '0 6px 32px rgba(47,90,240,0.55)' }}
            whileTap={{ scale: 0.97 }}
            style={{
              fontFamily: 'var(--font)', fontWeight: 600, fontSize: '16px', color: '#fff',
              background: '#2F5AF0', border: 'none', borderRadius: '12px', padding: '15px 36px',
              cursor: 'pointer', boxShadow: '0 4px 24px rgba(47,90,240,0.4)',
              transition: 'background 0.2s, box-shadow 0.2s',
            }}>
            {cta1}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03, borderColor: 'rgba(107,143,245,0.6)', color: '#fff' }}
            whileTap={{ scale: 0.97 }}
            style={{
              fontFamily: 'var(--font)', fontWeight: 600, fontSize: '16px',
              color: 'rgba(180,198,255,0.8)', background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(107,143,245,0.28)', borderRadius: '12px',
              padding: '15px 36px', cursor: 'pointer', backdropFilter: 'blur(8px)',
              transition: 'border-color 0.2s, color 0.2s',
            }}>
            {cta2}
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}
