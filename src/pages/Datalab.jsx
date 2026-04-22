import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import DataNetwork from '../components/DataNetwork'

function SectionLabel({ text, dark }) {
  return (
    <div style={{
      fontFamily:'var(--font)', fontWeight:600, fontSize:'12px',
      letterSpacing:'0.1em', textTransform:'uppercase',
      color: dark ? '#6B8FF5' : '#2F5AF0', marginBottom:'16px',
    }}>{text}</div>
  )
}

const features = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" />
      </svg>
    ),
    title: 'Spatial APIs out of the box',
    desc: 'REST and GraphQL endpoints for every dataset. Query by bounding box, polygon, radius, or attribute, returns GeoJSON in milliseconds.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M14.25 9.75L16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
      </svg>
    ),
    title: 'SDKs in your language',
    desc: 'Native libraries for Python, JavaScript, and Go. Import, query, transform, and stream spatial data without touching raw HTTP.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
    title: 'Streaming and webhooks',
    desc: 'Push updates the moment data changes. Subscribe to spatial regions and receive events when features enter, exit, or update.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    title: 'Sandbox access, no commitment',
    desc: 'A full-featured test environment with real datasets. Build and test against production-equivalent data before you spend a dollar.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
      </svg>
    ),
    title: 'Batch and pipeline support',
    desc: 'Run large-scale spatial joins, enrichments, and transformations as async jobs. Results land in your storage, S3, GCS, or Azure Blob.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
      </svg>
    ),
    title: 'Docs that don\'t waste your time',
    desc: 'Every endpoint documented with real examples, response shapes, and error codes. Spatial concepts explained for engineers, not cartographers.',
  },
]

const codeSample = `import biggeo

client = biggeo.Client(api_key="...")

# Query all parcels within 2km of a point
results = client.query(
  dataset="us-parcels-2024",
  filter={
    "type": "radius",
    "center": [-122.4194, 37.7749],
    "radius_km": 2
  },
  fields=["parcel_id", "owner", "area_sqft", "zoning"]
)

for parcel in results:
  print(parcel.parcel_id, parcel.zoning)`

const cardVars = {
  hidden: { opacity:0, y:32 },
  visible: (i) => ({ opacity:1, y:0, transition:{ duration:0.6, delay:i*0.1, ease:[0.22,1,0.36,1] } }),
}

