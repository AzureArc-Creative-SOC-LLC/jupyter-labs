import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const EASE = [0.16, 1, 0.3, 1] as const

/** Cinematic entrance: counter sweep + curtain reveal, then unmounts. */
export default function Preloader({ onDone }: { onDone: () => void }) {
  const [count, setCount] = useState(0)
  const [open, setOpen] = useState(true)

  useEffect(() => {
    const start = performance.now()
    const dur = 1900
    let raf = 0
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur)
      setCount(Math.round((1 - Math.pow(1 - p, 3)) * 100))
      if (p < 1) raf = requestAnimationFrame(tick)
      else setTimeout(() => setOpen(false), 350)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <AnimatePresence onExitComplete={onDone}>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-accent-dark text-bg grain"
          exit={{ y: '-100%' }}
          transition={{ duration: 1.1, ease: EASE }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20, filter: 'blur(12px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1, ease: EASE }}
            className="overflow-hidden"
          >
            <span className="inline-flex items-center gap-4 font-display leading-none">
              <span className="text-[14vw] font-medium lowercase tracking-[-0.05em] sm:text-[7rem]" style={{ fontFeatureSettings: '"ss01", "cv01"' }}>
                <span className="italic text-bg/85">j</span>upyter
              </span>
              <span className="h-[7vw] w-px bg-bg/40 sm:h-[3.5rem]" />
              <span className="text-[1.4vw] font-medium uppercase tracking-[0.34em] text-bg/85 sm:text-[0.7rem]">
                Labs
              </span>
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-6 flex w-[min(78vw,420px)] items-center justify-between text-xs uppercase tracking-[0.3em] text-bg/60"
          >
            <span>Elevate Daily Wellness</span>
            <span className="tabular-nums">{count}%</span>
          </motion.div>

          <div className="mt-3 h-px w-[min(78vw,420px)] overflow-hidden bg-bg/15">
            <div className="h-full bg-bg/80" style={{ width: `${count}%` }} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
