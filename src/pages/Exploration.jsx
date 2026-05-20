import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './Exploration.css'

/* ============================================================
   ATMOSPHERE
   Composite background of five layers, all fixed-positioned:
     1. soft pale-blue page wash (CSS)
     2. halftone dot gradient — bottom-left corner
     3. geodesic triangular mesh — top-left corner
     4. connected node network — right edge
     5. flowing topographic contours — bottom-right, the centerpiece
   Plus scattered BigGeo-blue accent squares for punctuation.
   The contour canvas is generated once via marching squares
   against a multi-octave noise field; a slow CSS drift gives
   the impression of breathing without burning CPU.
   ============================================================ */

// -- Marching squares contour extractor --------------------
function buildContours(width, height, cellSize, levels, fieldFn) {
  const cols = Math.ceil(width / cellSize)
  const rows = Math.ceil(height / cellSize)
  const stride = cols + 1
  const vals = new Float32Array(stride * (rows + 1))
  for (let r = 0; r <= rows; r++) {
    for (let c = 0; c <= cols; c++) {
      vals[r * stride + c] = fieldFn(c * cellSize, r * cellSize)
    }
  }
  const segs = [] // [level, x1, y1, x2, y2]
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const tl = vals[r * stride + c]
      const tr = vals[r * stride + c + 1]
      const bl = vals[(r + 1) * stride + c]
      const br = vals[(r + 1) * stride + c + 1]
      for (let li = 0; li < levels.length; li++) {
        const L = levels[li]
        const code = (tl > L ? 8 : 0) | (tr > L ? 4 : 0) | (br > L ? 2 : 0) | (bl > L ? 1 : 0)
        if (code === 0 || code === 15) continue
        const x0 = c * cellSize, y0 = r * cellSize
        const x1 = x0 + cellSize, y1 = y0 + cellSize
        const top = [x0 + (L - tl) / (tr - tl) * cellSize, y0]
        const right = [x1, y0 + (L - tr) / (br - tr) * cellSize]
        const bottom = [x0 + (L - bl) / (br - bl) * cellSize, y1]
        const left = [x0, y0 + (L - tl) / (bl - tl) * cellSize]
        const push = (a, b) => segs.push(li, a[0], a[1], b[0], b[1])
        switch (code) {
          case 1: case 14: push(left, bottom); break
          case 2: case 13: push(bottom, right); break
          case 3: case 12: push(left, right); break
          case 4: case 11: push(top, right); break
          case 5: push(left, top); push(bottom, right); break
          case 6: case 9: push(top, bottom); break
          case 7: case 8: push(left, top); break
          case 10: push(top, right); push(left, bottom); break
        }
      }
    }
  }
  return segs
}

