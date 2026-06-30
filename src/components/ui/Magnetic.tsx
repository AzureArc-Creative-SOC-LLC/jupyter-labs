import { useRef, type ReactNode } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useReducedMotion } from '../../lib/useReducedMotion'

interface Props {
  children: ReactNode
  className?: string
  /** how strongly the element follows the cursor */
  strength?: number
}

/** Magnetic hover wrapper — element drifts toward the cursor with spring inertia. */
export default function Magnetic({ children, className = '', strength = 0.4 }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 180, damping: 14, mass: 0.4 })
  const sy = useSpring(y, { stiffness: 180, damping: 14, mass: 0.4 })

  function onMove(e: React.MouseEvent) {
    if (reduced || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    x.set((e.clientX - (r.left + r.width / 2)) * strength)
    y.set((e.clientY - (r.top + r.height / 2)) * strength)
  }
  function reset() {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      onMouseMove={onMove}
      onMouseLeave={reset}
      style={{ x: sx, y: sy }}
    >
      {children}
    </motion.div>
  )
}
