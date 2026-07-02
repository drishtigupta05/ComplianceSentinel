export default function SelectInput({ value, onChange, options, placeholder, id, width }) {
  return (
    <div style={{ position: 'relative', width }}>
      <select
        id={id}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="input-base"
        style={{
          width: '100%',
          paddingRight: '32px',
          appearance: 'none',
          WebkitAppearance: 'none',
          cursor: 'pointer',
          color: value ? '#0F1117' : '#94A3B8',
        }}
        onFocus={e => {
          e.target.style.borderColor = '#0D9488'
          e.target.style.boxShadow = '0 0 0 3px rgba(13,148,136,0.1)'
        }}
        onBlur={e => {
          e.target.style.borderColor = 'rgba(0,0,0,0.09)'
          e.target.style.boxShadow = 'none'
        }}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      <svg
        style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#94A3B8' }}
        width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </div>
  )
}
