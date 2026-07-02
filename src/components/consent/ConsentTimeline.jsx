import { formatTimestamp } from '../../utils/formatters'

const PURPOSE_LABELS = {
  essential:        'Essential Services',
  marketing:        'Marketing',
  partner_sharing:  'Partner Sharing',
  analytics:        'Analytics',
  credit_reporting: 'Credit Reporting',
}

export default function ConsentTimeline({ records }) {
  if (!records || records.length === 0) {
    return (
      <div style={{ padding: '32px 0', textAlign: 'center' }}>
        <p style={{ fontSize: '13.5px', color: '#94A3B8' }}>No consent history on file.</p>
      </div>
    )
  }

  const sorted = [...records].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))

  return (
    <div style={{ position: 'relative', paddingLeft: '32px' }}>
      {/* Vertical rail */}
      <div style={{
        position: 'absolute',
        left: '8px', top: '8px', bottom: '8px',
        width: '1px',
        backgroundColor: 'rgba(10, 25, 47, 0.05)',
      }} />

      {sorted.map((rec, idx) => {
        const isGranted = rec.status === 'granted'
        const dotColor = isGranted ? '#0D9488' : '#B91C1C'
        const isFirst = idx === 0

        return (
          <div
            key={rec.id}
            style={{ position: 'relative', marginBottom: idx < sorted.length - 1 ? '24px' : 0 }}
            className="animate-slide-in"
          >
            {/* Timeline dot */}
            <div
              style={{
                position: 'absolute',
                left: '-28px', top: '6px',
                width: '10px', height: '10px',
                borderRadius: '50%',
                backgroundColor: dotColor,
                border: '2px solid #ffffff',
                boxShadow: `0 0 0 2px ${dotColor}24`,
                zIndex: 1,
              }}
            />

            {/* Content */}
            <div>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '6px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <span
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '4px',
                      padding: '2px 8px', borderRadius: '4px',
                      fontSize: '10px', fontWeight: 700,
                      letterSpacing: '0.04em', textTransform: 'uppercase',
                      backgroundColor: isGranted ? '#F0FDFA' : '#FEF2F2',
                      color: isGranted ? '#0F766E' : '#B91C1C',
                      border: `1px solid ${isGranted ? '#CCFBF1' : '#FDE2E2'}`,
                    }}
                  >
                    <span style={{
                      width: '4px', height: '4px', borderRadius: '50%',
                      backgroundColor: dotColor, display: 'inline-block',
                    }} />
                    {rec.status}
                  </span>
                  <span style={{ fontSize: '13.5px', fontWeight: 600, color: '#0A192F' }}>
                    {PURPOSE_LABELS[rec.purpose] || rec.purpose}
                  </span>
                  {isFirst && (
                    <span style={{
                      fontSize: '9.5px', padding: '1px 6px', borderRadius: '4px',
                      backgroundColor: '#F0FDFA', color: '#0F766E',
                      border: '1px solid #CCFBF1', fontWeight: 700,
                      letterSpacing: '0.02em',
                    }}>
                      LATEST
                    </span>
                  )}
                  {!rec.isSeeded && (
                    <span style={{ fontSize: '10px', color: '#0D9488', fontWeight: 700 }}>✦ Live</span>
                  )}
                </div>
                <span className="font-mono" style={{ fontSize: '11.5px', color: '#94A3B8', whiteSpace: 'nowrap', flexShrink: 0 }}>
                  {formatTimestamp(rec.timestamp)}
                </span>
              </div>

              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
                <span className="font-mono" style={{ fontSize: '11px', color: '#94A3B8' }}>{rec.id}</span>
                <span style={{ width: '3px', height: '3px', borderRadius: '50%', backgroundColor: '#CBD5E1' }} />
                <span style={{ fontSize: '12px', color: '#64748B' }}>Notice {rec.noticeVersion}</span>
                <span style={{ width: '3px', height: '3px', borderRadius: '50%', backgroundColor: '#CBD5E1' }} />
                <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>{rec.channel?.toUpperCase()}</span>
              </div>

              {rec.withdrawnReason && (
                <p style={{ fontSize: '12.5px', color: '#B91C1C', marginTop: '6px', fontStyle: 'italic', lineHeight: 1.5, marginBottom: 0 }}>
                  "{rec.withdrawnReason}"
                </p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
