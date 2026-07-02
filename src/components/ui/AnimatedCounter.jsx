import { useEffect, useState } from 'react'
import { useIntersection } from '../../utils/useIntersection'

export default function AnimatedCounter({ value, duration = 1000 }) {
  const numericVal = typeof value === 'number' 
    ? value 
    : parseInt(String(value).replace(/,/g, ''), 10) || 0

  const [count, setCount] = useState(0)
  const [ref, visible] = useIntersection({ threshold: 0.1 })

  useEffect(() => {
    if (!visible) return

    let start = 0
    const end = numericVal
    if (start === end) {
      setCount(end)
      return
    }

    const startTime = performance.now()

    let animationFrameId

    const updateCount = (currentTime) => {
      const elapsedTime = currentTime - startTime
      if (elapsedTime >= duration) {
        setCount(end)
      } else {
        // Quadratic ease-out formula
        const progress = elapsedTime / duration
        const easeOutProgress = 1 - (1 - progress) * (1 - progress)
        const currentCount = Math.floor(easeOutProgress * end)
        setCount(currentCount)
        animationFrameId = requestAnimationFrame(updateCount)
      }
    }

    animationFrameId = requestAnimationFrame(updateCount)

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
    }
  }, [numericVal, visible, duration])

  // Preserve trailing or prefix styling formatting if value was passed as a string
  const formatValue = () => {
    if (!visible) return '0'
    return count.toLocaleString()
  }

  return (
    <span ref={ref}>
      {formatValue()}
    </span>
  )
}
