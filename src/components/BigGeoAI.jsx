import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'

// ─── Color tokens ──────────────────────────────────────────────────────────────
const C = {
  white:  '#ffffff',
  bg:     '#F5F5F5',
  text:   '#1E1E1E',
  muted:  '#5A6175',
  blue:   '#2F5AF0',
  navy:   '#122159',
  border: '#E8E8E8',
}

const font = 'var(--font)'

const ease = [0.22, 1, 0.36, 1]

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
}

// ─── Tab data ─────────────────────────────────────────────────────────────────
const TABS = [
  {
    id: 'nearby',
    label: 'Find What\'s Nearby',
    questions: [
      { emoji: '⚡', text: 'Where\'s the nearest EV charger?' },
      { emoji: '🏫', text: 'What schools are near this address?' },
      { emoji: '✈️', text: 'What\'s the closest airport?' },
      { emoji: '🛒', text: 'What businesses are within walking distance?' },
      { emoji: '🚌', text: 'Where\'s the nearest transit stop?' },
      { emoji: '🛐', text: 'Are there places of worship nearby?' },
    ],
  },
  {
    id: 'neighbourhood',
    label: 'Explore a Neighbourhood',
    questions: [
      { emoji: '📊', text: 'What\'s the median household income here?' },
      { emoji: '🚶', text: 'How walkable is this area?' },
      { emoji: '📈', text: 'Is foot traffic growing or declining?' },
      { emoji: '🏘️', text: 'What type of housing dominates this neighbourhood?' },
      { emoji: '🌳', text: 'How much green space is nearby?' },
      { emoji: '🔊', text: 'What are the noise levels like here?' },
    ],
  },
  {
    id: 'property',
    label: 'Research a Property',
    questions: [
      { emoji: '🏠', text: 'What postal code and census tract is this in?' },
      { emoji: '💧', text: 'Is this property near a flood zone?' },
      { emoji: '🏗️', text: 'What\'s been built nearby in the last 5 years?' },
      { emoji: '🚗', text: 'What\'s the traffic volume on this street?' },
      { emoji: '📍', text: 'What administrative boundaries does this fall in?' },
      { emoji: '🏢', text: 'What are the zoning designations here?' },
    ],
  },
  {
    id: 'risk',
    label: 'Assess Risk & Hazards',
    questions: [
      { emoji: '🔥', text: 'Is this area at wildfire risk?' },
      { emoji: '🌊', text: 'What\'s the flood probability for this address?' },
      { emoji: '🌡️', text: 'How is climate risk changing here over 20 years?' },
      { emoji: '⚠️', text: 'Are there industrial hazards nearby?' },
      { emoji: '🔒', text: 'What\'s the crime rate trend in this area?' },
      { emoji: '🌪️', text: 'What severe weather events have hit this region?' },
    ],
  },
  {
    id: 'trip',
    label: 'Plan a Trip',
    questions: [
      { emoji: '🗺️', text: 'What\'s the best route avoiding toll roads?' },
      { emoji: '🏨', text: 'What neighbourhoods are walkable to the conference centre?' },
      { emoji: '🍽️', text: 'What areas have the best restaurant density?' },
      { emoji: '🅿️', text: 'Where is parking most available near the venue?' },
      { emoji: '🚆', text: 'What transit options connect these two points?' },
      { emoji: '🌆', text: 'What\'s the foot traffic like on this street at 8pm?' },
    ],
  },
]

// ─── Why cards ────────────────────────────────────────────────────────────────
const WHY_CARDS = [
  {
    title: 'Real answers, not guesses',
    body: 'Every response draws from governed, verified spatial datasets. No hallucinations. No approximations. Just the accurate answer grounded in real-world data.',
  },
  {
    title: 'Works in the AI you already use',
    body: 'BigGeo AI is an MCP connector that plugs directly into ChatGPT and Claude. No new tool to learn. No tab to switch to. Ask in your existing AI assistant.',
  },
  {
    title: 'Data owners earn on every query',
    body: 'Every time BigGeo AI answers a question, the data providers who made that answer possible are automatically compensated. A marketplace that pays as it scales.',
  },
  {
    title: 'Fast at any size',
    body: 'BigGeo\'s DGGS-indexed infrastructure returns sub-second results whether the dataset has a thousand rows or a billion. Scale never slows the answer down.',
  },
]

