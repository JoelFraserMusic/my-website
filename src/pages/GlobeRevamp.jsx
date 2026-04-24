import { useState, useEffect } from 'react'
import { motion, AnimatePresence, useScroll, useTransform, useInView, useMotionValue, animate } from 'framer-motion'
import GeodesicGlobe from '../components/GeodesicGlobe'
import datalabLogo from '../assets/datalab-logo.png'
import marketplaceLogo from '../assets/marketplace-logo.png'
import datascapeLogo from '../assets/datascape-logo.png'

// ─── Color tokens ─────────────────────────────────────────────────────────────
const C = {
  bg:     '#F5F5F5',
  white:  '#ffffff',
  border: '#E8E8E8',
  text:   '#1E1E1E',
  muted:  '#5A6175',
  blue:   '#2F5AF0',
  warm:   '#2F5AF0',
  navy:   '#0c1535',
  dark:   '#0d0d0f',
}

// ─── Floating label ───────────────────────────────────────────────────────────
function FloatLabel({ text, style, delay=0 }) {
  return (
    <motion.div
      initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
      transition={{ duration:0.7, delay, ease:[0.22,1,0.36,1] }}
      style={{
        position:'absolute', display:'flex', alignItems:'center', gap:8,
        padding:'8px 16px', borderRadius:100,
        background:'rgba(255,255,255,0.88)', backdropFilter:'blur(14px)',
        border:'1px solid rgba(47,90,240,0.14)',
        boxShadow:'0 4px 24px rgba(47,90,240,0.1), 0 1px 0 rgba(255,255,255,0.9) inset',
        fontFamily:'var(--font)', fontSize:12, fontWeight:600,
        color:C.blue, letterSpacing:'0.01em', whiteSpace:'nowrap',
        pointerEvents:'none', ...style,
      }}>
      <span style={{ width:6, height:6, borderRadius:'50%', background:C.blue, boxShadow:'0 0 8px rgba(47,90,240,0.7)', animation:'globePulse 2s ease-in-out infinite' }} />
      <span style={{ color:C.text, fontWeight:500 }}>{text}</span>
    </motion.div>
  )
}

// ─── Live data panel ──────────────────────────────────────────────────────────
const CELLS  = ['TRI·0A4F2C','TRI·1B8E91','TRI·3C2D57','TRI·7F1A30','TRI·2E9B44']
const COORDS = ['40.712°N  74.006°W','51.507°N  0.128°W','1.352°N  103.820°E','35.690°N  139.692°E','-23.550°S  46.633°W']

function DataPanel({ scrollProgress }) {
  const idx     = useTransform(scrollProgress, [0,0.2,0.4,0.6,0.8], [0,1,2,3,4])
  const cellMV  = useTransform(idx, v => CELLS[Math.round(v)%CELLS.length])
  const coordMV = useTransform(idx, v => COORDS[Math.round(v)%COORDS.length])
  return (
    <div style={{
      background:'rgba(255,255,255,0.92)', backdropFilter:'blur(20px)',
      border:'1px solid rgba(47,90,240,0.14)', borderRadius:14, padding:'18px 22px',
      fontFamily:'var(--font)', minWidth:210,
      boxShadow:'0 8px 48px rgba(47,90,240,0.12)',
    }}>
      <div style={{ fontSize:9, letterSpacing:'0.14em', color:'rgba(47,90,240,0.6)', textTransform:'uppercase', marginBottom:10, fontWeight:700 }}>Active Cell</div>
      <motion.div style={{ fontSize:14, fontWeight:700, color:C.blue, marginBottom:5, letterSpacing:'0.02em', fontFamily:'monospace' }}>{cellMV}</motion.div>
      <motion.div style={{ fontSize:11, color:'#6B7490', marginBottom:12, fontFamily:'monospace' }}>{coordMV}</motion.div>
      <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:11, color:C.warm, fontWeight:600 }}>
        <span style={{ width:6,height:6,borderRadius:'50%',background:C.warm,boxShadow:'0 0 8px rgba(47,90,240,0.5)',animation:'globePulse 1.4s ease-in-out infinite' }} />
        Querying...
      </div>
    </div>
  )
}

// ─── Scroll slide ─────────────────────────────────────────────────────────────
function Slide({ eyebrow, logo, title, accent, body, style }) {
  return (
    <motion.div style={{ position:'absolute', top:'50%', left:0, right:0, ...style }} transition={{ duration:0.3 }}>
      <div style={{ transform:'translateY(-50%)' }}>
        <div style={{
          display:'inline-flex', alignItems:'center',
          marginBottom:18, padding:'7px 14px', borderRadius:100,
          border:'1px solid rgba(47,90,240,0.2)', background:'rgba(47,90,240,0.06)',
        }}>
          {logo
            ? <img src={logo} alt={eyebrow} style={{ height:18, width:'auto', display:'block' }} />
            : <span style={{ fontFamily:'var(--font)', fontWeight:700, fontSize:11, letterSpacing:'0.12em', textTransform:'uppercase', color:C.blue }}>{eyebrow}</span>
          }
        </div>
        <h2 style={{
          fontFamily:'var(--font)', fontWeight:800, fontSize:'clamp(34px,4.2vw,60px)',
          color:'#1E1E1E', letterSpacing:'-0.035em', lineHeight:1.06, marginBottom:18,
        }}>
          {title}{' '}
          <span style={{ color:'#2F5AF0' }}>{accent}</span>
        </h2>
        <p style={{ fontFamily:'var(--font)', fontSize:'clamp(15px,1.6vw,18px)', color:'#4A5168', lineHeight:1.78 }}>{body}</p>
      </div>
    </motion.div>
  )
}

