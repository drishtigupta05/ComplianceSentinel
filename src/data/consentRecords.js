// Deterministic fake hash — purely visual, reinforces audit/compliance feel
function fakeHash(n) {
  const hex = '0123456789abcdef'
  let h = ''
  let s = Math.abs(n * 2654435761)
  for (let i = 0; i < 64; i++) {
    s = ((s * 1103515245 + 12345) >>> 0) ^ (s >>> 16)
    h += hex[s % 16]
    s = (s * 22695477 + 1) >>> 0
  }
  return h
}

const IPS = [
  '192.168.1.14', '10.0.0.42', '172.16.5.88', '192.168.2.33', '10.10.0.15',
  '172.20.1.7', '192.168.3.101', '10.0.1.56', '172.16.8.200', '192.168.4.19',
  '10.20.0.88', '172.18.2.44', '192.168.5.77', '10.0.2.31', '172.16.10.5',
  '192.168.6.55', '10.30.0.9', '172.22.3.66', '192.168.7.123', '10.0.3.48',
]

const AGENTS = [
  'Chrome 120.0 / Windows 11',
  'Firefox 121.0 / macOS 14',
  'Safari 17.1 / iOS 17',
  'Edge 120.0 / Windows 10',
  'Chrome 119.0 / Android 14',
  'Firefox 120.0 / Ubuntu 22.04',
]

function r(seq, userId, purpose, status, ts, noticeVersion, channel, language, ipIdx, agentIdx, withdrawnReason = null) {
  const id = `CR-${String(seq).padStart(4, '0')}`
  return {
    id,
    userId,
    purpose,
    status,
    timestamp: ts,
    noticeVersion,
    channel,
    language,
    ipAddress: IPS[ipIdx % IPS.length],
    userAgent: AGENTS[agentIdx % AGENTS.length],
    withdrawnAt: status === 'withdrawn' ? ts : null,
    withdrawnReason: status === 'withdrawn' ? withdrawnReason : null,
    recordHash: fakeHash(seq),
    isSeeded: true,
  }
}

