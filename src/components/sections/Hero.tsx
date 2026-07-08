import { useRef } from 'react'
import { motion, useScroll, useTransform, useMotionTemplate } from 'framer-motion'
import { useGSAP } from '@gsap/react'
import { gsap } from '../../lib/gsap'
import { useReducedMotion } from '../../lib/useReducedMotion'
const HEADLINE = ['Smarter', 'Peptides', 'For', 'Modern', 'Research']

export default function Hero() {
  const ref = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0])
  const blurPx = useTransform(scrollYProgress, [0, 0.6], [0, 12], { clamp: true })
  const imgFilter = useMotionTemplate`blur(${blurPx}px)`

  useGSAP(
    () => {
      if (reduced) return
      const tl = gsap.timeline({ delay: 2.3, defaults: { ease: 'power4.out' } })
      tl.from('.hero-top', { y: 18, opacity: 0, duration: 0.8 })
        .from('.hero-card', { y: 40, opacity: 0, scale: 0.985, duration: 1.2 }, '-=0.3')
        .from(
          '.hero-word',
          { yPercent: 120, opacity: 0, filter: 'blur(14px)', rotateX: -40, duration: 1.2, stagger: 0.12 },
          '-=0.6',
        )
    },
    { scope: ref, dependencies: [reduced] },
  )

  return (
    <section ref={ref} id="top" className="relative bg-white pb-0 pt-28 sm:pt-40 lg:pb-0 lg:pt-48">
      <div className="container-x">
        {/* Top trust + tag strip */}
        <div className="hero-top -mt-8 mb-16 flex flex-wrap items-center justify-between gap-4 lg:-mt-12 lg:mb-20">
          <div className="flex items-center gap-4">
            <div className="flex -space-x-2.5">
              {[
                '/images/jupyter-labs/customer-stories/jupyter-labs-researcher-avatar-1.webp',
                '/images/jupyter-labs/customer-stories/jupyter-labs-researcher-avatar-2.webp',
                '/images/jupyter-labs/customer-stories/jupyter-labs-researcher-avatar-3.webp',
              ].map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="h-10 w-10 rounded-full border-2 border-bg object-cover"
                />
              ))}
            </div>
            <span className="flex items-center gap-2.5 text-sm uppercase tracking-[0.22em] text-muted">
              <span className="h-2 w-2 rounded-full bg-accent-dark" />
              Trusted by 40,000+ researchers
            </span>
          </div>
          <div className="hidden rounded-full border border-line bg-card px-5 py-2 text-sm uppercase tracking-[0.22em] text-accent-dark sm:block">
            Research-Grade Peptides
          </div>
        </div>

        {/* Hero card with image background */}
        <div className="hero-card relative overflow-hidden rounded-[28px] shadow-[0_30px_80px_-30px_rgba(31,41,51,0.35)] lg:rounded-[40px]">
          {/* background image — blurs as you scroll */}
          <motion.img
            src="/images/jupyter-labs/jupyter-labs-research-grade-peptides-hero.webp"
            alt=""
            style={reduced ? undefined : { filter: imgFilter }}
            className="absolute inset-0 -z-10 h-full w-full object-cover"
          />

          {/* Darkening overlays for headline legibility */}
          <div className="pointer-events-none absolute inset-0 -z-[5] bg-ink/8" />
          <div className="pointer-events-none absolute inset-0 -z-[5] bg-gradient-to-b from-ink/12 via-ink/5 to-ink/18" />
          <div className="pointer-events-none absolute inset-0 -z-[5] bg-[radial-gradient(ellipse_at_center,rgba(20,32,42,0.18)_0%,transparent_65%)]" />

          {/* centered headline overlay */}
          <motion.div
            style={reduced ? undefined : { opacity: fade }}
            className="relative flex min-h-[78svh] flex-col items-center justify-center px-6 py-20 text-center lg:min-h-[78svh] lg:py-32"
          >
            <h1 className="type-hero font-display text-balance font-light leading-[1.12] text-white drop-shadow-[0_6px_30px_rgba(0,0,0,0.6)]">
              {HEADLINE.map((w) => (
                <span key={w} className="mr-[0.22em] inline-block overflow-hidden align-bottom">
                  <span className="hero-word inline-block">{w}</span>
                </span>
              ))}
            </h1>
          </motion.div>
        </div>

      </div>
    </section>
  )
}