// ─── Floating shimmer label ────────────────────────────────────────────────────
function ShimmerLabel({ text, style, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.75, delay, ease }}
      style={{
        position: 'absolute',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '7px 14px',
        borderRadius: 100,
        background: 'rgba(255,255,255,0.1)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255,255,255,0.18)',
        fontFamily: font,
        fontSize: 11,
        fontWeight: 600,
        color: 'rgba(255,255,255,0.85)',
        letterSpacing: '0.04em',
        whiteSpace: 'nowrap',
        pointerEvents: 'none',
        ...style,
      }}
    >
      <span style={{
        width: 6,
        height: 6,
        borderRadius: '50%',
        background: C.blue,
        boxShadow: '0 0 8px rgba(47,90,240,0.8)',
        animation: 'bgaiPulse 2s ease-in-out infinite',
      }} />
      {text}
    </motion.div>
  )
}

// ─── Question card ────────────────────────────────────────────────────────────
function QuestionCard({ emoji, text, delay }) {
  const [hovered, setHovered] = useState(false)
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay, ease }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: C.white,
        border: `1px solid ${hovered ? C.blue : C.border}`,
        borderRadius: 12,
        padding: '20px 18px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: 12,
        cursor: 'default',
        transition: 'border-color 0.18s, box-shadow 0.18s, transform 0.18s',
        boxShadow: hovered ? '0 6px 24px rgba(47,90,240,0.10)' : '0 1px 4px rgba(0,0,0,0.04)',
        transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
      }}
    >
      <span style={{ fontSize: 22, lineHeight: 1, flexShrink: 0, marginTop: 1 }}>{emoji}</span>
      <span style={{
        fontFamily: font,
        fontSize: 14,
        fontWeight: 500,
        color: C.text,
        lineHeight: 1.55,
      }}>
        {text}
      </span>
    </motion.div>
  )
}