// WORM seed — 78 immutable consent records
// Each withdrawal creates a new record (never mutates existing records)
export const SEEDED_RECORDS = [
  // ── USR-001 Priya Sharma ── All granted ──────────────────────────────────
  r(1,  'USR-001', 'essential',       'granted',   '2024-01-15T09:00:00.000Z', 'v1.0', 'email', 'en', 0, 0),
  r(2,  'USR-001', 'marketing',       'granted',   '2024-01-15T09:01:00.000Z', 'v1.0', 'email', 'en', 0, 0),
  r(3,  'USR-001', 'partner_sharing', 'granted',   '2024-01-15T09:02:00.000Z', 'v1.0', 'email', 'en', 0, 0),
  r(4,  'USR-001', 'analytics',       'granted',   '2024-01-15T09:03:00.000Z', 'v1.0', 'email', 'en', 0, 0),
  r(5,  'USR-001', 'credit_reporting','granted',   '2024-01-15T09:04:00.000Z', 'v1.0', 'email', 'en', 0, 0),

  // ── USR-002 Rohan Mehta ── Marketing withdrawn ───────────────────────────
  r(6,  'USR-002', 'essential',       'granted',   '2024-01-20T10:00:00.000Z', 'v1.0', 'sms',   'hi', 1, 1),
  r(7,  'USR-002', 'marketing',       'granted',   '2024-01-20T10:01:00.000Z', 'v1.0', 'sms',   'hi', 1, 1),
  r(8,  'USR-002', 'partner_sharing', 'granted',   '2024-01-20T10:02:00.000Z', 'v1.0', 'sms',   'hi', 1, 1),
  r(9,  'USR-002', 'analytics',       'granted',   '2024-01-20T10:03:00.000Z', 'v1.0', 'sms',   'hi', 1, 1),
  r(10, 'USR-002', 'credit_reporting','granted',   '2024-01-20T10:04:00.000Z', 'v1.0', 'sms',   'hi', 1, 1),
  r(11, 'USR-002', 'marketing',       'withdrawn', '2024-03-10T14:30:00.000Z', 'v1.0', 'sms',   'hi', 1, 2, 'I no longer wish to receive marketing communications.'),

  // ── USR-003 Ananya Iyer ── Essential only (never opted into optional) ────
  r(12, 'USR-003', 'essential',       'granted',   '2024-02-01T11:00:00.000Z', 'v1.0', 'email', 'ta', 2, 2),

  // ── USR-004 Vikram Singh ── No channel → BLOCKED ─────────────────────────
  r(13, 'USR-004', 'essential',       'granted',   '2024-02-05T08:00:00.000Z', 'v1.0', 'none',  'en', 3, 0),
  r(14, 'USR-004', 'marketing',       'granted',   '2024-02-05T08:01:00.000Z', 'v1.0', 'none',  'en', 3, 0),
  r(15, 'USR-004', 'partner_sharing', 'granted',   '2024-02-05T08:02:00.000Z', 'v1.0', 'none',  'en', 3, 0),
  r(16, 'USR-004', 'analytics',       'granted',   '2024-02-05T08:03:00.000Z', 'v1.0', 'none',  'en', 3, 0),
  r(17, 'USR-004', 'credit_reporting','granted',   '2024-02-05T08:04:00.000Z', 'v1.0', 'none',  'en', 3, 0),

  // ── USR-005 Kavya Reddy ── All granted ───────────────────────────────────
  r(18, 'USR-005', 'essential',       'granted',   '2024-02-10T09:30:00.000Z', 'v1.1', 'email', 'te', 4, 3),
  r(19, 'USR-005', 'marketing',       'granted',   '2024-02-10T09:31:00.000Z', 'v1.1', 'email', 'te', 4, 3),
  r(20, 'USR-005', 'partner_sharing', 'granted',   '2024-02-10T09:32:00.000Z', 'v1.1', 'email', 'te', 4, 3),
  r(21, 'USR-005', 'analytics',       'granted',   '2024-02-10T09:33:00.000Z', 'v1.1', 'email', 'te', 4, 3),
  r(22, 'USR-005', 'credit_reporting','granted',   '2024-02-10T09:34:00.000Z', 'v1.1', 'email', 'te', 4, 3),

  // ── USR-006 Arjun Nair ── Partner sharing withdrawn ──────────────────────
  r(23, 'USR-006', 'essential',       'granted',   '2024-02-15T12:00:00.000Z', 'v1.0', 'sms',   'ml', 5, 4),
  r(24, 'USR-006', 'marketing',       'granted',   '2024-02-15T12:01:00.000Z', 'v1.0', 'sms',   'ml', 5, 4),
  r(25, 'USR-006', 'partner_sharing', 'granted',   '2024-02-15T12:02:00.000Z', 'v1.0', 'sms',   'ml', 5, 4),
  r(26, 'USR-006', 'analytics',       'granted',   '2024-02-15T12:03:00.000Z', 'v1.0', 'sms',   'ml', 5, 4),
  r(27, 'USR-006', 'partner_sharing', 'withdrawn', '2024-04-01T16:00:00.000Z', 'v1.0', 'sms',   'ml', 5, 1, 'Concerned about third-party data handling practices.'),

  // ── USR-007 Sonal Gupta ── All granted ───────────────────────────────────
  r(28, 'USR-007', 'essential',       'granted',   '2024-03-01T10:00:00.000Z', 'v1.1', 'email', 'hi', 6, 0),
  r(29, 'USR-007', 'marketing',       'granted',   '2024-03-01T10:01:00.000Z', 'v1.1', 'email', 'hi', 6, 0),
  r(30, 'USR-007', 'partner_sharing', 'granted',   '2024-03-01T10:02:00.000Z', 'v1.1', 'email', 'hi', 6, 0),
  r(31, 'USR-007', 'analytics',       'granted',   '2024-03-01T10:03:00.000Z', 'v1.1', 'email', 'hi', 6, 0),
  r(32, 'USR-007', 'credit_reporting','granted',   '2024-03-01T10:04:00.000Z', 'v1.1', 'email', 'hi', 6, 0),

  // ── USR-008 Devraj Patel ── NO RECORDS → BLOCKED ──────────────────────────
  // (intentionally empty — represents a user who never completed consent flow)

  // ── USR-009 Meera Das ── Marketing + Partner withdrawn → RESTRICTED ───────
  r(33, 'USR-009', 'essential',       'granted',   '2024-03-10T09:00:00.000Z', 'v1.0', 'sms',   'bn', 8, 4),
  r(34, 'USR-009', 'marketing',       'granted',   '2024-03-10T09:01:00.000Z', 'v1.0', 'sms',   'bn', 8, 4),
  r(35, 'USR-009', 'partner_sharing', 'granted',   '2024-03-10T09:02:00.000Z', 'v1.0', 'sms',   'bn', 8, 4),
  r(36, 'USR-009', 'analytics',       'granted',   '2024-03-10T09:03:00.000Z', 'v1.0', 'sms',   'bn', 8, 4),
  r(37, 'USR-009', 'marketing',       'withdrawn', '2024-05-01T11:00:00.000Z', 'v1.0', 'sms',   'bn', 8, 2, 'Privacy concerns regarding personalised advertising.'),
  r(38, 'USR-009', 'partner_sharing', 'withdrawn', '2024-05-15T14:00:00.000Z', 'v1.0', 'sms',   'bn', 8, 2, 'Do not want data shared with third-party companies.'),

  // ── USR-010 Suresh Kumar ── All granted ──────────────────────────────────
  r(39, 'USR-010', 'essential',       'granted',   '2024-03-15T08:00:00.000Z', 'v2.0', 'email', 'en', 9, 3),
  r(40, 'USR-010', 'marketing',       'granted',   '2024-03-15T08:01:00.000Z', 'v2.0', 'email', 'en', 9, 3),
  r(41, 'USR-010', 'partner_sharing', 'granted',   '2024-03-15T08:02:00.000Z', 'v2.0', 'email', 'en', 9, 3),
  r(42, 'USR-010', 'analytics',       'granted',   '2024-03-15T08:03:00.000Z', 'v2.0', 'email', 'en', 9, 3),
  r(43, 'USR-010', 'credit_reporting','granted',   '2024-03-15T08:04:00.000Z', 'v2.0', 'email', 'en', 9, 3),

  // ── USR-011 Lalita Bose ── Analytics withdrawn ────────────────────────────
  r(44, 'USR-011', 'essential',       'granted',   '2024-04-01T10:00:00.000Z', 'v1.1', 'email', 'hi', 10, 0),
  r(45, 'USR-011', 'marketing',       'granted',   '2024-04-01T10:01:00.000Z', 'v1.1', 'email', 'hi', 10, 0),
  r(46, 'USR-011', 'partner_sharing', 'granted',   '2024-04-01T10:02:00.000Z', 'v1.1', 'email', 'hi', 10, 0),
  r(47, 'USR-011', 'analytics',       'granted',   '2024-04-01T10:03:00.000Z', 'v1.1', 'email', 'hi', 10, 0),
  r(48, 'USR-011', 'analytics',       'withdrawn', '2024-06-01T09:00:00.000Z', 'v1.1', 'email', 'hi', 10, 5, 'I prefer not to be tracked for analytics purposes.'),

  // ── USR-012 Farhan Qureshi ── All granted ────────────────────────────────
  r(49, 'USR-012', 'essential',       'granted',   '2024-04-10T11:00:00.000Z', 'v2.0', 'sms',   'ur', 11, 4),
  r(50, 'USR-012', 'marketing',       'granted',   '2024-04-10T11:01:00.000Z', 'v2.0', 'sms',   'ur', 11, 4),
  r(51, 'USR-012', 'partner_sharing', 'granted',   '2024-04-10T11:02:00.000Z', 'v2.0', 'sms',   'ur', 11, 4),
  r(52, 'USR-012', 'analytics',       'granted',   '2024-04-10T11:03:00.000Z', 'v2.0', 'sms',   'ur', 11, 4),
  r(53, 'USR-012', 'credit_reporting','granted',   '2024-04-10T11:04:00.000Z', 'v2.0', 'sms',   'ur', 11, 4),

  // ── USR-013 Rekha Pillai ── Credit reporting withdrawn ────────────────────
  r(54, 'USR-013', 'essential',       'granted',   '2024-04-15T09:00:00.000Z', 'v1.0', 'email', 'ml', 12, 2),
  r(55, 'USR-013', 'marketing',       'granted',   '2024-04-15T09:01:00.000Z', 'v1.0', 'email', 'ml', 12, 2),
  r(56, 'USR-013', 'partner_sharing', 'granted',   '2024-04-15T09:02:00.000Z', 'v1.0', 'email', 'ml', 12, 2),
  r(57, 'USR-013', 'analytics',       'granted',   '2024-04-15T09:03:00.000Z', 'v1.0', 'email', 'ml', 12, 2),
  r(58, 'USR-013', 'credit_reporting','granted',   '2024-04-15T09:04:00.000Z', 'v1.0', 'email', 'ml', 12, 2),
  r(59, 'USR-013', 'credit_reporting','withdrawn', '2024-06-10T15:00:00.000Z', 'v1.0', 'email', 'ml', 12, 3, 'Dispute regarding credit score accuracy — seeking resolution via RBI Ombudsman.'),

  // ── USR-014 Naveen Joshi ── No channel → BLOCKED ──────────────────────────
  r(60, 'USR-014', 'essential',       'granted',   '2024-05-01T10:00:00.000Z', 'v1.1', 'none',  'en', 13, 0),
  r(61, 'USR-014', 'marketing',       'granted',   '2024-05-01T10:01:00.000Z', 'v1.1', 'none',  'en', 13, 0),
  r(62, 'USR-014', 'analytics',       'granted',   '2024-05-01T10:02:00.000Z', 'v1.1', 'none',  'en', 13, 0),

  // ── USR-015 Aishwarya Rao ── All granted ─────────────────────────────────
  r(63, 'USR-015', 'essential',       'granted',   '2024-05-10T09:00:00.000Z', 'v2.0', 'email', 'kn', 14, 3),
  r(64, 'USR-015', 'marketing',       'granted',   '2024-05-10T09:01:00.000Z', 'v2.0', 'email', 'kn', 14, 3),
  r(65, 'USR-015', 'partner_sharing', 'granted',   '2024-05-10T09:02:00.000Z', 'v2.0', 'email', 'kn', 14, 3),
  r(66, 'USR-015', 'analytics',       'granted',   '2024-05-10T09:03:00.000Z', 'v2.0', 'email', 'kn', 14, 3),
  r(67, 'USR-015', 'credit_reporting','granted',   '2024-05-10T09:04:00.000Z', 'v2.0', 'email', 'kn', 14, 3),

  // ── USR-016 Tanmay Chatterjee ── Marketing withdrawn → RESTRICTED ─────────
  r(68, 'USR-016', 'essential',       'granted',   '2024-05-15T11:00:00.000Z', 'v1.0', 'sms',   'bn', 15, 4),
  r(69, 'USR-016', 'marketing',       'granted',   '2024-05-15T11:01:00.000Z', 'v1.0', 'sms',   'bn', 15, 4),
  r(70, 'USR-016', 'partner_sharing', 'granted',   '2024-05-15T11:02:00.000Z', 'v1.0', 'sms',   'bn', 15, 4),
  r(71, 'USR-016', 'analytics',       'granted',   '2024-05-15T11:03:00.000Z', 'v1.0', 'sms',   'bn', 15, 4),
  r(72, 'USR-016', 'marketing',       'withdrawn', '2024-06-20T10:00:00.000Z', 'v1.0', 'sms',   'bn', 15, 2, 'Opted out of all promotional and marketing content.'),

  // ── USR-017 Nisha Malhotra ── Partner sharing withdrawn → RESTRICTED ──────
  r(73, 'USR-017', 'essential',       'granted',   '2024-06-01T09:00:00.000Z', 'v1.1', 'email', 'pa', 16, 0),
  r(74, 'USR-017', 'marketing',       'granted',   '2024-06-01T09:01:00.000Z', 'v1.1', 'email', 'pa', 16, 0),
  r(75, 'USR-017', 'partner_sharing', 'granted',   '2024-06-01T09:02:00.000Z', 'v1.1', 'email', 'pa', 16, 0),
  r(76, 'USR-017', 'analytics',       'granted',   '2024-06-01T09:03:00.000Z', 'v1.1', 'email', 'pa', 16, 0),
  r(77, 'USR-017', 'partner_sharing', 'withdrawn', '2024-06-25T16:00:00.000Z', 'v1.1', 'email', 'pa', 16, 5, 'Requesting data sharing restriction per DPDPA §12 — regulatory compliance audit.'),

  // ── USR-018 Kiran Venkat ── Essential only (no optional opted in) ──────────
  r(78, 'USR-018', 'essential',       'granted',   '2024-06-10T10:00:00.000Z', 'v2.0', 'sms',   'te', 17, 4),
]
