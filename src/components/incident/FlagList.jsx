import { AlertTriangle, AlertCircle } from 'lucide-react'

export default function FlagList({ flags }) {
  if (!flags || flags.length === 0) {
    return (
      <span style={{ fontSize: '12.5px', color: '#0F766E', fontWeight: 600 }}>
        ✓ No compliance flags
      </span>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      {flags.map(flag => {
        const isError = flag.severity === 'error'
        const Icon = isError ? AlertCircle : AlertTriangle
        const color = isError ? '#B91C1C' : '#D97706'
        return (
          <div key={flag.code} style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
            <Icon
              size={12}
              style={{ color, flexShrink: 0, marginTop: '3px' }}
            />
            <span style={{ fontSize: '11.5px', color, lineHeight: '1.4', fontWeight: 500 }}>
              {flag.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}
