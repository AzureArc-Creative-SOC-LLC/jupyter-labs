import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Heading from '../ui/Heading'
import Reveal from '../ui/Reveal'
import Img from '../ui/Img'
import { IMG } from '../../lib/content'

const ITEMS = [
  { t: 'Climate-neutral shipping', d: 'Every order is carbon-offset, end to end.' },
  { t: 'Glass & aluminium', d: 'Infinitely recyclable packaging — no single-use plastic.' },
  { t: 'Regenerative sourcing', d: 'We partner with farms restoring soil and biodiversity.' },
  { t: 'Refill program', d: 'Keep the bottle, renew the ritual — and waste less.' },
]

export default function Sustainability() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['-10%', '14%'])

  return (
    <section id="sustainability" className="relative bg-bg py-24 lg:py-32">
      <div className="container-x">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <div>
            <Heading
              eyebrow="Sustainability & Quality"
              title={'Good for you.\nGentle on the planet.'}
              intro="Luxury and responsibility are not a trade-off. We build every part of Jupyter Labs to be as clean as the science inside it."
            />
            <div className="mt-12 grid gap-px overflow-hidden rounded-3xl border border-line sm:grid-cols-2">
              {ITEMS.map((it, i) => (
                <Reveal key={it.t} delay={i * 0.07}>
                  <div className="h-full bg-card p-7">
                    <div className="mb-4 grid h-10 w-10 place-items-center rounded-full bg-accent/10 text-accent-dark">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path d="M12 3C7 8 5 12 12 21C19 12 17 8 12 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <h3 className="font-display text-lg font-medium leading-[1.2] text-ink">{it.t}</h3>
                    <p className="mt-2 text-sm text-muted">{it.d}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          <div ref={ref} className="relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius-xl2)]">
              <motion.div style={{ y }} className="absolute inset-0 scale-110">
                <Img src={IMG.sustainability} alt="Botanical sustainability imagery" className="h-full w-full" />
              </motion.div>
              <div className="absolute inset-0 bg-gradient-to-t from-accent-dark/30 to-transparent" />
            </div>
            <div className="glass absolute -left-4 top-8 rounded-2xl px-6 py-4 lg:-left-10">
              <div className="font-display text-3xl font-light leading-[1.2] text-accent-dark">100%</div>
              <p className="text-xs uppercase tracking-wider text-muted">Recyclable packaging</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