function ContourCanvas() {
  const ref = useRef(null)
  useEffect(() => {
    const cv = ref.current
    if (!cv) return
    const ctx = cv.getContext('2d')

    const draw = () => {
      // Read measured size from the parent (canvas's own offset* can be
      // unreliable right after we mutate its width/height attributes).
      const parent = cv.parentElement || document.body
      const W = Math.max(100, Math.floor(parent.clientWidth * 0.78))
      const H = Math.max(100, Math.floor(parent.clientHeight * 0.78))
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      // Hard cap on cells so a misread dimension can never blow up the
      // typed-array allocation in buildContours.
      if (!Number.isFinite(W) || !Number.isFinite(H) || W > 4000 || H > 4000) return
      cv.style.width = W + 'px'
      cv.style.height = H + 'px'
      cv.width = W * dpr
      cv.height = H * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, W, H)

      // Multi-octave smooth scalar field. The constants below shape
      // the look — frequencies, phases, weights.
      const field = (x, y) => {
        const a = Math.sin(x * 0.0095 + 0.7) * 0.55
        const b = Math.cos(y * 0.012 - 0.4) * 0.45
        const c = Math.sin((x + y * 1.3) * 0.0065 + 1.1) * 0.40
        const d = Math.cos((x - y) * 0.005 + 2.1) * 0.32
        const e = Math.sin(x * 0.022 + y * 0.018 - 0.3) * 0.18
        // Bias contour density toward the bottom-right corner so the
        // top-left fades out naturally (matches inspiration image).
        const cornerBias = (x / W) * 0.4 + ((H - y) / H) * 0.0
        return a + b + c + d + e + cornerBias
      }

      const levels = []
      for (let i = -1.4; i <= 1.4; i += 0.16) levels.push(i)

      const cellSize = W < 900 ? 10 : 8
      const segs = buildContours(W, H, cellSize, levels, field)

      // Render contours. Lines closer to the center-bottom are darker;
      // outer/edge contours fade out. A handful of levels render in
      // BigGeo blue for the brand pop.
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'

      for (let i = 0; i < segs.length; i += 5) {
        const li = segs[i]
        const x1 = segs[i + 1], y1 = segs[i + 2]
        const x2 = segs[i + 3], y2 = segs[i + 4]

        // Distance from the bottom-right pivot (where contours are densest)
        const cx = (x1 + x2) / 2
        const cy = (y1 + y2) / 2
        const distNorm = Math.hypot((cx - W * 0.75) / W, (cy - H * 0.65) / H)
        const fade = Math.max(0, 1 - distNorm * 1.6)

        // Every ~4th level renders in blue
        const isBlue = li % 4 === 0
        const baseAlpha = isBlue ? 0.55 : 0.28
        const alpha = baseAlpha * fade

        if (alpha < 0.02) continue

        ctx.strokeStyle = isBlue
          ? `rgba(47, 90, 240, ${alpha.toFixed(3)})`
          : `rgba(11, 18, 56, ${alpha.toFixed(3)})`
        ctx.lineWidth = isBlue ? 0.8 : 0.55
        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.lineTo(x2, y2)
        ctx.stroke()
      }

      // Scatter a handful of solid blue squares riding the contours.
      const seedRand = (n) => {
        let x = Math.sin(n * 12.9898 + 78.233) * 43758.5453
        return x - Math.floor(x)
      }
      ctx.fillStyle = 'rgba(47, 90, 240, 0.85)'
      const dotCount = 18
      for (let i = 0; i < dotCount; i++) {
        const px = W * (0.4 + seedRand(i * 7 + 1) * 0.55)
        const py = H * (0.45 + seedRand(i * 7 + 2) * 0.55)
        const s = 2 + seedRand(i * 7 + 3) * 3
        ctx.globalAlpha = 0.55 + seedRand(i * 7 + 4) * 0.4
        ctx.fillRect(px, py, s, s)
      }
      ctx.globalAlpha = 1
    }

    draw()
    let raf = 0
    const onResize = () => {
      if (raf) return
      raf = requestAnimationFrame(() => { raf = 0; draw() })
    }
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return <canvas ref={ref} className="exp-atmos__contour" aria-hidden="true" />
}

function GeodesicMesh() {
  // Generate a static triangulated grid in the top-left corner
  const points = []
  const cols = 8
  const rows = 6
  const dx = 56
  const dy = 50
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const offset = r % 2 === 0 ? 0 : dx / 2
      points.push([c * dx + offset + 20, r * dy + 24])
    }
  }
  const segs = []
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const i = r * cols + c
      if (c < cols - 1) segs.push([points[i], points[i + 1]])
      if (r < rows - 1) {
        segs.push([points[i], points[(r + 1) * cols + c]])
        if (r % 2 === 0 && c < cols - 1) segs.push([points[i], points[(r + 1) * cols + c]])
        if (r % 2 === 0 && c < cols - 1) segs.push([points[i + 1], points[(r + 1) * cols + c]])
        else if (r % 2 === 1 && c > 0) segs.push([points[i], points[(r + 1) * cols + c - 1]])
      }
    }
  }
  return (
    <svg className="exp-atmos__mesh" viewBox="0 0 520 360" aria-hidden="true">
      <defs>
        <linearGradient id="mesh-fade" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#0B1238" stopOpacity="0.35" />
          <stop offset="1" stopColor="#0B1238" stopOpacity="0" />
        </linearGradient>
      </defs>
      <g stroke="url(#mesh-fade)" strokeWidth="0.6" fill="none">
        {segs.map(([a, b], i) => (
          <line key={i} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} />
        ))}
      </g>
      {points.slice(0, 12).map((p, i) => (
        <circle key={'p' + i} cx={p[0]} cy={p[1]} r="1.2" fill="#0B1238" opacity={0.3 - i * 0.018} />
      ))}
    </svg>
  )
}

