import { useRef, useEffect } from 'react'

const COLS = 38
const ROWS = 30
const GRID_W = 1400
const MIN_Z = 120
const MAX_Z = 950
const CAM_H = 90
const FOCAL = 500
const AMP = 55

const elevation = (wx, wz, t) =>
  AMP * Math.sin(wx * 0.007 + t * 0.7) * Math.cos(wz * 0.011 + t * 0.45)
  + AMP * 0.5 * Math.sin(wx * 0.014 - wz * 0.009 + t * 0.55)
  + AMP * 0.3 * Math.cos(wx * 0.022 + wz * 0.016 - t * 0.9)

const lerpColor = (gy) => {
  const t = Math.max(0, Math.min(1, (gy + AMP * 1.8) / (AMP * 3.6)))
  return `${Math.round(47 + t * 116)},${Math.round(90 + t * 101)},${Math.round(240 - t * 40)}`
}

export default function TerrainHero() {
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

    const project = (wx, wz, wy) => {
      if (wz <= 0) return null
      const scale = FOCAL / wz
      return { sx: W / 2 + wx * scale, sy: H * 0.5 + (CAM_H - wy) * scale }
    }

    // Pre-allocate grid array
    const grid = Array.from({ length: ROWS + 1 }, () => new Array(COLS + 1))

    const draw = () => {
      ctx.clearRect(0, 0, W, H)
      t += 0.012

      // Compute all grid points (row 0 = far)
      for (let row = 0; row <= ROWS; row++) {
        const wz = MAX_Z - row * (MAX_Z - MIN_Z) / ROWS
        for (let col = 0; col <= COLS; col++) {
          const wx = (col / COLS - 0.5) * GRID_W
          const wy = elevation(wx, wz, t)
          const p = project(wx, wz, wy)
          grid[row][col] = p ? { ...p, wy, wz } : null
        }
      }

      // Draw horizontal lines far → near
      for (let row = 0; row <= ROWS; row++) {
        const depthAlpha = 0.08 + (row / ROWS) * 0.55
        for (let col = 0; col < COLS; col++) {
          const p1 = grid[row][col]
          const p2 = grid[row][col + 1]
          if (!p1 || !p2) continue
          const avgGy = (p1.wy + p2.wy) / 2
          const heightBoost = Math.max(0, avgGy / (AMP * 1.8))
          const alpha = depthAlpha * (0.45 + heightBoost * 0.55)
          const rgb = lerpColor(avgGy)
          ctx.beginPath()
          ctx.moveTo(p1.sx, p1.sy)
          ctx.lineTo(p2.sx, p2.sy)
          ctx.strokeStyle = `rgba(${rgb},${Math.min(alpha, 0.9)})`
          ctx.lineWidth = 0.7 + heightBoost * 0.6
          ctx.stroke()

          // Glow on high peaks
          if (avgGy > AMP * 0.8 && row > ROWS * 0.3) {
            ctx.shadowColor = '#A3BFFC'
            ctx.shadowBlur = 6
            ctx.stroke()
            ctx.shadowBlur = 0
          }
        }
      }

      // Draw depth lines (col constant, varying row) — subtle grid
      for (let col = 0; col <= COLS; col += 3) {
        for (let row = 0; row < ROWS; row++) {
          const p1 = grid[row][col]
          const p2 = grid[row + 1][col]
          if (!p1 || !p2) continue
          const depthAlpha = 0.04 + (row / ROWS) * 0.14
          ctx.beginPath()
          ctx.moveTo(p1.sx, p1.sy)
          ctx.lineTo(p2.sx, p2.sy)
          ctx.strokeStyle = `rgba(107,143,245,${depthAlpha})`
          ctx.lineWidth = 0.4
          ctx.stroke()
        }
      }

      animId = requestAnimationFrame(draw)
    }
    draw()

    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize) }
  }, [])

  return <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
}
