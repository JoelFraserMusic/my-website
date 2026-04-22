import { useState, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import DataNetwork from '../components/DataNetwork'

const PORTAL_ID = '45654283'
const FORM_ID = 'b3048e7b-7905-4fde-87d9-3c7744b8b623'

const interestOptions = [
  { value: '', label: 'What are you interested in?' },
  { value: 'Datascape', label: 'Datascape, Spatial exploration' },
  { value: 'Datalab', label: 'Datalab, APIs & developer tools' },
  { value: 'Marketplace', label: 'Marketplace, Data access' },
  { value: 'Enterprise', label: 'Enterprise, Custom deployment' },
  { value: 'Data Provider', label: 'Data Provider, List your data' },
  { value: 'General', label: 'General enquiry' },
]

function Field({ label, id, type = 'text', value, onChange, error, children }) {
  const [focused, setFocused] = useState(false)
  const isActive = focused || value.length > 0

  const baseStyle = {
    width: '100%',
    padding: '20px 16px 8px',
    fontFamily: 'var(--font)',
    fontSize: '15px',
    color: '#1E1E1E',
    background: focused ? '#fff' : '#fafbff',
    border: `1.5px solid ${error ? '#e74c4c' : focused ? '#2F5AF0' : 'rgba(149,157,188,0.28)'}`,
    borderRadius: '10px',
    outline: 'none',
    transition: 'border-color 0.2s, background 0.2s, box-shadow 0.2s',
    boxShadow: focused ? '0 0 0 3px rgba(47,90,240,0.1)' : 'none',
    appearance: 'none',
  }

  return (
    <div style={{ position: 'relative' }}>
      <label
        htmlFor={id}
        style={{
          position: 'absolute',
          left: '16px',
          top: isActive ? '7px' : '50%',
          transform: isActive ? 'none' : 'translateY(-50%)',
          fontSize: isActive ? '11px' : '15px',
          fontFamily: 'var(--font)',
          fontWeight: isActive ? 600 : 400,
          color: focused ? '#2F5AF0' : '#959DBC',
          pointerEvents: 'none',
          transition: 'all 0.18s ease',
          letterSpacing: isActive ? '0.05em' : '0',
          textTransform: isActive ? 'uppercase' : 'none',
          zIndex: 1,
        }}
      >
        {label}
      </label>

      {children ? (
        <select
          id={id}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{ ...baseStyle, cursor: 'pointer', paddingTop: '20px' }}
        >
          {children}
        </select>
      ) : type === 'textarea' ? (
        <textarea
          id={id}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          rows={5}
          style={{ ...baseStyle, resize: 'vertical', minHeight: '120px', paddingTop: '24px' }}
        />
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={baseStyle}
        />
      )}

      {error && (
        <div style={{ fontFamily: 'var(--font)', fontSize: '12px', color: '#e74c4c', marginTop: '5px', paddingLeft: '4px' }}>
          {error}
        </div>
      )}
    </div>
  )
}

const initialForm = { firstName: '', lastName: '', email: '', company: '', interest: '', message: '' }

