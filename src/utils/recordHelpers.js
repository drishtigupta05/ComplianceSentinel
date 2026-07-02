/**
 * Pure selector functions — no side effects, no state mutations.
 */

/**
 * Returns the latest (effective) consent record per purpose for a user.
 * @returns {Object.<string, ConsentRecord>}
 */
export function getEffectiveConsents(userId, consentRecords, purposes) {
  const userRecords = consentRecords
    .filter(r => r.userId === userId)
    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))

  const effective = {}
  for (const rec of userRecords) {
    effective[rec.purpose] = rec
  }

  // Fill in "never consented" for any purpose missing a record
  const result = {}
  for (const p of purposes) {
    result[p.key] = effective[p.key] || null
  }
  return result
}

/**
 * Returns all consent records for a user, sorted newest-first.
 */
export function getUserHistory(userId, consentRecords) {
  return [...consentRecords]
    .filter(r => r.userId === userId)
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
}

/**
 * Returns filtered and sorted ledger rows.
 * Filters: { search, purpose, status, noticeVersion }
 * Sort: { key, dir }
 */
export function getLedgerRows(consentRecords, users, filters = {}, sort = {}) {
  const { search = '', purpose = '', status = '', noticeVersion = '' } = filters
  const { key = 'timestamp', dir = 'desc' } = sort

  const userMap = Object.fromEntries(users.map(u => [u.id, u]))
  const searchLower = search.toLowerCase()

  let rows = consentRecords.map(r => ({
    ...r,
    userName: userMap[r.userId]?.name || r.userId,
    userEmail: userMap[r.userId]?.email || '',
  }))

  if (searchLower) {
    rows = rows.filter(r =>
      r.id.toLowerCase().includes(searchLower) ||
      r.userName.toLowerCase().includes(searchLower) ||
      r.userEmail.toLowerCase().includes(searchLower) ||
      r.purpose.toLowerCase().includes(searchLower)
    )
  }
  if (purpose)       rows = rows.filter(r => r.purpose === purpose)
  if (status)        rows = rows.filter(r => r.status === status)
  if (noticeVersion) rows = rows.filter(r => r.noticeVersion === noticeVersion)

  rows.sort((a, b) => {
    let aVal = a[key] ?? ''
    let bVal = b[key] ?? ''
    if (key === 'timestamp' || key === 'withdrawnAt') {
      aVal = aVal ? new Date(aVal).getTime() : 0
      bVal = bVal ? new Date(bVal).getTime() : 0
    } else {
      aVal = String(aVal).toLowerCase()
      bVal = String(bVal).toLowerCase()
    }
    if (aVal < bVal) return dir === 'asc' ? -1 : 1
    if (aVal > bVal) return dir === 'asc' ? 1 : -1
    return 0
  })

  return rows
}

/**
 * Aggregate KPI stats across all records.
 */
export function getKpiStats(consentRecords, users, purposes) {
  const effectiveAll = {}
  for (const u of users) {
    effectiveAll[u.id] = {}
    const sorted = [...consentRecords]
      .filter(r => r.userId === u.id)
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
    for (const rec of sorted) {
      effectiveAll[u.id][rec.purpose] = rec
    }
  }

  let totalActive = 0
  let totalWithdrawn = 0
  const noChannel = users.filter(u => u.preferredChannel === 'none').length
  const neverConsented = users.filter(u =>
    consentRecords.filter(r => r.userId === u.id).length === 0
  ).length

  for (const u of users) {
    const byPurpose = effectiveAll[u.id]
    for (const p of purposes) {
      const rec = byPurpose[p.key]
      if (rec?.status === 'granted') totalActive++
      if (rec?.status === 'withdrawn') totalWithdrawn++
    }
  }

  return {
    totalRecords: consentRecords.length,
    totalActive,
    totalWithdrawn,
    noChannel,
    neverConsented,
  }
}

/**
 * Returns list of all notice versions seen across records (deduplicated).
 */
export function getNoticeVersions(consentRecords) {
  return [...new Set(consentRecords.map(r => r.noticeVersion))].sort()
}
