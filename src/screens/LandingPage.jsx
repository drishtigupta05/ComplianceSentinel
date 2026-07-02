import { Link } from 'react-router-dom'
import { ArrowRight, Shield, Database, Lock, Sparkles, Activity, FileSpreadsheet, CheckCircle2 } from 'lucide-react'
import { useIntersection } from '../utils/useIntersection'
import AnimatedCounter from '../components/ui/AnimatedCounter'

// Local helper component for scroll triggered reveals
function Reveal({ children, delay = 0, threshold = 0.1 }) {
  const [ref, visible] = useIntersection({ threshold, rootMargin: '0px 0px -60px 0px' })
  return (
    <div
      ref={ref}
      className={`reveal-element ${visible ? 'visible' : ''}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

export default function LandingPage() {
  const handleScroll = (id) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const [progressRef, progressVisible] = useIntersection({ threshold: 0.1 })

  return (
    <div
      style={{
        backgroundColor: '#FAFBFD',
        color: '#0A192F',
        minHeight: '100vh',
        paddingTop: '72px',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* ── AMBIENT HERO BACKGROUND GLOW ────────────────────────── */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '600px', overflow: 'hidden', zIndex: 0, pointerEvents: 'none' }}>
        <div 
          className="ambient-mesh-glow" 
          style={{ 
            top: '-20%', 
            left: '15%', 
            width: '450px', 
            height: '450px', 
            backgroundColor: 'rgba(13, 148, 136, 0.12)' 
          }} 
        />
        <div 
          className="ambient-mesh-glow" 
          style={{ 
            top: '10%', 
            right: '15%', 
            width: '500px', 
            height: '500px', 
            backgroundColor: 'rgba(10, 25, 47, 0.06)',
            animationDelay: '-12s'
          }} 
        />
      </div>

      {/* ── HERO SECTION ────────────────────────────────────────── */}
      <section
        style={{
          padding: '140px 24px 100px',
          textAlign: 'center',
          maxWidth: '900px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 10,
        }}
      >
        <div
          className="hero-reveal-line"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#F0FDFA',
            border: '1px solid #CCFBF1',
            padding: '6px 14px',
            borderRadius: '20px',
            marginBottom: '24px',
            animationDelay: '100ms',
          }}
        >
          <Sparkles size={12} color="#0D9488" />
          <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#0D9488', letterSpacing: '0.02em' }}>
            Next-Gen Consent Intelligence for DPDPA 2023
          </span>
        </div>

        <h1
          style={{
            fontSize: '56px',
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: '-0.03em',
            color: '#0A192F',
            marginBottom: '24px',
          }}
        >
          <span className="hero-reveal-line" style={{ display: 'block', animationDelay: '250ms' }}>
            Compliance Sentinel
          </span>
          <span className="hero-reveal-line" style={{ display: 'block', animationDelay: '370ms', color: '#4A5568', fontWeight: 700, fontSize: '42px', marginTop: '12px' }}>
            AI-powered compliance intelligence
          </span>
          <span className="hero-reveal-line" style={{ display: 'block', animationDelay: '490ms', color: '#0D9488', fontSize: '36px', fontWeight: 600, marginTop: '8px' }}>
            for consent governance.
          </span>
        </h1>

        <p
          className="hero-reveal-line"
          style={{
            fontSize: '18px',
            lineHeight: 1.6,
            color: '#64748B',
            maxWidth: '680px',
            margin: '0 auto 40px',
            fontWeight: 400,
            animationDelay: '640ms',
          }}
        >
          Automate regulatory alignment, manage immutable audit trails, and calculate contact eligibility dynamically. Built for modern privacy engineering.
        </p>

        <div 
          className="hero-reveal-line"
          style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '16px', 
            flexWrap: 'wrap',
            animationDelay: '780ms',
          }}
        >
          <Link
            to="/consent"
            className="btn-primary btn-tactile"
            style={{
              padding: '14px 28px',
              fontSize: '14.5px',
              fontWeight: 600,
              boxShadow: '0 4px 20px rgba(10, 25, 47, 0.15)',
            }}
          >
            <span>Launch Platform</span>
            <ArrowRight size={16} />
          </Link>
          <button
            onClick={() => handleScroll('platform-overview')}
            className="btn-ghost btn-tactile"
            style={{
              padding: '14px 28px',
              fontSize: '14.5px',
              fontWeight: 600,
            }}
          >
            Explore Platform
          </button>
        </div>
      </section>

      {/* ── PLATFORM OVERVIEW ───────────────────────────────────── */}
      <section
        id="platform-overview"
        style={{
          padding: '100px 48px',
          borderTop: '1px solid rgba(10, 25, 47, 0.04)',
          maxWidth: '1280px',
          margin: '0 auto',
          width: '100%',
          position: 'relative',
          zIndex: 10,
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px', alignItems: 'center', flexWrap: 'wrap' }}>
          <Reveal delay={100}>
            <div>
              <h2
                style={{
                  fontSize: '32px',
                  fontWeight: 800,
                  letterSpacing: '-0.02em',
                  lineHeight: 1.2,
                  color: '#0A192F',
                  marginBottom: '20px',
                }}
              >
                Consent governance built on trust and transparency.
              </h2>
              <p style={{ fontSize: '15px', color: '#64748B', lineHeight: 1.7, marginBottom: '24px' }}>
                Compliance Sentinel translates complex regulatory statutes like the Digital Personal Data Protection Act (DPDPA) 2023 and CERT-In guidelines into active engineering pipelines. 
              </p>
              <p style={{ fontSize: '15px', color: '#64748B', lineHeight: 1.7, marginBottom: '32px' }}>
                By pairing immutable append-only ledger technology with flexible user preference controls, we deliver compliance assurance without slowing down application scale.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[
                  'Real-time Data Principal preference maps',
                  'Write-Once-Read-Many (WORM) audit ledger',
                  'Automated breach linkage and eligibility simulator'
                ].map(text => (
                  <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <CheckCircle2 size={16} color="#0D9488" />
                    <span style={{ fontSize: '14px', fontWeight: 600, color: '#334155' }}>{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
            <Reveal delay={200}>
              <div
                className="card-premium"
                style={{ padding: '32px', borderLeft: '4px solid #0A192F' }}
              >
                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <div style={{ padding: '10px', backgroundColor: '#F0F4F8', borderRadius: '8px', color: '#0A192F' }}>
                    <Database size={20} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0A192F', marginBottom: '8px' }}>Granular Consent Architecture</h3>
                    <p style={{ fontSize: '13.5px', color: '#64748B', lineHeight: 1.6, margin: 0 }}>
                      Track user agreements down to individual processing purposes, rather than generic all-or-nothing terms.
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal delay={300}>
              <div
                className="card-premium"
                style={{ padding: '32px', borderLeft: '4px solid #0D9488' }}
              >
                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <div style={{ padding: '10px', backgroundColor: '#F0FDFA', borderRadius: '8px', color: '#0D9488' }}>
                    <Lock size={20} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0A192F', marginBottom: '8px' }}>Immutable WORM Ledgers</h3>
                    <p style={{ fontSize: '13.5px', color: '#64748B', lineHeight: 1.6, margin: 0 }}>
                      Every consent grant and withdrawal is logged with cryptographic hashes, preventing retrospective modification.
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── FEATURE HIGHLIGHTS ──────────────────────────────────── */}
      <section
        id="feature-highlights"
        style={{
          padding: '100px 48px',
          backgroundColor: '#ffffff',
          borderTop: '1px solid rgba(10, 25, 47, 0.04)',
          borderBottom: '1px solid rgba(10, 25, 47, 0.04)',
          width: '100%',
          position: 'relative',
          zIndex: 10,
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <Reveal delay={100}>
            <div style={{ textAlign: 'center', marginBottom: '64px' }}>
              <p style={{ fontSize: '12.5px', fontWeight: 700, color: '#0D9488', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>
                Built for Scale
              </p>
              <h2
                style={{
                  fontSize: '36px',
                  fontWeight: 800,
                  letterSpacing: '-0.02em',
                  color: '#0A192F',
                  marginBottom: '16px',
                }}
              >
                Everything you need for personal data governance.
              </h2>
              <p style={{ fontSize: '15.5px', color: '#64748B', maxWidth: '600px', margin: '0 auto' }}>
                Ensure constant compliance verification through clean dashboard analytics, queryable ledger states, and automated incident assessments.
              </p>
            </div>
          </Reveal>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
            {[
              {
                icon: Activity,
                title: 'Live Preference Capture',
                desc: 'Give users granular controls over notifications, channels, and languages to conform with DPDPA Schedule II provisions.',
                tag: 'Consent Capture'
              },
              {
                icon: FileSpreadsheet,
                title: 'Tamper-Evident Auditing',
                desc: 'Search, filter, and audit consent histories easily with our append-only ledger containing cryptographic signatures.',
                tag: 'Consent Ledger'
              },
              {
                icon: Shield,
                title: 'Simulated Breach Linkage',
                desc: 'Map data leaks to user preferences to determine who can legally be notified, instantly verifying CERT-In compliance paths.',
                tag: 'Incident Simulator'
              }
            ].map((f, i) => (
              <Reveal key={i} delay={150 * (i + 1)}>
                <div
                  className="card-premium"
                  style={{ padding: '32px', display: 'flex', flexDirection: 'column', height: '100%' }}
                >
                  <div style={{ display: 'inline-flex', alignSelf: 'flex-start', padding: '10px', backgroundColor: '#FAFBFD', borderRadius: '8px', color: '#0A192F', marginBottom: '24px', border: '1px solid rgba(10, 25, 47, 0.04)' }}>
                    <f.icon size={20} />
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#0D9488', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                    {f.tag}
                  </span>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0A192F', marginBottom: '12px' }}>
                    {f.title}
                  </h3>
                  <p style={{ fontSize: '13.5px', color: '#64748B', lineHeight: 1.6, margin: 0, flex: 1 }}>
                    {f.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────────────────────── */}
      <section
        id="how-it-works"
        style={{
          padding: '100px 48px',
          maxWidth: '1280px',
          margin: '0 auto',
          width: '100%',
          position: 'relative',
          zIndex: 10,
        }}
      >
        <Reveal delay={100}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <h2
              style={{
                fontSize: '32px',
                fontWeight: 800,
                letterSpacing: '-0.02em',
                color: '#0A192F',
                marginBottom: '16px',
              }}
            >
              The Compliance Flow
            </h2>
            <p style={{ fontSize: '15px', color: '#64748B' }}>
              A comprehensive pipeline from preference capture to incident auditing.
            </p>
          </div>
        </Reveal>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px' }}>
          {[
            { step: '01', title: 'Capture Preference', desc: 'User logs preferences via consent captures (email vs SMS, language, purposes).' },
            { step: '02', title: 'Record Ledger', desc: 'Ledger registers append-only records with hashes, IP/UserAgent trackers, and timestamps.' },
            { step: '03', title: 'Monitor Portal', desc: 'DPOs track active states and check specific user compliance summaries.' },
            { step: '04', title: 'Audit Linkage', desc: 'Engine simulated reports check contact options against live consent tables.' }
          ].map((s, i) => (
            <Reveal key={i} delay={100 * (i + 1)}>
              <div style={{ position: 'relative' }}>
                <div style={{ fontSize: '48px', fontWeight: 800, color: 'rgba(13, 148, 136, 0.08)', fontFamily: 'var(--font-mono)', lineHeight: 1, marginBottom: '16px' }}>
                  {s.step}
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0A192F', marginBottom: '8px' }}>
                  {s.title}
                </h3>
                <p style={{ fontSize: '13px', color: '#64748B', lineHeight: 1.6, margin: 0 }}>
                  {s.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── PROTOTYPE PREVIEW ───────────────────────────────────── */}
      <section
        id="prototype-preview"
        style={{
          padding: '100px 48px',
          backgroundColor: '#0A192F',
          color: '#ffffff',
          width: '100%',
          position: 'relative',
          zIndex: 10,
        }}
      >
        <div style={{ maxWidth: '1080px', margin: '0 auto', textAlign: 'center' }}>
          <Reveal delay={100}>
            <div>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#0D9488', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '16px' }}>
                Interactive Demo
              </span>
              <h2
                style={{
                  fontSize: '36px',
                  fontWeight: 800,
                  letterSpacing: '-0.02em',
                  color: '#ffffff',
                  marginBottom: '24px',
                }}
              >
                Explore the active platform prototype.
              </h2>
              <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.6)', maxWidth: '640px', margin: '0 auto 48px', lineHeight: 1.6 }}>
                Toggle active consents, view the cryptographic ledgers, search user records as a Data Protection Officer, and trigger breach simulated reports.
              </p>
            </div>
          </Reveal>

          {/* Styled Mockup Window */}
          <Reveal delay={200}>
            <div
              className="card-premium"
              style={{
                backgroundColor: '#0F2440',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '16px',
                padding: '32px',
                textAlign: 'left',
                boxShadow: '0 24px 60px rgba(0,0,0,0.35)',
                marginBottom: '48px',
                maxWidth: '800px',
                margin: '0 auto 48px',
              }}
            >
              <div style={{ display: 'flex', gap: '6px', marginBottom: '20px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#EF4444' }} />
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#F59E0B' }} />
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981' }} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '16px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: '#ffffff' }}>Consent Ledger Console</span>
                  <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: '#0D9488', fontWeight: 600 }}>WORM LEDGER RUNNING</span>
                </div>
                
                {/* Active Numbers Trigger Count-up */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr', gap: '16px', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', fontFamily: 'var(--font-mono)', color: 'rgba(255,255,255,0.4)' }}>
                    CR-00<AnimatedCounter value={24} duration={800} />
                  </span>
                  <span style={{ fontSize: '13.5px', color: 'rgba(255,255,255,0.8)', fontWeight: 500 }}>Purpose: Essential Services</span>
                  <span style={{ fontSize: '11px', color: '#10B981', textAlign: 'right', fontWeight: 700 }}>GRANTED</span>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr', gap: '16px', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', fontFamily: 'var(--font-mono)', color: 'rgba(255,255,255,0.4)' }}>
                    CR-00<AnimatedCounter value={25} duration={850} />
                  </span>
                  <span style={{ fontSize: '13.5px', color: 'rgba(255,255,255,0.8)', fontWeight: 500 }}>Purpose: Marketing Analytics</span>
                  <span style={{ fontSize: '11px', color: '#EF4444', textAlign: 'right', fontWeight: 700 }}>WITHDRAWN</span>
                </div>

                <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.04)', margin: '8px 0' }} />

                {/* Progress bar reveal */}
                <div ref={progressRef} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>
                    <span>Dynamic Consent Integrity Index</span>
                    <span style={{ fontFamily: 'var(--font-mono)' }}>99.8%</span>
                  </div>
                  <div style={{ width: '100%', height: '6px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{
                      width: progressVisible ? '99.8%' : '0%',
                      height: '100%',
                      backgroundColor: '#0D9488',
                      borderRadius: '3px',
                      transition: 'width 1.5s cubic-bezier(0.16, 1, 0.3, 1)',
                    }} />
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={300}>
            <Link
              to="/consent"
              className="btn-teal btn-tactile"
              style={{
                padding: '14px 32px',
                fontSize: '15px',
                fontWeight: 600,
                boxShadow: '0 4px 20px rgba(13, 148, 136, 0.25)',
              }}
            >
              <span>Open Sandbox Prototype</span>
              <ArrowRight size={16} />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────── */}
      <footer
        style={{
          backgroundColor: '#FAFBFD',
          borderTop: '1px solid rgba(10, 25, 47, 0.05)',
          padding: '80px 48px 40px',
          width: '100%',
          position: 'relative',
          zIndex: 10,
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <Reveal delay={100}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', flexWrap: 'wrap', gap: '24px' }}>
              <div>
                <p style={{ fontSize: '16px', fontWeight: 700, color: '#0A192F', margin: 0 }}>Compliance Sentinel</p>
                <p style={{ fontSize: '12.5px', color: '#64748B', marginTop: '4px' }}>
                  Secure, immutable, real-time consent orchestration.
                </p>
              </div>
              <div style={{ display: 'flex', gap: '24px' }}>
                <button onClick={() => handleScroll('platform-overview')} className="nav-link-animated" style={{ background: 'none', border: 'none', color: '#64748B', fontSize: '13.5px', cursor: 'pointer', fontWeight: 500 }}>Platform</button>
                <button onClick={() => handleScroll('feature-highlights')} className="nav-link-animated" style={{ background: 'none', border: 'none', color: '#64748B', fontSize: '13.5px', cursor: 'pointer', fontWeight: 500 }}>Solutions</button>
                <button onClick={() => handleScroll('how-it-works')} className="nav-link-animated" style={{ background: 'none', border: 'none', color: '#64748B', fontSize: '13.5px', cursor: 'pointer', fontWeight: 500 }}>Process</button>
                <Link to="/consent" style={{ textDecoration: 'none', color: '#0D9488', fontSize: '13.5px', fontWeight: 700 }}>Launch Demo</Link>
              </div>
            </div>
          </Reveal>

          <Reveal delay={200}>
            <div style={{ borderTop: '1px solid rgba(10, 25, 47, 0.04)', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
              <span style={{ fontSize: '12px', color: '#94A3B8' }}>
                &copy; {new Date().getFullYear()} Compliance Sentinel. All rights reserved.
              </span>
              <span style={{ fontSize: '11px', color: '#CBD5E1', maxWidth: '500px', textAlign: 'right', lineHeight: 1.4 }}>
                Disclaimer: All data displayed represents simulated mock values created under Personal Data Protection Act compliance guidelines for demonstration purposes.
              </span>
            </div>
          </Reveal>
        </div>
      </footer>
    </div>
  )
}
