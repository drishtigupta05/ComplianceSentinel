import { useLocation, Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Shield, RotateCcw, ArrowRight, LogOut } from 'lucide-react'
import { useConsent } from '../../context/ConsentContext'
import { ADMIN_USER } from '../../data/users'
import { getInitials } from '../../utils/formatters'

export default function Header() {
  const { dispatch } = useConsent()
  const location = useLocation()
  const navigate = useNavigate()
  const isLanding = location.pathname === '/'

  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScrollEvent = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScrollEvent, { passive: true })
    return () => window.removeEventListener('scroll', handleScrollEvent)
  }, [])

  function handleReset() {
    if (window.confirm('Reset all demo data to the seeded baseline?')) {
      dispatch({ type: 'RESET_DEMO' })
      navigate('/consent')
    }
  }

  const handleScroll = (id) => {
    if (!isLanding) {
      navigate('/')
      setTimeout(() => {
        const element = document.getElementById(id)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        }
      }, 100)
    } else {
      const element = document.getElementById(id)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  return (
    <header
      className={scrolled ? 'header-glass' : ''}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: scrolled ? '60px' : '72px',
        backgroundColor: scrolled ? 'rgba(255, 255, 255, 0.72)' : 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(10, 25, 47, 0.05)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 32px',
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        boxShadow: scrolled ? '0 4px 30px rgba(10, 25, 47, 0.03)' : 'none',
      }}
    >
      {/* ── Brand / Logo ──────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            textDecoration: 'none',
            color: 'inherit',
          }}
        >
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #0A192F, #0D9488)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(10, 25, 47, 0.1)',
            }}
          >
            <Shield size={16} color="#ffffff" />
          </div>
          <div>
            <span
              style={{
                color: '#0A192F',
                fontSize: '15px',
                fontWeight: 700,
                lineHeight: 1,
                letterSpacing: '-0.02em',
              }}
            >
              Compliance
            </span>
            <span
              style={{
                color: '#0D9488',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                display: 'block',
                marginTop: '1px',
              }}
            >
              Sentinel
            </span>
          </div>
        </Link>
        {!isLanding && (
          <span
            style={{
              fontSize: '10px',
              fontWeight: 700,
              letterSpacing: '0.05em',
              color: '#0D9488',
              backgroundColor: '#F0FDFA',
              border: '1px solid #CCFBF1',
              padding: '2px 6px',
              borderRadius: '4px',
              marginLeft: '4px',
            }}
          >
            PROTOTYPE
          </span>
        )}
      </div>

      {/* ── Navigation Menu ───────────────────────────────────── */}
      {isLanding ? (
        // Marketing Nav (Landing Page)
        <nav style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <button
            onClick={() => handleScroll('platform-overview')}
            className="nav-link-animated"
            style={{
              background: 'none',
              border: 'none',
              color: '#4A5568',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            Platform
          </button>
          <button
            onClick={() => handleScroll('feature-highlights')}
            className="nav-link-animated"
            style={{
              background: 'none',
              border: 'none',
              color: '#4A5568',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            Solutions
          </button>
          <button
            onClick={() => handleScroll('how-it-works')}
            className="nav-link-animated"
            style={{
              background: 'none',
              border: 'none',
              color: '#4A5568',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            How it Works
          </button>
          <button
            onClick={() => handleScroll('prototype-preview')}
            className="nav-link-animated"
            style={{
              background: 'none',
              border: 'none',
              color: '#4A5568',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            Prototype
          </button>
        </nav>
      ) : (
        // Application Navigation (Tabs)
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'rgba(10, 25, 47, 0.03)',
            padding: '4px',
            borderRadius: '10px',
            border: '1px solid rgba(10, 25, 47, 0.02)',
          }}
        >
          {[
            { path: '/consent', label: 'Consent Capture' },
            { path: '/ledger', label: 'Consent Ledger' },
            { path: '/admin', label: 'DPO Dashboard' },
            { path: '/incident', label: 'Incident Linkage' },
          ].map((item) => {
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  textDecoration: 'none',
                  fontSize: '13.5px',
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? '#0A192F' : '#64748B',
                  backgroundColor: isActive ? '#ffffff' : 'transparent',
                  padding: '6px 14px',
                  borderRadius: '6px',
                  boxShadow: isActive ? '0 1px 3px rgba(10, 25, 47, 0.05)' : 'none',
                  transition: 'var(--transition-fast)',
                }}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>
      )}

      {/* ── Actions ───────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {isLanding ? (
          // Landing Page Launch Demo button
          <Link
            to="/consent"
            className="btn-primary btn-tactile"
            style={{ padding: '8px 16px', fontSize: '13px' }}
          >
            <span>Launch Demo</span>
            <ArrowRight size={14} />
          </Link>
        ) : (
          // Application Page Controls
          <>
            {/* Reset Button */}
            <button
              onClick={handleReset}
              className="btn-tactile"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '8px',
                border: '1px solid rgba(10, 25, 47, 0.08)',
                background: 'transparent',
                color: '#64748B',
                fontSize: '12.5px',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              <RotateCcw size={12} />
              <span>Reset Data</span>
            </button>

            {/* DPO Profile Tag */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '4px 10px 4px 6px',
                backgroundColor: 'rgba(10, 25, 47, 0.03)',
                borderRadius: '20px',
                border: '1px solid rgba(10, 25, 47, 0.02)',
              }}
            >
              <div
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #0A192F, #0F2440)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '10px',
                  fontWeight: 700,
                  color: '#ffffff',
                }}
              >
                {getInitials(ADMIN_USER.name)}
              </div>
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#334155',
                }}
              >
                DPO Admin
              </span>
            </div>

            {/* Exit Demo Icon */}
            <Link
              to="/"
              title="Exit Prototype"
              className="btn-tactile"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                border: '1px solid rgba(10, 25, 47, 0.08)',
                color: '#64748B',
              }}
            >
              <LogOut size={14} />
            </Link>
          </>
        )}
      </div>
    </header>
  )
}
