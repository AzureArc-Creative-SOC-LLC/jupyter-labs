import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Heading from '../ui/Heading'
import Img from '../ui/Img'
import { INGREDIENTS } from '../../lib/content'

export default function Ingredients() {
  const [active, setActive] = useState(0)
  const item = INGREDIENTS[active]

  return (
    <section id="ingredients" className="relative bg-bg py-24 lg:py-32">
      <div className="container-x">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          {/* Sticky visual */}
          <div className="relative aspect-square overflow-hidden rounded-[var(--radius-xl2)] lg:sticky lg:top-24">
            <AnimatePresence mode="wait">
              <motion.div
                key={item.name}
                initial={{ opacity: 0, scale: 1.08, filter: 'blur(12px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 1.02, filter: 'blur(8px)' }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0"
              >
                <Img src={item.image} alt={item.name} className="h-full w-full" />
              </motion.div>
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-t from-accent-dark/40 to-transparent" />
            <div className="absolute bottom-7 left-7 text-bg">
              <p className="text-xs uppercase tracking-[0.3em] text-bg/70">{item.latin}</p>
              <h3 className="mt-2 font-display text-2xl font-medium leading-[1.2]">{item.name}</h3>
            </div>
          </div>

          {/* Heading + list */}
          <div>
            <Heading
              eyebrow="Key Ingredients"
              title={'Sourced for purity.\nDosed for impact.'}
              intro="We obsess over provenance — partnering with growers and labs who share our standard. Hover an ingredient to meet it."
            />
            <ul className="mt-10 divide-y divide-line border-y border-line">
            {INGREDIENTS.map((ing, i) => (
              <li key={ing.name}>
                <button
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  className="group flex w-full items-center gap-6 py-7 text-left transition-colors"
                >
                  <span
                    className={`font-display text-sm font-medium transition-colors ${active === i ? 'text-accent-dark' : 'text-sand'}`}
                  >
                    0{i + 1}
                  </span>
                  <div className="flex-1">
                    <h4
                      className={`font-display text-xl font-medium leading-[1.2] transition-all duration-500 lg:text-2xl ${
                        active === i ? 'text-ink translate-x-2' : 'text-ink/55'
                      }`}
                    >
                      {ing.name}
                    </h4>
                    <motion.p
                      initial={false}
                      animate={{ height: active === i ? 'auto' : 0, opacity: active === i ? 1 : 0 }}
                      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden text-base leading-[1.4] text-muted"
                    >
                      <span className="block pt-2.5 pl-1.5">{ing.note}</span>
                    </motion.p>
                  </div>
                  <span
                    className={`hidden h-12 w-12 shrink-0 place-items-center rounded-full border transition-all duration-500 sm:grid ${
                      active === i ? 'border-accent-dark bg-accent-dark text-bg' : 'border-line text-muted'
                    }`}
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </button>
              </li>
            ))}
          </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
