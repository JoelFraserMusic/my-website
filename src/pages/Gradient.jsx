import { useEffect } from 'react'
import { motion } from 'framer-motion'

/* ============================================================
   GRADIENT — Aurora Curtains

   Pure white page. Multiple diagonal "curtain" ribbons of brand
   blue drift across the viewport like Northern Lights. Each
   curtain is a heavily-blurred elliptical radial gradient on a
   tall narrow div, rotated to an angle. Five curtains layered,
   each with its own size / color / rotation / drift period —
   uncorrelated, so they're never synced.

   Brand palette (no invented hexes):
     #6B8FF5  companion (light brand blue)
     #2F5AF0  brand primary
     #1C40C1  brand dark
   ============================================================ */

const curtains = [
  {
    // Hero curtain — biggest, brand primary, slowest drift
    color: '47, 90, 240',
    alpha: 0.62,
    width: '15vw',
    height: '170vh',
    blur: 80,
    left: '22%',
    rotate: -24,
    drift: ['-12vw', '28vw'],
    duration: 30,
  },
  {
    // Second curtain — companion blue, mid-canvas
    color: '107, 143, 245',
    alpha: 0.58,
    width: '11vw',
    height: '185vh',
    blur: 65,
    left: '44%',
    rotate: -28,
    drift: ['-8vw', '22vw'],
    duration: 24,
  },
  {
    // Third curtain — deepest blue, right of center
    color: '28, 64, 193',
    alpha: 0.50,
    width: '13vw',
    height: '170vh',
    blur: 75,
    left: '64%',
    rotate: -21,
    drift: ['-18vw', '15vw'],
    duration: 27,
  },
  {
    // Fourth — slim accent on the far right
    color: '47, 90, 240',
    alpha: 0.45,
    width: '9vw',
    height: '200vh',
    blur: 55,
    left: '80%',
    rotate: -32,
    drift: ['-10vw', '20vw'],
    duration: 21,
  },
  {
    // Fifth — wide soft background curtain on the left
    color: '107, 143, 245',
    alpha: 0.38,
    width: '18vw',
    height: '180vh',
    blur: 110,
    left: '8%',
    rotate: -19,
    drift: ['-5vw', '35vw'],
    duration: 33,
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
      {curtains.map((c, i) => (
        <motion.div
          key={i}
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
