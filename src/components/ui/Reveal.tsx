import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { useReducedMotion } from '../../lib/useReducedMotion'

interface Props {
  children: ReactNode
  className?: string
  delay?: number
  y?: number
  blur?: boolean
  once?: boolean
}

/** Lightweight in-view reveal for blocks (Framer Motion). */
export default function Reveal({
  children,
  className = '',
  delay = 0,
  y = 36,
  blur = true,
  once = true,
}: Props) {
  const reduced = useReducedMotion()
  if (reduced) return <div className={className}>{children}</div>

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, filter: blur ? 'blur(10px)' : 'blur(0px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once, margin: '0px 0px -12% 0px' }}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}