function NodeNetwork() {
  // Pseudo-random connected constellation along the right edge
  const seedRand = (n) => {
    let x = Math.sin(n * 99.13) * 43758.5453
    return x - Math.floor(x)
  }
  const nodes = []
  const N = 22
  for (let i = 0; i < N; i++) {
    nodes.push([
      40 + seedRand(i * 3 + 1) * 320,
      40 + seedRand(i * 3 + 2) * 540,
      seedRand(i * 3 + 3) > 0.6, // is-square accent
    ])
  }
  const conns = []
  for (let i = 0; i < N; i++) {
    for (let j = i + 1; j < N; j++) {
      const d = Math.hypot(nodes[i][0] - nodes[j][0], nodes[i][1] - nodes[j][1])
      if (d < 130 && seedRand(i * 31 + j) > 0.35) conns.push([nodes[i], nodes[j], d])
    }
  }
  return (
    <svg className="exp-atmos__network" viewBox="0 0 400 620" aria-hidden="true">
      <defs>
        <linearGradient id="net-fade" x1="1" y1="0" x2="0" y2="0">
          <stop offset="0" stopColor="#2F5AF0" stopOpacity="0.45" />
          <stop offset="1" stopColor="#2F5AF0" stopOpacity="0" />
        </linearGradient>
      </defs>
      <g stroke="url(#net-fade)" strokeWidth="0.6" fill="none">
        {conns.map(([a, b, d], i) => (
          <line key={i} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} opacity={1 - d / 160} />
        ))}
      </g>
      {nodes.map(([x, y, sq], i) => (
        sq ? (
          <rect key={i} x={x - 2.5} y={y - 2.5} width="5" height="5" fill="#2F5AF0" opacity={0.45 + seedRand(i + 99) * 0.5} />
        ) : (
          <circle key={i} cx={x} cy={y} r="1.4" fill="#0B1238" opacity={0.35 + seedRand(i + 17) * 0.4} />
        )
      ))}
    </svg>
  )
}

function Atmosphere() {
  return (
    <div className="exp-atmos" aria-hidden="true">
      <div className="exp-atmos__wash" />
      <div className="exp-atmos__halftone" />
      <GeodesicMesh />
      <NodeNetwork />
      <ContourCanvas />
    </div>
  )
}

const TODAY = '2026.05.15'
const VERSION = 'v01'

const industries = [
  { code: 'LGS', name: 'Logistics & Fleet', desc: 'Routing, depot placement, last-mile coverage.', count: '14.2M Records' },
  { code: 'RND', name: 'Research & Education', desc: 'Spatial studies, longitudinal modeling.', count: '14.2M Records' },
  { code: 'RLE', name: 'Real Estate', desc: 'Site selection, trade-area analysis.', count: '14.2M Records' },
  { code: 'ENR', name: 'Energy & Resources', desc: 'Asset siting, demand surface mapping.', count: '14.2M Records' },
  { code: 'GOV', name: 'Government', desc: 'Planning, infrastructure, services.', count: '14.2M Records' },
  { code: 'PDS', name: 'Proptech & Data Science', desc: 'Modeling, alt-data feeds.', count: '14.2M Records' },
  { code: 'IRA', name: 'Insurance & Risk', desc: 'Underwriting, exposure mapping.', count: '14.2M Records' },
  { code: 'RTL', name: 'Retail & Commerce', desc: 'Competitor density, market entry.', count: '14.2M Records' },
]

const problems = [
  {
    num: '01',
    head: 'Fragmented Competitor Data',
    desc: 'Stale sources, inconsistent schemas, no clear lineage.',
    body: 'Most teams stitch together POI feeds from three or four vendors. None of them agree on what a “location” is, and none of them tell you when the data was last verified.',
    diag: 'broken',
  },
  {
    num: '02',
    head: 'No Currency Confidence',
    desc: 'Stale data creates underwriting and siting risk.',
    body: 'A store that closed eight months ago is still in the dataset, still being modeled against. The cost shows up later, in the wrong place.',
    diag: 'scatter',
  },
  {
    num: '03',
    head: 'Slow Proximity Analysis',
    desc: 'Catchment work takes days, not minutes.',
    body: 'Manual joins, manual cleanup, manual deduplication. By the time the analysis is ready, the question has moved on.',
    diag: 'progress',
  },
  {
    num: '04',
    head: 'Missing Historical Context',
    desc: 'No view of how footprints have moved.',
    body: 'You can see where Starbucks is today. You can’t see how the footprint shifted between 2018 and now — which is the only question that matters.',
    diag: 'cropped',
  },
]

