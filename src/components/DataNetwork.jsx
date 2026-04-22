import { useRef, useEffect } from 'react'

export default function DataNetwork() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    let W = canvas.offsetWidth
    let H = canvas.offsetHeight

    const resize = () => {
      W = canvas.offsetWidth
      H = canvas.offsetHeight
      canvas.width = W * window.devicePixelRatio
      canvas.height = H * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }
    resize()
    window.addEventListener('resize', resize)

    const nodes = Array.from({ length: 80 }, (_, i) => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: i < 8 ? Math.random() * 3 + 3 : Math.random() * 2 + 1,
      pulse: Math.random() * Math.PI * 2,
      isHub: i < 8,
    }))

    const pulses = Array.from({ length: 12 }, () => ({
      from: Math.floor(Math.random() * 80),
      to: Math.floor(Math.random() * 80),
      t: Math.random(),
      speed: 0.004 + Math.random() * 0.004,
    }))

    const CONNECT_DIST = 220
    let animId

    const draw = () => {
      ctx.clearRect(0, 0, W, H)

      nodes.forEach((n) => {
        n.x += n.vx
        n.y += n.vy
        n.pulse += 0.022
        if (n.x < 0) { n.x = 0; n.vx *= -1 }
        if (n.x > W) { n.x = W; n.vx *= -1 }
        if (n.y < 0) { n.y = 0; n.vy *= -1 }
        if (n.y > H) { n.y = H; n.vy *= -1 }
      })

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x
          const dy = nodes[i].y - nodes[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < CONNECT_DIST) {
            const proximity = 1 - dist / CONNECT_DIST
            const alpha = proximity * (nodes[i].isHub || nodes[j].isHub ? 0.65 : 0.38)
            ctx.beginPath()
            ctx.strokeStyle = `rgba(107,143,245,${alpha})`
            ctx.lineWidth = nodes[i].isHub || nodes[j].isHub ? 1.2 : 0.8
            ctx.moveTo(nodes[i].x, nodes[i].y)
            ctx.lineTo(nodes[j].x, nodes[j].y)
            ctx.stroke()
          }
        }
      }

      pulses.forEach((p) => {
        p.t += p.speed
        if (p.t >= 1) {
          p.t = 0
          p.from = Math.floor(Math.random() * nodes.length)
          p.to = Math.floor(Math.random() * nodes.length)
        }
        const a = nodes[p.from]
        const b = nodes[p.to]
        const dx = b.x - a.x
        const dy = b.y - a.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < CONNECT_DIST) {
          const px = a.x + dx * p.t
          const py = a.y + dy * p.t
          ctx.beginPath()
          ctx.arc(px, py, 2.5, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(163,191,252,0.9)`
          ctx.shadowColor = '#6B8FF5'
          ctx.shadowBlur = 10
          ctx.fill()
          ctx.shadowBlur = 0
        }
      })

      nodes.forEach((n) => {
        const pulsed = n.r + Math.sin(n.pulse) * (n.isHub ? 1.2 : 0.6)
        const brightness = 0.6 + Math.sin(n.pulse) * 0.25
        if (n.isHub) {
          ctx.beginPath()
          ctx.arc(n.x, n.y, pulsed + 6, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(47,90,240,${0.12 + Math.sin(n.pulse) * 0.06})`
          ctx.fill()
          ctx.beginPath()
          ctx.arc(n.x, n.y, pulsed + 2, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(107,143,245,0.3)`
          ctx.fill()
        }
        ctx.shadowColor = n.isHub ? '#A3BFFC' : '#6B8FF5'
        ctx.shadowBlur = n.isHub ? 18 : 8
        ctx.beginPath()
        ctx.arc(n.x, n.y, pulsed, 0, Math.PI * 2)
        ctx.fillStyle = n.isHub
          ? `rgba(163,191,252,${brightness})`
          : `rgba(107,143,245,${brightness})`
        ctx.fill()
        ctx.shadowBlur = 0
      })

      animId = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
    />
  )
}
