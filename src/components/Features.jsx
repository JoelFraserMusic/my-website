import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const features = [
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
      </svg>
    ),
    title: 'Any Size',
    tagline: 'Scale without limits',
    desc: 'From a single parcel to a planet\'s worth of data, we handle it without sharding, re-indexing, or emergency calls to your infrastructure team.',
    outcome: 'Your team ships features. Not workarounds.',
    accent: 'rgba(47,90,240,0.09)',
    border: 'rgba(47,90,240,0.2)',
    iconColor: '#2F5AF0',
    iconBg: 'rgba(47,90,240,0.1)',
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
      </svg>
    ),
    title: 'Any Slice',
    tagline: 'Precision spatial access',
    desc: 'Query down to the meter, the block, or the building. Bounding box, polygon, radius, you define the slice. We deliver exactly what you asked for.',
    outcome: 'No more pulling everything and filtering client-side.',
    accent: 'rgba(107,143,245,0.09)',
    border: 'rgba(107,143,245,0.22)',
    iconColor: '#6B8FF5',
    iconBg: 'rgba(107,143,245,0.1)',
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
    title: 'Delivered in Seconds',
    tagline: 'Speed that changes what\'s possible',
    desc: 'Live data, streaming queries, instant results. No GIS engineering required. No overnight batch jobs. Just the answer, when you need it.',
    outcome: 'Decisions that used to wait until tomorrow happen now.',
    accent: 'rgba(28,64,193,0.09)',
    border: 'rgba(28,64,193,0.2)',
    iconColor: '#1C40C1',
    iconBg: 'rgba(28,64,193,0.1)',
  },
]

const containerVars = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
}

const cardVars = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  },
}

export default function Features() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section style={{
      padding: 'clamp(80px, 10vw, 140px) clamp(20px, 5vw, 64px)',
      background: '#fff',
    }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }} ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{ textAlign: 'center', marginBottom: '64px' }}
        >
          <div style={{
            display: 'inline-block',
            fontFamily: 'var(--font)', fontWeight: 600, fontSize: '12px',
            letterSpacing: '0.1em', textTransform: 'uppercase',
            color: '#2F5AF0', marginBottom: '16px',
          }}>
            What We Deliver
          </div>
          <h2 style={{
            fontFamily: 'var(--font)', fontWeight: 700,
            fontSize: 'clamp(32px, 4.5vw, 52px)',
            color: '#1E1E1E', lineHeight: 1.1, letterSpacing: '-0.025em',
            marginBottom: '18px',
          }}>
            Built to remove every obstacle<br />between you and your data.
          </h2>
          <p style={{
            fontFamily: 'var(--font)', fontWeight: 400,
            fontSize: 'clamp(15px, 1.8vw, 18px)',
            color: '#959DBC', lineHeight: 1.7,
            maxWidth: '520px', margin: '0 auto',
          }}>
            Three principles drive everything we build. Together, they make spatial
            data usable for every team, not just specialists.
          </p>
        </motion.div>

        {/* Cards */}
        <motion.div
          variants={containerVars}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '20px',
          }}
        >
          {features.map((f) => (
            <FeatureCard key={f.title} feature={f} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}

function FeatureCard({ feature: f }) {
  return (
    <motion.div
      variants={cardVars}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      style={{
        background: '#fff',
        border: `1px solid ${f.border}`,
        borderRadius: '16px',
        padding: '36px 30px',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 2px 20px rgba(47,90,240,0.06)',
        cursor: 'default',
      }}
    >
      {/* Top accent line */}
      <div style={{
        position: 'absolute', top: 0, left: '24px', right: '24px', height: '2px',
        background: `linear-gradient(90deg, transparent, ${f.border}, transparent)`,
        borderRadius: '0 0 4px 4px',
      }} />

      {/* Icon */}
      <div style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        width: '52px', height: '52px', borderRadius: '14px',
        background: f.iconBg, color: f.iconColor,
        marginBottom: '24px',
        boxShadow: `0 2px 12px ${f.iconBg}`,
      }}>
        {f.icon}
      </div>

      {/* Tag */}
      <div style={{
        fontFamily: 'var(--font)', fontWeight: 500, fontSize: '12px',
        color: f.iconColor, letterSpacing: '0.06em', textTransform: 'uppercase',
        marginBottom: '8px',
      }}>
        {f.tagline}
      </div>

      <h3 style={{
        fontFamily: 'var(--font)', fontWeight: 700, fontSize: '24px',
        color: '#1E1E1E', letterSpacing: '-0.025em', marginBottom: '14px',
      }}>
        {f.title}
      </h3>
      <p style={{
        fontFamily: 'var(--font)', fontWeight: 400, fontSize: '15px',
        color: '#5A6175', lineHeight: 1.7, marginBottom: '20px',
      }}>
        {f.desc}
      </p>

      {/* Outcome */}
      <div style={{
        padding: '12px 16px', borderRadius: '10px',
        background: f.accent,
        fontFamily: 'var(--font)', fontWeight: 500, fontSize: '13px',
        color: f.iconColor, lineHeight: 1.5,
      }}>
        {f.outcome}
      </div>
    </motion.div>
  )
}