// ─── Why card ─────────────────────────────────────────────────────────────────
function WhyCard({ card, delay }) {
  const [hovered, setHovered] = useState(false)
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, delay, ease }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: C.white,
        border: `1px solid ${hovered ? C.blue : C.border}`,
        borderRadius: 14,
        padding: '32px 28px',
        transition: 'border-color 0.2s, box-shadow 0.2s',
        boxShadow: hovered ? '0 6px 28px rgba(47,90,240,0.09)' : '0 1px 6px rgba(0,0,0,0.04)',
        cursor: 'default',
      }}
    >
      <div style={{
        width: 38,
        height: 38,
        borderRadius: 10,
        background: 'rgba(47,90,240,0.08)',
        border: '1px solid rgba(47,90,240,0.18)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
      }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.blue} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 8v4l3 3" />
        </svg>
      </div>
      <h3 style={{
        fontFamily: font,
        fontWeight: 700,
        fontSize: 18,
        color: C.text,
        letterSpacing: '-0.02em',
        marginBottom: 10,
        lineHeight: 1.3,
      }}>
        {card.title}
      </h3>
      <p style={{
        fontFamily: font,
        fontSize: 14,
        color: C.muted,
        lineHeight: 1.7,
      }}>
        {card.body}
      </p>
    </motion.div>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function BigGeoAI() {
  const [activeTab, setActiveTab] = useState('nearby')
  const activeTabData = TABS.find(t => t.id === activeTab)

  return (
    <>
      {/* ── 1. Hero ─────────────────────────────────────────────────────────── */}
      <section style={{
        position: 'relative',
        background: C.navy,
        overflow: 'hidden',
        padding: 'clamp(96px, 14vw, 148px) clamp(20px, 5vw, 64px)',
        textAlign: 'center',
      }}>
        {/* Radial glow */}
        <div style={{
          position: 'absolute',
          top: '-10%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '80%',
          height: '70%',
          background: 'radial-gradient(ellipse at top, rgba(47,90,240,0.32) 0%, transparent 65%)',
          pointerEvents: 'none',
        }} />
        {/* Secondary glow bottom */}
        <div style={{
          position: 'absolute',
          bottom: '-5%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '60%',
          height: '40%',
          background: 'radial-gradient(ellipse at bottom, rgba(47,90,240,0.14) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        {/* Floating shimmer labels */}
        <ShimmerLabel text="Real spatial data" style={{ top: '22%', left: '7%' }} delay={1.0} />
        <ShimmerLabel text="MCP connector" style={{ top: '18%', right: '8%' }} delay={1.15} />
        <ShimmerLabel text="Works in ChatGPT & Claude" style={{ bottom: '28%', left: '5%' }} delay={1.3} />
        <ShimmerLabel text="Sub-second answers" style={{ bottom: '22%', right: '6%' }} delay={1.45} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 760, margin: '0 auto' }}>
          {/* Now Live badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.55, ease }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 28 }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 16px 6px 10px',
              borderRadius: 100,
              background: 'rgba(47,90,240,0.18)',
              border: '1px solid rgba(47,90,240,0.4)',
              fontFamily: font,
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#A3BFFC',
            }}>
              <span style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: '#60EFAB',
                boxShadow: '0 0 10px rgba(96,239,171,0.9)',
                animation: 'bgaiPulse 2.2s ease-in-out infinite',
              }} />
              Now Live
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.78, delay: 0.15, ease }}
            style={{
              fontFamily: font,
              fontWeight: 800,
              fontSize: 'clamp(40px, 7vw, 80px)',
              lineHeight: 1.04,
              letterSpacing: '-0.038em',
              color: '#ffffff',
              marginBottom: 24,
            }}
          >
            For the first time,{' '}
            <span style={{ color: C.blue }}>AI touches</span>
            <br />the world it reasons about.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease }}
            style={{
              fontFamily: font,
              fontSize: 'clamp(15px, 2vw, 18px)',
              color: 'rgba(180,198,255,0.82)',
              lineHeight: 1.72,
              maxWidth: 560,
              margin: '0 auto 40px',
            }}
          >
            BigGeo AI is an MCP connector that gives ChatGPT and Claude access to real, governed spatial data. Ask a question about any location. Get a verified answer in seconds — not a guess.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.45, ease }}
            style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}
          >
            <motion.a
              href="https://chatgpt.com/apps/biggeo-ai/asdk_app_69b2ece221cc8191b9e7c3e49ab0adf9"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05, boxShadow: '0 8px 40px rgba(47,90,240,0.55)' }}
              whileTap={{ scale: 0.97 }}
              style={{
                display: 'inline-block',
                fontFamily: font,
                fontWeight: 700,
                fontSize: 15,
                color: '#ffffff',
                background: C.blue,
                border: 'none',
                borderRadius: 12,
                padding: '15px 34px',
                cursor: 'pointer',
                boxShadow: '0 4px 28px rgba(47,90,240,0.45)',
                textDecoration: 'none',
              }}
            >
              Install BigGeo AI →
            </motion.a>
            <motion.button
              whileHover={{ scale: 1.03, background: 'rgba(255,255,255,0.08)' }}
              whileTap={{ scale: 0.97 }}
              style={{
                fontFamily: font,
                fontWeight: 700,
                fontSize: 15,
                color: 'rgba(180,198,255,0.88)',
                background: 'transparent',
                border: '1.5px solid rgba(107,143,245,0.32)',
                borderRadius: 12,
                padding: '15px 34px',
                cursor: 'pointer',
              }}
            >
              See How It Works
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* ── 2. Problem ──────────────────────────────────────────────────────── */}
      <section style={{
        background: C.white,
        padding: 'clamp(80px, 10vw, 120px) clamp(20px, 5vw, 64px)',
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 64,
            alignItems: 'center',
          }}>
            {/* Left: explanation */}
            <motion.div
              {...fadeUp}
              transition={{ duration: 0.65, ease }}
            >
              <div style={{
                display: 'inline-block',
                fontFamily: font,
                fontWeight: 600,
                fontSize: 11,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: C.blue,
                marginBottom: 16,
              }}>
                The Problem
              </div>
              <h2 style={{
                fontFamily: font,
                fontWeight: 800,
                fontSize: 'clamp(30px, 4vw, 46px)',
                color: C.text,
                letterSpacing: '-0.03em',
                lineHeight: 1.1,
                marginBottom: 20,
              }}>
                AI has{' '}
                <span style={{
                  background: 'linear-gradient(135deg,#E84545 0%,#F07432 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>
                  Spatial Blindness.
                </span>
              </h2>
              <p style={{
                fontFamily: font,
                fontSize: 16,
                color: C.muted,
                lineHeight: 1.75,
                marginBottom: 20,
              }}>
                AI knows <em>about</em> places — but it has no idea what's actually happening <em>at</em> a place, right now. Ask your AI assistant where the nearest flood zone is, what the foot traffic looks like on a given street, or whether a property sits in a wildfire risk corridor. You'll get a plausible-sounding guess. Not an answer.
              </p>
              <p style={{
                fontFamily: font,
                fontSize: 16,
                color: C.muted,
                lineHeight: 1.75,
              }}>
                The world generates billions of spatial data points every day. Until now, AI couldn't reach any of them. BigGeo AI closes that gap — connecting your AI assistant directly to governed, real-world spatial data, so it stops guessing and starts knowing.
              </p>
            </motion.div>

            {/* Right: Before / After card */}
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, delay: 0.12, ease }}
            >
              <div style={{
                background: C.white,
                border: `1px solid ${C.border}`,
                borderRadius: 16,
                overflow: 'hidden',
                boxShadow: '0 8px 40px rgba(0,0,0,0.08)',
              }}>
                {/* Chat header bar */}
                <div style={{
                  background: C.bg,
                  borderBottom: `1px solid ${C.border}`,
                  padding: '12px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#E8E8E8' }} />
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#E8E8E8' }} />
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#E8E8E8' }} />
                  <span style={{ fontFamily: font, fontSize: 12, color: C.muted, marginLeft: 8, letterSpacing: '0.02em' }}>
                    AI Assistant
                  </span>
                </div>

                {/* User question */}
                <div style={{ padding: '20px 20px 16px' }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    marginBottom: 20,
                  }}>
                    <div style={{
                      background: C.blue,
                      color: '#fff',
                      fontFamily: font,
                      fontSize: 13,
                      fontWeight: 500,
                      padding: '10px 16px',
                      borderRadius: '12px 12px 2px 12px',
                      maxWidth: '80%',
                      lineHeight: 1.5,
                    }}>
                      Is the property at 2847 Elm Street in a flood zone?
                    </div>
                  </div>

                  {/* Without BigGeo AI */}
                  <div style={{ marginBottom: 4 }}>
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      background: 'rgba(232,69,69,0.08)',
                      border: '1px solid rgba(232,69,69,0.2)',
                      borderRadius: 6,
                      padding: '3px 10px',
                      fontFamily: font,
                      fontSize: 10,
                      fontWeight: 700,
                      color: '#C03535',
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      marginBottom: 10,
                    }}>
                      <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#E84545' }} />
                      Without BigGeo AI
                    </div>
                    <div style={{
                      background: '#FAFAFA',
                      border: `1px solid ${C.border}`,
                      borderRadius: '2px 12px 12px 12px',
                      padding: '12px 14px',
                      fontFamily: font,
                      fontSize: 13,
                      color: '#8A8FA0',
                      lineHeight: 1.6,
                      fontStyle: 'italic',
                    }}>
                      I don't have access to real-time flood zone maps. You may want to check FEMA's Flood Map Service Center or contact a local assessor for accurate zoning information.
                    </div>
                  </div>

                  {/* Divider */}
                  <div style={{
                    height: 1,
                    background: C.border,
                    margin: '20px 0',
                    position: 'relative',
                  }}>
                    <span style={{
                      position: 'absolute',
                      left: '50%',
                      top: '50%',
                      transform: 'translate(-50%,-50%)',
                      background: C.white,
                      padding: '0 10px',
                      fontFamily: font,
                      fontSize: 10,
                      fontWeight: 600,
                      color: C.muted,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                    }}>
                      vs
                    </span>
                  </div>

                  {/* With BigGeo AI */}
                  <div>
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      background: 'rgba(47,90,240,0.08)',
                      border: '1px solid rgba(47,90,240,0.22)',
                      borderRadius: 6,
                      padding: '3px 10px',
                      fontFamily: font,
                      fontSize: 10,
                      fontWeight: 700,
                      color: C.blue,
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      marginBottom: 10,
                    }}>
                      <span style={{
                        width: 5,
                        height: 5,
                        borderRadius: '50%',
                        background: C.blue,
                        animation: 'bgaiPulse 2s ease-in-out infinite',
                      }} />
                      With BigGeo AI
                    </div>
                    <div style={{
                      background: 'rgba(47,90,240,0.04)',
                      border: '1px solid rgba(47,90,240,0.16)',
                      borderRadius: '2px 12px 12px 12px',
                      padding: '12px 14px',
                      fontFamily: font,
                      fontSize: 13,
                      color: C.text,
                      lineHeight: 1.65,
                    }}>
                      <strong>Yes.</strong> 2847 Elm Street falls within FEMA Flood Zone AE (100-year floodplain), census tract 0421.02, postal code K2B 7E9. Flood risk has elevated 12% over the past decade based on updated hydrological data. Last updated: April 2026.
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── 3. Tabs / See It In Action ──────────────────────────────────────── */}
      <section style={{
        background: C.bg,
        padding: 'clamp(80px, 10vw, 120px) clamp(20px, 5vw, 64px)',
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          {/* Header */}
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.6, ease }}
            style={{ textAlign: 'center', marginBottom: 48 }}
          >
            <div style={{
              fontFamily: font,
              fontWeight: 600,
              fontSize: 11,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: C.blue,
              marginBottom: 14,
            }}>
              See It In Action
            </div>
            <h2 style={{
              fontFamily: font,
              fontWeight: 800,
              fontSize: 'clamp(28px, 4vw, 44px)',
              color: C.text,
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
              marginBottom: 16,
            }}>
              Questions your AI can answer<br />
              <span style={{ color: C.blue }}>with BigGeo AI installed.</span>
            </h2>
            <p style={{
              fontFamily: font,
              fontSize: 16,
              color: C.muted,
              maxWidth: 520,
              margin: '0 auto',
              lineHeight: 1.7,
            }}>
              Pick a scenario and explore the kinds of real spatial questions your AI assistant can now answer with confidence — not guesswork.
            </p>
          </motion.div>

          {/* Tab pills */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: 0.1, ease }}
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 8,
              justifyContent: 'center',
              marginBottom: 40,
            }}
          >
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  fontFamily: font,
                  fontWeight: 600,
                  fontSize: 13,
                  padding: '9px 20px',
                  borderRadius: 100,
                  border: activeTab === tab.id
                    ? `1.5px solid ${C.blue}`
                    : `1.5px solid ${C.border}`,
                  background: activeTab === tab.id
                    ? C.blue
                    : C.white,
                  color: activeTab === tab.id
                    ? '#ffffff'
                    : C.muted,
                  cursor: 'pointer',
                  transition: 'all 0.18s ease',
                  letterSpacing: '0.01em',
                }}
              >
                {tab.label}
              </button>
            ))}
          </motion.div>

          {/* Question grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 14,
          }}>
            {activeTabData.questions.map((q, i) => (
              <QuestionCard
                key={`${activeTab}-${i}`}
                emoji={q.emoji}
                text={q.text}
                delay={i * 0.07}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. Why BigGeo AI ────────────────────────────────────────────────── */}
      <section style={{
        background: C.white,
        padding: 'clamp(80px, 10vw, 120px) clamp(20px, 5vw, 64px)',
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          {/* Header */}
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.6, ease }}
            style={{ textAlign: 'center', marginBottom: 56 }}
          >
            <div style={{
              fontFamily: font,
              fontWeight: 600,
              fontSize: 11,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: C.blue,
              marginBottom: 14,
            }}>
              Why BigGeo AI
            </div>
            <h2 style={{
              fontFamily: font,
              fontWeight: 800,
              fontSize: 'clamp(28px, 4vw, 44px)',
              color: C.text,
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
              marginBottom: 16,
            }}>
              Built for the questions<br />that actually matter.
            </h2>
            <p style={{
              fontFamily: font,
              fontSize: 16,
              color: C.muted,
              maxWidth: 500,
              margin: '0 auto',
              lineHeight: 1.7,
            }}>
              Four things that make BigGeo AI different from every other AI plugin for location.
            </p>
          </motion.div>

          {/* Cards 2-col grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(440px, 1fr))',
            gap: 18,
          }}>
            {WHY_CARDS.map((card, i) => (
              <WhyCard key={card.title} card={card} delay={i * 0.1} />
            ))}
          </div>

          {/* Three pillars row */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.65, delay: 0.15, ease }}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: 0,
              marginTop: 40,
              border: `1px solid ${C.border}`,
              borderRadius: 14,
              overflow: 'hidden',
            }}
          >
            {[
              { label: 'AI Touches Ground', sub: 'Real data, not training-set memories.' },
              { label: 'Data That Earns Forever', sub: 'Providers paid on every query automatically.' },
              { label: 'No Specialist Required', sub: 'Ask in plain language. Get governed answers.' },
            ].map((pillar, i, arr) => (
              <div
                key={pillar.label}
                style={{
                  padding: '28px 28px',
                  borderRight: i < arr.length - 1 ? `1px solid ${C.border}` : 'none',
                  background: C.bg,
                }}
              >
                <div style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: 'rgba(47,90,240,0.1)',
                  border: '1px solid rgba(47,90,240,0.18)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 14,
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.blue} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <div style={{
                  fontFamily: font,
                  fontWeight: 700,
                  fontSize: 15,
                  color: C.text,
                  marginBottom: 6,
                }}>
                  {pillar.label}
                </div>
                <div style={{
                  fontFamily: font,
                  fontSize: 13,
                  color: C.muted,
                  lineHeight: 1.6,
                }}>
                  {pillar.sub}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── 5. CTA ──────────────────────────────────────────────────────────── */}
      <section style={{
        background: C.bg,
        padding: 'clamp(40px, 6vw, 80px) clamp(20px, 5vw, 64px) clamp(80px, 10vw, 120px)',
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, ease }}
            style={{
              position: 'relative',
              background: C.navy,
              borderRadius: 20,
              overflow: 'hidden',
              padding: 'clamp(56px, 8vw, 96px) clamp(32px, 5vw, 72px)',
              textAlign: 'center',
            }}
          >
            {/* Radial glow top */}
            <div style={{
              position: 'absolute',
              top: '-5%',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '80%',
              height: '60%',
              background: 'radial-gradient(ellipse at top, rgba(47,90,240,0.3) 0%, transparent 65%)',
              pointerEvents: 'none',
            }} />
            {/* Radial glow bottom */}
            <div style={{
              position: 'absolute',
              bottom: '-5%',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '50%',
              height: '40%',
              background: 'radial-gradient(ellipse at bottom, rgba(47,90,240,0.14) 0%, transparent 70%)',
              pointerEvents: 'none',
            }} />

            <div style={{ position: 'relative', zIndex: 1, maxWidth: 600, margin: '0 auto' }}>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.65, delay: 0.1, ease }}
                style={{
                  fontFamily: font,
                  fontWeight: 800,
                  fontSize: 'clamp(26px, 4.5vw, 44px)',
                  color: '#ffffff',
                  letterSpacing: '-0.03em',
                  lineHeight: 1.1,
                  marginBottom: 18,
                }}
              >
                The question your AI was guessing at yesterday.{' '}
                <span style={{ color: C.blue }}>It answers today.</span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, delay: 0.2, ease }}
                style={{
                  fontFamily: font,
                  fontSize: 17,
                  color: 'rgba(180,198,255,0.75)',
                  lineHeight: 1.7,
                  maxWidth: 480,
                  margin: '0 auto 44px',
                }}
              >
                Install BigGeo AI in ChatGPT or Claude and start getting real answers about any location on Earth — governed, verified, and fast.
              </motion.p>

              <motion.a
                href="https://chatgpt.com/apps/biggeo-ai/asdk_app_69b2ece221cc8191b9e7c3e49ab0adf9"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.06, boxShadow: '0 10px 48px rgba(47,90,240,0.6)' }}
                whileTap={{ scale: 0.97 }}
                style={{
                  display: 'inline-block',
                  fontFamily: font,
                  fontWeight: 700,
                  fontSize: 16,
                  color: '#ffffff',
                  background: C.blue,
                  border: 'none',
                  borderRadius: 12,
                  padding: '17px 40px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 28px rgba(47,90,240,0.45)',
                  textDecoration: 'none',
                  letterSpacing: '-0.01em',
                }}
              >
                Install BigGeo AI →
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Keyframes ───────────────────────────────────────────────────────── */}
      <style>{`
        @keyframes bgaiPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.72); }
        }
      `}</style>
    </>
  )
}
