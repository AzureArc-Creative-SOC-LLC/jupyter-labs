import { useState } from 'react'
import SplitReveal from '../ui/SplitReveal'
import Magnetic from '../ui/Magnetic'
import { subscribeNewsletter } from '../../lib/api'

const COLS = [
  { h: 'Catalogue', links: ['BPC-157', 'Retatrutide', 'Tirzepatide', 'Glow (GHK-Cu)', 'Full Catalogue'] },
  { h: 'Research', links: ['The Science', 'COA Library', 'Methodology', 'Reviews', 'Research Notes'] },
  { h: 'Company', links: ['About', 'Careers', 'Press', 'Contact', 'Wholesale'] },
]

export default function Footer() {
  const [email, setEmail] = useState('')
  const [website, setWebsite] = useState('') // honeypot
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<{ tone: 'ok' | 'err'; text: string } | null>(null)

  async function onSubscribe(e: React.FormEvent) {
    e.preventDefault()
    if (busy) return
    setBusy(true)
    setMsg(null)
    try {
      const res = await subscribeNewsletter(email.trim())
      if ('already_subscribed' in res) {
        setMsg({ tone: 'ok', text: "You're already on the list." })
      } else {
        setMsg({ tone: 'ok', text: 'Thanks — research notes incoming.' })
      }
      setEmail('')
    } catch (err) {
      const status = (err as { status?: number }).status
      setMsg({
        tone: 'err',
        text:
          status === 429
            ? 'Too many submissions. Try again later.'
            : (err as Error).message || 'Failed to subscribe.',
      })
    } finally {
      setBusy(false)
    }
  }

  return (
    <footer id="contact" className="relative overflow-hidden bg-bg pt-24">
      <div className="container-x">
        {/* Newsletter */}
        <div className="grid gap-10 border-b border-line pb-16 lg:grid-cols-2 lg:items-end">
          <div>
            <p className="eyebrow mb-5">Join the lab</p>
            <SplitReveal as="h2" mode="lines" className="type-section font-display font-medium leading-[1.08] tracking-[-0.015em] text-ink">
              {'Research notes, worth\nopening.'}
            </SplitReveal>
          </div>
          <div className="flex flex-col gap-2">
            <form
              onSubmit={onSubscribe}
              className="flex flex-col gap-2 rounded-3xl border border-line bg-card p-2 sm:flex-row sm:items-center sm:gap-3 sm:rounded-full sm:pl-6"
            >
              <input
                type="email"
                required
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={busy}
                className="w-full bg-transparent px-4 py-3 text-ink outline-none placeholder:text-muted/70 disabled:opacity-60 sm:px-0 sm:py-0"
              />
              {/* Honeypot — must stay empty */}
              <input
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="hidden"
                aria-hidden="true"
              />
              <Magnetic className="w-full sm:w-auto sm:shrink-0">
                <button
                  type="submit"
                  disabled={busy}
                  className="w-full rounded-full bg-accent-dark px-7 py-3 text-sm text-bg transition-colors hover:bg-accent disabled:opacity-70"
                >
                  {busy ? 'Subscribing…' : 'Subscribe'}
                </button>
              </Magnetic>
            </form>
            {msg && (
              <p className={`pl-6 text-xs ${msg.tone === 'ok' ? 'text-accent-dark' : 'text-red-600'}`}>
                {msg.text}
              </p>
            )}
          </div>
        </div>

        {/* Links */}
        <div className="grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <a
              href="#top"
              className="inline-flex items-center gap-3 font-display text-ink"
            >
              <span className="text-3xl font-semibold lowercase tracking-[-0.05em]" style={{ fontFeatureSettings: '"ss01", "cv01"' }}>
                <span className="italic text-accent-dark">j</span>upyter
              </span>
              <span className="h-7 w-px bg-accent-dark/50" />
              <span className="text-[0.8rem] uppercase tracking-[0.34em] text-accent-dark">Labs</span>
            </a>
            <p className="mt-5 max-w-xs text-muted">
              Research-grade peptides — HPLC-verified, traceable to the lot, documented to the milligram.
            </p>
            <div className="mt-6 flex gap-3">
              {['IG', 'TT', 'YT', 'X'].map((s) => (
                <a
                  key={s}
                  href="#top"
                  className="grid h-10 w-10 place-items-center rounded-full border border-line text-xs text-muted transition-colors hover:border-accent-dark hover:text-accent-dark"
                >
                  {s}
                </a>
              ))}
            </div>
          </div>
          {COLS.map((c) => (
            <div key={c.h}>
              <h4 className="text-sm font-medium uppercase tracking-[0.2em] text-ink">{c.h}</h4>
              <ul className="mt-5 space-y-3">
                {c.links.map((l) => (
                  <li key={l}>
                    <a href="#top" className="text-muted transition-colors hover:text-accent-dark">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Giant wordmark */}
        <div className="select-none overflow-hidden">
          <div className="flex items-center gap-[2vw] font-display leading-[0.8] tracking-[-0.05em] text-accent-dark/10">
            <span className="text-[20vw] font-medium lowercase" style={{ fontFeatureSettings: '"ss01", "cv01"' }}>
              <span className="italic">j</span>upyter
            </span>
            <span className="h-[10vw] w-[2px] bg-accent-dark/15" />
            <span className="text-[2.2vw] uppercase tracking-[0.32em]">Labs</span>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-line py-8 text-sm text-muted sm:flex-row">
          <p>© {new Date().getFullYear()} Jupyter Labs. For research use only.</p>
          <div className="flex gap-6">
            <a href="#top" className="hover:text-accent-dark">Privacy</a>
            <a href="#top" className="hover:text-accent-dark">Terms</a>
            <a href="#top" className="hover:text-accent-dark">Accessibility</a>
          </div>
          <p className="text-xs uppercase tracking-[0.2em]">For research use only · Not for human consumption</p>
        </div>
      </div>
    </footer>
  )
}
