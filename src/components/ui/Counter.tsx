import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '../../lib/useReducedMotion'

interface Props {
  value: number
  prefix?: string
  suffix?: string
  duration?: number
  className?: string
}

/** Count-up number that animates the first time it scrolls into view. */
export default function Counter({ value, prefix = '', suffix = '', duration = 1800, className = '' }: Props) {
  const ref = useRef<HTMLSpanElement>(null)
  const [n, setN] = useState(0)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) {
      setN(value)
      return
    }
    const el = ref.current
    if (!el) return
    let raf = 0
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return
        io.disconnect()
        const start = performance.now()
        const tick = (t: number) => {
          const p = Math.min(1, (t - start) / duration)
          const eased = 1 - Math.pow(1 - p, 3)
          setN(Math.round(value * eased))
          if (p < 1) raf = requestAnimationFrame(tick)
        }
        raf = requestAnimationFrame(tick)
      },
      { threshold: 0.4 },
    )
    io.observe(el)
    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [value, duration, reduced])

  return (
    <span ref={ref} className={className}>
      {prefix}
      {n}
      {suffix}
    </span>
  )
}
