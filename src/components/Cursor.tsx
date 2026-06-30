import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '../lib/useReducedMotion'

/**
 * Custom luxury cursor: a small dot + a lagging ring that grows over
 * interactive elements (anything with [data-cursor] or a/button).
 */
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)
  const [hover, setHover] = useState(false)
  const reduced = useReducedMotion()
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    if (reduced) return
    if (window.matchMedia('(pointer: fine)').matches) setEnabled(true)
  }, [reduced])

  useEffect(() => {
    if (!enabled) return
    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    const ringPos = { ...target }
    let raf = 0

    const move = (e: MouseEvent) => {
      target.x = e.clientX
      target.y = e.clientY
      if (dot.current) {
        dot.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`
      }
      const t = e.target as HTMLElement
      setHover(!!t.closest('a, button, [data-cursor]'))
    }
    const loop = () => {
      ringPos.x += (target.x - ringPos.x) * 0.16
      ringPos.y += (target.y - ringPos.y) * 0.16
      if (ring.current) {
        ring.current.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0)`
      }
      raf = requestAnimationFrame(loop)
    }
    window.addEventListener('mousemove', move)
    raf = requestAnimationFrame(loop)
    return () => {
      window.removeEventListener('mousemove', move)
      cancelAnimationFrame(raf)
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <>
      <div
        ref={dot}
        className="pointer-events-none fixed left-0 top-0 z-[90] -ml-1 -mt-1 h-2 w-2 rounded-full bg-accent-dark mix-blend-multiply"
      />
      <div
        ref={ring}
        className={`pointer-events-none fixed left-0 top-0 z-[90] grid place-items-center rounded-full border border-accent-dark/40 transition-[width,height,opacity] duration-300 ${
          hover ? 'h-16 w-16 bg-accent-dark/5' : 'h-9 w-9'
        }`}
        style={{ marginLeft: hover ? -32 : -18, marginTop: hover ? -32 : -18 }}
      />
    </>
  )
}
