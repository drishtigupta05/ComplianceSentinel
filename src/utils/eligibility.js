/**
 * Deterministic 3-rule contact eligibility engine.
 *
 * Rule 1: No valid essential consent → BLOCKED
 * Rule 2: No registered channel      → BLOCKED
 * Rule 3: Any optional purpose withdrawn → RESTRICTED (breach notification still lawful under DPDPA §8)
 * Rule 4: All clear                  → ALLOWED
 */

const PURPOSE_LABELS = {
  essential:       'Essential Account Services',
  marketing:       'Marketing Communications',
  partner_sharing: 'Data Sharing with Partners',
  analytics:       'Product Analytics',
  credit_reporting:'Credit Bureau Reporting',
}

export function getContactEligibility(userId, users, consentRecords) {
  const user = users.find(u => u.id === userId)
  if (!user) return null

  // Latest record per purpose (most-recent wins = effective state)
  const effectiveByPurpose = {}
  const sorted = [...consentRecords]
    .filter(r => r.userId === userId)
    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))

  for (const rec of sorted) {
    effectiveByPurpose[rec.purpose] = rec
  }

  const flags = []

  // ── Rule 1: Essential consent ─────────────────────────────────────────────
  const essentialRec = effectiveByPurpose['essential']
  if (!essentialRec || essentialRec.status === 'withdrawn') {
    flags.push({
      code: 'NO_ESSENTIAL_CONSENT',
      label: 'No valid consent for Essential Account Services on file',
      severity: 'error',
    })
    return {
      userId,
      canContact: false,
      channel: 'none',
      language: user.preferredLanguage,
      languageLabel: user.languageLabel,
      status: 'blocked',
      reason: 'No record of consent to Essential Account Services. Direct contact is not legally permitted under DPDPA §6.',
      consentSnapshot: Object.values(effectiveByPurpose),
      flags,
    }
  }

  // ── Rule 2: Channel availability ──────────────────────────────────────────
  if (user.preferredChannel === 'none') {
    flags.push({
      code: 'NO_CHANNEL',
      label: 'No registered contact channel — neither email nor SMS on file',
      severity: 'error',
    })
    return {
      userId,
      canContact: false,
      channel: 'none',
      language: user.preferredLanguage,
      languageLabel: user.languageLabel,
      status: 'blocked',
      reason: 'No valid contact channel registered. Notification delivery is technically impossible.',
      consentSnapshot: Object.values(effectiveByPurpose),
      flags,
    }
  }

  // ── Rule 3: Withdrawn optional consents ───────────────────────────────────
  const withdrawn = Object.values(effectiveByPurpose).filter(
    r => r.purpose !== 'essential' && r.status === 'withdrawn'
  )

  if (withdrawn.length > 0) {
    for (const w of withdrawn) {
      flags.push({
        code: `${w.purpose.toUpperCase()}_WITHDRAWN`,
        label: `Consent withdrawn: ${PURPOSE_LABELS[w.purpose] || w.purpose}`,
        severity: 'warning',
      })
    }
    return {
      userId,
      canContact: true,
      channel: user.preferredChannel,
      language: user.preferredLanguage,
      languageLabel: user.languageLabel,
      status: 'restricted',
      reason: `Breach notification permitted via ${user.preferredChannel.toUpperCase()} in ${user.languageLabel} (DPDPA §8). ${withdrawn.length} purpose(s) carry contact restrictions — do not use this contact for withdrawn purposes.`,
      consentSnapshot: Object.values(effectiveByPurpose),
      flags,
    }
  }

  // ── Rule 4: All clear ─────────────────────────────────────────────────────
  return {
    userId,
    canContact: true,
    channel: user.preferredChannel,
    language: user.preferredLanguage,
    languageLabel: user.languageLabel,
    status: 'allowed',
    reason: `Full notification rights confirmed. Contact via ${user.preferredChannel.toUpperCase()} in ${user.languageLabel}. No active consent restrictions.`,
    consentSnapshot: Object.values(effectiveByPurpose),
    flags: [],
  }
}
