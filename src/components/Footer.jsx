import { motion } from 'framer-motion'

const cols = [
  {
    head: 'Product',
    links: ['Overview', 'Pricing', 'Changelog', 'Status'],
  },
  {
    head: 'Developers',
    links: ['Documentation', 'API Reference', 'SDKs', 'Open Source'],
  },
  {
    head: 'Company',
    links: ['About', 'Blog', 'Careers', 'Contact'],
  },
  {
    head: 'Legal',
    links: ['Privacy Policy', 'Terms of Service', 'Security', 'Compliance'],
  },
]

export default function Footer() {
  return (
    <footer style={{
      background: '#0C1640',
      borderTop: '1px solid rgba(47,90,240,0.15)',
      padding: 'clamp(56px, 8vw, 96px) clamp(20px, 5vw, 64px) 40px',
    }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        {/* Top row */}
        <div style={{
          display: 'flex', gap: '64px', flexWrap: 'wrap',
          justifyContent: 'space-between', marginBottom: '64px',
        }}>
          {/* Brand */}
          <div style={{ maxWidth: '260px' }}>
            <img
              src="https://sabiggeomedia01.blob.core.windows.net/media/b2982766-96ac-4fb2-a645-2194b432df4a"
              alt="BigGeo"
              style={{ height: '32px', width: 'auto', display: 'block', marginBottom: '16px' }}
            />
            <p style={{
              fontFamily: 'var(--font)', fontWeight: 400, fontSize: '14px',
              color: 'rgba(149,157,188,0.7)', lineHeight: 1.7,
            }}>
              The Spatial Cloud. Manage and access the world's spatial data, any size,
              any slice, delivered in seconds.
            </p>
          </div>

          {/* Link columns */}
          <div style={{ display: 'flex', gap: '48px', flexWrap: 'wrap' }}>
            {cols.map((col) => (
              <div key={col.head}>
                <div style={{
                  fontFamily: 'var(--font)', fontWeight: 600, fontSize: '13px',
                  color: 'rgba(200,213,255,0.9)', letterSpacing: '0.04em',
                  textTransform: 'uppercase', marginBottom: '16px',
                }}>
                  {col.head}
                </div>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {col.links.map((link) => (
                    <li key={link}>
                      <motion.a
                        href="#"
                        whileHover={{ color: '#6B8FF5' }}
                        style={{
                          fontFamily: 'var(--font)', fontWeight: 400, fontSize: '14px',
                          color: 'rgba(149,157,188,0.65)', textDecoration: 'none',
                          transition: 'color 0.2s', display: 'inline-block',
                        }}
                      >
                        {link}
                      </motion.a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: '1px solid rgba(47,90,240,0.12)',
          paddingTop: '28px',
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px',
        }}>
          <span style={{
            fontFamily: 'var(--font)', fontWeight: 400, fontSize: '13px',
            color: 'rgba(149,157,188,0.5)',
          }}>
            © {new Date().getFullYear()} BigGeo, Inc. All rights reserved.
          </span>
          <div style={{ display: 'flex', gap: '24px' }}>
            {['Privacy', 'Terms', 'Security'].map((l) => (
              <motion.a
                key={l}
                href="#"
                whileHover={{ color: '#6B8FF5' }}
                style={{
                  fontFamily: 'var(--font)', fontWeight: 400, fontSize: '13px',
                  color: 'rgba(149,157,188,0.5)', textDecoration: 'none',
                  transition: 'color 0.2s',
                }}
              >
                {l}
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
