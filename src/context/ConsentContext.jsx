import { createContext, useContext, useReducer, useEffect } from 'react'
import { USERS } from '../data/users'
import { PURPOSES } from '../data/purposes'
import { SEEDED_RECORDS } from '../data/consentRecords'
import { BREACH_CASES } from '../data/breachCases'

const STORAGE_KEY = 'cs_consent_records_v1'

// ── Helpers ────────────────────────────────────────────────────────────────

function fakeHash(seed) {
  const hex = '0123456789abcdef'
  let h = ''
  let s = typeof seed === 'string'
    ? seed.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
    : seed
  s = Math.abs(s)
  for (let i = 0; i < 64; i++) {
    s = ((s * 1103515245 + 12345) >>> 0) ^ (s >>> 16)
    h += hex[s % 16]
    s = (s * 22695477 + 1) >>> 0
  }
  return h
}

function generateMockIP() {
  const a = Math.floor(Math.random() * 30) + 10
  const b = Math.floor(Math.random() * 256)
  const c = Math.floor(Math.random() * 256)
  return `192.168.${a}.${c}`
}

// ── Initial state ───────────────────────────────────────────────────────────

function buildInitialState(storedRecords, storedSeq) {
  return {
    users: USERS,
    purposes: PURPOSES,
    breachCases: BREACH_CASES,
    // WORM: storedRecords always >= SEEDED_RECORDS (only ever grows)
    consentRecords: storedRecords || SEEDED_RECORDS,
    nextRecordSeq: storedSeq || (SEEDED_RECORDS.length + 1),
    adminSelectedUserId: null,
  }
}

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      return buildInitialState(parsed.consentRecords, parsed.nextRecordSeq)
    }
  } catch (_) {}
  return buildInitialState(null, null)
}

// ── Reducer ─────────────────────────────────────────────────────────────────

function reducer(state, action) {
  switch (action.type) {

    // WORM: only ever APPENDS new records — never mutates, never deletes
    case 'SUBMIT_CONSENT': {
      const { userId, grants, channel, language } = action.payload
      const timestamp = new Date().toISOString()
      const noticeVersion = 'v2.0'
      let seq = state.nextRecordSeq
      const newRecords = []

      for (const [purpose, wantGranted] of Object.entries(grants)) {
        // Skip mandatory purpose — it's always granted, never re-written unless status changed
        const existing = [...state.consentRecords]
          .filter(r => r.userId === userId && r.purpose === purpose)
          .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0]

        const newStatus = wantGranted ? 'granted' : 'withdrawn'
        if (!existing || existing.status !== newStatus) {
          const id = `CR-${String(seq).padStart(4, '0')}`
          newRecords.push({
            id,
            userId,
            purpose,
            status: newStatus,
            timestamp,
            noticeVersion,
            channel,
            language,
            ipAddress: generateMockIP(),
            userAgent: navigator.userAgent.slice(0, 60),
            withdrawnAt: newStatus === 'withdrawn' ? timestamp : null,
            withdrawnReason: newStatus === 'withdrawn' ? 'User preference update via Consent Portal' : null,
            recordHash: fakeHash(id + userId + purpose + timestamp),
            isSeeded: false,
          })
          seq++
        }
      }

      if (newRecords.length === 0) return state

      return {
        ...state,
        consentRecords: [...state.consentRecords, ...newRecords],
        nextRecordSeq: seq,
      }
    }

    case 'SELECT_ADMIN_USER':
      return { ...state, adminSelectedUserId: action.payload.userId }

    case 'RESET_DEMO': {
      try { localStorage.removeItem(STORAGE_KEY) } catch (_) {}
      return buildInitialState(null, null)
    }

    default:
      return state
  }
}

// ── Context ─────────────────────────────────────────────────────────────────

export const ConsentContext = createContext(null)

export function ConsentProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, null, loadFromStorage)

  // Persist WORM record log on every change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        consentRecords: state.consentRecords,
        nextRecordSeq: state.nextRecordSeq,
      }))
    } catch (_) {}
  }, [state.consentRecords, state.nextRecordSeq])

  return (
    <ConsentContext.Provider value={{ state, dispatch }}>
      {children}
    </ConsentContext.Provider>
  )
}

export function useConsent() {
  const ctx = useContext(ConsentContext)
  if (!ctx) throw new Error('useConsent must be used inside <ConsentProvider>')
  return ctx
}
