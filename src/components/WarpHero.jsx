import { useRef, useEffect } from 'react'

export default function WarpHero() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let W, H, animId

    const resize = () => {
      W = canvas.offsetWidth
      H = canvas.offsetHeight
      canvas.width = W * window.devicePixelRatio
      canvas.height = H * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }
    resize()
    window.addEventListener('resize', resize)

    const COUNT = 280
    const SPEED = 14
    const FL = 0.5  // focal length as fraction of W

    const newStar = () => ({
      x: (Math.random() - 0.5),
      y: (Math.random() - 0.5),
      z: Math.random(),
      pz: 0,
    })

    const stars = Array.from({ length: COUNT }, () => {
      const s = newStar()
      s.pz = s.z
      return s
    })

    const project = (x, y, z) => ({
      sx: W / 2 + (x / z) * W * FL,
      sy: H / 2 + (y / z) * H * FL,
    })

    const draw = () => {
      ctx.fillStyle = 'rgba(18,33,89,0.22)'
      ctx.fillRect(0, 0, W, H)

      stars.forEach(star => {
        star.pz = star.z
        star.z -= SPEED / 1000

        if (star.z <= 0.002) {
          Object.assign(star, newStar())
          star.pz = star.z
          return
        }

        const curr = project(star.x, star.y, star.z)
        if (curr.sx < -50 || curr.sx > W + 50 || curr.sy < -50 || curr.sy > H + 50) {
          Object.assign(star, newStar())
          star.pz = star.z
          return
        }

        const prev = project(star.x, star.y, star.pz)
        const brightness = 1 - star.z
        const alpha = 0.25 + brightness * 0.75

        ctx.beginPath()
        ctx.moveTo(prev.sx, prev.sy)
        ctx.lineTo(curr.sx, curr.sy)
        ctx.strokeStyle = `rgba(163,191,252,${alpha})`
        ctx.lineWidth = 0.4 + brightness * 2
        ctx.stroke()
      })

      animId = requestAnimationFrame(draw)
    }
    draw()

    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize) }
  }, [])

  return <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
}