export default function Datalab() {
  const featRef = useRef(null)
  const featInView = useInView(featRef, { once:true, margin:'-80px' })
  const codeRef = useRef(null)
  const codeInView = useInView(codeRef, { once:true, margin:'-80px' })

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
          background:'radial-gradient(ellipse 65% 55% at 50% 10%, rgba(28,64,193,0.32) 0%, transparent 70%)',
        }} />
        <DataNetwork />

        <div style={{ maxWidth:'860px', textAlign:'center', position:'relative', zIndex:1 }}>
          <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}
            transition={{ duration:0.5, delay:0.05, ease:[0.22,1,0.36,1] }}
            style={{
              display:'inline-block', fontFamily:'var(--font)', fontWeight:600,
              fontSize:'12px', letterSpacing:'0.12em', textTransform:'uppercase',
              color:'#6B8FF5', marginBottom:'20px',
              padding:'6px 14px', borderRadius:'100px',
              border:'1px solid rgba(107,143,245,0.3)', background:'rgba(47,90,240,0.1)',
            }}>
            Datalab
          </motion.div>

          <motion.h1 initial={{ opacity:0, y:28 }} animate={{ opacity:1, y:0 }}
            transition={{ duration:0.7, delay:0.15, ease:[0.22,1,0.36,1] }}
            style={{
              fontFamily:'var(--font)', fontWeight:800,
              fontSize:'clamp(42px,7vw,80px)',
              color:'#fff', lineHeight:1.05, letterSpacing:'-0.03em', marginBottom:'24px',
            }}>
            Build spatial apps{' '}
            <span style={{
              background:'linear-gradient(135deg,#6B8FF5 0%,#A3BFFC 100%)',
              WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text',
            }}>in minutes, not months.</span>
          </motion.h1>

          <motion.p initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
            transition={{ duration:0.65, delay:0.3, ease:[0.22,1,0.36,1] }}
            style={{
              fontFamily:'var(--font)', fontWeight:400,
              fontSize:'clamp(16px,2.2vw,20px)',
              color:'rgba(180,198,255,0.8)', lineHeight:1.7,
              maxWidth:'580px', margin:'0 auto 44px',
            }}>
            APIs, SDKs, and streaming endpoints built for engineers who need spatial data
            without the spatial infrastructure headache.
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
              Start Building Free
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
              Read the Docs
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Code preview */}
      <section style={{ background:'#0C1640', padding:'clamp(60px,8vw,100px) clamp(20px,5vw,64px)' }}>
        <div style={{ maxWidth:'1100px', margin:'0 auto' }} ref={codeRef}>
          <div style={{ display:'flex', gap:'64px', alignItems:'center', flexWrap:'wrap' }}>
            <motion.div initial={{ opacity:0, x:-24 }} animate={codeInView?{opacity:1,x:0}:{}}
              transition={{ duration:0.7, ease:[0.22,1,0.36,1] }}
              style={{ flex:'1', minWidth:'260px' }}>
              <SectionLabel text="Developer-first" dark />
              <h2 style={{
                fontFamily:'var(--font)', fontWeight:700,
                fontSize:'clamp(28px,3.5vw,44px)', color:'#fff',
                letterSpacing:'-0.025em', lineHeight:1.1, marginBottom:'18px',
              }}>
                A spatial query in five lines of Python.
              </h2>
              <p style={{ fontFamily:'var(--font)', fontSize:'16px', color:'rgba(149,157,188,0.8)', lineHeight:1.7 }}>
                Datalab is designed to get you from API key to production-ready data
                in one afternoon, not one sprint.
              </p>
            </motion.div>

            <motion.div initial={{ opacity:0, x:24 }} animate={codeInView?{opacity:1,x:0}:{}}
              transition={{ duration:0.7, delay:0.1, ease:[0.22,1,0.36,1] }}
              style={{ flex:'1.4', minWidth:'320px' }}>
              <div style={{
                background:'#0A1130', borderRadius:'16px',
                border:'1px solid rgba(47,90,240,0.25)',
                overflow:'hidden',
                boxShadow:'0 8px 48px rgba(0,0,0,0.4)',
              }}>
                {/* Window chrome */}
                <div style={{
                  padding:'14px 20px', borderBottom:'1px solid rgba(47,90,240,0.15)',
                  display:'flex', alignItems:'center', gap:'8px',
                  background:'rgba(47,90,240,0.06)',
                }}>
                  {['#ff5f56','#ffbd2e','#27c93f'].map(c => (
                    <div key={c} style={{ width:'12px', height:'12px', borderRadius:'50%', background:c }} />
                  ))}
                  <span style={{ marginLeft:'8px', fontFamily:'var(--font)', fontSize:'12px', color:'rgba(149,157,188,0.5)' }}>
                    query.py
                  </span>
                </div>
                <pre style={{
                  margin:0, padding:'28px 24px', overflowX:'auto',
                  fontFamily:"'Fira Code', 'Cascadia Code', 'Consolas', monospace",
                  fontSize:'13.5px', lineHeight:'1.8',
                  color:'rgba(200,213,255,0.9)',
                }}>
                  {codeSample.split('\n').map((line, i) => (
                    <div key={i}>{
                      line
                        .replace(/(import|from|for|in|print)/g, '<KW>$1</KW>')
                        .split(/(<KW>.*?<\/KW>)/)
                        .map((part, j) =>
                          part.startsWith('<KW>') ? (
                            <span key={j} style={{ color:'#6B8FF5' }}>
                              {part.replace(/<\/?KW>/g,'')}
                            </span>
                          ) : (
                            <span key={j}>{part}</span>
                          )
                        )
                    }</div>
                  ))}
                </pre>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features grid */}
      <section style={{ padding:'clamp(80px,10vw,130px) clamp(20px,5vw,64px)', background:'#fff' }}>
        <div style={{ maxWidth:'1100px', margin:'0 auto' }} ref={featRef}>
          <motion.div initial={{ opacity:0, y:20 }} animate={featInView?{opacity:1,y:0}:{}}
            transition={{ duration:0.6, ease:[0.22,1,0.36,1] }}
            style={{ textAlign:'center', marginBottom:'56px' }}>
            <SectionLabel text="Everything you need" />
            <h2 style={{
              fontFamily:'var(--font)', fontWeight:700,
              fontSize:'clamp(30px,4vw,48px)', color:'#1E1E1E',
              letterSpacing:'-0.025em', lineHeight:1.1,
            }}>
              Spatial infrastructure. None of the overhead.
            </h2>
          </motion.div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))', gap:'18px' }}>
            {features.map((f, i) => (
              <motion.div key={f.title} custom={i} variants={cardVars}
                initial="hidden" animate={featInView?'visible':'hidden'}
                whileHover={{ y:-4, transition:{ duration:0.2 } }}
                style={{
                  background:'#fff', border:'1px solid rgba(47,90,240,0.12)',
                  borderRadius:'15px', padding:'28px 26px',
                  boxShadow:'0 2px 14px rgba(47,90,240,0.05)',
                }}>
                <div style={{
                  display:'inline-flex', alignItems:'center', justifyContent:'center',
                  width:'46px', height:'46px', borderRadius:'12px',
                  background:'rgba(47,90,240,0.08)', color:'#2F5AF0', marginBottom:'18px',
                }}>
                  {f.icon}
                </div>
                <h3 style={{ fontFamily:'var(--font)', fontWeight:700, fontSize:'17px', color:'#1E1E1E', letterSpacing:'-0.02em', marginBottom:'9px' }}>{f.title}</h3>
                <p style={{ fontFamily:'var(--font)', fontSize:'14px', color:'#6B7490', lineHeight:1.7 }}>{f.desc}</p>
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
            Your API key is one click away.
          </h2>
          <p style={{ fontFamily:'var(--font)', fontSize:'17px', color:'rgba(149,157,188,0.8)', lineHeight:1.7, marginBottom:'36px' }}>
            Sandbox access. No credit card. No sales call. Just start building.
          </p>
          <div style={{ display:'flex', gap:'14px', justifyContent:'center', flexWrap:'wrap' }}>
            <motion.button whileHover={{ scale:1.05, background:'#1C40C1' }} whileTap={{ scale:0.97 }}
              style={{
                fontFamily:'var(--font)', fontWeight:600, fontSize:'16px', color:'#fff',
                background:'#2F5AF0', border:'none', borderRadius:'12px', padding:'16px 40px',
                cursor:'pointer', boxShadow:'0 4px 28px rgba(47,90,240,0.45)',
                transition:'background 0.2s',
              }}>
              Get Your API Key
            </motion.button>
            <motion.button
              whileHover={{ scale:1.03, borderColor:'rgba(107,143,245,0.6)', color:'#fff' }}
              whileTap={{ scale:0.97 }}
              style={{
                fontFamily:'var(--font)', fontWeight:600, fontSize:'16px',
                color:'rgba(180,198,255,0.8)', background:'rgba(255,255,255,0.06)',
                border:'1px solid rgba(107,143,245,0.28)', borderRadius:'12px',
                padding:'16px 40px', cursor:'pointer', backdropFilter:'blur(8px)',
                transition:'border-color 0.2s, color 0.2s',
              }}>
              View Docs
            </motion.button>
          </div>
        </div>
      </section>
    </>
  )
}
