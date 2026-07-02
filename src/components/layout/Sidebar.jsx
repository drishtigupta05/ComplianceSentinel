import { NavLink, useNavigate } from 'react-router-dom'
import { Shield, FileCheck, BookOpen, Users, AlertTriangle, RotateCcw } from 'lucide-react'
import { useConsent } from '../../context/ConsentContext'
import { ADMIN_USER } from '../../data/users'
import { getInitials } from '../../utils/formatters'

const NAV_ITEMS = [
  { path: '/consent',  icon: FileCheck,     label: 'Consent Capture',  },
  { path: '/ledger',   icon: BookOpen,      label: 'Consent Ledger',   },
  { path: '/admin',    icon: Users,         label: 'DPO Dashboard',    },
  { path: '/incident', icon: AlertTriangle, label: 'Incident Linkage', },
]

export default function Sidebar() {
  const { dispatch } = useConsent()
  const navigate = useNavigate()

  function handleReset() {
    if (window.confirm('Reset all demo data to the seeded baseline?')) {
      dispatch({ type: 'RESET_DEMO' })
      navigate('/consent')
    }
  }

  return (
    <aside
      style={{
        backgroundColor: '#0A192F',
        width: '232px',
        position: 'fixed',
        top: 0, left: 0, bottom: 0,
        display: 'flex',
        flexDirection: 'column',
        zIndex: 50,
        borderRight: '1px solid rgba(255,255,255,0.05)',
      }}
    >
      {/* ── Brand ─────────────────────────────────────────────── */}
      <div style={{ padding: '24px 20px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
          <div
            style={{
              width: '28px', height: '28px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #0D9488, #0F766E)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
              boxShadow: '0 2px 8px rgba(13,148,136,0.4)',
            }}
          >
            <Shield size={14} color="#ffffff" />
          </div>
          <div>
            <p style={{ color: '#F1F5F9', fontSize: '14px', fontWeight: 600, lineHeight: 1.2 }}>
              Compliance
            </p>
            <p style={{ color: '#0D9488', fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              Sentinel
            </p>
          </div>
        </div>
        <p style={{ color: 'rgba(255,255,255,0.28)', fontSize: '11px', lineHeight: 1.5, marginTop: '10px' }}>
          AI-Powered Consent Intelligence
        </p>
      </div>

      {/* Divider */}
      <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.06)', margin: '0 20px' }} />

      {/* ── Navigation ────────────────────────────────────────── */}
      <nav style={{ flex: 1, padding: '16px 12px', overflowY: 'auto' }}>
        {NAV_ITEMS.map(({ path, icon: Icon, label }) => (
          <NavLink
            key={path}
            to={path}
            style={{ textDecoration: 'none' }}
          >
            {({ isActive }) => (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '9px 12px',
                  borderRadius: '10px',
                  marginBottom: '2px',
                  cursor: 'pointer',
                  transition: 'all 0.12s ease',
                  background: isActive ? 'rgba(13,148,136,0.14)' : 'transparent',
                  color: isActive ? '#ffffff' : 'rgba(255,255,255,0.45)',
                  position: 'relative',
                }}
                onMouseEnter={e => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
                    e.currentTarget.style.color = 'rgba(255,255,255,0.72)'
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.color = 'rgba(255,255,255,0.45)'
                  }
                }}
              >
                {isActive && (
                  <div
                    style={{
                      position: 'absolute',
                      left: 0, top: '50%',
                      transform: 'translateY(-50%)',
                      width: '3px', height: '18px',
                      borderRadius: '0 3px 3px 0',
                      background: '#0D9488',
                    }}
                  />
                )}
                <Icon
                  size={15}
                  color={isActive ? '#0D9488' : 'currentColor'}
                  style={{ flexShrink: 0 }}
                />
                <span style={{ fontSize: '13.5px', fontWeight: isActive ? 600 : 500 }}>
                  {label}
                </span>
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      {/* ── Footer ────────────────────────────────────────────── */}
      <div style={{ padding: '12px 16px 20px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        {/* Admin identity */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
          <div
            style={{
              width: '30px', height: '30px',
              borderRadius: '50%',
              background: 'rgba(13,148,136,0.2)',
              border: '1px solid rgba(13,148,136,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
              fontSize: '11px',
              fontWeight: 700,
              color: '#0D9488',
            }}
          >
            {getInitials(ADMIN_USER.name)}
          </div>
          <div style={{ minWidth: 0 }}>
            <p style={{ color: '#F1F5F9', fontSize: '12.5px', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {ADMIN_USER.name}
            </p>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '11px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {ADMIN_USER.role}
            </p>
          </div>
        </div>

        {/* Reset button */}
        <button
          onClick={handleReset}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            padding: '7px',
            borderRadius: '8px',
            border: '1px solid rgba(255,255,255,0.08)',
            background: 'transparent',
            color: 'rgba(255,255,255,0.3)',
            fontSize: '12px',
            cursor: 'pointer',
            transition: 'all 0.12s ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
            e.currentTarget.style.color = 'rgba(255,255,255,0.6)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.color = 'rgba(255,255,255,0.3)'
          }}
        >
          <RotateCcw size={11} />
          Reset Demo
        </button>
      </div>
    </aside>
  )
}
