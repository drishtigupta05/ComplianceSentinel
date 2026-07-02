export default function Card({ children, className = '', padding = true, hover = false, style = {} }) {
  return (
    <div
      className={`card-base${hover ? ' card-hover' : ''} ${className}`}
      style={{
        padding: padding ? '32px' : undefined,
        ...style,
      }}
    >
      {children}
    </div>
  )
}
