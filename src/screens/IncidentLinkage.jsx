import { useState, useMemo } from 'react'
import { Play, Square, AlertTriangle, CheckCircle, XCircle, AlertCircle, Mail, MessageSquare, Globe } from 'lucide-react'
import PageWrapper from '../components/layout/PageWrapper'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import MonoText from '../components/ui/MonoText'
import EligibilityBadge from '../components/incident/EligibilityBadge'
import FlagList from '../components/incident/FlagList'
import { useConsent } from '../context/ConsentContext'
import { getContactEligibility } from '../utils/eligibility'
import { formatTimestamp, formatDate, getInitials } from '../utils/formatters'

const SEVERITY = {
  critical: { bg: '#FEF2F2', border: '#FDE2E2', text: '#B91C1C', dot: '#B91C1C' },
  high:     { bg: '#FFF7ED', border: '#FFEDD5', text: '#C2410C', dot: '#C2410C' },
  medium:   { bg: '#FFFBEB', border: '#FEF3C7', text: '#D97706', dot: '#D97706' },
}

export default function IncidentLinkage() {
  const { state } = useConsent()
  const { breachCases, users, consentRecords } = state

  const [activeSimulation, setActiveSimulation] = useState(null)

  const activeCaseData = useMemo(
    () => breachCases.find(c => c.id === activeSimulation) || null,
    [breachCases, activeSimulation]
  )

  const eligibilityResults = useMemo(() => {
    if (!activeCaseData) return []
    return activeCaseData.affectedUserIds.map(uid =>
      getContactEligibility(uid, users, consentRecords)
    ).filter(Boolean)
  }, [activeCaseData, users, consentRecords])

  const summary = useMemo(() => ({
    allowed:    eligibilityResults.filter(e => e.status === 'allowed').length,
    restricted: eligibilityResults.filter(e => e.status === 'restricted').length,
    blocked:    eligibilityResults.filter(e => e.status === 'blocked').length,
  }), [eligibilityResults])

  return (
    <PageWrapper
      title="Incident Linkage"
      subtitle="Data Principal Notification Eligibility — Breach Investigation"
      actions={
        activeSimulation ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '8px', backgroundColor: '#FFFBEB', border: '1px solid #FEF3C7' }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#D97706', animation: 'pulse-dot 1.5s infinite', display: 'inline-block' }} />
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#D97706', letterSpacing: '0.05em', textTransform: 'uppercase' }}>SIMULATION ACTIVE</span>
            </div>
            <button
              id="end-simulation-btn"
              onClick={() => setActiveSimulation(null)}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '6px', backgroundColor: '#FEF2F2', border: '1px solid #FDE2E2', color: '#B91C1C', fontSize: '13px', fontWeight: 600, cursor: 'pointer', transition: 'var(--transition-fast)' }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#FEE2E2' }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#FEF2F2' }}
            >
              <Square size={12} fill="#B91C1C" color="#B91C1C" />
              <span>End Simulation</span>
            </button>
          </div>
        ) : null
      }
    >
      {/* ── Landing state ────────────────────────────────────────── */}
      {!activeSimulation && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {/* Intro Banner */}
          <div
            style={{
              padding: '32px', borderRadius: '16px',
              background: 'linear-gradient(135deg, #0A192F 0%, #0F2440 100%)',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px' }}>
              <div
                style={{
                  width: '44px', height: '44px', borderRadius: '8px',
                  background: 'rgba(13,148,136,0.15)',
                  border: '1px solid rgba(13,148,136,0.25)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                  color: '#0D9488',
                }}
              >
                <AlertTriangle size={20} />
              </div>
              <div>
                <p style={{ fontSize: '16px', fontWeight: 700, color: '#F1F5F9', margin: '0 0 8px' }}>
                  Breach Notification Eligibility Simulator
                </p>
                <p style={{ fontSize: '13.5px', color: 'rgba(255,255,255,0.6)', margin: 0, lineHeight: 1.7 }}>
                  Select a breach case below to run a consent-based eligibility simulation. The engine evaluates each affected user against their live consent records to determine notification eligibility under{' '}
                  <span style={{ color: '#0D9488', fontWeight: 700 }}>DPDPA §8</span> and{' '}
                  <span style={{ color: '#D97706', fontWeight: 700 }}>CERT-In</span> regulations.
                </p>
              </div>
            </div>
          </div>

          {/* Breach case cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
            {breachCases.map(bc => {
              const sev = SEVERITY[bc.severity] || SEVERITY.medium
              return (
                <div
                  key={bc.id}
                  className="card-base card-hover"
                  style={{ overflow: 'hidden', cursor: 'default', display: 'flex', flexDirection: 'column', height: '100%' }}
                >
                  {/* Top section */}
                  <div style={{ padding: '32px 32px 24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    {/* Severity + ID row */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                      <span
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: '6px',
                          padding: '4px 10px', borderRadius: '4px',
                          fontSize: '10.5px', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase',
                          backgroundColor: sev.bg, color: sev.text, border: `1px solid ${sev.border}`,
                        }}
                      >
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: sev.dot, display: 'inline-block' }} />
                        {bc.severity.toUpperCase()}
                      </span>
                      <MonoText size="11px" color="#94A3B8">{bc.id}</MonoText>
                    </div>

                    <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0A192F', margin: '0 0 10px', lineHeight: 1.4 }}>
                      {bc.title}
                    </h3>
                    <p style={{ fontSize: '13px', color: '#64748B', margin: '0 0 24px', lineHeight: 1.6, flex: 1 }}>
                      {bc.description.slice(0, 140)}…
                    </p>

                    {/* Stats row */}
                    <div style={{ display: 'flex', gap: '24px', marginBottom: '20px', flexWrap: 'wrap' }}>
                      <div>
                        <p style={{ fontSize: '10.5px', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 4px' }}>Affected</p>
                        <p className="font-mono" style={{ fontSize: '18px', fontWeight: 600, color: '#0A192F', margin: 0, letterSpacing: '-0.02em' }}>
                          {bc.affectedCount.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p style={{ fontSize: '10.5px', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 4px' }}>Reported</p>
                        <p style={{ fontSize: '13.5px', fontWeight: 600, color: '#334155', margin: 0 }}>
                          {formatDate(bc.reportedAt)}
                        </p>
                      </div>
                      <div>
                        <p style={{ fontSize: '10.5px', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 4px' }}>Status</p>
                        <Badge variant={bc.remediated ? 'granted' : 'withdrawn'} size="xs" dot>
                          {bc.remediated ? 'Remediated' : 'Active'}
                        </Badge>
                      </div>
                    </div>

                    {/* CERT-In reference */}
                    <MonoText size="11px" color="#94A3B8">{bc.certInRef}</MonoText>

                    {/* Data categories */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '14px' }}>
                      {bc.dataCategories.map(d => (
                        <span key={d} style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '4px', backgroundColor: '#FAFBFD', color: '#64748B', border: '1px solid rgba(10,25,47,0.05)' }}>
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* CTA footer */}
                  <div style={{ borderTop: '1px solid rgba(10, 25, 47, 0.04)', padding: '20px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FAFBFD' }}>
                    <span style={{ fontSize: '12.5px', color: '#94A3B8' }}>
                      {bc.affectedUserIds.length} users in demo
                    </span>
                    <button
                      id={`start-sim-${bc.id}`}
                      onClick={() => setActiveSimulation(bc.id)}
                      className="btn-primary"
                      style={{ fontSize: '13px', padding: '8px 16px' }}
                    >
                      <Play size={11} fill="#ffffff" />
                      <span>Start Simulation</span>
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ── Active simulation ─────────────────────────────────────── */}
      {activeSimulation && activeCaseData && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Case summary banner */}
          <Card>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '32px', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '320px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', flexWrap: 'wrap' }}>
                  <MonoText size="11.5px" color="#94A3B8">{activeCaseData.id}</MonoText>
                  <span style={{
                    fontSize: '10px', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase',
                    padding: '3px 8px', borderRadius: '4px',
                    backgroundColor: SEVERITY[activeCaseData.severity]?.bg,
                    color: SEVERITY[activeCaseData.severity]?.text,
                    border: `1px solid ${SEVERITY[activeCaseData.severity]?.border}`,
                  }}>{activeCaseData.severity.toUpperCase()}</span>
                  <Badge variant={activeCaseData.remediated ? 'granted' : 'withdrawn'} size="xs" dot>
                    {activeCaseData.remediated ? 'Remediated' : 'Under Investigation'}
                  </Badge>
                </div>
                <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#0A192F', margin: '0 0 10px', letterSpacing: '-0.01em' }}>
                  {activeCaseData.title}
                </h2>
                <p style={{ fontSize: '13.5px', color: '#64748B', margin: 0, lineHeight: 1.65 }}>
                  {activeCaseData.description}
                </p>
              </div>

              <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '12px', minWidth: '200px' }}>
                <div>
                  <p style={{ fontSize: '10.5px', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 4px' }}>CERT-In Reference</p>
                  <MonoText size="12px" color="#334155">{activeCaseData.certInRef}</MonoText>
                </div>
                <div>
                  <p style={{ fontSize: '10.5px', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 4px' }}>Total Affected</p>
                  <p className="font-mono" style={{ fontSize: '20px', fontWeight: 600, color: '#0A192F', margin: 0, letterSpacing: '-0.02em' }}>
                    {activeCaseData.affectedCount.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: '10.5px', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 4px' }}>Deadline</p>
                  <MonoText size="11px" color="#B91C1C">{formatTimestamp(activeCaseData.notificationDeadline)}</MonoText>
                </div>
              </div>
            </div>
          </Card>

          {/* Eligibility summary row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
            {[
              { status: 'allowed',    count: summary.allowed,    bg: '#F0FDFA', border: '#CCFBF1', text: '#0F766E', icon: CheckCircle, color: '#0D9488', label: 'ALLOWED' },
              { status: 'restricted', count: summary.restricted, bg: '#FFFBEB', border: '#FEF3C7', text: '#D97706', icon: AlertCircle, color: '#D97706', label: 'RESTRICTED' },
              { status: 'blocked',    count: summary.blocked,    bg: '#FEF2F2', border: '#FDE2E2', text: '#B91C1C', icon: XCircle,      color: '#B91C1C', label: 'BLOCKED' },
            ].map(({ count, bg, border, text, icon: Icon, color, label }) => (
              <div
                key={label}
                style={{ padding: '20px 24px', borderRadius: '12px', backgroundColor: bg, border: `1px solid ${border}` }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Icon size={20} color={color} />
                  <div>
                    <p className="font-mono" style={{ fontSize: '24px', fontWeight: 600, color: text, margin: 0, letterSpacing: '-0.03em', lineHeight: 1 }}>
                      {count}
                    </p>
                    <p style={{ fontSize: '11px', fontWeight: 700, color: text, opacity: 0.8, margin: '6px 0 0', letterSpacing: '0.05em' }}>
                      {label}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            <div style={{ padding: '20px 24px', borderRadius: '12px', backgroundColor: '#ffffff', border: '1px solid rgba(10, 25, 47, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-card)' }}>
              <div style={{ textAlign: 'center' }}>
                <p className="font-mono" style={{ fontSize: '24px', fontWeight: 600, color: '#0A192F', margin: 0, letterSpacing: '-0.03em', lineHeight: 1 }}>
                  {eligibilityResults.length}
                </p>
                <p style={{ fontSize: '11px', color: '#94A3B8', margin: '6px 0 0', letterSpacing: '0.05em', textTransform: 'uppercase', fontWeight: 700 }}>
                  Demo Pool
                </p>
              </div>
            </div>
          </div>

          {/* Eligibility table */}
          <Card padding={false}>
            <div style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(10, 25, 47, 0.04)', flexWrap: 'wrap', gap: '12px' }}>
              <p style={{ fontSize: '14px', fontWeight: 700, color: '#0A192F', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>
                Notification Eligibility — {eligibilityResults.length} Users Evaluated
              </p>
              <p style={{ fontSize: '13px', color: '#64748B', margin: 0 }}>
                Calculated against immutable ledger state
              </p>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#ffffff', borderBottom: '1px solid rgba(10, 25, 47, 0.04)' }}>
                    {['User', 'Contact Email', 'Channel', 'Language', 'Eligibility', 'Compliance Flags'].map(h => (
                      <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: '#94A3B8', letterSpacing: '0.05em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {eligibilityResults.map(el => {
                    const user = users.find(u => u.id === el.userId)
                    const ChannelIcon = el.channel === 'email' ? Mail : el.channel === 'sms' ? MessageSquare : Globe
                    const rowBg = el.status === 'blocked' ? '#FFFAFA' : el.status === 'restricted' ? '#FFFCF5' : 'transparent'
                    return (
                      <tr
                        key={el.userId}
                        style={{ borderBottom: '1px solid rgba(10, 25, 47, 0.03)', backgroundColor: rowBg, transition: 'background-color 0.1s' }}
                        onMouseEnter={e => { e.currentTarget.style.backgroundColor = el.status === 'blocked' ? '#FEF2F2' : el.status === 'restricted' ? '#FFFBEB' : '#FAFBFD' }}
                        onMouseLeave={e => { e.currentTarget.style.backgroundColor = rowBg }}
                      >
                        {/* User */}
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{
                              width: '32px', height: '32px', borderRadius: '50%',
                              backgroundColor: '#FAFBFD', border: '1px solid rgba(10,25,47,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontSize: '11px', fontWeight: 700, color: '#94A3B8', flexShrink: 0,
                            }}>
                              {getInitials(user?.name || '?')}
                            </div>
                            <div>
                              <p style={{ fontSize: '13.5px', fontWeight: 600, color: '#0A192F', margin: 0 }}>{user?.name}</p>
                              <MonoText size="10.5px" color="#94A3B8">{el.userId}</MonoText>
                            </div>
                          </div>
                        </td>
                        {/* Email */}
                        <td style={{ padding: '14px 16px' }}>
                          <p style={{ fontSize: '13px', color: '#64748B', margin: 0 }}>{user?.email}</p>
                        </td>
                        {/* Channel */}
                        <td style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <ChannelIcon size={12} color={el.canContact ? '#0D9488' : '#B91C1C'} />
                            <span style={{ fontSize: '13px', fontWeight: 600, color: el.canContact ? '#334155' : '#B91C1C' }}>
                              {el.channel === 'none' ? 'None' : el.channel?.toUpperCase()}
                            </span>
                          </div>
                        </td>
                        {/* Language */}
                        <td style={{ padding: '14px 16px' }}>
                          <span style={{ fontSize: '13px', color: '#64748B' }}>{el.languageLabel}</span>
                        </td>
                        {/* Eligibility */}
                        <td style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>
                          <EligibilityBadge eligibility={el} compact />
                        </td>
                        {/* Flags */}
                        <td style={{ padding: '14px 16px', maxWidth: '280px' }}>
                          <FlagList flags={el.flags} />
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            <div style={{ padding: '16px 24px', backgroundColor: '#FAFBFD', borderTop: '1px solid rgba(10, 25, 47, 0.03)', fontSize: '12.5px', color: '#64748B', lineHeight: 1.6 }}>
              <strong>Regulatory Framework (DPDPA §8) —</strong> Breach notifications are legally required regardless of optional consent withdrawals. Restricted users are highlighted because they have withdrawn notifications consent but must still be contacted for urgent compliance incident communications.
            </div>
          </Card>

          {/* End simulation */}
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              onClick={() => setActiveSimulation(null)}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '6px', backgroundColor: '#FEF2F2', border: '1px solid #FDE2E2', color: '#B91C1C', fontSize: '13px', fontWeight: 600, cursor: 'pointer', transition: 'var(--transition-fast)' }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#FEE2E2' }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#FEF2F2' }}
            >
              <Square size={12} fill="#B91C1C" color="#B91C1C" />
              <span>End Simulation</span>
            </button>
          </div>
        </div>
      )}
    </PageWrapper>
  )
}
