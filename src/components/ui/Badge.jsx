const VARIANTS = {
  granted:    { bg: '#F0FDFA', text: '#0F766E', border: '#CCFBF1' },
  allowed:    { bg: '#F0FDFA', text: '#0F766E', border: '#CCFBF1' },
  withdrawn:  { bg: '#FEF2F2', text: '#B91C1C', border: '#FDE2E2' },
  blocked:    { bg: '#FEF2F2', text: '#B91C1C', border: '#FDE2E2' },
  restricted: { bg: '#FFFBEB', text: '#D97706', border: '#FEF3C7' },
  pending:    { bg: '#FFFBEB', text: '#D97706', border: '#FEF3C7' },
  critical:   { bg: '#FEF2F2', text: '#B91C1C', border: '#FDE2E2' },
  high:       { bg: '#FFF7ED', text: '#C2410C', border: '#FFEDD5' },
  medium:     { bg: '#FFFBEB', text: '#D97706', border: '#FEF3C7' },
  mandatory:  { bg: '#EFF6FF', text: '#1E40AF', border: '#DBEAFE' },
  email:      { bg: '#F0F9FF', text: '#0369A1', border: '#E0F2FE' },
  sms:        { bg: '#FAF5FF', text: '#6D28D9', border: '#F3E8FF' },
  none:       { bg: '#FAFBFD', text: '#64748B', border: '#E2E8F0' },
  new:        { bg: '#F0FDFA', text: '#0F766E', border: '#CCFBF1' },
  default:    { bg: '#FAFBFD', text: '#475569', border: '#E2E8F0' },
}

export default function Badge({ variant = 'default', children, size = 'sm', dot = false, className = '' }) {
  const s = VARIANTS[variant] || VARIANTS.default
  const isXs = size === 'xs'

  return (
    <span
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        paddingLeft: isXs ? '6px' : '8px',
        paddingRight: isXs ? '6px' : '8px',
        paddingTop: isXs ? '2px' : '3px',
        paddingBottom: isXs ? '2px' : '3px',
        borderRadius: '4px',
        fontSize: isXs ? '10px' : '11px',
        fontWeight: 600,
        letterSpacing: '0.02em',
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
        backgroundColor: s.bg,
        color: s.text,
        border: `1px solid ${s.border}`,
        lineHeight: 1.1,
      }}
    >
      {dot && (
        <span
          style={{
            width: '5px',
            height: '5px',
            borderRadius: '50%',
            backgroundColor: s.text,
            flexShrink: 0,
          }}
        />
      )}
      {children}
    </span>
  )
}
