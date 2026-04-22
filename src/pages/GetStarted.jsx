import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import DataNetwork from '../components/DataNetwork'

const PORTAL_ID = '45654283'
const FORM_ID = 'b3048e7b-7905-4fde-87d9-3c7744b8b623'

const interestOptions = [
  { value: '', label: 'Select an option', disabled: true },
  { value: 'Browse the Marketplace', label: 'Browse the Marketplace' },
  { value: 'Activate my own spatial data', label: 'Activate my own spatial data' },
  { value: 'Monetize data as a provider', label: 'Monetize data as a provider' },
  { value: 'See a platform demo', label: 'See a platform demo' },
  { value: 'Understand pricing & plans', label: 'Understand pricing & plans' },
  { value: 'Something else', label: 'Something else' },
]

const valueProps = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: 'A walkthrough tailored to your use case',
    desc: "Whether you're managing fleet routes, assessing climate risk, or analyzing foot traffic, we'll map BigGeo to the decisions you actually need to make.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0l4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0l-5.571 3-5.571-3" />
      </svg>
    ),
    title: 'Access to our Marketplace datasets',
    desc: 'Explore satellite imagery, mobility data, weather, demographics, and more, all queryable, governed, and ready to activate from one platform.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: 'Transparent pricing, no surprises',
    desc: "We'll walk you through plans and credits so you know exactly what it costs before you commit. No six-month procurement cycles.",
  },
]

// ── Shared input style ────────────────────────────────────────────────────────

