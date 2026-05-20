import { useEffect, useRef } from 'react'
import * as THREE from 'three'

/* ============================================================
   Moving mesh gradient. Pure white background, BigGeo blue
   blobs flowing through it via domain-warped fbm noise on a
   full-screen WebGL quad. 60fps, paused when tab hidden,
   honors prefers-reduced-motion.
   ============================================================ */

const VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`

const FRAG = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2 uResolution;

  // Hash + value noise + fbm (Inigo Quilez style)
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    float a = hash(i + vec2(0.0, 0.0));
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
  }
  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    mat2 rot = mat2(0.8, -0.6, 0.6, 0.8);
    for (int i = 0; i < 5; i++) {
      v += a * noise(p);
      p = rot * p * 2.04;
      a *= 0.52;
    }
    return v;
  }

  void main() {
    // ============================================================
    // THE BLOOM — single massive radial light source on white paper.
    // No noise, no flow, no warping. One big precise geometric form
    // that slowly drifts and breathes, plus a smaller off-axis bloom
    // for asymmetry. The Apple/Linear "distant light source" move.
    // ============================================================
    vec2 uv = vUv;
    float aspect = uResolution.x / uResolution.y;
    vec2 st = vec2(uv.x * aspect, uv.y);

    // ---- PRIMARY BLOOM ----------------------------------------------------
    // Massive radial form, ~85% viewport radius. Sweeps a wide path
    // across the canvas on a ~28s cycle so the motion is actually felt.
    float driftPhase = uTime * 0.18;
    vec2 c1 = vec2(
      (0.50 + sin(driftPhase * 1.30) * 0.36) * aspect,
       0.50 + cos(driftPhase * 1.05) * 0.30
    );
    float d1 = length(st - c1);

    // Scale breathing — bloom inhales and exhales every ~13s
    float breath = 1.0 + sin(uTime * 0.12) * 0.10;
    float r1 = 0.85 * breath;

    // Soft radial gradient
    float bloom1 = 1.0 - smoothstep(0.04, r1, d1);

    // Hot core — bright luminous center
    float core1 = pow(1.0 - smoothstep(0.0, 0.18 * breath, d1), 1.8);

    // ---- SECONDARY BLOOM (asymmetry, opposite side of primary) ------------
    // Smaller and fainter — drifts on the LEFT side of the canvas to
    // counterweight the primary, on its own period so they're never synced.
    float p2 = uTime * 0.16;
    vec2 c2 = vec2(
      (0.30 + cos(p2 * 1.40) * 0.28) * aspect,
       0.55 + sin(p2 * 1.65) * 0.28
    );
    float d2 = length(st - c2);
    float bloom2 = 1.0 - smoothstep(0.02, 0.52, d2);
    float core2 = pow(1.0 - smoothstep(0.0, 0.10, d2), 2.0);

    // ---- BRAND PALETTE (no invented hexes) --------------------------------
    vec3 paper     = vec3(1.000);                            // #FFFFFF
    vec3 surface   = vec3(244.0, 246.0, 255.0) / 255.0;      // #F4F6FF
    vec3 companion = vec3(107.0, 143.0, 245.0) / 255.0;      // #6B8FF5
    vec3 brand     = vec3( 47.0,  90.0, 240.0) / 255.0;      // #2F5AF0
    vec3 brandDark = vec3( 28.0,  64.0, 193.0) / 255.0;      // #1C40C1
    vec3 luminous  = vec3(0.985, 0.993, 1.000);

    // ---- COMPOSE (primary bloom first, then secondary on top) -------------
    vec3 col = paper;

    // PRIMARY: paper → surface → companion → brand → brandDark from outer
    // halo to deepest core. Each stop uses smoothstep against the same
    // radial bloom mask so the gradient stays clean and continuous.
    col = mix(col, surface,   smoothstep(0.00, 0.30, bloom1) * 0.90);
    col = mix(col, companion, smoothstep(0.20, 0.70, bloom1) * 0.78);
    col = mix(col, brand,     smoothstep(0.45, 0.88, bloom1) * 0.62);
    col = mix(col, brandDark, smoothstep(0.72, 0.96, bloom1) * 0.35);
    // Hot core — bright luminous near-white at the very center
    col = mix(col, luminous,  core1 * 0.80);

    // SECONDARY: same ladder, weaker contribution
    col = mix(col, companion, smoothstep(0.10, 0.55, bloom2) * 0.45);
    col = mix(col, brand,     smoothstep(0.35, 0.78, bloom2) * 0.35);
    col = mix(col, luminous,  core2 * 0.55);

    gl_FragColor = vec4(col, 1.0);
  }
`

export default function Gradient() {
  const ref = useRef(null)

  useEffect(() => {
    document.title = 'Gradient — BigGeo'
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const container = ref.current
    if (!container) return

    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false, powerPreference: 'high-performance' })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.setClearColor(0xffffff, 1)
    container.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)

    const geometry = new THREE.PlaneGeometry(2, 2)
    const uniforms = {
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(1, 1) },
    }
    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: VERT,
      fragmentShader: FRAG,
    })
    const quad = new THREE.Mesh(geometry, material)
    scene.add(quad)

    const sizeTo = () => {
      const w = container.clientWidth
      const h = container.clientHeight
      renderer.setSize(w, h, false)
      uniforms.uResolution.value.set(w, h)
    }
    sizeTo()
    window.addEventListener('resize', sizeTo)

    const start = performance.now()
    let raf = 0
    const tick = () => {
      uniforms.uTime.value = (performance.now() - start) * 0.001
      renderer.render(scene, camera)
      raf = requestAnimationFrame(tick)
    }

    if (reducedMotion) {
      // Render a single frame and stop.
      uniforms.uTime.value = 0
      renderer.render(scene, camera)
    } else {
      tick()
    }

    const onVis = () => {
      if (document.hidden) {
        if (raf) { cancelAnimationFrame(raf); raf = 0 }
      } else if (!raf && !reducedMotion) {
        tick()
      }
    }
    document.addEventListener('visibilitychange', onVis)

    return () => {
      if (raf) cancelAnimationFrame(raf)
      window.removeEventListener('resize', sizeTo)
      document.removeEventListener('visibilitychange', onVis)
      geometry.dispose()
      material.dispose()
      renderer.dispose()
      if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement)
    }
  }, [])

  return (
    <div
      ref={ref}
      style={{
        position: 'fixed',
        inset: 0,
        background: '#ffffff',
        overflow: 'hidden',
      }}
    />
  )
}
