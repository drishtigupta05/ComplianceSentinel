export default function MonoText({ children, size = '12px', color = '#475569', className = '' }) {
  return (
    <span
      className={`font-mono ${className}`}
      style={{
        fontSize: size,
        color,
      }}
    >
      {children}
    </span>
  )
}
