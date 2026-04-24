import { useRef, useEffect } from 'react'

export default function GlobeHero() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let W, H, animId, rotation = 0

    const resize = () => {
      W = canvas.offsetWidth
      H = canvas.offsetHeight
      canvas.width = W * window.devicePixelRatio
      canvas.height = H * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }
    resize()
    window.addEventListener('resize', resize)

    const dataPoints = Array.from({ length: 40 }, () => ({
      lat: (Math.random() - 0.5) * Math.PI,
      lon: Math.random() * Math.PI * 2,
      r: Math.random() * 2 + 1.5,
      pulse: Math.random() * Math.PI * 2,
      speed: 0.018 + Math.random() * 0.022,
    }))

    const project = (lat, lon) => {
      const R = Math.min(W, H) * 0.36
      return {
        x: W / 2 + Math.cos(lat) * Math.sin(lon + rotation) * R,
        y: H / 2 - Math.sin(lat) * R,
        z: Math.cos(lat) * Math.cos(lon + rotation),
      }
    }

    const SEGS = 80, LAT_LINES = 10, LON_LINES = 16

    const draw = () => {
      ctx.clearRect(0, 0, W, H)
      rotation += 0.003

      for (let li = 1; li < LAT_LINES; li++) {
        const lat = (li / LAT_LINES) * Math.PI - Math.PI / 2
        for (let si = 0; si < SEGS; si++) {
          const p1 = project(lat, (si / SEGS) * Math.PI * 2)
          const p2 = project(lat, ((si + 1) / SEGS) * Math.PI * 2)
          const z = (p1.z + p2.z) / 2
          ctx.beginPath()
          ctx.moveTo(p1.x, p1.y)
          ctx.lineTo(p2.x, p2.y)
          ctx.strokeStyle = `rgba(107,143,245,${z > 0 ? 0.12 + z * 0.22 : 0.04})`
          ctx.lineWidth = z > 0 ? 0.8 : 0.3
          ctx.stroke()
        }
      }

      for (let li = 0; li < LON_LINES; li++) {
        const lon = (li / LON_LINES) * Math.PI * 2
        for (let si = 0; si < SEGS; si++) {
          const p1 = project((si / SEGS) * Math.PI - Math.PI / 2, lon)
          const p2 = project(((si + 1) / SEGS) * Math.PI - Math.PI / 2, lon)
          const z = (p1.z + p2.z) / 2
          ctx.beginPath()
          ctx.moveTo(p1.x, p1.y)
          ctx.lineTo(p2.x, p2.y)
          ctx.strokeStyle = `rgba(107,143,245,${z > 0 ? 0.12 + z * 0.22 : 0.04})`
          ctx.lineWidth = z > 0 ? 0.8 : 0.3
          ctx.stroke()
        }
      }

      dataPoints.forEach(pt => {
        pt.pulse += pt.speed
        const p = project(pt.lat, pt.lon)
        if (p.z <= 0.05) return
        const depth = (p.z + 1) / 2
        const pulsed = pt.r + Math.sin(pt.pulse) * 0.7

        ctx.beginPath()
        ctx.arc(p.x, p.y, pulsed + 6 + Math.sin(pt.pulse) * 2, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(107,143,245,${0.22 * depth})`
        ctx.lineWidth = 0.8
        ctx.stroke()

        ctx.shadowColor = '#A3BFFC'
        ctx.shadowBlur = 14
        ctx.beginPath()
        ctx.arc(p.x, p.y, pulsed, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(163,191,252,${0.55 + depth * 0.38})`
        ctx.fill()
        ctx.shadowBlur = 0
      })

      animId = requestAnimationFrame(draw)
    }
    draw()

    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize) }
  }, [])

  return <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
}
