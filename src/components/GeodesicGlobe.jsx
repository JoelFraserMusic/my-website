import { useRef, useEffect } from 'react'

// ─── Math ─────────────────────────────────────────────────────────────────────
const norm  = ([x,y,z]) => { const l=Math.sqrt(x*x+y*y+z*z); return [x/l,y/l,z/l] }
const dot   = (a,b) => a[0]*b[0]+a[1]*b[1]+a[2]*b[2]
const cross = (a,b) => [a[1]*b[2]-a[2]*b[1], a[2]*b[0]-a[0]*b[2], a[0]*b[1]-a[1]*b[0]]
const rotY  = ([x,y,z],a) => [ x*Math.cos(a)+z*Math.sin(a), y, -x*Math.sin(a)+z*Math.cos(a)]
const rotX  = ([x,y,z],a) => [ x, y*Math.cos(a)-z*Math.sin(a), y*Math.sin(a)+z*Math.cos(a)]
const LIGHT = norm([0.35, 0.75, 0.55])

// ─── Icosahedron → geodesic sphere ────────────────────────────────────────────
const PHI = (1 + Math.sqrt(5)) / 2
const ICO_V = [
  [-1,PHI,0],[1,PHI,0],[-1,-PHI,0],[1,-PHI,0],
  [0,-1,PHI],[0,1,PHI],[0,-1,-PHI],[0,1,-PHI],
  [PHI,0,-1],[PHI,0,1],[-PHI,0,-1],[-PHI,0,1],
].map(norm)

const ICO_F = [
  [0,11,5],[0,5,1],[0,1,7],[0,7,10],[0,10,11],
  [1,5,9],[5,11,4],[11,10,2],[10,7,6],[7,1,8],
  [3,9,4],[3,4,2],[3,2,6],[3,6,8],[3,8,9],
  [4,9,5],[2,4,11],[6,2,10],[8,6,7],[9,8,1],
]

function buildSphere(level) {
  let v = ICO_V.map(x => [...x]), f = ICO_F.map(x => [...x])
  for (let l = 0; l < level; l++) {
    const cache = {}, nf = []
    const mid = (a,b) => {
      const k = Math.min(a,b)*100000+Math.max(a,b)
      if (cache[k] != null) return cache[k]
      const m = norm([(v[a][0]+v[b][0])/2,(v[a][1]+v[b][1])/2,(v[a][2]+v[b][2])/2])
      cache[k] = v.length; v.push(m); return v.length-1
    }
    f.forEach(([a,b,c]) => {
      const ab=mid(a,b),bc=mid(b,c),ca=mid(c,a)
      nf.push([a,ab,ca],[b,bc,ab],[c,ca,bc],[ab,bc,ca])
    })
    f = nf
  }
  return { v, f }
}

const { v: VERTS, f: FACES } = buildSphere(2) // 320 faces

const CENTROIDS = FACES.map(([a,b,c]) => norm([
  (VERTS[a][0]+VERTS[b][0]+VERTS[c][0])/3,
  (VERTS[a][1]+VERTS[b][1]+VERTS[c][1])/3,
  (VERTS[a][2]+VERTS[b][2]+VERTS[c][2])/3,
]))

// ─── Geographic data hubs ─────────────────────────────────────────────────────
const toVec = (lat,lon) => {
  const a=lat*Math.PI/180, b=lon*Math.PI/180
  return [Math.cos(a)*Math.cos(b), Math.sin(a), Math.cos(a)*Math.sin(b)]
}
const CLUSTERS = [
  toVec(40.7,-74), toVec(51.5,0), toVec(1.3,103.8), toVec(35.7,139.7),
  toVec(-23.5,-46.6), toVec(25.2,55.3), toVec(-33.9,151.2),
  toVec(41.9,-87.6), toVec(19.1,72.9), toVec(6.5,3.4),
]
const ARCS = [
  {from:0,to:1},{from:1,to:2},{from:2,to:3},{from:4,to:0},
  {from:5,to:2},{from:6,to:3},{from:7,to:1},{from:8,to:2},
]

