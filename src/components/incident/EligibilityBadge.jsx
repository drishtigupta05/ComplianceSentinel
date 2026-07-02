import { CheckCircle, AlertCircle, XCircle, Mail, MessageSquare, Globe } from 'lucide-react'

const CONFIG = {
  allowed: {
    bg: '#F0FDFA', border: '#CCFBF1', text: '#0F766E',
    iconBg: '#CCFBF1', icon: CheckCircle, iconColor: '#0D9488', label: 'ALLOWED',
  },
  restricted: {
    bg: '#FFFBEB', border: '#FEF3C7', text: '#D97706',
    iconBg: '#FEF3C7', icon: AlertCircle, iconColor: '#D97706', label: 'RESTRICTED',
  },
  blocked: {
    bg: '#FEF2F2', border: '#FDE2E2', text: '#B91C1C',
    iconBg: '#FDE2E2', icon: XCircle, iconColor: '#B91C1C', label: 'BLOCKED',
  },
}

const CHANNEL_ICONS = { email: Mail, sms: MessageSquare, none: Globe }

export default function EligibilityBadge({ eligibility, compact = false }) {
  if (!eligibility) return null

  const cfg = CONFIG[eligibility.status] || CONFIG.blocked
  const StatusIcon = cfg.icon
  const ChannelIcon = CHANNEL_ICONS[eligibility.channel] || Globe

  if (compact) {
    return (
      <span
        style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          padding: '4px 10px', borderRadius: '4px',
          fontSize: '11px', fontWeight: 700,
          letterSpacing: '0.02em', textTransform: 'uppercase',
          whiteSpace: 'nowrap',
          backgroundColor: cfg.bg,
          color: cfg.text,
          border: `1px solid ${cfg.border}`,
        }}
      >
        <StatusIcon size={12} color={cfg.iconColor} />
        {cfg.label}
      </span>
    )
  }

  return (
    <div
      style={{
        borderRadius: '8px',
        overflow: 'hidden',
        border: `1px solid ${cfg.border}`,
        backgroundColor: cfg.bg,
      }}
    >
      {/* Header */}
      <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
        <div
          style={{
            width: '32px', height: '32px', borderRadius: '50%',
            backgroundColor: cfg.iconBg,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
            marginTop: '2px',
          }}
        >
          <StatusIcon size={16} color={cfg.iconColor} />
        </div>
        <div>
          <p style={{ fontSize: '13px', fontWeight: 700, color: cfg.text, letterSpacing: '0.02em', textTransform: 'uppercase', margin: 0 }}>
            {cfg.label}
          </p>
          <p style={{ fontSize: '12.5px', color: cfg.text, opacity: 0.9, margin: '4px 0 0', lineHeight: 1.5 }}>
            {eligibility.reason}
          </p>
        </div>
      </div>

      {/* Contact details */}
      {eligibility.canContact && (
        <div style={{ padding: '0 20px 16px 20px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <span
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '4px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: 600,
              backgroundColor: 'rgba(255,255,255,0.7)', color: cfg.text, border: `1px solid ${cfg.border}`,
            }}
          >
            <ChannelIcon size={12} /> {eligibility.channel?.toUpperCase()}
          </span>
          <span
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '4px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: 600,
              backgroundColor: 'rgba(255,255,255,0.7)', color: cfg.text, border: `1px solid ${cfg.border}`,
            }}
          >
            <Globe size={12} /> {eligibility.languageLabel}
          </span>
        </div>
      )}
    </div>
  )
}
