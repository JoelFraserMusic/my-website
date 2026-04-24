import { motion } from 'framer-motion'

const cols = [
  {
    head: 'Products',
    links: ['Marketplace', 'DataLab', 'DataScape'],
  },
  {
    head: 'Resources',
    links: ['Blog', 'Support Center', 'Contact Us'],
  },
  {
    head: 'Company',
    links: ['About Us', 'Press & Media', 'Media Kit'],
  },
]

export default function Footer() {
  return (
    <footer style={{
      background: '#ffffff',
      borderTop: '1px solid #EAEAEA',
      padding: 'clamp(48px, 6vw, 80px) clamp(20px, 5vw, 64px) 32px',
      position: 'relative',
      zIndex: 10,
    }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

        {/* Logo row */}
        <div style={{ marginBottom: '48px' }}>
          <img
            src="https://sabiggeomedia01.blob.core.windows.net/media/467c0531-1db4-478f-810e-f2f7bb5253df"
            alt="BigGeo"
            style={{ height: '26px', width: 'auto', display: 'block' }}
          />
        </div>

        {/* Columns */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '32px',
          marginBottom: '48px',
        }}>
          {cols.map((col) => (
            <div key={col.head}>
              <div style={{
                fontFamily: 'var(--font)', fontWeight: 600, fontSize: '11px',
                color: '#1E1E1E', letterSpacing: '0.08em',
                textTransform: 'uppercase', marginBottom: '16px',
              }}>
                {col.head}
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {col.links.map((link) => (
                  <li key={link}>
                    <motion.a
                      href="#"
                      whileHover={{ color: '#2F5AF0' }}
                      style={{
                        fontFamily: 'var(--font)', fontWeight: 400, fontSize: '14px',
                        color: '#666666', textDecoration: 'none',
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

        {/* Bottom bar */}
        <div style={{
          borderTop: '1px solid #EAEAEA',
          paddingTop: '24px',
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px',
        }}>
          <span style={{
            fontFamily: 'var(--font)', fontWeight: 400, fontSize: '13px',
            color: '#999999',
          }}>
            {new Date().getFullYear()} BigGeo Inc. All rights reserved
          </span>
          <div style={{ display: 'flex', gap: '20px' }}>
            {['Investor Rights', 'Privacy Policy'].map((l) => (
              <motion.a
                key={l}
                href="#"
                whileHover={{ color: '#2F5AF0' }}
                style={{
                  fontFamily: 'var(--font)', fontWeight: 400, fontSize: '13px',
                  color: '#999999', textDecoration: 'none',
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