const features = [
  {
    fields: [['field', 'geo_point'], ['type', 'float64'], ['null', '0.00%']],
    name: 'Precise Coordinates',
    desc: 'Verified lat/long with no cleanup required. Native WGS-84 — ready to load into PostGIS, BigQuery, or Carto without a transform step.',
    example: 'example: (40.7128, -74.0060)',
  },
  {
    fields: [['field', 'brand_id'], ['type', 'string'], ['null', '0.08%']],
    name: 'Brand Attribution',
    desc: 'Filter by chain, segment, parent company, or sector. Standardized brand IDs mean you can join across the dataset without fuzzy matching.',
    example: 'example: "starbucks-us-corporate"',
  },
  {
    fields: [['field', 'last_verified'], ['type', 'timestamp'], ['null', '0.00%']],
    name: 'Update History',
    desc: 'Per-record verification timestamps. Audit-ready provenance so underwriters and risk teams can defend every decision against the data version it relied on.',
    example: 'example: 2026-05-09T14:21:00Z',
  },
  {
    fields: [['field', 'snapshot_ts'], ['type', 'date'], ['null', '0.00%']],
    name: 'Historical Snapshots',
    desc: 'Weekly snapshots back to January 2018. Build true trend models against the way the market actually moved — not last quarter’s memory of it.',
    example: 'example: 2018-W03 → 2026-W20',
  },
]

const faqs = [
  { q: 'What is BigGeo, and how is it different?', a: 'BigGeo is a spatial data platform that delivers verified retail POI data with full provenance, weekly refresh, and seven years of historical depth. The difference is currency, not coverage — most providers ship a snapshot. We ship a living dataset.' },
  { q: 'Which industries do you serve?', a: 'Retail, real estate, logistics, government, energy, insurance, proptech, and any team doing spatial analysis. The dataset is sector-agnostic; the queries make it relevant.' },
  { q: 'How will this dataset change my business?', a: 'Site-selection cycles compress from weeks to hours. Underwriting decisions get backed by audit-trail timestamps. Competitive intelligence stops being a once-a-year project and starts being a feed.' },
  { q: 'Can the data integrate with my existing systems?', a: 'Yes. CSV, JSON, and Parquet ship today. Snowflake, BigQuery, and Databricks shares ship on request. Custom APIs over /v1/poi handle everything else.' },
  { q: 'How do I get started?', a: 'Request a sample on this page. You receive real data — not previews — matched to a territory of your choosing, delivered in under 24 hours, no sales call required.' },
  { q: 'What kind of support do you offer?', a: 'Embedded analytics support during your evaluation. Dedicated solutions engineer once you sign. Slack-shared channels for production accounts.' },
]

const benefits = [
  'Real dataset rows, not previews',
  'Matched to your declared territory',
  'Delivered in under 24 hours',
  'No sales call required',
  'CSV, JSON, and Parquet formats',
  'CRM and MAP-ready columns',
]

// Hand-rolled US silhouette as a 16×10 dot grid. 1 = land.
const US_GRID = [
  '0000001111111100',
  '0011111111111111',
  '1111111111111110',
  '1111111111111100',
  '0111111111111000',
  '0011111111110000',
  '0001111111100000',
  '0000111111110000',
  '0000000000110000',
  '0000000000010000',
]

function DiagnosticSvg({ kind }) {
  if (kind === 'broken') {
    return (
      <svg viewBox="0 0 240 64" preserveAspectRatio="none">
        <line x1="0" y1="32" x2="240" y2="32" stroke="#E2E5F0" strokeWidth="1" strokeDasharray="2 4" />
        <polyline points="0,40 24,30 48,38 72,22" fill="none" stroke="#0B1238" strokeWidth="1.5" />
        <polyline points="96,46 120,28 144,34" fill="none" stroke="#0B1238" strokeWidth="1.5" />
        <polyline points="180,30 204,42 228,24" fill="none" stroke="#0B1238" strokeWidth="1.5" />
        <circle cx="120" cy="28" r="3" fill="#2F5AF0" />
      </svg>
    )
  }
  if (kind === 'scatter') {
    return (
      <svg viewBox="0 0 240 64">
        {[[12, 18], [40, 44], [68, 22], [96, 50], [124, 28], [152, 16], [180, 46], [208, 32], [228, 20], [56, 38], [86, 10], [148, 52]].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="2.5" fill={i === 4 ? '#2F5AF0' : '#0B1238'} opacity={i === 4 ? 1 : 0.4} />
        ))}
      </svg>
    )
  }
  if (kind === 'progress') {
    return (
      <svg viewBox="0 0 240 64">
        <rect x="0" y="28" width="240" height="8" fill="#F1F2F8" />
        <rect x="0" y="28" width="42" height="8" fill="#2F5AF0" />
        <rect x="42" y="28" width="198" height="8" fill="#0B1238" opacity="0.1" />
        {Array.from({ length: 24 }).map((_, i) => (
          <line key={i} x1={i * 10} y1="20" x2={i * 10} y2="24" stroke="#0B1238" strokeWidth="1" opacity="0.4" />
        ))}
      </svg>
    )
  }
  if (kind === 'cropped') {
    return (
      <svg viewBox="0 0 240 64">
        {[16, 22, 32, 28, 36, 44, 42, 48].map((h, i) => (
          <rect key={i} x={i * 16 + 4} y={56 - h} width="10" height={h} fill={i === 7 ? '#2F5AF0' : '#0B1238'} opacity={i === 7 ? 1 : 0.7} />
        ))}
        <rect x="140" y="0" width="100" height="64" fill="url(#crop)" />
        <defs>
          <pattern id="crop" patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="6" stroke="#E2E5F0" strokeWidth="1" />
          </pattern>
        </defs>
        <line x1="140" y1="0" x2="140" y2="64" stroke="#0B1238" strokeWidth="1" strokeDasharray="3 3" />
      </svg>
    )
  }
  return null
}

