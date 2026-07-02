export default function PageWrapper({ children, title, subtitle, actions, noPad = false }) {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#FAFBFD',
        paddingTop: '72px', // Offset for top fixed global Header
      }}
    >
      {/* ── Page header ───────────────────────────────────────── */}
      <header
        style={{
          padding: '24px 48px',
          backgroundColor: '#ffffff',
          borderBottom: '1px solid rgba(10, 25, 47, 0.04)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
        }}
      >
        <div>
          <h1
            style={{
              fontSize: '22px',
              fontWeight: 700,
              color: '#0A192F',
              margin: 0,
              letterSpacing: '-0.02em',
              lineHeight: 1.2,
            }}
          >
            {title}
          </h1>
          {subtitle && (
            <p
              style={{
                fontSize: '13px',
                color: '#64748B',
                marginTop: '4px',
                marginContent: 0,
              }}
            >
              {subtitle}
            </p>
          )}
        </div>
        {actions && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {actions}
          </div>
        )}
      </header>

      {/* ── Content ───────────────────────────────────────────── */}
      <main
        style={{
          flex: 1,
          padding: noPad ? 0 : '40px 48px',
          maxWidth: '1440px',
          width: '100%',
          margin: '0 auto',
        }}
        className="animate-fade-in"
      >
        {children}
      </main>
    </div>
  )
}
