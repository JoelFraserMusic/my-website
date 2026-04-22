import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const enterprise = {
  eyebrow: 'For Enterprise',
  question: 'Can I trust this beneath my business?',
  desc: 'We\'re built for production. Compliance-ready, resilient, and auditable, so your infrastructure team can sleep at night.',
  points: [
    'SOC 2 Type II certified',
    '99.99% uptime SLA with dedicated support',
    'Role-based access controls and audit trails',
    'Private cloud and on-prem deployment options',
    'Custom data licensing and usage agreements',
  ],
  cta: 'Talk to Enterprise Sales',
  dark: true,
}

const developers = {
  eyebrow: 'For Developers',
  question: 'Can I use this now?',
  desc: 'Spatial queries over a REST API. SDKs in the languages you already use. Docs that explain the why, not just the how.',
  points: [
    'REST and GraphQL APIs, ready today',
    'SDKs for Python, JavaScript, and Go',
    'Sandbox access, no credit card needed',
    'Webhooks, streaming, and batch endpoints',
    'Docs written for engineers, not marketers',
  ],
  cta: 'Start Building Free',
  dark: false,
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  )
}

function Column({ data, inView, delay }) {
  const isDark = data.dark
  return (
    <motion.div
      initial={{ opacity: 0, y: 36 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      style={{
        flex: 1, minWidth: '280px',
        background: isDark ? '#122159' : '#fff',
        border: isDark ? '1px solid rgba(47,90,240,0.25)' : '1px solid rgba(149,157,188,0.18)',
        borderRadius: '20px',
        padding: 'clamp(36px, 4vw, 52px)',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: isDark
          ? '0 8px 48px rgba(18,33,89,0.5)'
          : '0 4px 24px rgba(47,90,240,0.06)',
      }}
    >
      {isDark && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '200px',
          background: 'radial-gradient(ellipse 100% 100% at 50% 0%, rgba(47,90,240,0.18) 0%, transparent 100%)',
          pointerEvents: 'none',
        }} />
      )}

      {/* Eyebrow */}
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: '6px',
        fontFamily: 'var(--font)', fontWeight: 600, fontSize: '12px',
        letterSpacing: '0.1em', textTransform: 'uppercase',
        color: isDark ? '#6B8FF5' : '#2F5AF0',
        marginBottom: '20px',
      }}>
        <span style={{
          width: '6px', height: '6px', borderRadius: '50%',
          background: isDark ? '#6B8FF5' : '#2F5AF0',
        }} />
        {data.eyebrow}
      </div>

      {/* Question */}
      <h3 style={{
        fontFamily: 'var(--font)', fontWeight: 700,
        fontSize: 'clamp(24px, 3vw, 32px)',
        color: isDark ? '#fff' : '#1E1E1E',
        letterSpacing: '-0.025em', lineHeight: 1.15,
        marginBottom: '16px',
      }}>
        {data.question}
      </h3>

      {/* Desc */}
      <p style={{
        fontFamily: 'var(--font)', fontWeight: 400, fontSize: '16px',
        color: isDark ? 'rgba(149,157,188,0.85)' : '#959DBC',
        lineHeight: 1.7, marginBottom: '32px',
      }}>
        {data.desc}
      </p>

      {/* Points */}
      <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '40px' }}>
        {data.points.map((pt) => (
          <li key={pt} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <span style={{
              flexShrink: 0, marginTop: '1px',
              color: isDark ? '#6B8FF5' : '#2F5AF0',
            }}>
              <CheckIcon />
            </span>
            <span style={{
              fontFamily: 'var(--font)', fontWeight: 400, fontSize: '15px',
              color: isDark ? 'rgba(200,213,255,0.85)' : '#3A4260',
              lineHeight: 1.5,
            }}>
              {pt}
            </span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <motion.button
        whileHover={{ scale: 1.04, ...(isDark ? { background: '#2540A8' } : { background: '#1C40C1' }) }}
        whileTap={{ scale: 0.97 }}
        style={{
          fontFamily: 'var(--font)', fontWeight: 600, fontSize: '15px',
          color: '#fff',
          background: isDark ? '#2F5AF0' : '#2F5AF0',
          border: 'none', borderRadius: '12px',
          padding: '14px 28px', cursor: 'pointer',
          width: '100%', letterSpacing: '-0.01em',
          boxShadow: '0 4px 20px rgba(47,90,240,0.3)',
          transition: 'background 0.2s, transform 0.15s',
        }}
      >
        {data.cta}
      </motion.button>
    </motion.div>
  )
}

export default function Audience() {
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
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{ textAlign: 'center', marginBottom: '56px' }}
        >
          <h2 style={{
            fontFamily: 'var(--font)', fontWeight: 700,
            fontSize: 'clamp(32px, 4.5vw, 52px)',
            color: '#1E1E1E', letterSpacing: '-0.025em', lineHeight: 1.1,
            marginBottom: '16px',
          }}>
            Built for the teams who move fast<br />and the systems that can't afford to stop.
          </h2>
          <p style={{
            fontFamily: 'var(--font)', fontWeight: 400,
            fontSize: 'clamp(15px, 1.8vw, 18px)',
            color: '#959DBC', lineHeight: 1.7, maxWidth: '500px', margin: '0 auto',
          }}>
            Whether you're evaluating infrastructure or writing your first query,
            BigGeo meets you where you are.
          </p>
        </motion.div>

        {/* Two columns */}
        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
          <Column data={enterprise} inView={inView} delay={0.1} />
          <Column data={developers} inView={inView} delay={0.22} />
        </div>
      </div>
    </section>
  )
}
