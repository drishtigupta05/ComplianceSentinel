import { useState } from 'react'
import { Shield, Mail, Share2, BarChart2, CreditCard, ChevronDown, ChevronUp, Info } from 'lucide-react'
import Toggle from '../ui/Toggle'
import Badge from '../ui/Badge'

const ICONS = { Shield, Mail, Share2, BarChart2, CreditCard }

export default function PurposeCard({ purpose, checked, onChange }) {
  const [expanded, setExpanded] = useState(false)
  const Icon = ICONS[purpose.icon] || Shield

  return (
    <div
      className="card-base"
      style={{
        marginBottom: '12px',
        overflow: 'hidden',
        border: purpose.mandatory
          ? '1px solid rgba(10, 25, 47, 0.08)'
          : checked
          ? '1px solid rgba(13, 148, 136, 0.14)'
          : '1px solid rgba(10, 25, 47, 0.05)',
        transition: 'var(--transition-base)',
      }}
    >
      {/* ── Header ──────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '24px 32px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', flex: 1, minWidth: 0 }}>
          {/* Icon */}
          <div
            style={{
              width: '40px', height: '40px',
              borderRadius: '8px',
              backgroundColor: purpose.mandatory ? 'rgba(10, 25, 47, 0.04)' : checked ? '#F0FDFA' : '#FAFBFD',
              border: '1px solid rgba(10, 25, 47, 0.03)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
              marginTop: '2px',
              transition: 'background-color 0.15s',
            }}
          >
            <Icon size={16} color={purpose.mandatory ? '#0A192F' : checked ? '#0D9488' : '#94A3B8'} />
          </div>

          {/* Text */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '6px' }}>
              <p style={{ fontSize: '15px', fontWeight: 700, color: '#0A192F', margin: 0 }}>
                {purpose.label}
              </p>
              {purpose.mandatory
                ? <Badge variant="mandatory" size="xs">Required</Badge>
                : <Badge variant={checked ? 'granted' : 'withdrawn'} size="xs" dot>
                    {checked ? 'Consented' : 'Withheld'}
                  </Badge>
              }
            </div>
            <p style={{ fontSize: '13.5px', color: '#64748B', margin: 0, lineHeight: 1.6 }}>
              {purpose.description}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', paddingLeft: '24px', flexShrink: 0, marginTop: '2px' }}>
          <Toggle
            id={`toggle-${purpose.key}`}
            checked={checked}
            onChange={onChange}
            disabled={purpose.mandatory}
          />
          <button
            type="button"
            onClick={() => setExpanded(e => !e)}
            style={{
              padding: '6px',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              color: '#94A3B8',
              transition: 'color 0.15s',
              borderRadius: '6px',
              lineHeight: 0,
            }}
            onMouseEnter={e => { e.currentTarget.style.color = '#0A192F' }}
            onMouseLeave={e => { e.currentTarget.style.color = '#94A3B8' }}
          >
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      {/* ── Expanded detail ──────────────────────────────────── */}
      {expanded && (
        <div
          style={{
            padding: '24px 32px',
            borderTop: '1px solid rgba(10, 25, 47, 0.04)',
            backgroundColor: '#FAFBFD',
          }}
          className="animate-fade-in"
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: purpose.withdrawEffect || purpose.mandatory ? '20px' : 0 }}>
            <div>
              <p style={{ fontSize: '11px', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px', marginContent: 0 }}>
                Legal Basis
              </p>
              <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.6, margin: 0 }}>{purpose.legalBasis}</p>
            </div>
            <div>
              <p style={{ fontSize: '11px', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px', marginContent: 0 }}>
                Data Collected
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {purpose.dataCollected.map(d => (
                  <span
                    key={d}
                    style={{
                      fontSize: '11.5px', padding: '3px 8px', borderRadius: '4px',
                      backgroundColor: '#ffffff', color: '#64748B',
                      border: '1px solid rgba(10, 25, 47, 0.05)',
                    }}
                  >
                    {d}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {purpose.withdrawEffect && (
            <div
              style={{
                display: 'flex', gap: '12px', padding: '16px',
                backgroundColor: '#FFFBEB', borderRadius: '8px',
                border: '1px solid #FEF3C7',
              }}
            >
              <Info size={14} color="#D97706" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <p style={{ fontSize: '12.5px', fontWeight: 600, color: '#D97706', margin: '0 0 4px' }}>Withdrawal Impact</p>
                <p style={{ fontSize: '12.5px', color: '#B45309', lineHeight: 1.5, margin: 0 }}>{purpose.withdrawEffect}</p>
              </div>
            </div>
          )}

          {purpose.mandatory && (
            <div
              style={{
                display: 'flex', gap: '12px', padding: '16px',
                backgroundColor: '#EFF6FF', borderRadius: '8px',
                border: '1px solid #DBEAFE',
              }}
            >
              <Shield size={14} color="#1E40AF" style={{ flexShrink: 0, marginTop: '2px' }} />
              <p style={{ fontSize: '12.5px', color: '#1E40AF', lineHeight: 1.5, margin: 0 }}>
                This processing is mandatory for account operation and cannot be disabled. {purpose.regulatoryNote}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