function Field({ label, id, type = 'text', value, onChange, placeholder, children }) {
  const [focused, setFocused] = useState(false)

  const inputStyle = {
    width: '100%',
    padding: '11px 14px',
    fontFamily: 'var(--font)',
    fontSize: '14px',
    color: '#1E1E1E',
    background: focused ? '#fff' : '#fafbff',
    border: `1.5px solid ${focused ? '#2F5AF0' : 'rgba(149,157,188,0.3)'}`,
    borderRadius: '9px',
    outline: 'none',
    boxShadow: focused ? '0 0 0 3px rgba(47,90,240,0.1)' : 'none',
    transition: 'border-color 0.18s, box-shadow 0.18s, background 0.18s',
    appearance: 'none',
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label htmlFor={id} style={{
        fontFamily: 'var(--font)', fontWeight: 500, fontSize: '13px',
        color: '#4A5168', letterSpacing: '0.01em',
      }}>
        {label}
      </label>
      {children ? (
        <select
          id={id} value={value} onChange={onChange}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={{ ...inputStyle, cursor: 'pointer' }}
        >
          {children}
        </select>
      ) : type === 'textarea' ? (
        <textarea
          id={id} value={value} onChange={onChange} placeholder={placeholder}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          rows={4}
          style={{ ...inputStyle, resize: 'vertical', minHeight: '100px' }}
        />
      ) : (
        <input
          id={id} type={type} value={value} onChange={onChange} placeholder={placeholder}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={inputStyle}
        />
      )}
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────

const initialForm = { firstName: '', lastName: '', email: '', company: '', interest: '', message: '' }

export default function GetStarted() {
  const [form, setForm] = useState(initialForm)
  const [status, setStatus] = useState('idle') // idle | loading | success | error

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('loading')

    const data = {
      fields: [
        { name: 'firstname', value: form.firstName },
        { name: 'lastname', value: form.lastName },
        { name: 'email', value: form.email },
        { name: 'company', value: form.company },
        { name: 'interest', value: form.interest },
        { name: 'message', value: form.message },
      ],
      context: { pageUri: window.location.href, pageName: document.title },
    }

    try {
      const res = await fetch(
        `https://api.hsforms.com/submissions/v3/integration/submit/${PORTAL_ID}/${FORM_ID}`,
        { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }
      )
      setStatus(res.ok ? 'success' : 'error')
      if (!res.ok) console.error('HubSpot error:', await res.json())
    } catch (err) {
      console.error('HubSpot error:', err)
      setStatus('error')
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#122159',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Animated background */}
      <DataNetwork />

      {/* Radial glow */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
        background: 'radial-gradient(ellipse 80% 60% at 30% 20%, rgba(47,90,240,0.22) 0%, transparent 65%)',
      }} />

      {/* ── Nav ── */}
      <motion.nav
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: 'relative', zIndex: 10,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '24px clamp(24px, 5vw, 64px)',
        }}
      >
        <Link to="/">
          <img
            src="https://sabiggeomedia01.blob.core.windows.net/media/b2982766-96ac-4fb2-a645-2194b432df4a"
            alt="BigGeo"
            style={{ height: '32px', width: 'auto', display: 'block' }}
          />
        </Link>
        <motion.a
          href="https://biggeo.com/"
          target="_blank"
          rel="noreferrer"
          whileHover={{ color: '#fff' }}
          style={{
            fontFamily: 'var(--font)', fontWeight: 500, fontSize: '14px',
            color: 'rgba(163,191,252,0.7)', textDecoration: 'none',
            transition: 'color 0.2s',
          }}
        >
          biggeo.com →
        </motion.a>
      </motion.nav>

      {/* ── Main content ── */}
      <div style={{
        position: 'relative', zIndex: 1, flex: 1,
        padding: 'clamp(40px,6vw,80px) clamp(24px,5vw,64px) clamp(40px,6vw,80px)',
        maxWidth: '1200px', margin: '0 auto', width: '100%',
        display: 'flex', flexDirection: 'column', gap: '56px',
      }}>

        {/* ── Hero text ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          style={{ maxWidth: '640px' }}
        >
          <div style={{
            fontFamily: 'var(--font)', fontWeight: 600, fontSize: '12px',
            letterSpacing: '0.12em', textTransform: 'uppercase',
            color: '#6B8FF5', marginBottom: '18px',
          }}>
            The Spatial Cloud
          </div>
          <h1 style={{
            fontFamily: 'var(--font)', fontWeight: 800,
            fontSize: 'clamp(32px, 5vw, 56px)',
            color: '#fff', lineHeight: 1.1, letterSpacing: '-0.03em',
            marginBottom: '18px',
          }}>
            Manage and access the world's spatial data,{' '}
            <span style={{
              background: 'linear-gradient(135deg, #6B8FF5 0%, #A3BFFC 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>
              delivered in seconds.
            </span>
          </h1>
          <p style={{
            fontFamily: 'var(--font)', fontWeight: 400,
            fontSize: 'clamp(15px, 1.8vw, 18px)',
            color: 'rgba(180,198,255,0.75)', lineHeight: 1.7,
          }}>
            Any size, any slice, any insight. Tell us what you're working on and we'll show you how BigGeo fits.
          </p>
        </motion.div>

        {/* ── Two-column grid ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '40px',
          alignItems: 'start',
        }}>

          {/* Left: value props */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}
          >
            <h2 style={{
              fontFamily: 'var(--font)', fontWeight: 700,
              fontSize: 'clamp(18px, 2.2vw, 22px)',
              color: 'rgba(200,213,255,0.9)', lineHeight: 1.3,
              letterSpacing: '-0.02em',
            }}>
              What you can expect from a conversation with us
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {valueProps.map((p) => (
                <div key={p.title} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <div style={{
                    flexShrink: 0, width: '38px', height: '38px',
                    borderRadius: '10px',
                    background: 'rgba(47,90,240,0.18)',
                    border: '1px solid rgba(107,143,245,0.25)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#6B8FF5', marginTop: '2px',
                  }}>
                    {p.icon}
                  </div>
                  <div>
                    <h3 style={{
                      fontFamily: 'var(--font)', fontWeight: 600, fontSize: '15px',
                      color: '#fff', marginBottom: '6px', letterSpacing: '-0.01em',
                    }}>
                      {p.title}
                    </h3>
                    <p style={{
                      fontFamily: 'var(--font)', fontWeight: 400, fontSize: '14px',
                      color: 'rgba(149,157,188,0.8)', lineHeight: 1.7,
                    }}>
                      {p.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Trust line */}
            <div style={{
              padding: '18px 20px',
              background: 'rgba(47,90,240,0.1)',
              border: '1px solid rgba(107,143,245,0.2)',
              borderRadius: '12px',
            }}>
              <p style={{
                fontFamily: 'var(--font)', fontSize: '13px',
                color: 'rgba(180,198,255,0.8)', lineHeight: 1.7,
              }}>
                <strong style={{ color: 'rgba(200,213,255,0.95)', fontWeight: 600 }}>
                  Already trusted by teams in insurance, logistics, energy, and real estate.
                </strong>{' '}
                Organizations that need spatial intelligence without the overhead of traditional GIS infrastructure.
              </p>
            </div>
          </motion.div>

          {/* Right: form card */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{
              background: '#fff',
              borderRadius: '20px',
              padding: 'clamp(28px, 4vw, 40px)',
              boxShadow: '0 24px 80px rgba(0,0,0,0.35), 0 4px 24px rgba(47,90,240,0.15)',
              position: 'relative', overflow: 'hidden',
            }}
          >
            {/* Top accent line */}
            <div style={{
              position: 'absolute', top: 0, left: '28px', right: '28px', height: '2px',
              background: 'linear-gradient(90deg, transparent, #2F5AF0, transparent)',
              borderRadius: '0 0 4px 4px',
            }} />

            <AnimatePresence mode="wait">
              {status === 'success' ? (
                <motion.div key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  style={{ textAlign: 'center', padding: '40px 0' }}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1, type: 'spring', stiffness: 200, damping: 16 }}
                    style={{
                      width: '64px', height: '64px', borderRadius: '50%',
                      background: 'rgba(47,90,240,0.1)',
                      border: '1px solid rgba(47,90,240,0.25)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      margin: '0 auto 20px',
                    }}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="#2F5AF0" strokeWidth="2.5" width="28" height="28">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </motion.div>
                  <h3 style={{
                    fontFamily: 'var(--font)', fontWeight: 700, fontSize: '22px',
                    color: '#1E1E1E', letterSpacing: '-0.025em', marginBottom: '12px',
                  }}>
                    We've got your request.
                  </h3>
                  <p style={{
                    fontFamily: 'var(--font)', fontSize: '15px',
                    color: '#959DBC', lineHeight: 1.7, maxWidth: '320px', margin: '0 auto',
                  }}>
                    A member of the BigGeo team will reach out within one business day. In the meantime, explore{' '}
                    <a href="https://biggeo.com/" target="_blank" rel="noreferrer"
                      style={{ color: '#2F5AF0', textDecoration: 'none' }}>biggeo.com</a>{' '}
                    to learn more about the platform.
                  </p>
                </motion.div>
              ) : (
                <motion.div key="form" initial={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <h2 style={{
                    fontFamily: 'var(--font)', fontWeight: 700, fontSize: '20px',
                    color: '#1E1E1E', letterSpacing: '-0.025em', marginBottom: '6px',
                  }}>
                    Get in touch
                  </h2>
                  <p style={{
                    fontFamily: 'var(--font)', fontSize: '14px',
                    color: '#959DBC', marginBottom: '24px', lineHeight: 1.6,
                  }}>
                    Fill out the form and our team will follow up within one business day.
                  </p>

                  <form onSubmit={handleSubmit} noValidate
                    style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}
                  >
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <Field label="First name" id="firstName" value={form.firstName}
                        onChange={set('firstName')} placeholder="Jane" />
                      <Field label="Last name" id="lastName" value={form.lastName}
                        onChange={set('lastName')} placeholder="Smith" />
                    </div>

                    <Field label="Work email" id="email" type="email" value={form.email}
                      onChange={set('email')} placeholder="jane@company.com" />

                    <Field label="Company" id="company" value={form.company}
                      onChange={set('company')} placeholder="Acme Corp" />

                    <Field label="What are you looking for?" id="interest"
                      value={form.interest} onChange={set('interest')}>
                      {interestOptions.map((o) => (
                        <option key={o.value} value={o.value} disabled={o.disabled}>{o.label}</option>
                      ))}
                    </Field>

                    <Field label="Anything else we should know?" id="message" type="textarea"
                      value={form.message} onChange={set('message')}
                      placeholder="Tell us about your use case, data needs, or any questions..." />

                    {status === 'error' && (
                      <div style={{
                        padding: '11px 14px', borderRadius: '9px',
                        background: 'rgba(231,76,60,0.07)', border: '1px solid rgba(231,76,60,0.22)',
                        fontFamily: 'var(--font)', fontSize: '13px', color: '#c0392b',
                      }}>
                        Something went wrong. Please try again.
                      </div>
                    )}

                    <motion.button
                      type="submit"
                      disabled={status === 'loading'}
                      whileHover={status !== 'loading' ? { scale: 1.02, background: '#1C40C1' } : {}}
                      whileTap={status !== 'loading' ? { scale: 0.98 } : {}}
                      style={{
                        fontFamily: 'var(--font)', fontWeight: 600, fontSize: '15px',
                        color: '#fff', background: '#2F5AF0', border: 'none',
                        borderRadius: '10px', padding: '14px',
                        cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                        opacity: status === 'loading' ? 0.7 : 1,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                        boxShadow: '0 4px 20px rgba(47,90,240,0.3)',
                        transition: 'background 0.2s, opacity 0.2s',
                        marginTop: '4px',
                      }}
                    >
                      {status === 'loading' ? (
                        <>
                          <motion.span animate={{ rotate: 360 }}
                            transition={{ duration: 0.85, repeat: Infinity, ease: 'linear' }}
                            style={{ display: 'inline-flex' }}>
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                            </svg>
                          </motion.span>
                          Sending…
                        </>
                      ) : 'Request Information'}
                    </motion.button>
                  </form>

                  <p style={{
                    fontFamily: 'var(--font)', fontSize: '12px', color: '#C0C6D8',
                    textAlign: 'center', marginTop: '14px', lineHeight: 1.5,
                  }}>
                    We'll never share your information. Read our{' '}
                    <a href="https://biggeo.com/privacy" target="_blank" rel="noreferrer"
                      style={{ color: '#2F5AF0', textDecoration: 'none' }}>privacy policy</a>.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

        </div>
      </div>

      {/* ── Footer ── */}
      <div style={{
        position: 'relative', zIndex: 1,
        padding: '24px clamp(24px, 5vw, 64px)',
        borderTop: '1px solid rgba(47,90,240,0.15)',
        fontFamily: 'var(--font)', fontSize: '13px',
        color: 'rgba(149,157,188,0.45)',
        textAlign: 'center',
      }}>
        © {new Date().getFullYear()} BigGeo, Inc. · The Spatial Cloud
      </div>
    </div>
  )
}
