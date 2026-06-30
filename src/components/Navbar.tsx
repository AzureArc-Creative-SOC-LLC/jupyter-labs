import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { NAV } from '../lib/content'
import { scrollToHash } from './SmoothScroll'
import { useCart } from '../lib/CartContext'

const MENU_EASE = [0.16, 1, 0.3, 1] as const

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { count } = useCart()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Lock background scroll while the fullscreen menu is open. The page scroller
  // is Lenis (on <html>), so pause it; also lock body as a reduced-motion fallback.
  useEffect(() => {
    if (!open) return
    const lenis = (window as unknown as { __lenis?: { stop: () => void; start: () => void } }).__lenis
    lenis?.stop()
    const prevBody = document.body.style.overflow
    const prevHtml = document.documentElement.style.overflow
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
    return () => {
      lenis?.start()
      document.body.style.overflow = prevBody
      document.documentElement.style.overflow = prevHtml
    }
  }, [open])

  // Close on Escape.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  // Scroll to the hash target after route changes (e.g. tapping "About" in the
  // mobile menu while on /cart navigates to /#about — without this, the page
  // would mount at the top and ignore the hash). Also handles deep links like
  // /#products. Delay lets the home page DOM mount + Lenis attach first.
  useEffect(() => {
    if (location.pathname !== '/' || !location.hash) return
    const id = setTimeout(() => scrollToHash(location.hash), 120)
    return () => clearTimeout(id)
  }, [location.pathname, location.hash])

  function go(e: React.MouseEvent, href: string) {
    e.preventDefault()
    const wasOpen = open
    setOpen(false)
    if (location.pathname !== '/') {
      navigate('/' + href)
      return
    }
    // When the mobile menu was open, the `open` effect's cleanup restarts
    // Lenis on the next render. Defer so the scroll lands on a running engine.
    if (wasOpen) {
      setTimeout(() => scrollToHash(href), 60)
    } else {
      scrollToHash(href)
    }
  }

  return (
    <>
    <motion.header
      initial={{ y: -90, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: location.pathname === '/' ? 2.4 : 0.1, duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-x-0 top-0 z-[80]"
    >
      {/* Full-bleed frosted bar (sits behind the width-capped content). */}
      <div
        className={`pointer-events-none absolute inset-0 -z-10 transition-opacity duration-500 ${
          scrolled || open || location.pathname !== '/' ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="glass h-full w-full" />
      </div>

      <div
        className={`container-x flex items-center justify-between transition-all duration-500 ${
          scrolled ? 'py-3' : 'py-5'
        }`}
      >
        <Link
          to="/"
          className="group inline-flex items-center gap-2.5 font-display text-ink"
        >
          <span className="relative text-2xl font-semibold lowercase tracking-[-0.05em]" style={{ fontFeatureSettings: '"ss01", "cv01"' }}>
            <span className="italic text-accent-dark transition-colors duration-500 group-hover:text-accent">j</span>upyter
            <span className="absolute -bottom-1 left-0 h-[2px] w-[0.45em] origin-left scale-x-0 bg-accent-dark transition-transform duration-500 group-hover:scale-x-100" />
          </span>
          <span className="h-5 w-px bg-accent-dark/40 transition-colors duration-500 group-hover:bg-accent" />
          <span className="text-[0.7rem] uppercase tracking-[0.34em] text-accent-dark transition-colors duration-500 group-hover:text-accent">
            Labs
          </span>
        </Link>

        <nav className="hidden items-center gap-9 md:flex">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              onClick={(e) => go(e, n.href)}
              className="group relative text-sm tracking-wide text-ink/75 transition-colors hover:text-ink"
            >
              {n.label}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-accent-dark transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:w-full" />
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            to="/cart"
            aria-label={`Cart (${count} items)`}
            className="relative grid h-10 w-10 place-items-center rounded-full border border-line bg-card text-ink transition-all hover:border-accent-dark/40 hover:text-accent-dark"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 3h2l2.4 12.2a2 2 0 0 0 2 1.6h8.2a2 2 0 0 0 2-1.5L21 8H6" />
              <circle cx="9" cy="20" r="1.5" />
              <circle cx="18" cy="20" r="1.5" />
            </svg>
            {count > 0 && (
              <span className="absolute -right-1 -top-1 grid h-5 min-w-[1.25rem] place-items-center rounded-full bg-accent-dark px-1 text-[0.65rem] font-semibold text-bg">
                {count}
              </span>
            )}
          </Link>

          <a
            href="#products"
            onClick={(e) => go(e, '#products')}
            className="hidden rounded-full bg-accent-dark px-6 py-2.5 text-sm text-bg transition-colors hover:bg-accent md:inline-block"
          >
            Shop
          </a>
          <button
            aria-label="Menu"
            onClick={() => setOpen((v) => !v)}
            className="relative z-50 flex h-11 w-11 flex-col items-center justify-center gap-1.5 md:hidden"
          >
            <span className={`h-px w-6 bg-ink transition-all ${open ? 'translate-y-[3px] rotate-45' : ''}`} />
            <span className={`h-px w-6 bg-ink transition-all ${open ? '-translate-y-[3px] -rotate-45' : ''}`} />
          </button>
        </div>
      </div>
    </motion.header>

      {/* ───── Premium fullscreen overlay menu (mobile) ───── */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: MENU_EASE }}
            className="fixed inset-0 z-[70] flex flex-col overflow-y-auto overscroll-contain bg-bg/98 backdrop-blur-2xl md:hidden"
          >
            <div className="grain pointer-events-none fixed inset-0 opacity-30" />
            <div className="pointer-events-none fixed -right-24 top-10 h-80 w-80 rounded-full bg-accent/15 blur-[120px]" />
            <div className="pointer-events-none fixed -left-24 bottom-10 h-80 w-80 rounded-full bg-sand/30 blur-[120px]" />

            <nav className="container-x relative flex min-h-full flex-col justify-center gap-1 pb-[max(2rem,env(safe-area-inset-bottom))] pt-24">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1, ease: MENU_EASE }}
                className="eyebrow mb-6"
              >
                Menu
              </motion.p>

              {NAV.map((n, i) => (
                <motion.a
                  key={n.href}
                  href={n.href}
                  onClick={(e) => go(e, n.href)}
                  initial={{ opacity: 0, y: 34 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.14 + i * 0.07, ease: MENU_EASE }}
                  className="group flex items-center justify-between border-b border-line py-3.5 font-display text-[clamp(1.85rem,10vw,3rem)] font-light leading-[1.1] tracking-[-0.02em] text-ink"
                >
                  {n.label}
                  <span className="text-2xl text-accent-dark opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100">
                    →
                  </span>
                </motion.a>
              ))}

              <motion.a
                href="#products"
                onClick={(e) => go(e, '#products')}
                initial={{ opacity: 0, y: 34 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.14 + NAV.length * 0.07, ease: MENU_EASE }}
                className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-accent-dark py-4 text-base font-medium text-bg transition-colors hover:bg-accent"
              >
                Shop Jupyter Labs
              </motion.a>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="mt-6 text-[0.65rem] uppercase tracking-[0.28em] text-muted"
              >
                For research use only · Not for human consumption
              </motion.p>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