function UsDotGrid({ active }) {
  // active: one of 'CITY' | 'ZIP' | 'METRO' | 'COUNTY' | null
  const granularity = { CITY: 1, ZIP: 2, METRO: 3, COUNTY: 4, null: 0 }[active] ?? 0
  return (
    <svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid meet">
      {/* faint baseline grid */}
      {Array.from({ length: 11 }).map((_, i) => (
        <line key={'h' + i} x1="0" y1={i * 20} x2="320" y2={i * 20} stroke="#F1F2F8" strokeWidth="1" />
      ))}
      {Array.from({ length: 17 }).map((_, i) => (
        <line key={'v' + i} x1={i * 20} y1="0" x2={i * 20} y2="200" stroke="#F1F2F8" strokeWidth="1" />
      ))}
      {/* US dots */}
      {US_GRID.flatMap((row, r) =>
        row.split('').map((cell, c) => {
          if (cell !== '1') return null
          const isHighlighted = granularity > 0 && (r * 16 + c) % (6 - granularity) === 0
          const x = c * 20 + 10
          const y = r * 20 + 10
          return (
            <g key={`${r}-${c}`}>
              <circle cx={x} cy={y} r={isHighlighted ? 4 : 2.5} fill={isHighlighted ? '#2F5AF0' : '#0B1238'} opacity={isHighlighted ? 1 : 0.55} />
              {isHighlighted && <circle cx={x} cy={y} r="8" fill="none" stroke="#2F5AF0" strokeWidth="1" opacity="0.4" />}
            </g>
          )
        })
      )}
      {/* center crosshair */}
      <g opacity="0.5">
        <line x1="156" y1="92" x2="164" y2="92" stroke="#0B1238" strokeWidth="1" />
        <line x1="160" y1="88" x2="160" y2="96" stroke="#0B1238" strokeWidth="1" />
      </g>
    </svg>
  )
}

