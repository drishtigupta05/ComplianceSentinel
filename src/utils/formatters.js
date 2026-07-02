/**
 * Formatting utilities — purely presentational.
 */

const DTF_FULL = new Intl.DateTimeFormat('en-IN', {
  year: 'numeric',
  month: 'short',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false,
  timeZone: 'Asia/Kolkata',
})

const DTF_SHORT = new Intl.DateTimeFormat('en-IN', {
  year: 'numeric',
  month: 'short',
  day: '2-digit',
  timeZone: 'Asia/Kolkata',
})

const DTF_TIME = new Intl.DateTimeFormat('en-IN', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: true,
  timeZone: 'Asia/Kolkata',
})

export function formatTimestamp(iso) {
  if (!iso) return '—'
  return DTF_FULL.format(new Date(iso))
}

export function formatDate(iso) {
  if (!iso) return '—'
  return DTF_SHORT.format(new Date(iso))
}

export function formatTime(iso) {
  if (!iso) return '—'
  return DTF_TIME.format(new Date(iso))
}

export function formatRelative(iso) {
  if (!iso) return '—'
  const diff = Date.now() - new Date(iso).getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 30) return `${days}d ago`
  const months = Math.floor(days / 30)
  if (months < 12) return `${months}mo ago`
  return `${Math.floor(months / 12)}yr ago`
}

export function getInitials(name) {
  if (!name) return '?'
  return name
    .split(' ')
    .slice(0, 2)
    .map(s => s[0]?.toUpperCase() || '')
    .join('')
}

export function formatPurposeLabel(key) {
  const MAP = {
    essential:        'Essential Services',
    marketing:        'Marketing',
    partner_sharing:  'Partner Sharing',
    analytics:        'Analytics',
    credit_reporting: 'Credit Reporting',
  }
  return MAP[key] || key
}

export function formatChannelLabel(channel) {
  if (channel === 'email') return 'Email'
  if (channel === 'sms')   return 'SMS'
  return 'None'
}

export function truncateHash(hash, chars = 16) {
  if (!hash) return '—'
  return hash.slice(0, chars) + '…'
}

/**
 * Exports a list of record objects as a real CSV Blob download.
 */
export function downloadCSV(rows, filename = 'consent-ledger.csv') {
  const headers = [
    'Record ID',
    'User Name',
    'User Email',
    'Purpose',
    'Status',
    'Timestamp (IST)',
    'Notice Version',
    'Channel',
    'Language',
    'IP Address',
    'User Agent',
    'Withdrawn At',
    'Withdrawal Reason',
    'Record Hash',
    'Seeded',
  ]

  const escape = v => `"${String(v ?? '').replace(/"/g, '""')}"`

  const csvLines = [
    headers.map(escape).join(','),
    ...rows.map(r =>
      [
        r.id,
        r.userName || r.userId,
        r.userEmail || '',
        r.purpose,
        r.status,
        r.timestamp ? formatTimestamp(r.timestamp) : '',
        r.noticeVersion,
        r.channel,
        r.language,
        r.ipAddress,
        r.userAgent,
        r.withdrawnAt ? formatTimestamp(r.withdrawnAt) : '',
        r.withdrawnReason || '',
        r.recordHash || '',
        r.isSeeded ? 'Yes' : 'No',
      ].map(escape).join(',')
    ),
  ]

  const csv = csvLines.join('\r\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
