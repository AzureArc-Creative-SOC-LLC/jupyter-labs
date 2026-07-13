import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'
import { useSeo } from '../lib/useSeo'
import type { ApiError } from '../types/api'

const inputCls =
  'w-full rounded-2xl border border-line bg-bg px-4 py-3 text-sm text-ink placeholder:text-muted/60 transition-colors focus:border-accent-dark focus:outline-none'

export default function SignIn() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const returnTo = params.get('returnTo') || '/'
  const { login, isAuthenticated, status } = useAuth()

  useSeo({ title: 'Sign in — Jupyter Labs', path: '/signin', noindex: true })

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    if (status === 'authenticated') navigate(returnTo, { replace: true })
  }, [status, navigate, returnTo])

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (submitting) return
    setError(null)
    setSubmitting(true)
    try {
      await login({ email: email.trim().toLowerCase(), password })
      navigate(returnTo, { replace: true })
    } catch (err) {
      const httpStatus = (err as ApiError).status
      const serverMsg = (err as ApiError).serverMessage
      setError(
        httpStatus === 401 || httpStatus === 400
          ? 'Incorrect email or password.'
          : httpStatus === 429
          ? 'Too many attempts. Try again later.'
          : serverMsg || (err as Error).message || 'Could not sign in. Please try again.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  if (isAuthenticated) return null

  return (
    <main id="main-content" className="relative z-10 min-h-screen bg-bg">
      <div className="container-x flex min-h-screen items-center justify-center py-12 sm:py-16">
        <div className="w-full max-w-md">
          <Link
            to="/"
            className="mb-10 inline-flex items-center gap-2.5 font-display text-ink"
          >
            <span className="text-2xl font-semibold lowercase tracking-[-0.05em]" style={{ fontFeatureSettings: '"ss01", "cv01"' }}>
              <span className="italic text-accent-dark">j</span>upyter
            </span>
            <span className="h-5 w-px bg-accent-dark/40" />
            <span className="text-[0.7rem] uppercase tracking-[0.34em] text-accent-dark">Labs</span>
          </Link>

          <div className="border-b border-line pb-6 text-center sm:pb-8">
            <p className="text-[0.65rem] uppercase tracking-[0.28em] text-accent-dark">Researcher access</p>
            <h1 className="mt-2 font-display text-3xl tracking-[-0.02em] text-ink sm:text-4xl lg:text-5xl">
              Sign in
            </h1>
            <p className="mt-3 text-sm text-muted">
              Welcome back. Sign in to review orders, COAs and shipments.
            </p>
          </div>

          <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-4 sm:mt-10">
            <label className="flex flex-col gap-2">
              <span className="text-xs uppercase tracking-[0.22em] text-muted">Email</span>
              <input
                className={inputCls}
                type="email"
                required
                autoComplete="email"
                placeholder="you@lab.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={submitting}
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-xs uppercase tracking-[0.22em] text-muted">Password</span>
              <input
                className={inputCls}
                type="password"
                required
                autoComplete="current-password"
                minLength={6}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={submitting}
              />
            </label>

            <div className="-mt-1 text-right">
              <Link
                to="/forgot-password"
                className="text-xs uppercase tracking-[0.22em] text-accent-dark hover:text-accent"
              >
                Forgot password?
              </Link>
            </div>

            {error && (
              <p role="alert" className="text-sm text-red-600">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="mt-2 rounded-full bg-accent-dark px-7 py-3 text-sm text-bg transition-colors hover:bg-accent disabled:opacity-70"
            >
              {submitting ? 'Signing in…' : 'Sign in'}
            </button>

            <p className="mt-6 text-center text-sm text-muted">
              New to Jupyter Labs?{' '}
              <Link
                to={`/register${returnTo !== '/' ? `?returnTo=${encodeURIComponent(returnTo)}` : ''}`}
                className="text-accent-dark hover:text-accent"
              >
                Create an account
              </Link>
            </p>
            <p className="text-center text-xs text-muted">
              For laboratory R&D use only · Not for human or veterinary consumption.
            </p>
          </form>
        </div>
      </div>
    </main>
  )
}
