import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import DataNetwork from '../components/DataNetwork'
import marketplaceLogo from '../assets/marketplace-logo-white.png'

function SectionLabel({ text, dark }) {
  return (
    <div style={{
      fontFamily:'var(--font)', fontWeight:600, fontSize:'12px',
      letterSpacing:'0.1em', textTransform:'uppercase',
      color: dark ? '#6B8FF5' : '#2F5AF0', marginBottom:'16px',
    }}>{text}</div>
  )
}

const categories = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
      </svg>
    ),
    name: 'Parcel & Property',
    count: '2.1B records',
    desc: 'US and global parcel boundaries, ownership, assessed values, zoning classifications, and building footprints.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
      </svg>
    ),
    name: 'Demographics & Census',
    count: '190+ countries',
    desc: 'Population density, age breakdowns, income distribution, household composition, at block, tract, and national level.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z" />
      </svg>
    ),
    name: 'Environmental & Climate',
    count: 'Live + historical',
    desc: 'Flood risk, wildfire perimeters, air quality indices, sea-level projections, and climate hazard scores by geography.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
      </svg>
    ),
    name: 'Transportation & Logistics',
    count: 'Updated daily',
    desc: 'Road networks, traffic patterns, transit routes, port boundaries, freight lanes, and last-mile delivery zones.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" />
      </svg>
    ),
    name: 'Points of Interest',
    count: '200M+ locations',
    desc: 'Verified business locations, retail footprints, amenity data, opening hours, and category hierarchies, globally.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
      </svg>
    ),
    name: 'Administrative Boundaries',
    count: 'Every jurisdiction',
    desc: 'Country, state, county, city, zip, census tract, and custom boundary layers, always current, versioned and diffable.',
  },
]

const trust = [
  { label:'Licensed datasets', desc:'Every dataset is sourced, licensed, and terms-cleared. We handle the legal complexity so you don\'t have to.' },
  { label:'Instant access', desc:'No procurement workflow. Purchase or subscribe and your API key unlocks access in under 60 seconds.' },
  { label:'Versioned and diffable', desc:'Every dataset version is retained. Query historical snapshots or stream change events as they happen.' },
  { label:'One invoice', desc:'All your data providers consolidated into a single monthly bill. Usage-based pricing, no minimums.' },
]

const cardVars = {
  hidden: { opacity:0, y:32 },
  visible: (i) => ({ opacity:1, y:0, transition:{ duration:0.6, delay:i*0.09, ease:[0.22,1,0.36,1] } }),
}

