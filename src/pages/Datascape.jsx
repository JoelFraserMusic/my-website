import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import DataNetwork from '../components/DataNetwork'
import datascapeLogo from '../assets/datascape-logo.png'

// ── Shared primitives ──────────────────────────────────────────────────────────

function ProductHero({ eyebrow, headline, accent, sub, cta1, cta2 }) {
  return (
    <section style={{
      background: '#122159', minHeight: '88vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '140px clamp(20px,5vw,64px) 100px',
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 65% 55% at 50% 10%, rgba(47,90,240,0.28) 0%, transparent 70%)',
      }} />
      <DataNetwork />

      <div style={{ maxWidth: '820px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}
          transition={{ duration:0.5, delay:0.05, ease:[0.22,1,0.36,1] }}
          style={{
            display:'inline-flex', alignItems:'center',
            marginBottom:'20px', padding:'7px 16px', borderRadius:'100px',
            background:'rgba(255,255,255,0.95)',
            boxShadow:'0 2px 12px rgba(0,0,0,0.15)',
          }}>
          <img src={datascapeLogo} alt="Datascape" style={{ height:'18px', width:'auto', display:'block' }} />
        </motion.div>

        <motion.h1 initial={{ opacity:0, y:28 }} animate={{ opacity:1, y:0 }}
          transition={{ duration:0.7, delay:0.15, ease:[0.22,1,0.36,1] }}
          style={{
            fontFamily:'var(--font)', fontWeight:800,
            fontSize:'clamp(42px,7vw,80px)',
            color:'#fff', lineHeight:1.05, letterSpacing:'-0.03em', marginBottom:'24px',
          }}>
          {headline}{' '}
          <span style={{
            background:'linear-gradient(135deg,#6B8FF5 0%,#A3BFFC 100%)',
            WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text',
          }}>{accent}</span>
        </motion.h1>

        <motion.p initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
          transition={{ duration:0.65, delay:0.3, ease:[0.22,1,0.36,1] }}
          style={{
            fontFamily:'var(--font)', fontWeight:400,
            fontSize:'clamp(16px,2.2vw,20px)',
            color:'rgba(180,198,255,0.8)', lineHeight:1.7,
            maxWidth:'580px', margin:'0 auto 44px',
          }}>
          {sub}
        </motion.p>

        <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
          transition={{ duration:0.6, delay:0.44, ease:[0.22,1,0.36,1] }}
          style={{ display:'flex', gap:'14px', justifyContent:'center', flexWrap:'wrap' }}>
          <motion.button
            whileHover={{ scale:1.05, background:'#1C40C1', boxShadow:'0 6px 32px rgba(47,90,240,0.55)' }}
            whileTap={{ scale:0.97 }}
            style={{
              fontFamily:'var(--font)', fontWeight:600, fontSize:'16px', color:'#fff',
              background:'#2F5AF0', border:'none', borderRadius:'12px', padding:'15px 36px',
              cursor:'pointer', boxShadow:'0 4px 24px rgba(47,90,240,0.4)',
              transition:'background 0.2s, box-shadow 0.2s',
            }}>
            {cta1}
          </motion.button>
          <motion.button
            whileHover={{ scale:1.03, borderColor:'rgba(107,143,245,0.6)', color:'#fff' }}
            whileTap={{ scale:0.97 }}
            style={{
              fontFamily:'var(--font)', fontWeight:600, fontSize:'16px',
              color:'rgba(180,198,255,0.8)', background:'rgba(255,255,255,0.06)',
              border:'1px solid rgba(107,143,245,0.28)', borderRadius:'12px',
              padding:'15px 36px', cursor:'pointer', backdropFilter:'blur(8px)',
              transition:'border-color 0.2s, color 0.2s',
            }}>
            {cta2}
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}

function SectionLabel({ text }) {
  return (
    <div style={{
      fontFamily:'var(--font)', fontWeight:600, fontSize:'12px',
      letterSpacing:'0.1em', textTransform:'uppercase',
      color:'#2F5AF0', marginBottom:'16px',
    }}>{text}</div>
  )
}

// ── Feature cards ─────────────────────────────────────────────────────────────

const features = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
      </svg>
    ),
    title: 'Query without code',
    desc: 'Point, filter, slice. Write plain-language spatial queries and get back structured data, no SQL dialects or GIS experience required.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0l4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0l-5.571 3-5.571-3" />
      </svg>
    ),
    title: 'Any dataset, any format',
    desc: 'Connect to GeoJSON, shapefiles, CSVs with coordinates, WKT, or live API feeds. Datascape normalises everything into a unified view.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
      </svg>
    ),
    title: 'Share and collaborate',
    desc: 'Package any exploration as a shareable snapshot. Teams stay aligned without exporting, emailing, or rebuilding the same query twice.',
  },
]

