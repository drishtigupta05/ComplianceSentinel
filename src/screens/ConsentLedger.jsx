import { useState, useMemo } from 'react'
import { Download, Info } from 'lucide-react'
import PageWrapper from '../components/layout/PageWrapper'
import Card from '../components/ui/Card'
import DataTable from '../components/ui/DataTable'
import SearchInput from '../components/ui/SearchInput'
import SelectInput from '../components/ui/SelectInput'
import Badge from '../components/ui/Badge'
import MonoText from '../components/ui/MonoText'
import { useConsent } from '../context/ConsentContext'
import { getLedgerRows, getNoticeVersions } from '../utils/recordHelpers'
import { formatTimestamp, formatPurposeLabel, downloadCSV } from '../utils/formatters'

const PURPOSE_OPTIONS = [
  { value: 'essential',        label: 'Essential Services' },
  { value: 'marketing',        label: 'Marketing' },
  { value: 'partner_sharing',  label: 'Partner Sharing' },
  { value: 'analytics',        label: 'Analytics' },
  { value: 'credit_reporting', label: 'Credit Reporting' },
]
const STATUS_OPTIONS = [
  { value: 'granted',   label: 'Granted' },
  { value: 'withdrawn', label: 'Withdrawn' },
]

const COLUMNS = [
  { key: 'id',            label: 'Record ID',       sortable: true,  mono: true,  nowrap: true, width: '110px' },
  { key: 'userName',      label: 'User',            sortable: true,  width: '150px' },
  { key: 'purpose',       label: 'Purpose',         sortable: true,  render: v => formatPurposeLabel(v) },
  { key: 'status',        label: 'Status',          sortable: true,  width: '110px',
    render: v => <Badge variant={v} dot>{v}</Badge> },
  { key: 'timestamp',     label: 'Timestamp (IST)', sortable: true,  mono: true,  nowrap: true,
    render: v => formatTimestamp(v) },
  { key: 'noticeVersion', label: 'Notice',          sortable: true,  width: '80px',
    render: v => <MonoText size="11.5px">{v}</MonoText> },
  { key: 'channel',       label: 'Channel',         sortable: true,  width: '80px',
    render: v => <Badge variant={v} size="xs">{v?.toUpperCase()}</Badge> },
  { key: 'language',      label: 'Lang',            sortable: true,  width: '55px', mono: true,
    render: v => v?.toUpperCase() },
]