// ─── Orbit rings (fixed in space, globe spins inside them) ────────────────────
const RINGS = [
  { incl: 0.42, asc: 0,    r: 1.30, alpha: 0.13 },
  { incl: 1.18, asc: 1.15, r: 1.40, alpha: 0.09 },
  { incl: 0.72, asc: 2.80, r: 1.35, alpha: 0.10 },
]

// ─── Component ────────────────────────────────────────────────────────────────
// Point-in-triangle test (2D screen space)
function ptInTri(px, py, ax, ay, bx, by, cx, cy) {
  const d1 = (px-bx)*(ay-by)-(ax-bx)*(py-by)
  const d2 = (px-cx)*(by-cy)-(bx-cx)*(py-cy)
  const d3 = (px-ax)*(cy-ay)-(cx-ax)*(py-ay)
  const hasNeg = d1<0 || d2<0 || d3<0
  const hasPos = d1>0 || d2>0 || d3>0
  return !(hasNeg && hasPos)
}

export default function GeodesicGlobe({ zoomMV, highlightMV, tilt = 0.28 }) {
  const canvasRef = useRef(null)
  const mouseRef  = useRef({ x:-9999, y:-9999 })

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let W, H, animId, rotAngle = 0

    const onMouseMove = e => {
      const rect = canvas.getBoundingClientRect()
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
    }
    const onMouseLeave = () => { mouseRef.current = { x:-9999, y:-9999 } }
    canvas.addEventListener('mousemove', onMouseMove)
    canvas.addEventListener('mouseleave', onMouseLeave)

    const resize = () => {
      W = canvas.offsetWidth; H = canvas.offsetHeight
      canvas.width = W*window.devicePixelRatio; canvas.height = H*window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }
    resize()
    window.addEventListener('resize', resize)

    // Cluster lifecycles
    const clusters = CLUSTERS.map((center,i) => ({
      center, life: Math.random(), speed: 0.2+Math.random()*0.28,
      phase: (i/CLUSTERS.length)*Math.PI*2,
    }))

    // Beacons — fixed to geographic points, rotate with the globe
    const BEACON_LOCS = [
      toVec(40.7,-74), toVec(51.5,0), toVec(35.7,139.7),
      toVec(1.3,103.8), toVec(-33.9,151.2), toVec(25.2,55.3),
    ]
    const beacons = BEACON_LOCS.map((pos, i) => ({
      pos,
      ring1: (i / BEACON_LOCS.length),   // staggered phase offset
      ring2: (i / BEACON_LOCS.length) + 0.5,
    }))

    // Arc state
    const arcs = ARCS.map(a => ({ ...a, t: Math.random(), speed: 0.003+Math.random()*0.0025 }))

    // Orbit particles — float in space around globe, NOT tied to globe rotation
    const orbitPts = Array.from({ length: 62 }, () => ({
      phi:   Math.acos(2*Math.random()-1),
      theta: Math.random()*Math.PI*2,
      r:     1.18 + Math.random()*0.68,
      dTheta:(Math.random()-0.5)*0.0028,
      dPhi:  (Math.random()-0.5)*0.0016,
      size:  0.7 + Math.random()*1.7,
      phase: Math.random()*Math.PI*2,
      spd:   0.016 + Math.random()*0.024,
    }))

    const slerp = (a,b,t) => {
      const d=Math.max(-1,Math.min(1,dot(a,b))), theta=Math.acos(d)
      if (theta<1e-6) return [...a]
      const s=Math.sin(theta)
      return [
        (Math.sin((1-t)*theta)*a[0]+Math.sin(t*theta)*b[0])/s,
        (Math.sin((1-t)*theta)*a[1]+Math.sin(t*theta)*b[1])/s,
        (Math.sin((1-t)*theta)*a[2]+Math.sin(t*theta)*b[2])/s,
      ]
    }

    // Globe vertices use full transform (rotation + tilt)
    const xform   = v => rotX(rotY(v, rotAngle), tilt)
    // Orbit elements use camera tilt ONLY — globe spins underneath
    const camTilt = v => rotX(v, tilt)

    const project = (tv, cx, cy, R) => {
      const FOV = 3.6, s = R*FOV/(FOV+1-tv[2])
      return { sx: cx+tv[0]*s, sy: cy-tv[1]*s, depth: tv[2] }
    }

    const draw = () => {
      ctx.clearRect(0, 0, W, H)
      rotAngle += 0.0016 // slower, more cinematic

      const zoom      = zoomMV      ? zoomMV.get()      : 1
      const highlight = highlightMV ? highlightMV.get() : 0.2

      const cx = W/2, cy = H/2
      const R  = Math.min(W,H) * 0.38 * zoom

      // ── 1. Globe body fill ────────────────────────────────────────────────
      const body = ctx.createRadialGradient(cx-R*0.2,cy-R*0.2,R*0.04, cx,cy,R)
      body.addColorStop(0,   'rgba(230,238,255,0.55)')
      body.addColorStop(0.5, 'rgba(218,230,255,0.22)')
      body.addColorStop(1,   'rgba(207,222,255,0.06)')
      ctx.beginPath(); ctx.arc(cx,cy,R,0,Math.PI*2)
      ctx.fillStyle = body; ctx.fill()

      // ── 2. Globe face geometry (clipped to sphere) ────────────────────────
      clusters.forEach(c => { c.life = (c.life+c.speed*0.005)%1 })
      const CLUSTER_R = 0.44
      const faceAct = new Float32Array(FACES.length)
      clusters.forEach(c => {
        const pulse = Math.sin(c.life*Math.PI)
        const intensity = pulse*(0.18+highlight*0.82)
        CENTROIDS.forEach((cen,fi) => {
          const d = Math.acos(Math.max(-1,Math.min(1,dot(cen,c.center))))
          if (d<CLUSTER_R) faceAct[fi] = Math.max(faceAct[fi], intensity*(1-d/CLUSTER_R))
        })
      })

      const tv = VERTS.map(xform)
      const pv = tv.map(v => project(v,cx,cy,R))

      const mx = mouseRef.current.x, my = mouseRef.current.y

      const faceList = FACES.map(([a,b,c],i) => {
        const pa=pv[a],pb=pv[b],pc=pv[c]
        const depth=(pa.depth+pb.depth+pc.depth)/3
        const e1=[tv[b][0]-tv[a][0],tv[b][1]-tv[a][1],tv[b][2]-tv[a][2]]
        const e2=[tv[c][0]-tv[a][0],tv[c][1]-tv[a][1],tv[c][2]-tv[a][2]]
        const n=norm(cross(e1,e2))
        const hovered = n[2] > 0 && ptInTri(mx,my, pa.sx,pa.sy, pb.sx,pb.sy, pc.sx,pc.sy)
        return { depth, facing:n[2], brightness:Math.max(0,dot(n,LIGHT)), pa,pb,pc, act:faceAct[i], hovered }
      })
      faceList.sort((a,b)=>a.depth-b.depth)

      ctx.save()
      ctx.beginPath(); ctx.arc(cx,cy,R,0,Math.PI*2); ctx.clip()

      faceList.forEach(({ facing, brightness, pa,pb,pc, act, hovered }) => {
        if (facing < -0.08) return // cull back faces
        const front = facing > 0
        const activeAct = hovered ? Math.max(act, 0.85) : act

        if (activeAct > 0.04) {
          ctx.beginPath()
          ctx.moveTo(pa.sx,pa.sy); ctx.lineTo(pb.sx,pb.sy); ctx.lineTo(pc.sx,pc.sy)
          ctx.closePath()
          const fillA = activeAct*Math.max(0,facing+0.25)*0.55
          if (activeAct>0.55) { ctx.shadowColor='#2F5AF0'; ctx.shadowBlur=hovered?36:28 }
          ctx.fillStyle = activeAct>0.65
            ? `rgba(47,90,240,${Math.min(fillA*1.4,0.5)})`
            : `rgba(47,90,240,${Math.min(fillA,0.28)})`
          ctx.fill(); ctx.shadowBlur=0
        }

        const baseA  = front ? 0.06+brightness*0.28 : 0.018
        const edgeA  = Math.min(baseA+activeAct*0.58, 0.95)
        const edgeC  = hovered
          ? `rgba(47,90,240,${Math.min(edgeA*2.2,0.95)})`
          : activeAct>0.55
            ? `rgba(47,90,240,${edgeA})`
            : front
              ? `rgba(79,112,242,${edgeA})`
              : `rgba(47,90,240,0.018)`

        if (hovered) { ctx.shadowColor='#2F5AF0'; ctx.shadowBlur=24 }
        else if (activeAct>0.62&&front) { ctx.shadowColor='#2F5AF0'; ctx.shadowBlur=22 }
        ctx.beginPath()
        ctx.moveTo(pa.sx,pa.sy); ctx.lineTo(pb.sx,pb.sy)
        ctx.moveTo(pb.sx,pb.sy); ctx.lineTo(pc.sx,pc.sy)
        ctx.moveTo(pc.sx,pc.sy); ctx.lineTo(pa.sx,pa.sy)
        ctx.strokeStyle = edgeC
        ctx.lineWidth   = hovered ? 1.5 : activeAct>0.55 ? 1.2 : front ? 0.65 : 0.3
        ctx.stroke(); ctx.shadowBlur=0
      })

      ctx.restore() // remove sphere clip

      // ── 3. Orbit rings ────────────────────────────────────────────────────
      RINGS.forEach(({ incl, asc, r, alpha }) => {
        const SEGS=90; let prev=null
        for (let s=0; s<=SEGS; s++) {
          const ang=(s/SEGS)*Math.PI*2
          // Ring point in its own plane, then tilt/rotate
          let pt=[r*Math.cos(ang),0,r*Math.sin(ang)]
          pt=rotX(pt,incl); pt=rotY(pt,asc)
          const tp=camTilt(pt)   // camera tilt only, no globe spin
          const pp=project(tp,cx,cy,R)
          if (prev&&pp.depth>-0.9&&prev.depth>-0.9) {
            const a = alpha*Math.max(0,(pp.depth+prev.depth+2)/4)
            ctx.beginPath()
            ctx.moveTo(prev.sx,prev.sy); ctx.lineTo(pp.sx,pp.sy)
            ctx.strokeStyle=`rgba(79,112,242,${a})`
            ctx.lineWidth=0.5; ctx.stroke()
          }
          prev=pp
        }
      })

      // ── 4. Arc pulses ─────────────────────────────────────────────────────
      arcs.forEach(arc => {
        arc.t=(arc.t+arc.speed)%1
        const fc=CLUSTERS[arc.from], tc=CLUSTERS[arc.to]
        const ARC_S=36; let prev=null
        for (let s=0; s<=ARC_S; s++) {
          const pt=slerp(fc,tc,s/ARC_S)
          const p=project(xform(pt),cx,cy,R)
          if (p.depth>-0.2&&prev&&prev.depth>-0.2) {
            const a=Math.max(0,(p.depth+1)/2)*0.22*(0.4+highlight*0.6)
            ctx.beginPath(); ctx.moveTo(prev.sx,prev.sy); ctx.lineTo(p.sx,p.sy)
            ctx.strokeStyle=`rgba(47,90,240,${a})`; ctx.lineWidth=0.7; ctx.stroke()
          }
          prev=p
        }
        const dp=project(xform(slerp(fc,tc,arc.t)),cx,cy,R)
        if (dp.depth>-0.06) {
          ctx.shadowColor='#2F5AF0'; ctx.shadowBlur=20
          ctx.beginPath(); ctx.arc(dp.sx,dp.sy,2.6,0,Math.PI*2)
          ctx.fillStyle='rgba(47,90,240,0.92)'; ctx.fill(); ctx.shadowBlur=0
        }
      })

      // ── 5. Beacons — rotate with globe, project to screen each frame ─────
      const BEACON_SPEED = 0.0008
      beacons.forEach(b => {
        b.ring1 = (b.ring1 + BEACON_SPEED) % 1
        b.ring2 = (b.ring2 + BEACON_SPEED) % 1

        const tv3 = xform(b.pos)
        if (tv3[2] < 0.05) return  // behind the globe

        const p = project(tv3, cx, cy, R)
        const depth = Math.max(0, (p.depth + 1) / 2)

        // core dot
        ctx.beginPath()
        ctx.arc(p.sx, p.sy, 2.2, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(184,134,78,${0.9 * depth})`
        ctx.shadowColor = '#B8864E'
        ctx.shadowBlur = 10
        ctx.fill()
        ctx.shadowBlur = 0

        // two staggered expanding rings
        ;[b.ring1, b.ring2].forEach(phase => {
          const t = phase % 1
          const maxR = R * 0.09
          const ringR = t * maxR
          const alpha = (1 - t) * 0.55 * depth
          if (alpha < 0.01) return
          ctx.beginPath()
          ctx.arc(p.sx, p.sy, ringR, 0, Math.PI * 2)
          ctx.strokeStyle = `rgba(184,134,78,${alpha})`
          ctx.lineWidth = 1.2
          ctx.stroke()
        })
      })

      // ── 7. Orbit particles ────────────────────────────────────────────────
      orbitPts.forEach(p => {
        p.theta += p.dTheta
        p.phi = Math.max(0.05, Math.min(Math.PI-0.05, p.phi+p.dPhi))
        if (p.phi<=0.05||p.phi>=Math.PI-0.05) p.dPhi*=-1
        p.phase += p.spd
      })

      // Project (camera tilt only)
      const pp3d = orbitPts.map(p => {
        const wp=[p.r*Math.sin(p.phi)*Math.cos(p.theta), p.r*Math.cos(p.phi), p.r*Math.sin(p.phi)*Math.sin(p.theta)]
        return { proj: project(camTilt(wp),cx,cy,R), p }
      })

      // Connections between nearby particles
      const CONN_D = 0.52
      for (let i=0; i<orbitPts.length; i++) {
        for (let j=i+1; j<orbitPts.length; j++) {
          const a=orbitPts[i], b=orbitPts[j]
          const dx=a.r*Math.sin(a.phi)*Math.cos(a.theta)-b.r*Math.sin(b.phi)*Math.cos(b.theta)
          const dy=a.r*Math.cos(a.phi)-b.r*Math.cos(b.phi)
          const dz=a.r*Math.sin(a.phi)*Math.sin(a.theta)-b.r*Math.sin(b.phi)*Math.sin(b.theta)
          const dist=Math.sqrt(dx*dx+dy*dy+dz*dz)
          if (dist<CONN_D) {
            const pa=pp3d[i].proj, pb=pp3d[j].proj
            if (pa.depth>-0.45&&pb.depth>-0.45) {
              const prox=1-dist/CONN_D
              const df=Math.max(0,(pa.depth+pb.depth+2)/4)
              ctx.beginPath(); ctx.moveTo(pa.sx,pa.sy); ctx.lineTo(pb.sx,pb.sy)
              ctx.strokeStyle=`rgba(47,90,240,${prox*df*0.2})`
              ctx.lineWidth=0.5; ctx.stroke()
            }
          }
        }
      }

      // Draw particles
      pp3d.forEach(({ proj, p }) => {
        if (proj.depth<-0.6) return
        const df = Math.max(0,(proj.depth+1)/2)
        const pulsed = p.size*(1+Math.sin(p.phase)*0.28)
        ctx.shadowColor='#2F5AF0'; ctx.shadowBlur=12+pulsed*4
        ctx.beginPath(); ctx.arc(proj.sx,proj.sy,pulsed,0,Math.PI*2)
        ctx.fillStyle=`rgba(47,90,240,${0.28+df*0.58})`
        ctx.fill(); ctx.shadowBlur=0
      })

      animId = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
      canvas.removeEventListener('mousemove', onMouseMove)
      canvas.removeEventListener('mouseleave', onMouseLeave)
    }
  }, [zoomMV, highlightMV, tilt])

  return (
    <canvas ref={canvasRef} style={{ position:'absolute', inset:0, width:'100%', height:'100%', cursor:'crosshair' }} />
  )
}
