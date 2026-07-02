import { useState, useEffect, useRef } from 'react'

export function useIntersection(options = { threshold: 0.1, rootMargin: '0px' }) {
  const [hasIntersected, setHasIntersected] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setHasIntersected(true)
        // Trigger only once, so stop observing
        observer.unobserve(element)
      }
    }, options)

    observer.observe(element)

    return () => {
      if (element && !hasIntersected) {
        observer.unobserve(element)
      }
    }
  }, [options, hasIntersected])

  return [ref, hasIntersected]
}
