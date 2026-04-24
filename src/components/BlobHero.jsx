import { useRef, useEffect } from 'react'

const BLOB_DEFS = [
  { cx: 0.5,  cy: 0.48, r: 0.24, phase: 0,   speed: 0.32, color: '47,90,240',   opacity: 0.2  },
  { cx: 0.28, cy: 0.55, r: 0.18, phase: 2.1,  speed: 0.48, color: '107,143,245', opacity: 0.15 },
  { cx: 0.72, cy: 0.42, r: 0.19, phase: 4.2,  speed: 0.38, color: '47,90,240',   opacity: 0.17 },
  { cx: 0.5,  cy: 0.28, r: 0.13, phase: 1.05, speed: 0.58, color: '163,191,252', opacity: 0.11 },
  { cx: 0.62, cy: 0.62, r: 0.14, phase: 3.5,  speed: 0.44, color: '107,143,245', opacity: 0.13 },
]

const N = 14

const getBlobPoints = (cx, cy, baseR, phase, t, speed) =>
  Array.from({ length: N }, (_, i) => {
    const angle = (i / N) * Math.PI * 2
    const r = baseR * (
      1
      + 0.32 * Math.sin(angle * 2 + t * speed + phase)
      + 0.18 * Math.sin(angle * 3 - t * speed * 0.75 + phase * 1.4)
      + 0.1  * Math.sin(angle * 5 + t * speed * 1.35 + phase * 0.6)
    )
    return { x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r }
  })

const drawBlobPath = (ctx, pts) => {
  const n = pts.length
  ctx.beginPath()
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n]
    const p1 = pts[i]
    const p2 = pts[(i + 1) % n]
    const p3 = pts[(i + 2) % n]
    const cp1x = p1.x + (p2.x - p0.x) / 6
    const cp1y = p1.y + (p2.y - p0.y) / 6
    const cp2x = p2.x - (p3.x - p1.x) / 6
    const cp2y = p2.y - (p3.y - p1.y) / 6
    if (i === 0) ctx.moveTo(p1.x, p1.y)
    ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2.x, p2.y)
  }
  ctx.closePath()
}

export default function BlobHero() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let W, H, animId, t = 0

    const resize = () => {
      W = canvas.offsetWidth
      H = canvas.offsetHeight
      canvas.width = W * window.devicePixelRatio
      canvas.height = H * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }
    resize()
    window.addEventListener('resize', resize)

    const draw = () => {
      ctx.clearRect(0, 0, W, H)
      t += 0.008

      const base = Math.min(W, H)

      BLOB_DEFS.forEach(blob => {
        const cx = blob.cx * W
        const cy = blob.cy * H
        const baseR = blob.r * base
        const pts = getBlobPoints(cx, cy, baseR, blob.phase, t, blob.speed)

        drawBlobPath(ctx, pts)

        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, baseR * 1.3)
        grad.addColorStop(0,   `rgba(${blob.color},${blob.opacity * 2.2})`)
        grad.addColorStop(0.6, `rgba(${blob.color},${blob.opacity})`)
        grad.addColorStop(1,   `rgba(${blob.color},0)`)

        ctx.shadowColor = `rgba(${blob.color},0.45)`
        ctx.shadowBlur = 48
        ctx.fillStyle = grad
        ctx.fill()
        ctx.shadowBlur = 0

        // Soft border
        ctx.strokeStyle = `rgba(${blob.color},${blob.opacity * 0.6})`
        ctx.lineWidth = 1
        ctx.stroke()
      })

      animId = requestAnimationFrame(draw)
    }
    draw()

    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize) }
  }, [])

  return <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
}
