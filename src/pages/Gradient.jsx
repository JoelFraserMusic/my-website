import { useEffect } from 'react'
import { motion } from 'framer-motion'

/* ============================================================
   GRADIENT — Aurora Curtains (Brand Gradient Edition)

   Each curtain uses ONE of the three official BigGeo brand
   gradients instead of a flat color, giving the page real
   chromatic range — from #122159 deep navy through #2F5AF0
   primary to #89D9FF sky-blue accent.

   Brand gradients (Figma):
     navy   #122159 → #2747BF   (deepest, dramatic)
     brand  #1C40C1 → #2F5AF0   (punchy mid)
     sky    #2F5AF0 → #89D9FF   (bright accent — the new color)
   ============================================================ */

// SKY-DOMINANT composition. The sky gradient (#2F5AF0 → #89D9FF)
// is the only one with cyan content, so 4 of 5 blobs use it. One small
// navy blob anchors depth without flooding the page with purple-blue.
const blobs = [
  {
    // BIG SKY hero — top-left
    from: '#2F5AF0',
    to:   '#89D9FF',
    alpha: 0.62,
    size: '54vw',
    blur: 105,
    top:  '32%',
    left: '24%',
    drift: { x: ['-6vw', '8vw', '-4vw'], y: ['-3vh', '5vh', '-2vh'], scale: [1, 1.08, 0.96, 1] },
    duration: 26,
  },
  {
    // SKY mid-canvas
    from: '#2F5AF0',
    to:   '#89D9FF',
    alpha: 0.58,
    size: '46vw',
    blur: 95,
    top:  '60%',
    left: '54%',
    drift: { x: ['0vw', '-10vw', '6vw', '0vw'], y: ['0vh', '4vh', '-6vh', '0vh'], scale: [1, 1.10, 0.94, 1] },
    duration: 24,
  },
  {
    // SKY right
    from: '#2F5AF0',
    to:   '#89D9FF',
    alpha: 0.55,
    size: '42vw',
    blur: 90,
    top:  '38%',
    left: '78%',
    drift: { x: ['0vw', '6vw', '-4vw', '0vw'], y: ['0vh', '-5vh', '3vh', '0vh'], scale: [1, 1.06, 0.95, 1] },
    duration: 22,
  },
  {
    // SKY bottom-left
    from: '#2F5AF0',
    to:   '#89D9FF',
    alpha: 0.48,
    size: '36vw',
    blur: 85,
    top:  '78%',
    left: '20%',
    drift: { x: ['0vw', '8vw', '-3vw', '0vw'], y: ['0vh', '3vh', '-4vh', '0vh'], scale: [1, 1.12, 0.92, 1] },
    duration: 28,
  },
  {
    // SMALL NAVY depth anchor — bottom-right. The only non-sky blob.
    // Kept small + low alpha so it provides gravity without spreading
    // a purple tint across the page.
    from: '#122159',
    to:   '#2747BF',
    alpha: 0.32,
    size: '28vw',
    blur: 100,
    top:  '84%',
    left: '74%',
    drift: { x: ['0vw', '-6vw', '3vw', '0vw'], y: ['0vh', '3vh', '-2vh', '0vh'], scale: [1, 1.04, 0.98, 1] },
    duration: 30,
  },
]

export default function Gradient() {
  useEffect(() => {
    document.title = 'Gradient — BigGeo'
  }, [])

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        overflow: 'hidden',
        background: '#ffffff',
      }}
    >
      {blobs.map((b, i) => (
        <motion.div
          key={i}
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: b.top,
            left: b.left,
            width: b.size,
            height: b.size,
            translateX: '-50%',
            translateY: '-50%',
            borderRadius: '50%',
            // Linear gradient supplies the chromatic color, radial mask
            // supplies the circular soft-edged shape.
            background: `linear-gradient(160deg, ${b.from} 0%, ${b.to} 100%)`,
            maskImage: 'radial-gradient(circle, #000 0%, transparent 70%)',
            WebkitMaskImage: 'radial-gradient(circle, #000 0%, transparent 70%)',
            opacity: b.alpha,
            filter: `blur(${b.blur}px)`,
            pointerEvents: 'none',
            willChange: 'transform',
          }}
          animate={{
            x: b.drift.x,
            y: b.drift.y,
            scale: b.drift.scale,
          }}
          transition={{
            duration: b.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            repeatType: 'mirror',
          }}
        />
      ))}

      {/* Top-edge guard — blue can come close to but never touch the top */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '22vh',
          background:
            'linear-gradient(to bottom, rgba(255,255,255,1) 0%, rgba(255,255,255,0.85) 40%, rgba(255,255,255,0) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Bottom subtle fade — anchor the curtains to a horizon */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: '10vh',
          background:
            'linear-gradient(to top, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0) 100%)',
          pointerEvents: 'none',
        }}
      />
    </div>
  )
}
