import { Lock } from 'lucide-react'

export default function Toggle({ checked, onChange, disabled = false, id }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        style={{
          position: 'relative',
          width: '38px', height: '22px',
          borderRadius: '11px',
          border: 'none',
          padding: 0,
          cursor: disabled ? 'not-allowed' : 'pointer',
          backgroundColor: checked ? '#0D9488' : '#CBD5E1',
          opacity: disabled ? 0.55 : 1,
          transition: 'background-color 0.2s ease, box-shadow 0.15s',
          flexShrink: 0,
          outline: 'none',
          boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.06)',
        }}
        onFocus={e => { if (!disabled) e.target.style.boxShadow = '0 0 0 3px rgba(13,148,136,0.15)' }}
        onBlur={e => { e.target.style.boxShadow = 'inset 0 1px 2px rgba(0,0,0,0.06)' }}
      >
        <span
          style={{
            position: 'absolute',
            top: '3px',
            left: checked ? '19px' : '3px',
            width: '16px', height: '16px',
            borderRadius: '50%',
            backgroundColor: '#ffffff',
            transition: 'left 0.18s ease',
            boxShadow: '0 1px 3px rgba(10, 25, 47, 0.1)',
          }}
        />
      </button>
      {disabled && <Lock size={10} color="#94A3B8" />}
    </div>
  )
}
