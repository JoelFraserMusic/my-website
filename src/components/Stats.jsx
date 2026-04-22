import { useRef, useEffect, useState } from 'react'
import { motion, useInView } from 'framer-motion'

const stats = [
  { value: 20, suffix: 'x', label: 'faster than Snowflake', prefix: '' },
  { value: 3, suffix: 's', label: 'avg. query response time', prefix: '<' },
  { value: 99.99, suffix: '%', label: 'uptime SLA', prefix: '' },
  { value: 0, suffix: '', label: 'GIS engineers required', prefix: '' },
]

function CountUp({ target, prefix, suffix, inView, decimals = 0 }) {
  const [display, setDisplay] = useState(prefix + '0' + suffix)

  useEffect(() => {
    if (!inView) return
    const duration = 1800
    const start = performance.now()
    const startVal = 0

    const step = (now) => {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = startVal + (target - startVal) * eased
      const formatted = decimals > 0 ? current.toFixed(decimals) : Math.round(current)
      setDisplay(prefix + formatted + suffix)
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [inView, target, prefix, suffix, decimals])

  return <span>{display}</span>
}

export default function Stats() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section style={{
      background: '#122159',
      padding: 'clamp(60px, 8vw, 100px) clamp(20px, 5vw, 64px)',
    }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }} ref={ref}>
        {/* Optional label */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          style={{
            textAlign: 'center', marginBottom: '52px',
            fontFamily: 'var(--font)', fontWeight: 500, fontSize: '15px',
            color: 'rgba(149,157,188,0.7)', letterSpacing: '0.04em',
            textTransform: 'uppercase',
          }}
        >
          By the numbers
        </motion.div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '0',
        }}>
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              style={{
                textAlign: 'center',
                padding: '32px 24px',
                borderRight: i < stats.length - 1 ? '1px solid rgba(47,90,240,0.2)' : 'none',
              }}
            >
              <div style={{
                fontFamily: 'var(--font)', fontWeight: 800,
                fontSize: 'clamp(42px, 6vw, 64px)',
                lineHeight: 1, letterSpacing: '-0.04em',
                background: 'linear-gradient(135deg, #fff 0%, rgba(163,191,252,0.9) 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                marginBottom: '10px',
              }}>
                <CountUp
                  target={stat.value}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                  inView={inView}
                  decimals={stat.value % 1 !== 0 ? 2 : 0}
                />
              </div>
              <div style={{
                fontFamily: 'var(--font)', fontWeight: 400, fontSize: '14px',
                color: 'rgba(149,157,188,0.75)', lineHeight: 1.5,
              }}>
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
