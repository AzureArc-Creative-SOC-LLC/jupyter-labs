import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import SplitReveal from '../ui/SplitReveal'

export default function Lifestyle() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y1 = useTransform(scrollYProgress, [0, 1], ['-12%', '12%'])
  const y2 = useTransform(scrollYProgress, [0, 1], ['10%', '-10%'])
  const scale = useTransform(scrollYProgress, [0, 1], [1.2, 1])

  return (
    <section id="lifestyle" ref={ref} className="section-pad relative overflow-hidden bg-section">
      <div className="container-x">
        <div className="mb-16 text-center">
          <p className="eyebrow mb-5">Inside The Lab</p>
          <SplitReveal as="h2" mode="lines" className="display mx-auto max-w-3xl text-balance text-[clamp(1.85rem,1rem+3.4vw,4rem)] text-ink">
            Research-grade peptides for the serious bench.
          </SplitReveal>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-12 sm:gap-6">
          <div className="overflow-hidden rounded-[var(--radius-xl2)] sm:col-span-7">
            <div className="relative aspect-[16/11] overflow-hidden">
              <motion.div style={{ y: y1, scale }} className="absolute -inset-y-[15%] inset-x-0">
                <img
                  src="/images/liquild.jpeg"
                  alt="Peptide liquid in lab vials — Jupyter Labs workflow"
                  className="h-full w-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </motion.div>
            </div>
          </div>

          <div className="overflow-hidden rounded-[var(--radius-xl2)] sm:col-span-5">
            <div className="relative aspect-[4/3] overflow-hidden sm:aspect-auto sm:h-full">
              <motion.div style={{ y: y2 }} className="absolute -inset-y-[15%] inset-x-0">
                <img
                  src="/images/glow-peptide.jpeg"
                  alt="Glow peptide — Jupyter Labs research compound"
                  className="h-full w-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </motion.div>
            </div>
          </div>

          <div className="flex flex-col justify-center rounded-[var(--radius-xl2)] bg-accent-dark p-8 text-bg sm:col-span-5">
            <p className="font-display text-xl font-light leading-[1.35] sm:text-2xl lg:text-3xl">“The COA is right there with every vial. No guesswork, no chasing — the math just adds up.”</p>
            <p className="mt-5 text-xs uppercase tracking-[0.25em] text-bg/60 sm:text-sm">A Jupyter Labs researcher</p>
          </div>

          <div className="overflow-hidden rounded-[var(--radius-xl2)] sm:col-span-7">
            <div className="relative aspect-[16/9] overflow-hidden">
              <motion.div style={{ y: y1 }} className="absolute -inset-y-[15%] inset-x-0">
                <img
                  src="/images/dna-img.jpeg"
                  alt="DNA double helix — Jupyter Labs peptide research"
                  className="h-full w-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