export default function Marketplace() {
  const catRef = useRef(null)
  const catInView = useInView(catRef, { once:true, margin:'-80px' })
  const trustRef = useRef(null)
  const trustInView = useInView(trustRef, { once:true, margin:'-80px' })

  return (
    <>
      {/* Hero */}
      <section style={{
        background:'#122159', minHeight:'88vh',
        display:'flex', alignItems:'center', justifyContent:'center',
        padding:'140px clamp(20px,5vw,64px) 100px',
        position:'relative', overflow:'hidden',
      }}>
        <div style={{
          position:'absolute', inset:0, pointerEvents:'none',
          background:'radial-gradient(ellipse 65% 55% at 50% 10%, rgba(47,90,240,0.24) 0%, transparent 70%)',
        }} />
        <DataNetwork />

        <div style={{ maxWidth:'860px', textAlign:'center', position:'relative', zIndex:1 }}>
          <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}
            transition={{ duration:0.5, delay:0.05, ease:[0.22,1,0.36,1] }}
            style={{
              display:'inline-flex', alignItems:'center',
              marginBottom:'20px', padding:'7px 16px', borderRadius:'100px',
              background:'rgba(255,255,255,0.12)',
              border:'1px solid rgba(255,255,255,0.2)',
              boxShadow:'0 2px 12px rgba(0,0,0,0.15)',
            }}>
            <img src={marketplaceLogo} alt="Marketplace" style={{ height:'18px', width:'auto', display:'block' }} />
          </motion.div>

          <motion.h1 initial={{ opacity:0, y:28 }} animate={{ opacity:1, y:0 }}
            transition={{ duration:0.7, delay:0.15, ease:[0.22,1,0.36,1] }}
            style={{
              fontFamily:'var(--font)', fontWeight:800,
              fontSize:'clamp(42px,7vw,80px)',
              color:'#fff', lineHeight:1.05, letterSpacing:'-0.03em', marginBottom:'24px',
            }}>
            The world's spatial data.{' '}
            <span style={{
              background:'linear-gradient(135deg,#6B8FF5 0%,#A3BFFC 100%)',
              WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text',
            }}>Ready to use.</span>
          </motion.h1>

          <motion.p initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
            transition={{ duration:0.65, delay:0.3, ease:[0.22,1,0.36,1] }}
            style={{
              fontFamily:'var(--font)', fontWeight:400,
              fontSize:'clamp(16px,2.2vw,20px)',
              color:'rgba(180,198,255,0.8)', lineHeight:1.7,
              maxWidth:'580px', margin:'0 auto 44px',
            }}>
            Browse, preview, and access thousands of licensed spatial datasets, from parcel records
            to environmental risk layers, through a single API.
          </motion.p>

          <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
            transition={{ duration:0.6, delay:0.44, ease:[0.22,1,0.36,1] }}
            style={{ display:'flex', gap:'14px', justifyContent:'center', flexWrap:'wrap' }}>
            <motion.button
              whileHover={{ scale:1.05, background:'#1C40C1' }} whileTap={{ scale:0.97 }}
              style={{
                fontFamily:'var(--font)', fontWeight:600, fontSize:'16px', color:'#fff',
                background:'#2F5AF0', border:'none', borderRadius:'12px', padding:'15px 36px',
                cursor:'pointer', boxShadow:'0 4px 24px rgba(47,90,240,0.4)',
                transition:'background 0.2s',
              }}>
              Browse Datasets
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
              Talk to a Data Expert
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section style={{ padding:'clamp(80px,10vw,130px) clamp(20px,5vw,64px)', background:'#fff' }}>
        <div style={{ maxWidth:'1100px', margin:'0 auto' }} ref={catRef}>
          <motion.div initial={{ opacity:0, y:20 }} animate={catInView?{opacity:1,y:0}:{}}
            transition={{ duration:0.6, ease:[0.22,1,0.36,1] }}
            style={{ marginBottom:'56px' }}>
            <SectionLabel text="Dataset categories" />
            <h2 style={{
              fontFamily:'var(--font)', fontWeight:700,
              fontSize:'clamp(30px,4vw,48px)', color:'#1E1E1E',
              letterSpacing:'-0.025em', lineHeight:1.1, marginBottom:'16px',
            }}>
              Every type of spatial data,<br />licensed and ready to query.
            </h2>
            <p style={{ fontFamily:'var(--font)', fontSize:'17px', color:'#959DBC', lineHeight:1.7, maxWidth:'520px' }}>
              We work directly with data providers to source, license, and standardise
              datasets, so you can access them through a single API with a single contract.
            </p>
          </motion.div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))', gap:'18px' }}>
            {categories.map((c, i) => (
              <motion.div key={c.name} custom={i} variants={cardVars}
                initial="hidden" animate={catInView?'visible':'hidden'}
                whileHover={{ y:-4, borderColor:'rgba(47,90,240,0.3)', transition:{ duration:0.2 } }}
                style={{
                  background:'#fff', border:'1px solid rgba(149,157,188,0.15)',
                  borderRadius:'16px', padding:'28px 26px',
                  boxShadow:'0 2px 14px rgba(47,90,240,0.04)',
                  cursor:'pointer', transition:'border-color 0.2s',
                }}>
                <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:'16px' }}>
                  <div style={{
                    display:'inline-flex', alignItems:'center', justifyContent:'center',
                    width:'52px', height:'52px', borderRadius:'14px',
                    background:'rgba(47,90,240,0.07)', color:'#2F5AF0',
                  }}>
                    {c.icon}
                  </div>
                  <span style={{
                    fontFamily:'var(--font)', fontWeight:600, fontSize:'12px',
                    color:'#2F5AF0', background:'rgba(47,90,240,0.08)',
                    padding:'4px 10px', borderRadius:'100px',
                    letterSpacing:'0.02em',
                  }}>
                    {c.count}
                  </span>
                </div>
                <h3 style={{ fontFamily:'var(--font)', fontWeight:700, fontSize:'18px', color:'#1E1E1E', letterSpacing:'-0.02em', marginBottom:'8px' }}>{c.name}</h3>
                <p style={{ fontFamily:'var(--font)', fontSize:'14px', color:'#7B83A0', lineHeight:1.7 }}>{c.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust */}
      <section style={{ padding:'clamp(60px,8vw,110px) clamp(20px,5vw,64px)', background:'#f5f7ff' }}>
        <div style={{ maxWidth:'1100px', margin:'0 auto' }} ref={trustRef}>
          <motion.div initial={{ opacity:0, y:20 }} animate={trustInView?{opacity:1,y:0}:{}}
            transition={{ duration:0.6, ease:[0.22,1,0.36,1] }}
            style={{ textAlign:'center', marginBottom:'52px' }}>
            <SectionLabel text="How it works" />
            <h2 style={{
              fontFamily:'var(--font)', fontWeight:700,
              fontSize:'clamp(28px,3.5vw,44px)', color:'#1E1E1E',
              letterSpacing:'-0.025em', lineHeight:1.1,
            }}>
              One platform. Every provider. Zero procurement drama.
            </h2>
          </motion.div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))', gap:'20px' }}>
            {trust.map((t, i) => (
              <motion.div key={t.label}
                initial={{ opacity:0, y:24 }} animate={trustInView?{opacity:1,y:0}:{}}
                transition={{ duration:0.58, delay:i*0.1, ease:[0.22,1,0.36,1] }}
                style={{
                  background:'#fff', borderRadius:'14px', padding:'28px 24px',
                  border:'1px solid rgba(149,157,188,0.14)',
                }}>
                <div style={{
                  fontFamily:'var(--font)', fontWeight:700, fontSize:'13px',
                  color:'#2F5AF0', letterSpacing:'0.02em',
                  marginBottom:'10px',
                  display:'flex', alignItems:'center', gap:'8px',
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2F5AF0" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  {t.label}
                </div>
                <p style={{ fontFamily:'var(--font)', fontSize:'14px', color:'#7B83A0', lineHeight:1.7 }}>{t.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background:'#122159', padding:'clamp(60px,8vw,100px) clamp(20px,5vw,64px)' }}>
        <div style={{ maxWidth:'680px', margin:'0 auto', textAlign:'center' }}>
          <h2 style={{
            fontFamily:'var(--font)', fontWeight:800,
            fontSize:'clamp(32px,5vw,56px)', color:'#fff',
            letterSpacing:'-0.03em', lineHeight:1.1, marginBottom:'20px',
          }}>
            The data you need is already here.
          </h2>
          <p style={{ fontFamily:'var(--font)', fontSize:'17px', color:'rgba(149,157,188,0.8)', lineHeight:1.7, marginBottom:'36px' }}>
            Browse thousands of datasets across every category. Preview before you commit.
            Access instantly when you're ready.
          </p>
          <motion.button whileHover={{ scale:1.05, background:'#1C40C1' }} whileTap={{ scale:0.97 }}
            style={{
              fontFamily:'var(--font)', fontWeight:600, fontSize:'16px', color:'#fff',
              background:'#2F5AF0', border:'none', borderRadius:'12px', padding:'16px 40px',
              cursor:'pointer', boxShadow:'0 4px 28px rgba(47,90,240,0.45)',
              transition:'background 0.2s',
            }}>
            Explore the Marketplace
          </motion.button>
        </div>
      </section>
    </>
  )
}
