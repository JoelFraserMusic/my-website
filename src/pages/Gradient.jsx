import { useEffect, useMemo } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

/* ============================================================
   GRADIENT — Spatial Atmosphere

   BigGeo is the spatial cloud. This page should feel like you're
   looking at the dataset itself, illuminated.

   Layer stack:
     1. Aurora curtains (the energy)              — mix-blend: screen
     2. POI dot constellation (the data points)
     3. Network connections (the relationships)
     4. Cursor spotlight (you, exploring)
     5. Top / bottom guard fades

   Brand palette only:
     #6B8FF5  companion       #2F5AF0  brand
     #1C40C1  brand-dark      #FFFFFF  paper
   ============================================================ */

// Deterministic pseudo-random — same dots every render, no flicker.
const rand = (n) => {
  const x = Math.sin(n * 12.9898 + 78.233) * 43758.5453
  return x - Math.floor(x)
}

// ============ CURTAINS ============
const curtains = [
  { color: '47, 90, 240',  alpha: 0.62, width: '15vw', height: '170vh', blur: 80,  left: '22%', rotate: -24, drift: ['-12vw', '28vw'], duration: 30 },
  { color: '107, 143, 245', alpha: 0.58, width: '11vw', height: '185vh', blur: 65,  left: '44%', rotate: -28, drift: ['-8vw',  '22vw'], duration: 24 },
  { color: '28, 64, 193',   alpha: 0.50, width: '13vw', height: '170vh', blur: 75,  left: '64%', rotate: -21, drift: ['-18vw', '15vw'], duration: 27 },
  { color: '47, 90, 240',   alpha: 0.45, width: '9vw',  height: '200vh', blur: 55,  left: '80%', rotate: -32, drift: ['-10vw', '20vw'], duration: 21 },
  { color: '107, 143, 245', alpha: 0.38, width: '18vw', height: '180vh', blur: 110, left: '8%',  rotate: -19, drift: ['-5vw',  '35vw'], duration: 33 },
]

// ============ DOT CONSTELLATION ============
const DOT_COUNT = 48
function makeDots() {
  return Array.from({ length: DOT_COUNT }, (_, i) => {
    const x = rand(i * 3 + 1) * 100
    const y = 18 + rand(i * 3 + 2) * 76     // keep dots inside the readable band
    const sz = 2 + rand(i * 3 + 3) * 4
    const sat = rand(i * 3 + 4)
    const color = sat > 0.7 ? '47, 90, 240' : sat > 0.35 ? '107, 143, 245' : '28, 64, 193'
    return {
      x, y, sz, color,
      delay: rand(i * 7) * 6,
      duration: 2.8 + rand(i * 7 + 1) * 3.4,
      peakOpacity: 0.55 + rand(i * 7 + 2) * 0.45,
    }
  })
}

// ============ NETWORK CONNECTIONS ============
// Hand-pick pairs from the deterministic dot field that are visually close.
function makeConnections(dots) {
  const out = []
  for (let i = 0; i < dots.length; i++) {
    for (let j = i + 1; j < dots.length; j++) {
      const dx = dots[i].x - dots[j].x
      const dy = dots[i].y - dots[j].y
      const d = Math.hypot(dx, dy)
      if (d < 14 && rand(i * 99 + j) > 0.55) {
        out.push({ a: i, b: j, d })
        if (out.length >= 22) return out
      }
    }
  }
  return out
}