export default function Contact() {
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | loading | success | error

  const infoRef = useRef(null)
  const infoInView = useInView(infoRef, { once: true, margin: '-60px' })

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const validate = () => {
    const e = {}
    if (!form.firstName.trim()) e.firstName = 'Required'
    if (!form.lastName.trim()) e.lastName = 'Required'
    if (!form.email.trim()) e.email = 'Required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email'
    if (!form.interest) e.interest = 'Please select an option'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
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
      context: {
        pageUri: window.location.href,
        pageName: document.title,
      },
    }

    try {
      const res = await fetch(
        `https://api.hsforms.com/submissions/v3/integration/submit/${PORTAL_ID}/${FORM_ID}`,
        { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }
      )
      if (res.ok) {
        setStatus('success')
      } else {
        const json = await res.json()
        console.error('HubSpot error:', json)
        setStatus('error')
      }
    } catch (err) {
      console.error('HubSpot error:', err)
      setStatus('error')
    }
  }

  return (
    <>
      {/* Hero */}
      <section style={{
        background: '#122159',
        padding: '140px clamp(20px,5vw,64px) 100px',
        position: 'relative', overflow: 'hidden',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: '52vh',
      }}>
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse 65% 60% at 50% 10%, rgba(47,90,240,0.26) 0%, transparent 70%)',
        }} />
        <DataNetwork />

        <div style={{ textAlign: 'center', position: 'relative', zIndex: 1, maxWidth: '640px' }}>
          <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}
            transition={{ duration:0.5, ease:[0.22,1,0.36,1] }}
            style={{
              display:'inline-block', fontFamily:'var(--font)', fontWeight:600,
              fontSize:'12px', letterSpacing:'0.12em', textTransform:'uppercase',
              color:'#6B8FF5', marginBottom:'20px', padding:'6px 14px',
              borderRadius:'100px', border:'1px solid rgba(107,143,245,0.3)',
              background:'rgba(47,90,240,0.1)',
            }}>
            Contact Us
          </motion.div>
          <motion.h1 initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }}
            transition={{ duration:0.65, delay:0.12, ease:[0.22,1,0.36,1] }}
            style={{
              fontFamily:'var(--font)', fontWeight:800,
              fontSize:'clamp(38px,6vw,68px)', color:'#fff',
              lineHeight:1.05, letterSpacing:'-0.03em', marginBottom:'18px',
            }}>
            Let's talk{' '}
            <span style={{
              background:'linear-gradient(135deg,#6B8FF5 0%,#A3BFFC 100%)',
              WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text',
            }}>spatial data.</span>
          </motion.h1>
          <motion.p initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
            transition={{ duration:0.6, delay:0.24, ease:[0.22,1,0.36,1] }}
            style={{
              fontFamily:'var(--font)', fontWeight:400,
              fontSize:'clamp(16px,2vw,19px)',
              color:'rgba(180,198,255,0.78)', lineHeight:1.7,
            }}>
            Whether you're evaluating BigGeo for your team, building on our APIs,
            or want to list data on our Marketplace, we'd like to hear from you.
          </motion.p>
        </div>
      </section>

      {/* Form + info */}
      <section style={{
        background: '#f5f7ff',
        padding: 'clamp(64px,9vw,120px) clamp(20px,5vw,64px)',
      }}>
        <div style={{
          maxWidth: '1100px', margin: '0 auto',
          display: 'flex', gap: '64px', alignItems: 'flex-start', flexWrap: 'wrap',
        }}>

          {/* Left: info column */}
          <div ref={infoRef} style={{ flex: '1', minWidth: '240px', maxWidth: '320px' }}>
            <motion.div initial={{ opacity:0, y:24 }} animate={infoInView?{opacity:1,y:0}:{}}
              transition={{ duration:0.6, ease:[0.22,1,0.36,1] }}>

              <h2 style={{
                fontFamily:'var(--font)', fontWeight:700,
                fontSize:'clamp(22px,2.5vw,30px)', color:'#1E1E1E',
                letterSpacing:'-0.025em', lineHeight:1.2, marginBottom:'16px',
              }}>
                We typically respond within one business day.
              </h2>
              <p style={{
                fontFamily:'var(--font)', fontSize:'15px', color:'#959DBC', lineHeight:1.75,
                marginBottom:'40px',
              }}>
                For urgent technical issues, check our docs or open a support ticket
                directly from your dashboard.
              </p>

              {[
                {
                  icon: (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2F5AF0" strokeWidth="1.8">
                      <path strokeLinecap="round" strokeLinejoin="round"
                        d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                    </svg>
                  ),
                  label: 'Enterprise Sales',
                  detail: 'Custom pricing, SLAs, and private deployments.',
                },
                {
                  icon: (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2F5AF0" strokeWidth="1.8">
                      <path strokeLinecap="round" strokeLinejoin="round"
                        d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" />
                    </svg>
                  ),
                  label: 'Developer Support',
                  detail: 'API questions, integration help, and sandbox access.',
                },
                {
                  icon: (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2F5AF0" strokeWidth="1.8">
                      <path strokeLinecap="round" strokeLinejoin="round"
                        d="M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0l4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0l-5.571 3-5.571-3" />
                    </svg>
                  ),
                  label: 'Data Providers',
                  detail: 'List your spatial datasets on our Marketplace.',
                },
              ].map((item) => (
                <div key={item.label} style={{
                  display:'flex', gap:'14px', alignItems:'flex-start', marginBottom:'24px',
                }}>
                  <div style={{
                    flexShrink:0, width:'38px', height:'38px', borderRadius:'10px',
                    background:'rgba(47,90,240,0.08)', display:'flex',
                    alignItems:'center', justifyContent:'center',
                  }}>
                    {item.icon}
                  </div>
                  <div>
                    <div style={{ fontFamily:'var(--font)', fontWeight:600, fontSize:'14px', color:'#1E1E1E', marginBottom:'3px' }}>{item.label}</div>
                    <div style={{ fontFamily:'var(--font)', fontSize:'13px', color:'#959DBC', lineHeight:1.5 }}>{item.detail}</div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: form card */}
          <motion.div
            initial={{ opacity:0, y:32 }}
            animate={{ opacity:1, y:0 }}
            transition={{ duration:0.7, delay:0.1, ease:[0.22,1,0.36,1] }}
            style={{
              flex:'1.6', minWidth:'300px',
              background:'#fff',
              border:'1px solid rgba(149,157,188,0.16)',
              borderRadius:'20px',
              padding:'clamp(32px,4vw,48px)',
              boxShadow:'0 4px 32px rgba(47,90,240,0.07)',
              position:'relative', overflow:'hidden',
            }}
          >
            {/* Top accent */}
            <div style={{
              position:'absolute', top:0, left:'32px', right:'32px', height:'2px',
              background:'linear-gradient(90deg, transparent, rgba(47,90,240,0.4), transparent)',
              borderRadius:'0 0 4px 4px',
            }} />

            <AnimatePresence mode="wait">
              {status === 'success' ? (
                <motion.div key="success"
                  initial={{ opacity:0, scale:0.94 }}
                  animate={{ opacity:1, scale:1 }}
                  exit={{ opacity:0 }}
                  transition={{ duration:0.45, ease:[0.22,1,0.36,1] }}
                  style={{ textAlign:'center', padding:'48px 0' }}
                >
                  <motion.div
                    initial={{ scale:0 }}
                    animate={{ scale:1 }}
                    transition={{ delay:0.1, type:'spring', stiffness:200, damping:16 }}
                    style={{
                      width:'68px', height:'68px', borderRadius:'50%',
                      background:'rgba(47,90,240,0.1)',
                      border:'1px solid rgba(47,90,240,0.25)',
                      display:'flex', alignItems:'center', justifyContent:'center',
                      margin:'0 auto 24px',
                    }}
                  >
                    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#2F5AF0" strokeWidth="2.2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </motion.div>
                  <h3 style={{
                    fontFamily:'var(--font)', fontWeight:700, fontSize:'26px',
                    color:'#1E1E1E', letterSpacing:'-0.025em', marginBottom:'12px',
                  }}>
                    Message received.
                  </h3>
                  <p style={{ fontFamily:'var(--font)', fontSize:'16px', color:'#959DBC', lineHeight:1.7, maxWidth:'360px', margin:'0 auto' }}>
                    Thanks for reaching out. Someone from our team will be in touch within one business day.
                  </p>
                </motion.div>
              ) : (
                <motion.form key="form" onSubmit={handleSubmit} noValidate
                  initial={{ opacity:1 }} exit={{ opacity:0 }}
                  style={{ display:'flex', flexDirection:'column', gap:'16px' }}
                >
                  <h2 style={{
                    fontFamily:'var(--font)', fontWeight:700, fontSize:'22px',
                    color:'#1E1E1E', letterSpacing:'-0.025em', marginBottom:'4px',
                  }}>
                    Get in touch
                  </h2>
                  <p style={{ fontFamily:'var(--font)', fontSize:'14px', color:'#959DBC', marginBottom:'8px' }}>
                    Fill out the form and we'll route your message to the right person.
                  </p>

                  {/* Name row */}
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
                    <Field label="First name" id="firstName" value={form.firstName} onChange={set('firstName')} error={errors.firstName} />
                    <Field label="Last name" id="lastName" value={form.lastName} onChange={set('lastName')} error={errors.lastName} />
                  </div>

                  <Field label="Work email" id="email" type="email" value={form.email} onChange={set('email')} error={errors.email} />
                  <Field label="Company" id="company" value={form.company} onChange={set('company')} error={errors.company} />

                  {/* Interest select */}
                  <Field label="I'm interested in" id="interest" value={form.interest} onChange={set('interest')} error={errors.interest}>
                    {interestOptions.map((o) => (
                      <option key={o.value} value={o.value} disabled={o.value === ''}>
                        {o.label}
                      </option>
                    ))}
                  </Field>

                  <Field label="Message" id="message" type="textarea" value={form.message} onChange={set('message')} error={errors.message} />

                  {status === 'error' && (
                    <div style={{
                      padding:'12px 16px', borderRadius:'10px',
                      background:'rgba(231,76,60,0.07)', border:'1px solid rgba(231,76,60,0.2)',
                      fontFamily:'var(--font)', fontSize:'14px', color:'#c0392b',
                    }}>
                      Something went wrong. Please try again or email us directly.
                    </div>
                  )}

                  <motion.button
                    type="submit"
                    disabled={status === 'loading'}
                    whileHover={status !== 'loading' ? { scale:1.02, background:'#1C40C1' } : {}}
                    whileTap={status !== 'loading' ? { scale:0.98 } : {}}
                    style={{
                      fontFamily:'var(--font)', fontWeight:600, fontSize:'16px',
                      color:'#fff', background:'#2F5AF0', border:'none',
                      borderRadius:'11px', padding:'16px',
                      cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                      opacity: status === 'loading' ? 0.75 : 1,
                      display:'flex', alignItems:'center', justifyContent:'center', gap:'10px',
                      boxShadow:'0 4px 20px rgba(47,90,240,0.3)',
                      transition:'background 0.2s, opacity 0.2s',
                      marginTop:'4px',
                    }}
                  >
                    {status === 'loading' ? (
                      <>
                        <motion.span
                          animate={{ rotate:360 }}
                          transition={{ duration:0.85, repeat:Infinity, ease:'linear' }}
                          style={{ display:'inline-flex' }}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                          </svg>
                        </motion.span>
                        Sending…
                      </>
                    ) : (
                      'Send Message'
                    )}
                  </motion.button>

                  <p style={{
                    fontFamily:'var(--font)', fontSize:'12px', color:'#959DBC',
                    textAlign:'center', lineHeight:1.5,
                  }}>
                    By submitting you agree to our{' '}
                    <a href="#" style={{ color:'#2F5AF0', textDecoration:'none' }}>Privacy Policy</a>.
                    We never share your information.
                  </p>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>
    </>
  )
}