function ExpandedRow({ row }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '32px' }}>
      <div>
        <p style={{ fontSize: '11px', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px', marginContent: 0 }}>
          User Identity
        </p>
        <p style={{ fontSize: '14px', fontWeight: 700, color: '#0A192F', marginBottom: '4px', marginContent: 0 }}>{row.userName}</p>
        <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '6px', marginContent: 0 }}>{row.userEmail}</p>
        <MonoText size="11px" color="#94A3B8">{row.userId}</MonoText>
      </div>
      <div>
        <p style={{ fontSize: '11px', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px', marginContent: 0 }}>
          Access Metadata
        </p>
        <MonoText size="12px" color="#334155">{row.ipAddress}</MonoText>
        <p style={{ fontSize: '11.5px', color: '#64748B', marginTop: '6px', lineHeight: 1.5, marginContent: 0 }}>{row.userAgent}</p>
      </div>
      <div>
        <p style={{ fontSize: '11px', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px', marginContent: 0 }}>
          Cryptographic Signature
        </p>
        <MonoText size="11px" color="#94A3B8" className="break-all">{row.recordHash || '—'}</MonoText>
        <p style={{ fontSize: '12px', fontWeight: 600, color: row.isSeeded ? '#94A3B8' : '#0D9488', marginTop: '10px', marginContent: 0 }}>
          {row.isSeeded ? '🔒 Seeded · WORM' : '✦ Live Ledger Entry'}
        </p>
      </div>
      {row.withdrawnReason && (
        <div style={{ gridColumn: '1 / -1', paddingTop: '20px', borderTop: '1px solid rgba(10, 25, 47, 0.04)' }}>
          <p style={{ fontSize: '11px', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px', marginContent: 0 }}>
            Withdrawal Details
          </p>
          <p style={{ fontSize: '13px', color: '#B91C1C', fontStyle: 'italic', lineHeight: 1.5, marginBottom: '6px', marginTop: 0 }}>"{row.withdrawnReason}"</p>
          <MonoText size="11px" color="#94A3B8">Withdrawn timestamp: {formatTimestamp(row.withdrawnAt)}</MonoText>
        </div>
      )}
    </div>
  )
}

export default function ConsentLedger() {
  const { state } = useConsent()
  const { consentRecords, users } = state

  const [search, setSearch]         = useState('')
  const [purposeFilter, setPurpose] = useState('')
  const [statusFilter, setStatus]   = useState('')
  const [noticeFilter, setNotice]   = useState('')

  const noticeVersionOptions = useMemo(
    () => getNoticeVersions(consentRecords).map(v => ({ value: v, label: v })),
    [consentRecords]
  )

  const rows = useMemo(
    () => getLedgerRows(consentRecords, users, { search, purpose: purposeFilter, status: statusFilter, noticeVersion: noticeFilter }, { key: 'timestamp', dir: 'desc' }),
    [consentRecords, users, search, purposeFilter, statusFilter, noticeFilter]
  )

  const grantedCount   = rows.filter(r => r.status === 'granted').length
  const withdrawnCount = rows.filter(r => r.status === 'withdrawn').length

  function handleExport() {
    downloadCSV(rows, `consent-ledger-${new Date().toISOString().split('T')[0]}.csv`)
  }

  return (
    <PageWrapper
      title="Consent Ledger"
      subtitle="Append-only audit trail — WORM, tamper-evident"
      actions={
        <button id="export-csv-btn" onClick={handleExport} className="btn-primary">
          <Download size={13} />
          <span>Export CSV</span>
        </button>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* ── Filter Bar ─────────────────────────────────────────── */}
        <Card padding={false}>
          <div style={{ padding: '24px 32px', display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center', borderBottom: '1px solid rgba(10, 25, 47, 0.04)' }}>
            <div style={{ flex: '1', minWidth: '280px' }}>
              <SearchInput id="ledger-search" value={search} onChange={setSearch} placeholder="Search by record ID, user, or purpose…" />
            </div>
            <SelectInput id="purpose-filter" value={purposeFilter} onChange={setPurpose} options={PURPOSE_OPTIONS} placeholder="All Purposes" width="180px" />
            <SelectInput id="status-filter"  value={statusFilter}  onChange={setStatus}  options={STATUS_OPTIONS}  placeholder="All Statuses" width="140px" />
            <SelectInput id="notice-filter"  value={noticeFilter}  onChange={setNotice}  options={noticeVersionOptions} placeholder="All Versions" width="140px" />
            {(search || purposeFilter || statusFilter || noticeFilter) && (
              <button
                onClick={() => { setSearch(''); setPurpose(''); setStatus(''); setNotice('') }}
                style={{ fontSize: '13px', color: '#94A3B8', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', whiteSpace: 'nowrap', fontWeight: 500 }}
                onMouseEnter={e => e.target.style.color = '#0A192F'}
                onMouseLeave={e => e.target.style.color = '#94A3B8'}
              >
                Clear filters
              </button>
            )}
          </div>

          {/* Stats Bar */}
          <div style={{ padding: '16px 32px', display: 'flex', gap: '24px', alignItems: 'center', backgroundColor: '#FAFBFD', borderBottom: '1px solid rgba(10, 25, 47, 0.03)', flexWrap: 'wrap' }}>
            <p style={{ fontSize: '13px', color: '#64748B', margin: 0 }}>
              <strong style={{ color: '#0A192F' }}>{rows.length.toLocaleString()}</strong> of{' '}
              <strong style={{ color: '#0A192F' }}>{consentRecords.length.toLocaleString()}</strong> records
            </p>
            <span style={{ color: '#E2E8F0', display: 'inline-block' }}>|</span>
            <span style={{ fontSize: '12.5px', color: '#0D9488', fontWeight: 600 }}>✓ {grantedCount} active grants</span>
            <span style={{ fontSize: '12.5px', color: '#B91C1C', fontWeight: 600 }}>✕ {withdrawnCount} withdrawals</span>
            <span style={{ fontSize: '12px', color: '#94A3B8', marginLeft: 'auto' }}>Click row to expand audit signature</span>
          </div>

          <DataTable
            columns={COLUMNS}
            data={rows}
            keyField="id"
            renderExpanded={row => <ExpandedRow row={row} />}
            emptyMessage="No records match the current filters."
          />
        </Card>

        {/* WORM Notice */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#0F766E', padding: '16px 20px', borderRadius: '8px', backgroundColor: '#F0FDFA', border: '1px solid #CCFBF1' }}>
          <Info size={16} color="#0D9488" style={{ flexShrink: 0 }} />
          <span>
            <strong>WORM Storage Console —</strong> Every consent ledger entry is write-once, read-many. Retrospective modification is cryptographically prevented. Withdrawals generate new append-only logs per DPDPA §7(3).
          </span>
        </div>
      </div>
    </PageWrapper>
  )
}