const cardVars = {
  hidden: { opacity:0, y:36 },
  visible: (i) => ({ opacity:1, y:0, transition:{ duration:0.62, delay:i*0.12, ease:[0.22,1,0.36,1] } }),
}

// ── Use-case row ──────────────────────────────────────────────────────────────

const useCases = [
  { label:'Real estate analytics', desc:'Overlay parcel data, zoning boundaries, and demographic layers to answer valuation questions in minutes.' },
  { label:'Insurance underwriting', desc:'Explore flood zones, wildfire risk, and claim history by geography, without a GIS team.' },
  { label:'Logistics & routing', desc:'Identify coverage gaps, density clusters, and service boundary anomalies across your network.' },
  { label:'Urban planning', desc:'Visualise population change, infrastructure load, and land use patterns across any jurisdiction.' },
]

// ── Main export ───────────────────────────────────────────────────────────────

export default function Datascape() {
  const featRef = useRef(null)
  const featInView = useInView(featRef, { once:true, margin:'-80px' })
  const caseRef = useRef(null)
  const caseInView = useInView(caseRef, { once:true, margin:'-80px' })

  return (
    <>
      <ProductHero
        eyebrow="Datascape"
        headline="Explore your spatial data."
        accent="Without the complexity."
        sub="Datascape gives every analyst, strategist, and product manager direct access to spatial datasets, no GIS tools, no specialist bottleneck, no waiting."
        cta1="Try Datascape Free"
        cta2="See a Live Demo"
      />

      {/* Features */}
      <section style={{ padding:'clamp(80px,10vw,130px) clamp(20px,5vw,64px)', background:'#fff' }}>
        <div style={{ maxWidth:'1100px', margin:'0 auto' }} ref={featRef}>
          <motion.div initial={{ opacity:0, y:20 }} animate={featInView?{opacity:1,y:0}:{}}
            transition={{ duration:0.6, ease:[0.22,1,0.36,1] }}
            style={{ marginBottom:'56px', maxWidth:'600px' }}>
            <SectionLabel text="What Datascape does" />
            <h2 style={{
              fontFamily:'var(--font)', fontWeight:700,
              fontSize:'clamp(30px,4vw,48px)', color:'#1E1E1E',
              letterSpacing:'-0.025em', lineHeight:1.1, marginBottom:'16px',
            }}>
              From raw coordinates to clear answers, fast.
            </h2>
            <p style={{ fontFamily:'var(--font)', fontSize:'17px', color:'#959DBC', lineHeight:1.7 }}>
              Datascape connects to your spatial data wherever it lives and turns it into something
              every team can act on.
            </p>
          </motion.div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))', gap:'20px' }}>
            {features.map((f, i) => (
              <motion.div key={f.title} custom={i} variants={cardVars}
                initial="hidden" animate={featInView?'visible':'hidden'}
                whileHover={{ y:-4, transition:{ duration:0.2 } }}
                style={{
                  background:'#fff', border:'1px solid rgba(47,90,240,0.14)',
                  borderRadius:'16px', padding:'32px 28px',
                  boxShadow:'0 2px 16px rgba(47,90,240,0.06)',
                }}>
                <div style={{
                  display:'inline-flex', alignItems:'center', justifyContent:'center',
                  width:'48px', height:'48px', borderRadius:'12px',
                  background:'rgba(47,90,240,0.08)', color:'#2F5AF0', marginBottom:'20px',
                }}>
                  {f.icon}
                </div>
                <h3 style={{ fontFamily:'var(--font)', fontWeight:700, fontSize:'19px', color:'#1E1E1E', letterSpacing:'-0.02em', marginBottom:'10px' }}>{f.title}</h3>
                <p style={{ fontFamily:'var(--font)', fontSize:'15px', color:'#6B7490', lineHeight:1.7 }}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section style={{ padding:'clamp(60px,8vw,110px) clamp(20px,5vw,64px)', background:'#f5f7ff' }}>
        <div style={{ maxWidth:'1100px', margin:'0 auto' }} ref={caseRef}>
          <motion.div initial={{ opacity:0, y:20 }} animate={caseInView?{opacity:1,y:0}:{}}
            transition={{ duration:0.6, ease:[0.22,1,0.36,1] }}
            style={{ marginBottom:'48px' }}>
            <SectionLabel text="Built for" />
            <h2 style={{
              fontFamily:'var(--font)', fontWeight:700,
              fontSize:'clamp(28px,3.5vw,44px)', color:'#1E1E1E',
              letterSpacing:'-0.025em', lineHeight:1.1,
            }}>
              Teams that need answers, not another tool to learn.
            </h2>
          </motion.div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))', gap:'16px' }}>
            {useCases.map((u, i) => (
              <motion.div key={u.label}
                initial={{ opacity:0, y:24 }} animate={caseInView?{opacity:1,y:0}:{}}
                transition={{ duration:0.58, delay:i*0.1, ease:[0.22,1,0.36,1] }}
                style={{
                  background:'#fff', borderRadius:'14px', padding:'28px 24px',
                  border:'1px solid rgba(149,157,188,0.15)',
                  boxShadow:'0 1px 12px rgba(47,90,240,0.04)',
                }}>
                <div style={{
                  width:'6px', height:'6px', borderRadius:'50%',
                  background:'#2F5AF0', marginBottom:'16px',
                }} />
                <h4 style={{ fontFamily:'var(--font)', fontWeight:600, fontSize:'16px', color:'#1E1E1E', marginBottom:'8px', letterSpacing:'-0.01em' }}>{u.label}</h4>
                <p style={{ fontFamily:'var(--font)', fontSize:'14px', color:'#7B83A0', lineHeight:1.7 }}>{u.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA strip */}
      <section style={{ background:'#122159', padding:'clamp(60px,8vw,100px) clamp(20px,5vw,64px)' }}>
        <div style={{ maxWidth:'680px', margin:'0 auto', textAlign:'center' }}>
          <h2 style={{
            fontFamily:'var(--font)', fontWeight:800,
            fontSize:'clamp(32px,5vw,56px)', color:'#fff',
            letterSpacing:'-0.03em', lineHeight:1.1, marginBottom:'20px',
          }}>
            Start exploring in minutes.
          </h2>
          <p style={{ fontFamily:'var(--font)', fontSize:'17px', color:'rgba(149,157,188,0.8)', lineHeight:1.7, marginBottom:'36px' }}>
            No setup. No onboarding call. Connect your data and go.
          </p>
          <motion.button
            whileHover={{ scale:1.05, background:'#1C40C1' }} whileTap={{ scale:0.97 }}
            style={{
              fontFamily:'var(--font)', fontWeight:600, fontSize:'16px', color:'#fff',
              background:'#2F5AF0', border:'none', borderRadius:'12px', padding:'16px 40px',
              cursor:'pointer', boxShadow:'0 4px 28px rgba(47,90,240,0.45)',
              transition:'background 0.2s',
            }}>
            Get Started Free
          </motion.button>
        </div>
      </section>
    </>
  )
}
