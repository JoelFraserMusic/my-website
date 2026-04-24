export default function AnnouncementBanner() {
  return (
    <div style={{
      fontFamily: 'var(--font)',
      background: '#122159',
      position: 'relative',
      overflow: 'hidden',
      zIndex: 1,
    }}>
      {/* Central radial glow */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 60% 120% at 50% 50%, rgba(47,90,240,0.35) 0%, transparent 70%)',
      }} />

      {/* Slow shimmer sweep */}
      <div style={{
        position: 'absolute', top: 0, bottom: 0, width: 300, pointerEvents: 'none',
        background: 'linear-gradient(105deg, transparent 0%, rgba(107,143,245,0.08) 40%, rgba(107,143,245,0.15) 50%, rgba(107,143,245,0.08) 60%, transparent 100%)',
        animation: 'bgeo-shimmer 6s cubic-bezier(0.4,0,0.6,1) infinite',
      }} />

      {/* Bottom edge glow line */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 1,
        background: 'linear-gradient(90deg, transparent, rgba(47,90,240,0.6) 30%, rgba(107,143,245,0.9) 50%, rgba(47,90,240,0.6) 70%, transparent)',
      }} />

      <div style={{
        position: 'relative', zIndex: 2,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: '20px', padding: '16px 48px', flexWrap: 'wrap',
      }}>

        {/* Live badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '7px',
          background: 'rgba(47,90,240,0.25)',
          border: '1px solid rgba(107,143,245,0.4)',
          borderRadius: '999px', padding: '5px 12px 5px 8px',
          flexShrink: 0,
        }}>
          <span style={{ position: 'relative', width: 8, height: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{
              width: 7, height: 7, borderRadius: '50%', background: '#fff',
              boxShadow: '0 0 6px rgba(255,255,255,0.8)',
              display: 'block',
              animation: 'bgeo-pulse 2s ease-in-out infinite',
            }} />
            <span style={{
              position: 'absolute', inset: -3, borderRadius: '50%',
              border: '1px solid rgba(255,255,255,0.35)',
              animation: 'bgeo-ring 2s ease-out infinite',
            }} />
          </span>
          <span style={{
            fontSize: 11, fontWeight: 700, letterSpacing: '0.1em',
            textTransform: 'uppercase', color: 'rgba(180,198,255,0.9)', lineHeight: 1,
          }}>Now Live</span>
        </div>

        {/* Text */}
        <p style={{ margin: 0, fontSize: 14, fontWeight: 500, color: 'rgba(220,230,255,0.92)', letterSpacing: '-0.01em', lineHeight: 1 }}>
          <span style={{ color: '#fff', fontWeight: 700 }}>BigGeo AI</span>
          {' '}is now available in ChatGPT via MCP —{' '}
          <span style={{ color: 'rgba(180,198,255,0.75)' }}>ask any location question, get a governed answer in seconds.</span>
        </p>

        {/* CTA */}
        <a
          href="https://chatgpt.com/apps/biggeo-ai/asdk_app_69b2ece221cc8191b9e7c3e49ab0adf9"
          target="_blank" rel="noopener noreferrer"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0,
            fontSize: 13, fontWeight: 600, color: '#fff',
            background: 'rgba(255,255,255,0.12)',
            border: '1px solid rgba(255,255,255,0.25)',
            borderRadius: 8, padding: '8px 16px',
            backdropFilter: 'blur(8px)',
            transition: 'background 0.2s, border-color 0.2s, transform 0.2s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.2)'
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.45)'
            e.currentTarget.style.transform = 'translateY(-1px)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.12)'
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'
            e.currentTarget.style.transform = 'translateY(0)'
          }}
        >
          Try BigGeo AI
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"/>
            <polyline points="12 5 19 12 12 19"/>
          </svg>
        </a>

      </div>

      <style>{`
        @keyframes bgeo-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.6; transform: scale(0.8); }
        }
        @keyframes bgeo-ring {
          0%   { transform: scale(0.7); opacity: 0.8; }
          100% { transform: scale(1.8); opacity: 0; }
        }
        @keyframes bgeo-shimmer {
          0%   { transform: translateX(-320px); }
          100% { transform: translateX(calc(100vw + 320px)); }
        }
      `}</style>
    </div>
  )
}
