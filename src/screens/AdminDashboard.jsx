import { useState, useMemo } from 'react'
import { Users, CheckCircle, XCircle, WifiOff, Search } from 'lucide-react'
import PageWrapper from '../components/layout/PageWrapper'
import Card from '../components/ui/Card'
import KpiCard from '../components/ui/KpiCard'
import Badge from '../components/ui/Badge'
import MonoText from '../components/ui/MonoText'
import ConsentTimeline from '../components/consent/ConsentTimeline'
import { useConsent } from '../context/ConsentContext'
import { getEffectiveConsents, getKpiStats, getUserHistory } from '../utils/recordHelpers'
import { formatDate, formatChannelLabel, getInitials } from '../utils/formatters'

export default function AdminDashboard() {
  const { state, dispatch } = useConsent()
  const { users, consentRecords, purposes, adminSelectedUserId } = state

  const [search, setSearch] = useState('')

  const stats = useMemo(
    () => getKpiStats(consentRecords, users, purposes),
    [consentRecords, users, purposes]
  )

  const filteredUsers = useMemo(() => {
    const q = search.toLowerCase()
    if (!q) return users
    return users.filter(u =>
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.id.toLowerCase().includes(q)
    )
  }, [users, search])

  const selectedUser = users.find(u => u.id === adminSelectedUserId) || null

  const effectiveConsents = useMemo(() => {
    if (!selectedUser) return null
    return getEffectiveConsents(selectedUser.id, consentRecords, purposes)
  }, [selectedUser, consentRecords, purposes])

  const userHistory = useMemo(() => {
    if (!selectedUser) return []
    return getUserHistory(selectedUser.id, consentRecords)
  }, [selectedUser, consentRecords])

  const noticeVersions = useMemo(
    () => [...new Set(userHistory.map(r => r.noticeVersion))].sort(),
    [userHistory]
  )

  return (
    <PageWrapper
      title="DPO Dashboard"
      subtitle="Data Protection Officer — administrative consent management"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        {/* ── KPI Row ────────────────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
          <KpiCard label="Total Records"      value={stats.totalRecords.toLocaleString()}  sub={`${users.length} registered users`} accent="teal"  icon={Users}        />
          <KpiCard label="Active Consents"    value={stats.totalActive.toLocaleString()}   sub="Granted across all purposes"        accent="green" icon={CheckCircle}  />
          <KpiCard label="Withdrawn"          value={stats.totalWithdrawn.toLocaleString()} sub="Append-only withdrawal records"    accent="amber" icon={XCircle}      />
          <KpiCard label="No Contact Channel" value={stats.noChannel.toLocaleString()}     sub={`${stats.neverConsented} never consented`} accent="red" icon={WifiOff} />
        </div>

        {/* ── Main split ─────────────────────────────────────────── */}
        <div style={{ display: 'flex', gap: '32px', minHeight: '560px', alignItems: 'stretch' }}>
          {/* User list */}
          <div style={{ width: '320px', flexShrink: 0 }}>
            <Card padding={false} style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              {/* Search */}
              <div style={{ padding: '24px 24px 16px' }}>
                <p style={{ fontSize: '11px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px', marginContent: 0 }}>
                  User Search
                </p>
                <div style={{ position: 'relative' }}>
                  <Search size={13} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#CBD5E1' }} />
                  <input
                    id="admin-user-search"
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Name, email, or ID…"
                    className="input-base"
                    style={{ width: '100%', paddingLeft: '36px', fontSize: '13px' }}
                    onFocus={e => { e.target.style.borderColor = '#0A192F'; e.target.style.boxShadow = '0 0 0 3px rgba(10,25,47,0.05)' }}
                    onBlur={e => { e.target.style.borderColor = 'rgba(10,25,47,0.08)'; e.target.style.boxShadow = 'none' }}
                  />
                </div>
                <p style={{ fontSize: '12px', color: '#94A3B8', marginTop: '10px', marginContent: 0 }}>
                  Showing {filteredUsers.length} of {users.length} users
                </p>
              </div>

              <div style={{ height: '1px', backgroundColor: 'rgba(10, 25, 47, 0.04)', margin: '0 24px' }} />

              {/* User rows */}
              <div style={{ overflowY: 'auto', flex: 1, maxHeight: '600px' }}>
                {filteredUsers.map(u => {
                  const isSelected = u.id === adminSelectedUserId
                  const hasIssue = u.preferredChannel === 'none' || consentRecords.filter(r => r.userId === u.id).length === 0
                  const recordCount = consentRecords.filter(r => r.userId === u.id).length

                  return (
                    <button
                      key={u.id}
                      id={`user-item-${u.id}`}
                      type="button"
                      onClick={() => dispatch({ type: 'SELECT_ADMIN_USER', payload: { userId: u.id } })}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '12px',
                        padding: '16px 24px',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        textAlign: 'left',
                        borderBottom: '1px solid rgba(10, 25, 47, 0.03)',
                        backgroundColor: isSelected ? 'rgba(13, 148, 136, 0.04)' : 'transparent',
                        borderLeft: `3px solid ${isSelected ? '#0D9488' : 'transparent'}`,
                        transition: 'var(--transition-fast)',
                      }}
                      onMouseEnter={e => { if (!isSelected) e.currentTarget.style.backgroundColor = '#FAFBFD' }}
                      onMouseLeave={e => { if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent' }}
                    >
                      <div
                        style={{
                          width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '11px', fontWeight: 700,
                          backgroundColor: isSelected ? '#CCFBF1' : '#F1F5F9',
                          color: isSelected ? '#0F766E' : '#94A3B8',
                          border: '1px solid rgba(10, 25, 47, 0.03)',
                        }}
                      >
                        {getInitials(u.name)}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '4px' }}>
                          <p style={{ fontSize: '13.5px', fontWeight: 700, color: isSelected ? '#0A192F' : '#334155', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {u.name}
                          </p>
                          {hasIssue && <span style={{ fontSize: '12px', color: '#D97706', lineHeight: 1 }}>⚠</span>}
                        </div>
                        <p style={{ fontSize: '12.5px', color: '#64748B', margin: '2px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {u.email}
                        </p>
                        <div style={{ display: 'flex', gap: '8px', marginTop: '6px', alignItems: 'center' }}>
                          <MonoText size="10.5px" color="#94A3B8">{u.id}</MonoText>
                          <span style={{ fontSize: '10.5px', color: '#CBD5E1' }}>|</span>
                          <span style={{ fontSize: '10.5px', color: '#94A3B8' }}>{recordCount} logs</span>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </Card>
          </div>

          {/* Profile panel */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {!selectedUser ? (
              <Card style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center', maxWidth: '360px', padding: '32px' }}>
                  <div
                    style={{
                      width: '56px', height: '56px', borderRadius: '12px',
                      backgroundColor: '#FAFBFD', margin: '0 auto 20px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      border: '1px solid rgba(10, 25, 47, 0.05)',
                      color: '#94A3B8',
                    }}
                  >
                    <Users size={24} />
                  </div>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0A192F', margin: '0 0 8px' }}>
                    Select a Data Principal
                  </h3>
                  <p style={{ fontSize: '13px', color: '#64748B', margin: 0, lineHeight: 1.6 }}>
                    Query active consent profiles and records histories from the left search directory.
                  </p>
                </div>
              </Card>
            ) : (
              <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* Identity */}
                <Card>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                      <div
                        style={{
                          width: '52px', height: '52px', borderRadius: '50%', flexShrink: 0,
                          backgroundColor: '#FAFBFD',
                          border: '1px solid rgba(10, 25, 47, 0.08)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '16px', fontWeight: 700, color: '#0A192F',
                        }}
                      >
                        {getInitials(selectedUser.name)}
                      </div>
                      <div>
                        <p style={{ fontSize: '18px', fontWeight: 700, color: '#0A192F', margin: '0 0 6px', letterSpacing: '-0.01em' }}>
                          {selectedUser.name}
                        </p>
                        <p style={{ fontSize: '13.5px', color: '#334155', margin: '0 0 4px' }}>
                          {selectedUser.email} · {selectedUser.phone}
                        </p>
                        <p style={{ fontSize: '12.5px', color: '#64748B', margin: 0 }}>
                          {selectedUser.department} · Joined {formatDate(selectedUser.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
                      <MonoText size="11px" color="#94A3B8">{selectedUser.id}</MonoText>
                      <Badge variant={selectedUser.preferredChannel === 'none' ? 'blocked' : selectedUser.preferredChannel} size="xs">
                        {formatChannelLabel(selectedUser.preferredChannel)}
                      </Badge>
                    </div>
                  </div>

                  {noticeVersions.length > 0 && (
                    <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid rgba(10, 25, 47, 0.04)' }}>
                      <p style={{ fontSize: '11px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px', marginContent: 0 }}>
                        Notice Versions Accepted
                      </p>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        {noticeVersions.map(v => (
                          <span
                            key={v}
                            className="font-mono"
                            style={{
                              padding: '4px 10px', borderRadius: '4px',
                              backgroundColor: '#F0FDFA', color: '#0F766E',
                              border: '1px solid #CCFBF1',
                              fontSize: '11.5px', fontWeight: 600,
                            }}
                          >
                            {v}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </Card>

                {/* Effective consent state */}
                <Card>
                  <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#0A192F', marginBottom: '16px', marginTop: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Effective Consent State
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {purposes.map(p => {
                      const rec = effectiveConsents?.[p.key]
                      const status = rec?.status || 'not_recorded'
                      return (
                        <div
                          key={p.key}
                          style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            padding: '14px 20px', borderRadius: '8px',
                            backgroundColor: '#FAFBFD',
                            border: '1px solid rgba(10, 25, 47, 0.04)',
                            gap: '16px',
                          }}
                        >
                          <div>
                            <p style={{ fontSize: '13.5px', fontWeight: 600, color: '#334155', margin: 0 }}>{p.label}</p>
                            {p.mandatory && <p style={{ fontSize: '11.5px', color: '#94A3B8', margin: '2px 0 0' }}>Mandatory Service</p>}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            {rec ? (
                              <>
                                <Badge variant={status} size="xs" dot>{status}</Badge>
                                <MonoText size="11px" color="#94A3B8">{rec.id}</MonoText>
                              </>
                            ) : (
                              <Badge variant="default" size="xs">Not recorded</Badge>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </Card>

                {/* Timeline */}
                <Card>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
                    <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#0A192F', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Consent History
                    </h3>
                    <span style={{ fontSize: '12.5px', color: '#64748B' }}>
                      {userHistory.length} audit records · Append-only
                    </span>
                  </div>
                  <ConsentTimeline records={userHistory} />
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}