function FaqItem({ q, a, open, onToggle, index }) {
  return (
    <div className="exp-faq__item">
      <button className="exp-faq__btn" onClick={onToggle} aria-expanded={open}>
        <span style={{ display: 'flex', gap: 24, alignItems: 'baseline', flex: 1 }}>
          <span className="exp-mono exp-mono--accent" style={{ minWidth: 28 }}>{String(index + 1).padStart(2, '0')}</span>
          <span className="exp-faq__q">{q}</span>
        </span>
        <span className="exp-faq__sign">[ {open ? '−' : '+'} ]</span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            className="exp-faq__body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.32, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <div className="exp-faq__body-inner" style={{ paddingLeft: 52 }}>{a}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function SectionMarker({ num, name }) {
  return (
    <motion.div
      className="exp-section__marker"
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <span className="exp-section__num">§ {num}</span>
      <span className="exp-section__name">{name}</span>
    </motion.div>
  )
}

export default function Exploration() {
  const [openFaq, setOpenFaq] = useState(0)
  const [geoActive, setGeoActive] = useState('METRO')
  const [time, setTime] = useState(() => {
    const d = new Date()
    return d.toTimeString().slice(0, 8) + ' PT'
  })

  useEffect(() => {
    const t = setInterval(() => {
      const d = new Date()
      setTime(d.toTimeString().slice(0, 8) + ' PT')
    }, 1000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    document.title = 'US Retail POI · Exploration — BigGeo'
  }, [])

  return (
    <div className="exp-page">
      <Atmosphere />
      {/* ============ UTILITY BAR ============ */}
      <div className="exp-utility">
        <div className="exp-utility__inner">
          <div className="exp-utility__crumb">
            BigGeo&nbsp;&nbsp;/&nbsp;&nbsp;Campaign&nbsp;&nbsp;/&nbsp;&nbsp;<span>US-Retail-POI-Dataset</span>
          </div>
          <div className="exp-utility__meta">
            <span className="exp-utility__coords">Lat 39.8283° · Lon −98.5795°&nbsp;&nbsp;|&nbsp;&nbsp;</span>
            {TODAY} · {VERSION}
          </div>
        </div>
      </div>

      {/* ============ HERO ============ */}
      <section className="exp-hero">
        <div className="exp-hero__grid" />
        <motion.div
          className="exp-scanline"
          initial={{ left: '-2%' }}
          animate={{ left: '102%' }}
          transition={{ duration: 1.4, ease: [0.5, 0, 0.5, 1], delay: 0.6 }}
        />
        <div className="exp-container">
          <motion.div
            className="exp-hero__marker"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="exp-section__num">§ 00</span>
            <span className="exp-section__name">Mission Brief · Confidential</span>
          </motion.div>
          <div className="exp-hero__inner">
            <div>
              <h1 className="exp-hero__headline">
                <motion.span initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1], delay: 0.15 }}>
                  Stop guessing.
                </motion.span>
                <motion.span initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1], delay: 0.25 }}>
                  Select sites
                </motion.span>
                <motion.span initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1], delay: 0.35 }}>
                  with <em>confidence.</em>
                </motion.span>
              </h1>
              <motion.p
                className="exp-hero__lede"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
              >
                The US Retail POI Dataset gives you verified coordinates, brand attribution, and weekly historical snapshots — so trade-area analysis runs on what is, not what was.
              </motion.p>
              <motion.div
                className="exp-hero__ctas"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.85 }}
              >
                <a href="#sample" className="exp-btn">Request a sample <span className="exp-btn__arrow">→</span></a>
                <a href="#cta" className="exp-btn exp-btn--ghost">Book a walkthrough</a>
              </motion.div>
            </div>

            <motion.div
              className="exp-datasheet"
              initial="hidden"
              animate="visible"
              variants={{
                visible: { transition: { staggerChildren: 0.08, delayChildren: 0.55 } },
              }}
            >
              {[
                ['Records', '14.2M'],
                ['Vintage', '2018→'],
                ['States', '50'],
                ['Refresh', 'Weekly'],
              ].map(([label, val]) => (
                <motion.div
                  key={label}
                  className="exp-datasheet__row"
                  variants={{
                    hidden: { opacity: 0, y: 6 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
                  }}
                >
                  <span className="exp-datasheet__label">{label}</span>
                  <span className="exp-datasheet__value">{val}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============ AT A GLANCE ============ */}
      <section className="exp-section">
        <div className="exp-container">
          <SectionMarker num="01" name="At a Glance" />
          <div className="exp-section__head">
            <h2 className="exp-section__title">
              Verified scale. <em>Decade-deep.</em> Continuously refreshed.
            </h2>
            <p className="exp-section__sub">
              The numbers behind the dataset, before we get into how to use them. Every figure below is auditable, traceable, and refreshed on a known cadence.
            </p>
          </div>
          <div className="exp-glance">
            <div className="exp-glance__cell">
              <div className="exp-mono">Volume</div>
              <div className="exp-glance__num">14.2<small>M</small></div>
              <div className="exp-glance__label">Verified Records</div>
              <div className="exp-glance__note">Active US retail POIs across more than 280,000 brands and 8 sectors.</div>
            </div>
            <div className="exp-glance__cell">
              <div className="exp-mono">Depth</div>
              <div className="exp-glance__num">2018<small>→</small></div>
              <div className="exp-glance__label">Vintage Start</div>
              <div className="exp-glance__note">Weekly snapshots stretching back over seven years. Real trend modeling, not yearly memory.</div>
            </div>
            <div className="exp-glance__cell">
              <div className="exp-mono">Reach</div>
              <div className="exp-glance__num">50</div>
              <div className="exp-glance__label">States · Plus PR &amp; VI</div>
              <div className="exp-glance__note">Continuous coverage of the contiguous US, Alaska, Hawaii, and major US territories.</div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ BUY BY GEOGRAPHY ============ */}
      <section className="exp-section">
        <div className="exp-container">
          <SectionMarker num="02" name="Buy by Geography" />
          <div className="exp-geo">
            <div className="exp-geo__copy">
              <h2 className="exp-section__title" style={{ fontSize: 'clamp(34px,5vw,68px)' }}>
                Buy markets. <em>Not countries.</em>
              </h2>
              <p style={{ marginTop: 32 }}>
                Most providers force a national license. Pay for the country, use 4% of it. We sell at the granularity you operate: a single city, a cluster of ZIPs, a metro footprint, a county outline. Whatever maps to how your team plans.
              </p>
              <p>
                Switch granularity on the right — coverage redraws against the unit you select.
              </p>
              <div className="exp-geo__chips">
                {['CITY', 'ZIP', 'METRO', 'COUNTY'].map((g) => (
                  <button
                    key={g}
                    className="exp-geo__chip"
                    onMouseEnter={() => setGeoActive(g)}
                    onClick={() => setGeoActive(g)}
                    style={geoActive === g ? { background: 'var(--ink)', color: 'var(--paper)' } : null}
                  >
                    <div className="exp-geo__chip-label">{g}</div>
                    <div className="exp-geo__chip-count" style={geoActive === g ? { color: 'var(--paper)', opacity: 0.7 } : null}>
                      {{ CITY: '19,495 units', ZIP: '41,683 units', METRO: '927 units', COUNTY: '3,143 units' }[g]}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="exp-geo__map">
              <span className="exp-geo__map-label">fig. 02 · Coverage Surface</span>
              <span className="exp-geo__map-coord">Lat 39.83° / Lon −98.58°</span>
              <UsDotGrid active={geoActive} />
            </div>
          </div>
        </div>
      </section>

      {/* ============ THE PROBLEM ============ */}
      <section className="exp-section">
        <div className="exp-container">
          <SectionMarker num="03" name="The Problem" />
          <div className="exp-section__head">
            <h2 className="exp-section__title">
              Four failure modes <em>every team hits</em>.
            </h2>
            <p className="exp-section__sub">
              Each one we've watched cost real money. Each one this dataset is designed to eliminate from the workflow.
            </p>
          </div>
          <div className="exp-problem">
            {problems.map((p) => (
              <motion.div
                key={p.num}
                className="exp-problem__row"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              >
                <div className="exp-problem__num">{p.num}</div>
                <div>
                  <h3 className="exp-problem__head">{p.head}</h3>
                  <p className="exp-problem__desc">{p.desc}</p>
                  <p className="exp-problem__body">{p.body}</p>
                </div>
                <div className="exp-problem__diag">
                  <span className="exp-mono exp-problem__diag-label">fig. 03.{p.num}</span>
                  <DiagnosticSvg kind={p.diag} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ SCHEMA / FEATURES ============ */}
      <section className="exp-section">
        <div className="exp-container">
          <SectionMarker num="04" name="What's in the Dataset" />
          <div className="exp-section__head">
            <h2 className="exp-section__title">
              Four fields. <em>One source of truth.</em>
            </h2>
            <p className="exp-section__sub">
              Schema-first. Every record carries verification metadata. Every column has a defined contract.
            </p>
          </div>
          <div className="exp-schema">
            {features.map((f) => (
              <motion.div
                key={f.name}
                className="exp-schema__cell"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5 }}
              >
                <div className="exp-schema__decl">
                  {f.fields.map(([k, v]) => (
                    <div key={k}><span>{k}:</span> {v}</div>
                  ))}
                </div>
                <h3 className="exp-schema__name">{f.name}</h3>
                <p className="exp-schema__desc">{f.desc}</p>
                <div className="exp-schema__example">{f.example}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ INDUSTRY VERTICALS ============ */}
      <section className="exp-section">
        <div className="exp-container">
          <SectionMarker num="05" name="Industry Verticals" />
          <div className="exp-section__head">
            <h2 className="exp-section__title">
              Built for any team that <em>moves on geography</em>.
            </h2>
            <p className="exp-section__sub">
              Hover a sector to see what it covers. Every tile is the same dataset — just different queries against it.
            </p>
          </div>
          <div className="exp-industries">
            {industries.map((i) => (
              <div key={i.code} className="exp-industry">
                <div className="exp-industry__top">
                  <span className="exp-industry__code">{i.code}</span>
                  <span className="exp-industry__notch" />
                </div>
                <div>
                  <h3 className="exp-industry__name">{i.name}</h3>
                  <p className="exp-industry__desc">{i.desc}</p>
                </div>
                <div className="exp-industry__count">▸ {i.count}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ SAMPLE REQUEST ============ */}
      <section className="exp-section" id="sample">
        <div className="exp-container">
          <SectionMarker num="06" name="Request Sample Data" />
          <div className="exp-section__head">
            <h2 className="exp-section__title">
              Real rows. <em>Your territory.</em> Under 24 hours.
            </h2>
            <p className="exp-section__sub">
              No previews, no demos against fake markets. We slice the dataset to your declared territory and send the actual file.
            </p>
          </div>

          <div className="exp-form-wrap">
            <form className="exp-form" onSubmit={(e) => { e.preventDefault(); alert('Sample request transmitted. Check your inbox within 24 hours.') }}>
              <div className="exp-form__grid">
                <div className="exp-form__field">
                  <label className="exp-form__label">01 · First name</label>
                  <input className="exp-form__input" required placeholder="—" />
                </div>
                <div className="exp-form__field">
                  <label className="exp-form__label">02 · Last name</label>
                  <input className="exp-form__input" required placeholder="—" />
                </div>
                <div className="exp-form__field exp-form__field--full">
                  <label className="exp-form__label">03 · Work email</label>
                  <input className="exp-form__input" type="email" required placeholder="you@company.com" />
                </div>
                <div className="exp-form__field">
                  <label className="exp-form__label">04 · Company</label>
                  <input className="exp-form__input" required placeholder="—" />
                </div>
                <div className="exp-form__field">
                  <label className="exp-form__label">05 · Territory of interest</label>
                  <input className="exp-form__input" required placeholder="e.g. Texas, DFW metro, 75201" />
                </div>
                <div className="exp-form__field">
                  <label className="exp-form__label">06 · Company size</label>
                  <div className="exp-form__select-wrap">
                    <select className="exp-form__select" defaultValue="">
                      <option value="" disabled>—</option>
                      <option>1 – 20 employees</option>
                      <option>21 – 100 employees</option>
                      <option>101 – 500 employees</option>
                      <option>501 – 1,000 employees</option>
                      <option>1,000+ employees</option>
                    </select>
                  </div>
                </div>
                <div className="exp-form__field">
                  <label className="exp-form__label">07 · Industry</label>
                  <div className="exp-form__select-wrap">
                    <select className="exp-form__select" defaultValue="">
                      <option value="" disabled>—</option>
                      {industries.map((i) => <option key={i.code}>{i.name}</option>)}
                    </select>
                  </div>
                </div>
              </div>
              <button type="submit" className="exp-form__submit">
                <span>Transmit request</span>
                <span>→</span>
              </button>
            </form>

            <aside className="exp-benefits">
              <div className="exp-benefits__title">[ What you receive ]</div>
              <ul className="exp-benefits__list">
                {benefits.map((b) => (
                  <li key={b} className="exp-benefits__item">{b}</li>
                ))}
              </ul>
              <div style={{ marginTop: 32, fontSize: 12, lineHeight: 1.6, color: 'var(--mute)', fontFamily: 'Outfit', textTransform: 'uppercase', letterSpacing: '0.14em' }}>
                Delivery SLA · &lt; 24h · No call required
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* ============ FAQ ============ */}
      <section className="exp-section">
        <div className="exp-container">
          <SectionMarker num="07" name="Field Questions" />
          <div className="exp-section__head">
            <h2 className="exp-section__title">
              Six questions <em>worth answering up front</em>.
            </h2>
            <p className="exp-section__sub">
              The objections we hear most often, answered before you have to ask.
            </p>
          </div>
          <div className="exp-faq">
            {faqs.map((f, i) => (
              <FaqItem
                key={f.q}
                q={f.q}
                a={f.a}
                index={i}
                open={openFaq === i}
                onToggle={() => setOpenFaq(openFaq === i ? -1 : i)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ============ BOTTOM CTA ============ */}
      <section className="exp-cta" id="cta">
        <div className="exp-container">
          <div className="exp-cta__marker">
            <span className="exp-section__num">§ 08</span>
            <span className="exp-section__name">Schedule a Reading</span>
          </div>
          <h2 className="exp-cta__headline">
            Book a 20-minute<br />reading of your market.
          </h2>
          <div className="exp-cta__row">
            <p className="exp-cta__sub">
              We pull a live sample against your actual territory and walk through the rows on a call. No slideware. No 12-step intro. The data and your questions, in twenty minutes.
            </p>
            <a href="#sample" className="exp-btn exp-btn--invert">Schedule now <span className="exp-btn__arrow">→</span></a>
          </div>
          <div className="exp-cta__ticker">
            <span>LIVE</span>
            <span>DATA SYNC · {TODAY}</span>
            <span>LOCAL · {time}</span>
            <span>COORD SYS · WGS-84</span>
            <span>DATASET · US-RTL-POI · {VERSION}</span>
          </div>
        </div>
      </section>
    </div>
  )
}
