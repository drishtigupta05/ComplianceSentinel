import { useState, useMemo } from 'react'
import { CheckCircle, Send, FileText, User } from 'lucide-react'
import PageWrapper from '../components/layout/PageWrapper'
import PurposeCard from '../components/consent/PurposeCard'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import MonoText from '../components/ui/MonoText'
import { useConsent } from '../context/ConsentContext'
import { DATA_PRINCIPAL_USER } from '../data/users'
import { getEffectiveConsents } from '../utils/recordHelpers'
import { formatTimestamp, getInitials } from '../utils/formatters'

const CHANNEL_OPTIONS = [
  { value: 'email', label: 'Email', desc: 'Receive notifications via email' },
  { value: 'sms',   label: 'SMS',   desc: 'Receive via text message' },
]

const LANGUAGE_OPTIONS = [
  { value: 'en', label: 'English'    },
  { value: 'hi', label: 'Hindi'      },
  { value: 'ta', label: 'Tamil'      },
  { value: 'te', label: 'Telugu'     },
  { value: 'ml', label: 'Malayalam'  },
  { value: 'bn', label: 'Bengali'    },
  { value: 'gu', label: 'Gujarati'   },
  { value: 'kn', label: 'Kannada'    },
  { value: 'pa', label: 'Punjabi'    },
  { value: 'ur', label: 'Urdu'       },
  { value: 'mr', label: 'Marathi'    },
]