// ─── Section label ────────────────────────────────────────────────────────────
function SectionLabel({ children }) {
  return (
    <span style={{ display:'block', fontFamily:'var(--font)', fontSize:11, fontWeight:600, letterSpacing:'1.4px', textTransform:'uppercase', color:C.blue, marginBottom:12 }}>
      {children}
    </span>
  )
}

// ─── Divider ──────────────────────────────────────────────────────────────────
function Divider() {
  return <div style={{ height:1, background:C.border }} />
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function GlobeRevamp() {
  const [openFaq, setOpenFaq] = useState(null)
  const [vh, setVh] = useState(typeof window !== 'undefined' ? window.innerHeight : 900)

  useEffect(() => {
    const onResize = () => setVh(window.innerHeight)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const { scrollY } = useScroll()

  // 0 to 1 as user scrolls from page top through 200vh of the 300vh spacer
  const scrollProgress = useTransform(scrollY, [0, vh * 2], [0, 1], { clamp: true })
  // Globe fades out as the content sections scroll into view
  const globeOp = useTransform(scrollY, [vh * 2.4, vh * 3], [1, 0])

  const scrollZoom      = useTransform(scrollProgress, [0, 0.5, 1],   [1, 1.18, 1.26])
  const globeX          = useTransform(scrollProgress, [0, 0.2, 1],   ['0%', '10%', '18%'])
  const scrollHighlight = useTransform(scrollProgress, [0, 0.3, 0.9], [0.2, 0.85, 1])
  const heroOp  = useTransform(scrollProgress, [0, 0.13], [1, 0])
  const heroY   = useTransform(scrollProgress, [0, 0.13], [0, -24])
  const floatOp = useTransform(scrollProgress, [0, 0.10], [1, 0])
  const s1Op = useTransform(scrollProgress, [0.10, 0.20, 0.32, 0.42], [0, 1, 1, 0])
  const s1Y  = useTransform(scrollProgress, [0.10, 0.20], [26, 0])
  const s2Op = useTransform(scrollProgress, [0.38, 0.48, 0.60, 0.70], [0, 1, 1, 0])
  const s2Y  = useTransform(scrollProgress, [0.38, 0.48], [26, 0])
  const s3Op = useTransform(scrollProgress, [0.65, 0.74, 0.92, 1],    [0, 1, 1, 0])
  const s3Y  = useTransform(scrollProgress, [0.65, 0.74], [26, 0])
  const d1 = useTransform(scrollProgress, [0.10, 0.32, 0.42],       [1, 1, 0.25])
  const d2 = useTransform(scrollProgress, [0.38, 0.50, 0.62, 0.70], [0.25, 1, 1, 0.25])
  const d3 = useTransform(scrollProgress, [0.65, 0.74, 1],          [0.25, 1, 1])
  const panelOp = useTransform(scrollProgress, [0.10, 0.22], [0, 1])

  const BG = '#ffffff'

  const TICKER_ITEMS = [
    'The Spatial Cloud','Sub-second queries','190+ countries',
    'BigGeo AI -now in beta','Datalab','Marketplace','Datascape',
    'Canadian-owned','GDPR compliant','API-first architecture',
  ]

  const PRODUCTS = [
    { tag:'Datalab',     logo:datalabLogo,     title:'Take control of your data',        body:'A workspace to prepare, manage, and optimize geospatial data for analysis, visualization, and delivery. Built for speed, precision, and scalability.',        link:'Explore Datalab' },
    { tag:'Marketplace', logo:marketplaceLogo, title:'Your geospatial data hub',          body:'Browse, discover, and source datasets from trusted providers. Power your projects with data designed to integrate into any application or workflow.',         link:'Browse datasets' },
    { tag:'Datascape',   logo:datascapeLogo,   title:'See your data like never before',   body:'Transform complex geospatial datasets into interactive, easy-to-understand maps. Analyze, partition, and export with unmatched speed.',                        link:'Explore Datascape' },
  ]

  const HOW_STEPS = [
    { num:'01', title:'Upload or connect your data',      body:'Bring your own datasets or source from the Marketplace. BigGeo indexes everything automatically. No manual prep required.',
      icon: <path strokeLinecap="round" strokeLinejoin="round" d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" /> },
    { num:'02', title:'Query in plain language or API',   body:'Run spatial queries through the platform, via API, or through BigGeo AI in Claude or ChatGPT. Every query uses credits.',
      icon: <><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></> },
    { num:'03', title:'Get results in under a second',    body:"BigGeo's DGGS-indexed infrastructure returns sub-second results whether your dataset has a thousand rows or a billion.",
      icon: <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /> },
    { num:'04', title:'Visualize, export, or automate',   body:'See results in Datascape, export for your own tools, or feed outputs directly into your workflows and production APIs.',
      icon: <><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></> },
  ]

  const IC = { fill:'none', stroke:'#AAAAAA', strokeWidth:'1.5', strokeLinecap:'round', strokeLinejoin:'round' }
  // Exactly 12 categories matching the product section, 6 per row
  const INDUSTRIES = [
    { name:'Geospatial Data',
      icon:<svg viewBox="0 0 24 24" width="24" height="24" {...IC}><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg> },
    { name:'AI & Machine Learning Data',
      icon:<svg viewBox="0 0 24 24" width="24" height="24" {...IC}><rect x="9" y="9" width="6" height="6" rx="1"/><path d="M9 9V5h6v4M9 15v4h6v-4M4 9h5v6H4M15 9h5v6h-5"/></svg> },
    { name:'Real Estate Data',
      icon:<svg viewBox="0 0 24 24" width="24" height="24" {...IC}><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> },
    { name:'Commerce Data',
      icon:<svg viewBox="0 0 24 24" width="24" height="24" {...IC}><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg> },
    { name:'B2B Data',
      icon:<svg viewBox="0 0 24 24" width="24" height="24" {...IC}><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/></svg> },
    { name:'Risk Data',
      icon:<svg viewBox="0 0 24 24" width="24" height="24" {...IC}><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> },
    { name:'Infrastructure Data',
      icon:<svg viewBox="0 0 24 24" width="24" height="24" {...IC}><path d="M3 22V9l7-7v20M13 22V15h8v7M13 10l5-4h3v12"/><line x1="2" y1="22" x2="22" y2="22"/></svg> },
    { name:'Environmental Data',
      icon:<svg viewBox="0 0 24 24" width="24" height="24" {...IC}><path d="M3 20l5-9 4 5 3-4 5 8H3z"/><circle cx="18" cy="7" r="2"/></svg> },
    { name:'Weather & Climate Data',
      icon:<svg viewBox="0 0 24 24" width="24" height="24" {...IC}><path d="M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z"/></svg> },
    { name:'Consumer Data',
      icon:<svg viewBox="0 0 24 24" width="24" height="24" {...IC}><path d="M6 2h12l2 6H4L6 2z"/><path d="M4 8v13h16V8"/><line x1="9" y1="21" x2="9" y2="12"/><line x1="15" y1="21" x2="15" y2="12"/></svg> },
    { name:'Population Data',
      icon:<svg viewBox="0 0 24 24" width="24" height="24" {...IC}><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg> },
    { name:'Marketing Data',
      icon:<svg viewBox="0 0 24 24" width="24" height="24" {...IC}><path d="M3 8h2l10-5v14L5 12H3a1 1 0 01-1-1V9a1 1 0 011-1z"/><path d="M5 12v5a1 1 0 002 0v-5"/></svg> },
  ]

  const TESTIMONIALS = [
    { quote:"It wasn't hard to realize that BigGeo technology represents a cutting edge opportunity to redefine how our vast spatial content is managed.", name:'Jennifer Howell', title:'Product Management Director, S&P Global', initials:'JH' },
    { quote:"BigGeo's performance and capabilities, coupled with Snowflake's platform, make us the most powerful geospatial platform in existence.",       name:'Grace Johnson',   title:'Principal, Data Cloud Products, Snowflake', initials:'GJ' },
    { quote:"I'm very excited to see what BigGeo is doing in this space, as it provides a lightning fast and readily usable alternative to existing products.", name:'Dr. Michael Goodchild', title:'GIS World Leader', initials:'MG' },
    { quote:"BigGeo is channeling years of complex geospatial data into valuable intelligence, helping organizations tackle everything from emergency response to energy management.", name:'Sridhar Ramaswamy', title:'CEO, Snowflake', initials:'SR' },
  ]

  const FAQS = [
    { q:'What is BigGeo?',                                               a:'BigGeo is The Spatial Cloud, the infrastructure layer that lets any team store, query, and act on spatial data at any scale. Instead of juggling separate GIS tools, storage bills, and integration timelines, everything runs through a single credit-based platform delivered in sub-second response times.' },
    { q:'How is BigGeo different from traditional geospatial platforms?', a:'Traditional platforms struggle with slow processing, limited scalability, and static maps. BigGeo offers real-time data processing, dynamic visualizations, and unmatched scalability, with sub-second query speeds on datasets of any size. No specialist required to use it.' },
    { q:'What is BigGeo AI?',                                            a:"BigGeo AI is our MCP (Model Context Protocol) connector that brings The Spatial Cloud directly into Claude and ChatGPT. Instead of switching tools, you ask your AI assistant a question about any location and get a verified, governed answer in seconds. It's currently in beta." },
    { q:'How does the credit system work?',                              a:"Credits are BigGeo's universal unit of platform usage. Every action (storing data, running a query, accessing an API) is measured in credits. Most standard queries cost about 1 credit. Your monthly plan includes thousands of credits, and every dataset has a built-in spend boundary so you're never surprised by your bill." },
    { q:'What industries does BigGeo serve?',                            a:'Any business that needs to understand the where of their data can use BigGeo. This includes energy, healthcare, insurance, commerce, construction, public sector, tourism, weather and climate, and more. If location matters to your decisions, BigGeo is built for you.' },
    { q:'How do I get started?',                                         a:'You can sign up for free at biggeo.com, explore the Marketplace for ready-to-query datasets, or book a demo with our team. Pricing starts at $500/month for 5,000 credits, enough for a small team to run thousands of queries each month.' },
  ]

  const font = 'var(--font)'

  return (
    <>
      {/* Spacer: 300vh creates scroll room; pointer-events:none so fixed globe gets clicks */}
      <div style={{ height:'300vh', pointerEvents:'none' }} />

      {/* Globe: position:fixed tracks window scrollY directly, avoids sticky+overflow-x bug */}
      <motion.div style={{ position:'fixed', top:0, left:0, width:'100%', height:'100vh', zIndex:5, opacity:globeOp, overflow:'hidden', background:BG }}>
          <div style={{
            position:'absolute', inset:0, pointerEvents:'none', zIndex:0,
            backgroundImage:[
              'repeating-linear-gradient(0deg,transparent,transparent 79px,rgba(0,0,0,0.04) 79px,rgba(0,0,0,0.04) 80px)',
              'repeating-linear-gradient(90deg,transparent,transparent 79px,rgba(0,0,0,0.04) 79px,rgba(0,0,0,0.04) 80px)',
            ].join(','),
          }} />

          <motion.div style={{ position:'absolute', inset:0, x:globeX, zIndex:1 }}>
            <GeodesicGlobe zoomMV={scrollZoom} highlightMV={scrollHighlight} />
          </motion.div>

          <motion.div style={{ position:'absolute', inset:0, opacity:floatOp, pointerEvents:'none', zIndex:4 }}>
            <FloatLabel text="43M triangular cells"  delay={0.9}  style={{ top:'52%', left:'6%'  }} />
            <FloatLabel text="<12ms query latency"   delay={1.05} style={{ top:'38%', right:'6%' }} />
            <FloatLabel text="7 resolution levels"   delay={1.2}  style={{ bottom:'30%', left:'6%' }} />
            <FloatLabel text="Sub-meter precision"   delay={1.35} style={{ bottom:'22%', right:'6%' }} />
          </motion.div>

          <motion.div style={{ position:'absolute', top:0, left:0, right:0, zIndex:5, textAlign:'center', opacity:heroOp, y:heroY, padding:'clamp(120px,14vh,148px) 24px 0', pointerEvents:'none' }}>
            <div style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'6px 14px 6px 10px', borderRadius:100, border:'1px solid rgba(47,90,240,0.22)', background:'rgba(47,90,240,0.06)', color:C.blue, fontSize:12, fontWeight:700, marginBottom:28, letterSpacing:'0.09em', textTransform:'uppercase', fontFamily:font }}>
              <span style={{ width:7, height:7, borderRadius:'50%', background:C.blue, boxShadow:'0 0 10px rgba(47,90,240,0.8)', animation:'globePulse 2.2s ease-in-out infinite' }} />
              The Spatial Cloud
            </div>
            <motion.h1 initial={{ opacity:0, y:32 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.78, delay:0.2, ease:[0.22,1,0.36,1] }}
              style={{ fontFamily:font, fontWeight:800, fontSize:'clamp(46px,7vw,88px)', lineHeight:1.0, letterSpacing:'-0.038em', color:'#1E1E1E', marginBottom:22 }}>
              Manage the world's<br />
              <span style={{ color:'#2F5AF0' }}>spatial data.</span>
            </motion.h1>
            <motion.p initial={{ opacity:0, y:22 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.7, delay:0.36, ease:[0.22,1,0.36,1] }}
              style={{ fontFamily:font, fontSize:'clamp(16px,2vw,19px)', color:'#4A5168', lineHeight:1.72, maxWidth:520, margin:'0 auto 38px' }}>
              Any size, any slice, any insight. Delivered in seconds. The infrastructure layer that makes location data as easy to query as a spreadsheet.
            </motion.p>
            <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.65, delay:0.5, ease:[0.22,1,0.36,1] }}
              style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap', pointerEvents:'all' }}>
              <motion.button whileHover={{ scale:1.05, boxShadow:'0 8px 40px rgba(47,90,240,0.5)' }} whileTap={{ scale:0.97 }}
                style={{ fontFamily:font, fontWeight:700, fontSize:15, color:'#fff', background:C.blue, border:'none', borderRadius:12, padding:'15px 34px', cursor:'pointer', boxShadow:'0 4px 24px rgba(47,90,240,0.4)' }}>
                Get Started Free
              </motion.button>
              <motion.button whileHover={{ scale:1.03, background:'rgba(47,90,240,0.06)' }} whileTap={{ scale:0.97 }}
                style={{ fontFamily:font, fontWeight:700, fontSize:15, color:C.blue, background:'transparent', border:'1.5px solid rgba(47,90,240,0.22)', borderRadius:12, padding:'15px 34px', cursor:'pointer' }}>
                Book a Demo
              </motion.button>
            </motion.div>
          </motion.div>

          <div style={{ position:'absolute', left:0, top:0, bottom:0, width:'50%', display:'flex', alignItems:'center', paddingLeft:'clamp(36px,5vw,80px)', paddingRight:'clamp(24px,3vw,40px)', zIndex:5, pointerEvents:'none' }}>
            <div style={{ display:'flex', alignItems:'flex-start', gap:20, width:'100%' }}>
              <div style={{ display:'flex', flexDirection:'column', gap:14, paddingTop:6, flexShrink:0 }}>
                {[d1,d2,d3].map((d,i) => (
                  <motion.div key={i} style={{ opacity:d }}>
                    <div style={{ width:8, height:8, borderRadius:'50%', background:C.blue, boxShadow:'0 0 10px rgba(47,90,240,0.6)' }} />
                  </motion.div>
                ))}
              </div>
              <div style={{ position:'relative', flex:1, minHeight:300 }}>
                <Slide eyebrow="Datalab" logo={datalabLogo} title="Prepare, manage," accent="own your data."
                  body="A workspace to clean, enrich, and structure any spatial dataset. From raw ingestion to production-ready, without the complexity or the bottlenecks."
                  style={{ opacity:s1Op, y:s1Y }} />
                <Slide eyebrow="Marketplace" logo={marketplaceLogo} title="Source the data" accent="you need."
                  body="Browse hundreds of ready-to-query spatial datasets from trusted providers. License, integrate, and ship in minutes, not months."
                  style={{ opacity:s2Op, y:s2Y }} />
                <Slide eyebrow="Datascape" logo={datascapeLogo} title="See your data" accent="come alive."
                  body="Transform complex spatial datasets into interactive maps and visual insights. Partition, analyze, and share with anyone, at any scale."
                  style={{ opacity:s3Op, y:s3Y }} />
              </div>
            </div>
          </div>

          <motion.div style={{ opacity:panelOp, position:'absolute', bottom:'10%', right:'5%', zIndex:5 }}>
            <DataPanel scrollProgress={scrollProgress} />
          </motion.div>

          <motion.div style={{ opacity:heroOp, position:'absolute', bottom:28, left:0, right:0, zIndex:2, display:'flex', justifyContent:'center' }}>
            <motion.div animate={{ y:[0,6,0] }} transition={{ duration:2, repeat:Infinity, ease:'easeInOut' }}
              style={{ color:'rgba(47,90,240,0.4)', display:'flex', flexDirection:'column', alignItems:'center', gap:6, fontSize:10, letterSpacing:'0.12em', textTransform:'uppercase', fontFamily:font }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
              Scroll to explore
            </motion.div>
          </motion.div>
      </motion.div>

      {/* Content sections sit above the fixed globe (zIndex 10 > 5) with solid backgrounds */}
      <div style={{ position:'relative', zIndex:10 }}>

      {/* Ticker */}
      <div style={{ padding:'16px 0', background:'rgba(47,90,240,0.05)', borderTop:'1px solid rgba(47,90,240,0.12)', borderBottom:'1px solid rgba(47,90,240,0.12)', overflow:'hidden', whiteSpace:'nowrap' }}>
        <div style={{ display:'inline-flex', animation:'ticker 32s linear infinite' }}>
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <span key={i} style={{ display:'inline-flex', alignItems:'center', gap:10, padding:'0 28px', fontSize:12, fontWeight:600, textTransform:'uppercase', letterSpacing:'0.08em', color:'rgba(0,0,0,0.45)', fontFamily:font }}>
              <span style={{ color:C.warm, fontSize:14 }}>◆</span>
              {item}
            </span>
          ))}
        </div>
      </div>

      <Divider />

      {/* ── Products ──────────────────────────────────────────────────────────── */}
      <section style={{ padding:'96px clamp(20px,5vw,64px)', background:C.white }}>
        <div style={{ maxWidth:1040, margin:'0 auto' }}>
          <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true, margin:'-60px' }} transition={{ duration:0.6, ease:[0.22,1,0.36,1] }} style={{ marginBottom:52 }}>
            <SectionLabel>The BigGeo Ecosystem</SectionLabel>
            <h2 style={{ fontFamily:font, fontWeight:800, fontSize:'clamp(28px,3.8vw,42px)', color:C.text, letterSpacing:'-0.6px', lineHeight:1.12, marginBottom:14 }}>
              Three products.<br /><span style={{ color:C.blue }}>One connected platform.</span>
            </h2>
            <p style={{ fontFamily:font, fontSize:16, color:C.muted, maxWidth:500, lineHeight:1.7 }}>
              Manage, explore, and visualize your spatial data -from raw ingestion to production-ready insights.
            </p>
          </motion.div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:16 }}>
            {PRODUCTS.map((p, i) => (
              <motion.div key={p.tag}
                initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true, margin:'-40px' }}
                transition={{ duration:0.55, delay:i*0.1, ease:[0.22,1,0.36,1] }}
                whileHover={{ y:-3 }}
                style={{ background:C.bg, border:`1px solid ${C.border}`, borderRadius:14, padding:'32px 28px', display:'flex', flexDirection:'column', position:'relative', overflow:'hidden', transition:'border-color 0.18s' }}>
                <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:'linear-gradient(90deg,#2F5AF0,rgba(47,90,240,0))', opacity:0 }} className="product-top-line" />
                <img src={p.logo} alt={p.tag} style={{ height:22, width:'auto', display:'block', marginBottom:16, alignSelf:'flex-start' }} />
                <h3 style={{ fontFamily:font, fontWeight:700, fontSize:22, color:C.text, marginBottom:12 }}>{p.title}</h3>
                <p style={{ fontFamily:font, fontSize:14, color:C.muted, lineHeight:1.7, flex:1, marginBottom:28 }}>{p.body}</p>
                <span style={{ fontFamily:font, fontSize:13, fontWeight:600, color:C.blue, display:'inline-flex', alignItems:'center', gap:6 }}>{p.link} →</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Divider />

      {/* ── BigGeo AI Banner ──────────────────────────────────────────────────── */}
      <section style={{ padding:'96px clamp(20px,5vw,64px)', background:C.bg }}>
        <div style={{ maxWidth:1040, margin:'0 auto' }}>
          <motion.div initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true, margin:'-60px' }} transition={{ duration:0.65, ease:[0.22,1,0.36,1] }}
            style={{ background:`linear-gradient(135deg,${C.navy} 0%,${C.dark} 60%)`, border:'1px solid rgba(47,90,240,0.25)', borderRadius:16, padding:'clamp(40px,5vw,64px) clamp(32px,5vw,72px)', position:'relative', overflow:'hidden', display:'grid', gridTemplateColumns:'1fr auto', gap:48, alignItems:'center' }}>
            <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse 60% 100% at 0% 50%,rgba(47,90,240,0.18) 0%,transparent 70%)', pointerEvents:'none' }} />
            <div style={{ position:'relative', zIndex:1 }}>
              <div style={{ display:'inline-flex', alignItems:'center', gap:8, fontSize:10, fontWeight:700, letterSpacing:'1.4px', textTransform:'uppercase', color:C.blue, background:'rgba(47,90,240,0.12)', border:'1px solid rgba(47,90,240,0.3)', borderRadius:999, padding:'4px 12px', marginBottom:16, fontFamily:font }}>
                <span style={{ width:6, height:6, borderRadius:'50%', background:C.blue, animation:'globePulse 2s ease-in-out infinite' }} />
                Now in Beta
              </div>
              <h2 style={{ fontFamily:font, fontWeight:800, fontSize:'clamp(22px,2.8vw,32px)', color:'#fff', letterSpacing:'-0.5px', lineHeight:1.2, marginBottom:12 }}>
                Introducing <span style={{ color:C.blue }}>BigGeo AI</span>: spatial data inside your AI assistant.
              </h2>
              <p style={{ fontFamily:font, fontSize:15, color:'rgba(180,198,255,0.75)', lineHeight:1.7, maxWidth:480 }}>
                For the first time, AI can touch the world it reasons about. BigGeo AI connects Claude and ChatGPT directly to real, governed spatial data. Ask a question about any location. Get a verified answer in seconds. Not a guess.
              </p>
            </div>
            <div style={{ position:'relative', zIndex:1, display:'flex', flexDirection:'column', gap:10, flexShrink:0 }}>
              <motion.button whileHover={{ scale:1.04 }} whileTap={{ scale:0.97 }}
                style={{ fontFamily:font, fontWeight:600, fontSize:14, color:'#fff', background:C.blue, border:'none', borderRadius:8, padding:'13px 28px', cursor:'pointer', whiteSpace:'nowrap' }}>
                Request Access
              </motion.button>
              <motion.button whileHover={{ scale:1.04 }} whileTap={{ scale:0.97 }}
                style={{ fontFamily:font, fontWeight:600, fontSize:14, color:'rgba(180,198,255,0.82)', background:'transparent', border:'1px solid rgba(107,143,245,0.35)', borderRadius:8, padding:'13px 28px', cursor:'pointer', whiteSpace:'nowrap' }}>
                Learn More
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      <Divider />

      {/* ── How It Works ──────────────────────────────────────────────────────── */}
      <section style={{ padding:'96px clamp(20px,5vw,64px)', background:C.white }}>
        <div style={{ maxWidth:1040, margin:'0 auto' }}>
          <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true, margin:'-60px' }} transition={{ duration:0.6, ease:[0.22,1,0.36,1] }}
            style={{ textAlign:'center', marginBottom:64 }}>
            <SectionLabel>How It Works</SectionLabel>
            <h2 style={{ fontFamily:font, fontWeight:800, fontSize:'clamp(28px,3.8vw,42px)', color:C.text, letterSpacing:'-0.8px', marginBottom:14 }}>Simple by design. Powerful at scale.</h2>
            <p style={{ fontFamily:font, fontSize:16, color:C.muted, maxWidth:520, margin:'0 auto', lineHeight:1.7 }}>
              BigGeo's credit-based platform removes the complexity from working with spatial data -so your team can focus on the work, not the infrastructure.
            </p>
          </motion.div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:16 }}>
            {HOW_STEPS.map((s, i) => (
              <motion.div key={s.num}
                initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true, margin:'-40px' }}
                transition={{ duration:0.55, delay:i*0.1, ease:[0.22,1,0.36,1] }}
                style={{ background:C.bg, border:`1px solid ${C.border}`, borderRadius:12, padding:'28px 22px' }}>
                <div style={{ fontFamily:font, fontSize:11, fontWeight:700, color:C.blue, letterSpacing:'0.5px', marginBottom:16 }}>{s.num}</div>
                <div style={{ width:40, height:40, borderRadius:9, background:'rgba(47,90,240,0.08)', border:'1px solid rgba(47,90,240,0.18)', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:16 }}>
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke={C.blue} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{s.icon}</svg>
                </div>
                <h4 style={{ fontFamily:font, fontWeight:700, fontSize:15, color:C.text, marginBottom:8 }}>{s.title}</h4>
                <p style={{ fontFamily:font, fontSize:13, color:C.muted, lineHeight:1.65 }}>{s.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Divider />

      {/* Industries */}
      <section style={{ padding:'96px clamp(20px,5vw,64px)', background:C.white }}>
        <div style={{ maxWidth:1040, margin:'0 auto' }}>
          <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:24, marginBottom:40 }}>
            <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true, margin:'-60px' }} transition={{ duration:0.6, ease:[0.22,1,0.36,1] }}>
              <SectionLabel>Industries</SectionLabel>
              <h2 style={{ fontFamily:font, fontWeight:800, fontSize:'clamp(28px,3.8vw,42px)', color:C.text, letterSpacing:'-0.8px', marginBottom:12 }}>A solution for every industry.</h2>
              <p style={{ fontFamily:font, fontSize:16, color:C.muted, maxWidth:500, lineHeight:1.7 }}>Any business that needs to understand the "where" of their data can work with BigGeo.</p>
            </motion.div>
            <motion.div initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }} transition={{ duration:0.5, delay:0.2 }} style={{ flexShrink:0, paddingTop:4 }}>
              <motion.a
                href="https://marketplace.biggeo.com/categories"
                target="_blank" rel="noopener noreferrer"
                whileHover={{ borderColor:'rgba(47,90,240,0.4)', color:C.blue }}
                style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'10px 18px', background:C.white, border:`1px solid ${C.border}`, borderRadius:10, fontFamily:font, fontSize:14, fontWeight:500, color:C.text, cursor:'pointer', whiteSpace:'nowrap', textDecoration:'none', transition:'border-color 0.2s, color 0.2s' }}>
                All Categories
                <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7 17L17 7M17 7H7M17 7v10"/>
                </svg>
              </motion.a>
            </motion.div>
          </div>
          {/* Shared-border grid matching product category layout */}
          <motion.div
            initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true, margin:'-40px' }} transition={{ duration:0.55, ease:[0.22,1,0.36,1] }}
            style={{ display:'grid', gridTemplateColumns:'repeat(6, 1fr)', borderTop:`1px solid ${C.border}`, borderLeft:`1px solid ${C.border}` }}>
            {INDUSTRIES.map((ind) => (
              <motion.div key={ind.name}
                whileHover={{ background:'rgba(47,90,240,0.025)' }}
                style={{ borderRight:`1px solid ${C.border}`, borderBottom:`1px solid ${C.border}`, padding:'32px 16px', display:'flex', flexDirection:'column', alignItems:'center', gap:12, cursor:'default' }}>
                {ind.icon}
                <span style={{ fontFamily:font, fontSize:12.5, fontWeight:500, color:'#555555', textAlign:'center', lineHeight:1.4 }}>{ind.name}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <Divider />

      {/* ── Testimonials ──────────────────────────────────────────────────────── */}
      <section style={{ padding:'96px clamp(20px,5vw,64px)', background:C.white }}>
        <div style={{ maxWidth:1040, margin:'0 auto' }}>
          <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true, margin:'-60px' }} transition={{ duration:0.6, ease:[0.22,1,0.36,1] }}
            style={{ textAlign:'center', marginBottom:56 }}>
            <SectionLabel>What Our Partners Say</SectionLabel>
            <h2 style={{ fontFamily:font, fontWeight:800, fontSize:'clamp(28px,3.8vw,42px)', color:C.text, letterSpacing:'-0.8px', marginBottom:14 }}>
              Trusted by the people<br />building what's next.
            </h2>
            <p style={{ fontFamily:font, fontSize:16, color:C.muted, maxWidth:480, margin:'0 auto' }}>See how BigGeo empowers individuals and organizations alike.</p>
          </motion.div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(440px,1fr))', gap:16 }}>
            {TESTIMONIALS.map((t, i) => (
              <motion.div key={t.name}
                initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true, margin:'-40px' }}
                transition={{ duration:0.55, delay:i*0.08, ease:[0.22,1,0.36,1] }}
                style={{ background:C.bg, border:`1px solid ${C.border}`, borderRadius:14, padding:'32px 28px' }}>
                <p style={{ fontFamily:font, fontSize:15.5, color:'#333', lineHeight:1.75, marginBottom:24, fontStyle:'italic' }}>
                  <span style={{ color:C.blue, fontSize:28, lineHeight:0, verticalAlign:'-10px', marginRight:4, fontStyle:'normal' }}>"</span>
                  {t.quote}
                </p>
                <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                  <div style={{ width:40, height:40, borderRadius:'50%', flexShrink:0, background:'rgba(47,90,240,0.1)', border:'1px solid rgba(47,90,240,0.2)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:font, fontSize:13, fontWeight:700, color:C.blue }}>
                    {t.initials}
                  </div>
                  <div>
                    <div style={{ fontFamily:font, fontSize:14, fontWeight:600, color:C.text }}>{t.name}</div>
                    <div style={{ fontFamily:font, fontSize:12, color:C.muted, marginTop:2 }}>{t.title}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Divider />

      {/* ── FAQ ───────────────────────────────────────────────────────────────── */}
      <section style={{ padding:'96px clamp(20px,5vw,64px)', background:C.bg }}>
        <div style={{ maxWidth:1040, margin:'0 auto' }}>
          <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true, margin:'-60px' }} transition={{ duration:0.6, ease:[0.22,1,0.36,1] }}
            style={{ textAlign:'center', marginBottom:56 }}>
            <SectionLabel>FAQ</SectionLabel>
            <h2 style={{ fontFamily:font, fontWeight:800, fontSize:'clamp(28px,3.8vw,42px)', color:C.text, letterSpacing:'-0.8px', marginBottom:14 }}>Frequently asked questions.</h2>
            <p style={{ fontFamily:font, fontSize:16, color:C.muted, maxWidth:480, margin:'0 auto' }}>Everything you need to know about BigGeo and The Spatial Cloud.</p>
          </motion.div>
          <div style={{ maxWidth:720, margin:'0 auto', display:'flex', flexDirection:'column', gap:8 }}>
            {FAQS.map((faq, i) => (
              <div key={i} style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:10, overflow:'hidden' }}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{ width:'100%', padding:'20px 24px', background:'none', border:'none', display:'flex', alignItems:'center', justifyContent:'space-between', gap:16, fontFamily:font, fontSize:15, fontWeight:600, color: openFaq === i ? C.blue : C.text, cursor:'pointer', textAlign:'left', transition:'color 0.15s' }}>
                  {faq.q}
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke={C.blue} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                    style={{ flexShrink:0, transform: openFaq === i ? 'rotate(45deg)' : 'none', transition:'transform 0.2s ease' }}>
                    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                </button>
                <AnimatePresence initial={false}>
                  {openFaq === i && (
                    <motion.div key="answer" initial={{ height:0, opacity:0 }} animate={{ height:'auto', opacity:1 }} exit={{ height:0, opacity:0 }} transition={{ duration:0.25, ease:'easeInOut' }} style={{ overflow:'hidden' }}>
                      <div style={{ padding:'0 24px 20px', fontFamily:font, fontSize:14, color:C.muted, lineHeight:1.75 }}>{faq.a}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Divider />

      {/* ── CTA ───────────────────────────────────────────────────────────────── */}
      <section style={{ padding:'96px clamp(20px,5vw,64px)', background:C.white }}>
        <div style={{ maxWidth:1040, margin:'0 auto' }}>
          <motion.div initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true, margin:'-60px' }} transition={{ duration:0.65, ease:[0.22,1,0.36,1] }}
            style={{ background:`linear-gradient(180deg,${C.navy} 0%,${C.dark} 100%)`, border:'1px solid rgba(47,90,240,0.2)', borderRadius:16, padding:'clamp(48px,7vw,80px)', textAlign:'center', position:'relative', overflow:'hidden' }}>
            <div style={{ position:'absolute', top:0, left:'50%', transform:'translateX(-50%)', width:700, height:350, background:'radial-gradient(ellipse at top,rgba(47,90,240,0.25) 0%,transparent 70%)', pointerEvents:'none' }} />
            <div style={{ position:'relative', zIndex:1 }}>
              <h2 style={{ fontFamily:font, fontWeight:800, fontSize:'clamp(28px,4.5vw,44px)', color:'#fff', letterSpacing:'-1px', lineHeight:1.12, marginBottom:16 }}>
                Ready to put your<br /><span style={{ color:C.blue }}>data to work?</span>
              </h2>
              <p style={{ fontFamily:font, fontSize:17, color:'rgba(180,198,255,0.75)', lineHeight:1.7, maxWidth:480, margin:'0 auto 44px' }}>
                Join the teams using BigGeo to answer the questions that matter -faster than anyone else.
              </p>
              <div style={{ display:'flex', justifyContent:'center', gap:12, flexWrap:'wrap' }}>
                <motion.button whileHover={{ scale:1.05, boxShadow:'0 8px 40px rgba(47,90,240,0.55)' }} whileTap={{ scale:0.97 }}
                  style={{ fontFamily:font, fontWeight:700, fontSize:15, color:'#fff', background:C.blue, border:'none', borderRadius:8, padding:'14px 34px', cursor:'pointer', boxShadow:'0 4px 28px rgba(47,90,240,0.45)' }}>
                  Get Started Free
                </motion.button>
                <motion.button whileHover={{ scale:1.03, borderColor:'rgba(107,143,245,0.6)', color:'#fff' }} whileTap={{ scale:0.97 }}
                  style={{ fontFamily:font, fontWeight:700, fontSize:15, color:'rgba(180,198,255,0.82)', background:'transparent', border:'1px solid rgba(107,143,245,0.28)', borderRadius:8, padding:'14px 34px', cursor:'pointer' }}>
                  Contact Sales →
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      </div>{/* end content sections */}

      <style>{`
        @keyframes globePulse {
          0%,100% { opacity:1; transform:scale(1); }
          50% { opacity:0.4; transform:scale(0.72); }
        }
        @keyframes ticker {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>
    </>
  )
}
