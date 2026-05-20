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
    vec2 uv = vUv;
    float aspect = uResolution.x / uResolution.y;
    vec2 st = vec2(uv.x * aspect, uv.y);

    // Very slow time base — full loop takes minutes, not seconds.
    float t = uTime * 0.03;

    // Mild domain warp purely to organic-ify edges.
    vec2 q;
    q.x = fbm(st * 0.65 + t);
    q.y = fbm(st * 0.65 + vec2(3.1, 1.7) + t * 0.6);
    float n = fbm(st * 0.65 + q * 0.7);

    // ONE huge soft wash. Drifts on its own slow period; the only
    // moving element on the canvas.
    vec2 c1 = vec2((0.45 + sin(uTime * 0.028) * 0.30) * aspect,
                    0.50 + cos(uTime * 0.022) * 0.22);
    float d1 = length(st - c1);
    float b1 = 1.0 - smoothstep(0.08, 1.05, d1);

    // A second, smaller, fainter wash for asymmetry. Drifts on a
    // different slow period so they never sync up.
    vec2 c2 = vec2((0.72 + cos(uTime * 0.034) * 0.20) * aspect,
                    0.40 + sin(uTime * 0.041) * 0.18);
    float d2 = length(st - c2);
    float b2 = 1.0 - smoothstep(0.10, 0.78, d2);

    // Combine. Lift edges with noise so the blob is never a clean circle.
    float mask = b1 + b2 * 0.45;
    mask = mask * (0.65 + 0.42 * n);
    mask = clamp(mask, 0.0, 1.0);

    // Palette — extreme restraint. Peak is barely-there pale blue.
    vec3 paper = vec3(1.000, 1.000, 1.000);
    vec3 whisper = vec3(0.972, 0.980, 0.998); // #F8FAFE — almost-not-there
    vec3 mist    = vec3(0.932, 0.952, 0.998); // #EEF3FE
    vec3 peak    = vec3(0.860, 0.895, 0.988); // #DBE4FC — pale-blue peak

    vec3 col = paper;
    col = mix(col, whisper, smoothstep(0.00, 0.30, mask));
    col = mix(col, mist,    smoothstep(0.25, 0.62, mask));
    col = mix(col, peak,    smoothstep(0.58, 0.92, mask) * 0.78);

    // No grain. Pristine surface.

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