export default function ConsentCapture() {
  const { state, dispatch } = useConsent()
  const { purposes, consentRecords } = state
  const user = DATA_PRINCIPAL_USER

  const effective = useMemo(
    () => getEffectiveConsents(user.id, consentRecords, purposes),
    [user.id, consentRecords, purposes]
  )

  const [grants, setGrants] = useState(() => {
    const init = {}
    for (const p of purposes) {
      init[p.key] = p.mandatory ? true : effective[p.key]?.status === 'granted' || false
    }
    return init
  })

  const [channel, setChannel] = useState(user.preferredChannel === 'none' ? 'email' : user.preferredChannel)
  const [language, setLanguage] = useState(user.preferredLanguage)
  const [submitted, setSubmitted] = useState(false)
  const [submittedAt, setSubmittedAt] = useState(null)

  function handleSubmit(e) {
    e.preventDefault()
    const ts = new Date().toISOString()
    dispatch({ type: 'SUBMIT_CONSENT', payload: { userId: user.id, grants, channel, language } })
    setSubmittedAt(ts)
    setSubmitted(true)
  }

  const newRecords = useMemo(() => {
    if (!submitted || !submittedAt) return []
    return consentRecords.filter(
      r => r.userId === user.id && !r.isSeeded && new Date(r.timestamp) >= new Date(submittedAt) - 5000
    )
  }, [consentRecords, submitted, submittedAt, user.id])

  const grantedCount = Object.values(grants).filter(Boolean).length

  return (
    <PageWrapper
      title="Consent Capture"
      subtitle="DPDPA 2023 — Data Principal preference management"
      actions={
        <>
          <Badge variant="mandatory" size="xs">Notice v2.0</Badge>
          <Badge variant="default" size="xs">DPDPA §6</Badge>
        </>
      }
    >
      <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
        
        {/* ── Identity Banner ───────────────────────────────────── */}
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div
                style={{
                  width: '48px', height: '48px',
                  borderRadius: '50%',
                  backgroundColor: '#FAFBFD',
                  border: '1px solid rgba(10, 25, 47, 0.08)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '15px', fontWeight: 700, color: '#0A192F', flexShrink: 0,
                }}
              >
                {getInitials(user.name)}
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                  <p style={{ fontSize: '16px', fontWeight: 700, color: '#0A192F', margin: 0 }}>{user.name}</p>
                  <Badge variant="mandatory" size="xs">
                    <User size={10} style={{ display: 'inline', marginRight: '3px' }} />
                    Data Principal
                  </Badge>
                </div>
                <p style={{ fontSize: '13px', color: '#64748B', margin: 0 }}>
                  {user.email} · {user.phone}
                </p>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: '10.5px', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px', marginContent: 0 }}>User ID</p>
              <MonoText size="12px" color="#475569">{user.id}</MonoText>
            </div>
          </div>
        </Card>

        {/* ── Success Banner ────────────────────────────────────── */}
        {submitted && (
          <div
            className="animate-fade-in"
            style={{
              borderRadius: '12px',
              padding: '24px',
              backgroundColor: '#F0FDFA',
              border: '1px solid #CCFBF1',
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: '16px',
            }}
          >
            <div style={{ display: 'flex', gap: '12px', flex: 1 }}>
              <CheckCircle size={20} color="#0D9488" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <p style={{ fontSize: '14.5px', fontWeight: 600, color: '#0F766E', margin: '0 0 12px' }}>
                  {newRecords.length} consent record{newRecords.length !== 1 ? 's' : ''} written to the immutable ledger
                </p>
                {newRecords.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {newRecords.map(r => (
                      <div
                        key={r.id}
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: '8px',
                          padding: '6px 12px', borderRadius: '6px',
                          backgroundColor: '#ffffff',
                          border: '1px solid rgba(13, 148, 136, 0.12)',
                          alignSelf: 'flex-start'
                        }}
                      >
                        <FileText size={12} color="#0D9488" />
                        <MonoText size="11px" color="#0F766E">{r.id}</MonoText>
                        <span style={{ fontSize: '12px', color: '#475569' }}>{r.purpose} · {r.status}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSubmitted(false)}
              style={{ fontSize: '13px', color: '#0F766E', background: 'none', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap', textDecoration: 'underline', fontWeight: 500 }}
            >
              Edit again
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {/* ── Processing purposes ─────────────────────────────── */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '14px', fontWeight: 700, color: '#0A192F', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>
                Processing Purposes
              </h2>
              <p style={{ fontSize: '13px', color: '#64748B', margin: 0 }}>
                {grantedCount} of {purposes.length} active
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {purposes.map(p => (
                <PurposeCard
                  key={p.key}
                  purpose={p}
                  checked={grants[p.key]}
                  onChange={val => setGrants(prev => ({ ...prev, [p.key]: val }))}
                />
              ))}
            </div>
          </div>

          {/* ── Preferences ─────────────────────────────────────── */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', flexWrap: 'wrap' }}>
            {/* Channel */}
            <Card>
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#0A192F', marginBottom: '16px', marginTop: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Notification Channel
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {CHANNEL_OPTIONS.map(opt => {
                  const isSelected = channel === opt.value
                  return (
                    <label
                      key={opt.value}
                      htmlFor={`channel-${opt.value}`}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '12px',
                        padding: '16px', borderRadius: '8px',
                        border: `1px solid ${isSelected ? '#0A192F' : 'rgba(10, 25, 47, 0.05)'}`,
                        backgroundColor: isSelected ? '#FAFBFD' : '#ffffff',
                        cursor: 'pointer',
                        transition: 'var(--transition-fast)',
                      }}
                      onMouseEnter={e => {
                        if (!isSelected) e.currentTarget.style.borderColor = 'rgba(10, 25, 47, 0.12)'
                      }}
                      onMouseLeave={e => {
                        if (!isSelected) e.currentTarget.style.borderColor = 'rgba(10, 25, 47, 0.05)'
                      }}
                    >
                      <input
                        id={`channel-${opt.value}`}
                        type="radio"
                        name="channel"
                        value={opt.value}
                        checked={isSelected}
                        onChange={() => setChannel(opt.value)}
                        style={{ accentColor: '#0A192F', flexShrink: 0 }}
                      />
                      <div>
                        <p style={{ fontSize: '13.5px', fontWeight: 600, color: '#0A192F', margin: 0 }}>{opt.label}</p>
                        <p style={{ fontSize: '12px', color: '#64748B', margin: '2px 0 0', lineHeight: 1.4 }}>{opt.desc}</p>
                      </div>
                      {isSelected && (
                        <Badge variant="granted" size="xs" style={{ marginLeft: 'auto' }}>Active</Badge>
                      )}
                    </label>
                  )
                })}
              </div>
            </Card>

            {/* Language */}
            <Card>
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#0A192F', marginBottom: '16px', marginTop: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Notification Language
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <select
                  id="language-select"
                  value={language}
                  onChange={e => setLanguage(e.target.value)}
                  className="input-base"
                  style={{ width: '100%' }}
                >
                  {LANGUAGE_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <p style={{ fontSize: '12.5px', color: '#64748B', margin: 0, lineHeight: 1.6 }}>
                  Regulatory communications will be delivered in your selected language where available under DPDPA Schedule II.
                </p>
              </div>
            </Card>
          </div>

          {/* ── Legal notice ──────────────────────────────────────── */}
          <div
            style={{
              padding: '20px 24px', borderRadius: '8px',
              backgroundColor: 'rgba(10, 25, 47, 0.02)',
              border: '1px solid rgba(10, 25, 47, 0.04)',
            }}
          >
            <p style={{ fontSize: '12.5px', color: '#64748B', margin: 0, lineHeight: 1.7 }}>
              <span style={{ fontWeight: 600, color: '#334155' }}>Notice v2.0 · {formatTimestamp(new Date().toISOString())} IST — </span>
              By saving your preferences, your choices are recorded as immutable entries in the Compliance Sentinel consent ledger under the Digital Personal Data Protection Act 2023. Updates create new auditable records. Essential Account Services are mandatory and cannot be disabled.
            </p>
          </div>

          {/* ── Submit ────────────────────────────────────────────── */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(10, 25, 47, 0.05)', paddingTop: '24px', flexWrap: 'wrap', gap: '16px' }}>
            <p style={{ fontSize: '12px', color: '#94A3B8', margin: 0 }}>
              Append-only · Tamper-evident · WORM ledger
            </p>
            <button
              id="save-consent-btn"
              type="submit"
              className="btn-primary"
              style={{ fontSize: '14px', padding: '12px 28px' }}
            >
              <Send size={14} />
              <span>Save Preferences</span>
            </button>
          </div>
        </form>
      </div>
    </PageWrapper>
  )
}
