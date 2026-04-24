import { motion } from 'framer-motion'

const font = 'var(--font)'
const ease = [0.22, 1, 0.36, 1]

const points = [
  { text: 'Ask any location question in ChatGPT or Claude' },
  { text: 'Get a governed, sourced answer — not a guess' },
  { text: 'Sub-second responses. No new software. No login.' },
]

export default function BigGeoAI() {
  return (
    <section style={{
      background: '#122159',
      padding: 'clamp(72px,9vw,112px) clamp(20px,5vw,64px)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Radial glow */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 70% 80% at 20% 50%, rgba(47,90,240,0.22) 0%, transparent 65%)',
      }} />

      <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 'clamp(40px,6vw,80px)',
          alignItems: 'center',
        }}>

          {/* ── Left: copy ── */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, ease }}
          >
            {/* Badge */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '5px 14px 5px 10px', borderRadius: 100,
              background: 'rgba(47,90,240,0.2)',
              border: '1px solid rgba(107,143,245,0.35)',
              marginBottom: 24,
            }}>
              <span style={{
                width: 7, height: 7, borderRadius: '50%',
                background: '#60EFAB',
                boxShadow: '0 0 8px rgba(96,239,171,0.9)',
                animation: 'bgaiPulse 2s ease-in-out infinite',
                flexShrink: 0,
              }} />
              <span style={{ fontFamily: font, fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#A3BFFC' }}>
                Now Live · BigGeo AI
              </span>
            </div>

            {/* Headline */}
            <h2 style={{
              fontFamily: font, fontWeight: 800,
              fontSize: 'clamp(32px,4vw,52px)',
              lineHeight: 1.08, letterSpacing: '-0.03em',
              color: '#ffffff', marginBottom: 16,
            }}>
              Your AI now knows<br />
              <span style={{ color: '#6B8FF5' }}>where things actually are.</span>
            </h2>

            <p style={{
              fontFamily: font, fontSize: 16, lineHeight: 1.7,
              color: 'rgba(180,198,255,0.75)', marginBottom: 28, maxWidth: 440,
            }}>
              BigGeo AI is an MCP connector that gives ChatGPT and Claude access to real, governed spatial data. No guesses. No hallucinations. Just verified answers about any location on Earth.
            </p>

            {/* Points */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 36 }}>
              {points.map((p) => (
                <div key={p.text} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B8FF5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                    <path d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  <span style={{ fontFamily: font, fontSize: 14, color: 'rgba(200,215,255,0.85)', lineHeight: 1.5 }}>
                    {p.text}
                  </span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <motion.a
                href="https://chatgpt.com/apps/biggeo-ai/asdk_app_69b2ece221cc8191b9e7c3e49ab0adf9"
                target="_blank" rel="noopener noreferrer"
                whileHover={{ scale: 1.04, boxShadow: '0 8px 32px rgba(47,90,240,0.55)' }}
                whileTap={{ scale: 0.97 }}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  fontFamily: font, fontWeight: 700, fontSize: 15,
                  color: '#fff', background: '#2F5AF0',
                  borderRadius: 10, padding: '13px 28px',
                  textDecoration: 'none',
                  boxShadow: '0 4px 20px rgba(47,90,240,0.4)',
                }}
              >
                Install BigGeo AI
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                </svg>
              </motion.a>
              <motion.a
                href="#"
                whileHover={{ scale: 1.02, borderColor: 'rgba(107,143,245,0.6)', color: '#fff' }}
                style={{
                  display: 'inline-flex', alignItems: 'center',
                  fontFamily: font, fontWeight: 600, fontSize: 15,
                  color: 'rgba(180,198,255,0.8)',
                  border: '1.5px solid rgba(107,143,245,0.25)',
                  borderRadius: 10, padding: '13px 28px',
                  textDecoration: 'none',
                  transition: 'border-color 0.2s, color 0.2s',
                }}
              >
                Learn More
              </motion.a>
            </div>
          </motion.div>

          {/* ── Right: before/after chat card ── */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, delay: 0.12, ease }}
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(107,143,245,0.2)',
              borderRadius: 16,
              overflow: 'hidden',
              boxShadow: '0 24px 64px rgba(0,0,0,0.3)',
            }}
          >
            {/* Window chrome */}
            <div style={{
              padding: '12px 18px',
              borderBottom: '1px solid rgba(255,255,255,0.07)',
              display: 'flex', alignItems: 'center', gap: 8,
              background: 'rgba(255,255,255,0.03)',
            }}>
              {['#ff5f56','#ffbd2e','#27c93f'].map(c => (
                <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c, opacity: 0.7 }} />
              ))}
              <span style={{ marginLeft: 8, fontFamily: font, fontSize: 12, color: 'rgba(180,198,255,0.4)' }}>
                ChatGPT
              </span>
            </div>

            {/* Without */}
            <div style={{ padding: '20px 22px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{
                display: 'inline-block', fontFamily: font, fontSize: 10, fontWeight: 700,
                letterSpacing: '0.1em', textTransform: 'uppercase',
                color: '#e07070', background: 'rgba(220,60,60,0.1)',
                border: '1px solid rgba(220,60,60,0.2)',
                borderRadius: 4, padding: '2px 8px', marginBottom: 12,
              }}>Without BigGeo AI</div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 8 }}>
                <span style={{ fontFamily: font, fontSize: 11, fontWeight: 700, color: '#fff', background: '#2F5AF0', padding: '2px 8px', borderRadius: 4, flexShrink: 0, marginTop: 2 }}>You</span>
                <span style={{ fontFamily: font, fontSize: 13, color: 'rgba(220,228,255,0.9)' }}>"Is this neighbourhood safe?"</span>
              </div>
              <div style={{
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 8, padding: '10px 14px',
                fontFamily: font, fontSize: 12.5, color: 'rgba(160,160,180,0.8)',
                lineHeight: 1.6, fontStyle: 'italic',
              }}>
                "I don't have access to crime data for specific locations. I'd recommend checking local police reports..."
              </div>
            </div>

            {/* With */}
            <div style={{ padding: '20px 22px 22px', background: 'rgba(47,90,240,0.06)' }}>
              <div style={{
                display: 'inline-block', fontFamily: font, fontSize: 10, fontWeight: 700,
                letterSpacing: '0.1em', textTransform: 'uppercase',
                color: '#7c9cf0', background: 'rgba(47,90,240,0.15)',
                border: '1px solid rgba(47,90,240,0.3)',
                borderRadius: 4, padding: '2px 8px', marginBottom: 12,
              }}>With BigGeo AI</div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 8 }}>
                <span style={{ fontFamily: font, fontSize: 11, fontWeight: 700, color: '#fff', background: '#2F5AF0', padding: '2px 8px', borderRadius: 4, flexShrink: 0, marginTop: 2 }}>You</span>
                <span style={{ fontFamily: font, fontSize: 13, color: 'rgba(220,228,255,0.9)' }}>"Is this neighbourhood safe?"</span>
              </div>
              <div style={{
                background: 'rgba(47,90,240,0.1)', border: '1px solid rgba(47,90,240,0.25)',
                borderRadius: 8, padding: '10px 14px',
                fontFamily: font, fontSize: 12.5, color: 'rgba(180,200,255,0.9)',
                lineHeight: 1.6,
              }}>
                "Using governed crime data from 2020–present: this area has seen a <strong>12% drop</strong> in reported incidents over two years. Most common: property crime, concentrated 0.8 miles southwest of this address."
              </div>
            </div>
          </motion.div>

        </div>
      </div>

      <style>{`
        @keyframes bgaiPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.5; transform: scale(0.8); }
        }
      `}</style>
    </section>
  )
}
