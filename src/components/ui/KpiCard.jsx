const ACCENT = {
  teal:  '#0D9488',
  green: '#0F766E',
  amber: '#D97706',
  red:   '#B91C1C',
  slate: '#64748B',
  blue:  '#2563EB',
}

export default function KpiCard({ label, value, sub, accent = 'teal', icon: Icon }) {
  const color = ACCENT[accent] || ACCENT.slate

  return (
    <div
      className="card-base card-hover"
      style={{ padding: '24px 32px', cursor: 'default' }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
        <p style={{ fontSize: '11px', fontWeight: 600, color: '#94A3B8', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          {label}
        </p>
        {Icon && (
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: `${color}0F`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon size={14} color={color} />
          </div>
        )}
      </div>
      <p
        className="font-mono"
        style={{
          fontSize: '32px',
          fontWeight: 600,
          color: '#0A192F',
          lineHeight: 1,
          marginBottom: '8px',
          letterSpacing: '-0.03em',
        }}
      >
        {value}
      </p>
      {sub && (
        <p style={{ fontSize: '12px', color: '#64748B', margin: 0 }}>
          {sub}
        </p>
      )}
    </div>
  )
}
