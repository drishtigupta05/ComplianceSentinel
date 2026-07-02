import { Search } from 'lucide-react'

export default function SearchInput({ value, onChange, placeholder = 'Search…', id }) {
  return (
    <div style={{ position: 'relative' }}>
      <Search
        size={13}
        style={{
          position: 'absolute', left: '12px', top: '50%',
          transform: 'translateY(-50%)',
          color: '#CBD5E1',
          pointerEvents: 'none',
          transition: 'color 0.12s',
        }}
      />
      <input
        id={id}
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="input-base"
        style={{
          paddingLeft: '36px',
          paddingRight: '12px',
          width: '100%',
        }}
        onFocus={e => {
          e.target.style.borderColor = '#0D9488'
          e.target.style.boxShadow = '0 0 0 3px rgba(13,148,136,0.1)'
          const icon = e.target.previousSibling
          if (icon) icon.style.color = '#0D9488'
        }}
        onBlur={e => {
          e.target.style.borderColor = 'rgba(0,0,0,0.09)'
          e.target.style.boxShadow = 'none'
          const icon = e.target.previousSibling
          if (icon) icon.style.color = '#CBD5E1'
        }}
      />
    </div>
  )
}