export default function Gradient() {
  const dots = useMemo(makeDots, [])
  const connections = useMemo(() => makeConnections(dots), [dots])

  // Cursor spotlight
  const mouseX = useMotionValue(typeof window !== 'undefined' ? window.innerWidth / 2 : 0)
  const mouseY = useMotionValue(typeof window !== 'undefined' ? window.innerHeight / 2 : 0)
  const springX = useSpring(mouseX, { damping: 28, stiffness: 80, mass: 0.6 })
  const springY = useSpring(mouseY, { damping: 28, stiffness: 80, mass: 0.6 })

  useEffect(() => {
    document.title = 'Gradient — BigGeo'
    const onMove = (e) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [mouseX, mouseY])

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        overflow: 'hidden',
        background: '#ffffff',
      }}
    >
      {/* ============ AURORA CURTAINS ============ */}
      {curtains.map((c, i) => (
        <motion.div
          key={`curtain-${i}`}
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: '50%',
            left: c.left,
            width: c.width,
            height: c.height,
            marginTop: `calc(-${c.height} / 2)`,
            background: `radial-gradient(ellipse 50% 50% at center, rgba(${c.color}, ${c.alpha}) 0%, rgba(${c.color}, 0) 72%)`,
            filter: `blur(${c.blur}px)`,
            mixBlendMode: 'screen',
            pointerEvents: 'none',
            willChange: 'transform',
          }}
          initial={{ x: c.drift[0], rotate: c.rotate, scaleY: 1 }}
          animate={{
            x: [c.drift[0], c.drift[1], c.drift[0]],
            rotate: [c.rotate, c.rotate + 5, c.rotate - 2, c.rotate],
            scaleY: [1, 1.08, 0.94, 1.04, 1],
          }}
          transition={{
            duration: c.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            times: [0, 0.33, 0.66, 1],
          }}
        />
      ))}

      {/* ============ NETWORK CONNECTIONS (drawn before dots so dots sit on top) ============ */}
      <svg
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}
        preserveAspectRatio="none"
        viewBox="0 0 100 100"
      >
        {connections.map((conn, i) => {
          const a = dots[conn.a]
          const b = dots[conn.b]
          const baseOpacity = 0.10 + (1 - conn.d / 14) * 0.18
          return (
            <motion.line
              key={`line-${i}`}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke="rgb(47, 90, 240)"
              strokeWidth={0.06}
              vectorEffect="non-scaling-stroke"
              initial={{ opacity: 0 }}
              animate={{ opacity: [baseOpacity * 0.4, baseOpacity, baseOpacity * 0.4] }}
              transition={{
                duration: 4 + (i % 5) * 0.8,
                delay: rand(i + 200) * 4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          )
        })}
      </svg>

      {/* ============ POI DOT CONSTELLATION ============ */}
      {dots.map((d, i) => (
        <motion.div
          key={`dot-${i}`}
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: `${d.x}%`,
            top: `${d.y}%`,
            width: `${d.sz * 4}px`,
            height: `${d.sz * 4}px`,
            marginLeft: `-${d.sz * 2}px`,
            marginTop: `-${d.sz * 2}px`,
            borderRadius: '50%',
            background: `radial-gradient(circle, rgba(${d.color}, 0.95) 0%, rgba(${d.color}, 0.55) 22%, rgba(${d.color}, 0) 65%)`,
            pointerEvents: 'none',
            willChange: 'transform, opacity',
          }}
          initial={{ opacity: 0, scale: 0.4 }}
          animate={{
            opacity: [d.peakOpacity * 0.3, d.peakOpacity, d.peakOpacity * 0.3],
            scale: [0.7, 1.15, 0.7],
          }}
          transition={{
            duration: d.duration,
            delay: d.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* ============ CURSOR SPOTLIGHT ============
          Soft blue glow follows the mouse. Normal blend mode + brand-blue
          radial gradient = visible against both white paper AND on top of
          the curtains (where it brightens the existing blue). Spring
          physics give it a smooth trailing lag behind the cursor. */}
      <motion.div
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '700px',
          height: '700px',
          marginLeft: '-350px',
          marginTop: '-350px',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(47, 90, 240, 0.22) 0%, rgba(47, 90, 240, 0.12) 28%, rgba(47, 90, 240, 0) 65%)',
          filter: 'blur(8px)',
          x: springX,
          y: springY,
          pointerEvents: 'none',
          willChange: 'transform',
          zIndex: 5,
        }}
      />

      {/* ============ TOP-EDGE GUARD ============ */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '20vh',
          background:
            'linear-gradient(to bottom, rgba(255,255,255,1) 0%, rgba(255,255,255,0.85) 40%, rgba(255,255,255,0) 100%)',
          pointerEvents: 'none',
          zIndex: 10,
        }}
      />

      {/* ============ BOTTOM FADE ============ */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: '12vh',
          background:
            'linear-gradient(to top, rgba(255,255,255,0.65) 0%, rgba(255,255,255,0) 100%)',
          pointerEvents: 'none',
          zIndex: 10,
        }}
      />
    </div>
  )
}
