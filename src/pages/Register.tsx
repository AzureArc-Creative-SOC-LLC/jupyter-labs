import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'
import { useSeo } from '../lib/useSeo'
import type { ApiError, RegisterRequest } from '../types/api'

const inputCls =
  'w-full rounded-2xl border border-line bg-bg px-4 py-3 text-sm text-ink placeholder:text-muted/60 transition-colors focus:border-accent-dark focus:outline-none'

const COUNTRIES = [
  'United Kingdom',
  'Ireland',
  'United States',
  'Canada',
  'France',
  'Germany',
  'Netherlands',
  'Spain',
  'Italy',
  'Sweden',
  'Denmark',
  'Norway',
  'Australia',
  'New Zealand',
  'Japan',
  'Singapore',
  'Other',
]

const NATIONALITIES = [
  'British',
  'Irish',
  'American',
  'Canadian',
  'French',
  'German',
  'Dutch',
  'Spanish',
  'Italian',
  'Swedish',
  'Danish',
  'Norwegian',
  'Australian',
  'New Zealander',
  'Japanese',
  'Singaporean',
  'Other',
]

type Form = RegisterRequest & { confirmPassword: string }

export default function Register() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const returnTo = params.get('returnTo') || '/'
  const { register, isAuthenticated, status } = useAuth()

  useSeo({ title: 'Create account — Jupyter Labs', path: '/register', noindex: true })

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    if (status === 'authenticated') navigate(returnTo, { replace: true })
  }, [status, navigate, returnTo])

  const [form, setForm] = useState<Form>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    date_of_birth: '',
    nationality: 'British',
    country_of_residence: 'United Kingdom',
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function set<K extends keyof Form>(k: K, v: Form[K]) {
    setForm((f) => ({ ...f, [k]: v }))
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (submitting) return

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }

    setError(null)
    setSubmitting(true)
    try {
      await register({
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        date_of_birth: form.date_of_birth,
        nationality: form.nationality,
        country_of_residence: form.country_of_residence,
      })
      navigate(returnTo, { replace: true })
    } catch (err) {
      const httpStatus = (err as ApiError).status
      const serverMsg = (err as ApiError).serverMessage
      setError(
        httpStatus === 409
          ? 'An account with this email already exists.'
          : httpStatus === 400
          ? serverMsg || 'Please check the form and try again.'
          : httpStatus === 429
          ? 'Too many attempts. Try again later.'
          : serverMsg || (err as Error).message || 'Could not create account. Please try again.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  if (isAuthenticated) return null

  const today = new Date().toISOString().split('T')[0]

  return (
    <main id="main-content" className="relative z-10 min-h-screen bg-bg">
      <div className="container-x flex min-h-screen items-center justify-center py-12 sm:py-16">
        <div className="w-full max-w-lg">
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
                Create your account
              </h1>
              <p className="mt-3 text-sm text-muted">
                Join Jupyter Labs to access COAs, order history and members-only research notes.
              </p>
            </div>

            <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-4 sm:mt-10">
              <label className="flex flex-col gap-2">
                <span className="text-xs uppercase tracking-[0.22em] text-muted">Full name</span>
                <input
                  className={inputCls}
                  required
                  maxLength={80}
                  autoComplete="name"
                  placeholder="Dr. Ada Lovelace"
                  value={form.name}
                  onChange={(e) => set('name', e.target.value)}
                  disabled={submitting}
                />
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-xs uppercase tracking-[0.22em] text-muted">Email</span>
                <input
                  className={inputCls}
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="you@lab.com"
                  value={form.email}
                  onChange={(e) => set('email', e.target.value)}
                  disabled={submitting}
                />
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="flex flex-col gap-2">
                  <span className="text-xs uppercase tracking-[0.22em] text-muted">Password</span>
                  <input
                    className={inputCls}
                    type="password"
                    required
                    minLength={8}
                    autoComplete="new-password"
                    placeholder="At least 8 characters"
                    value={form.password}
                    onChange={(e) => set('password', e.target.value)}
                    disabled={submitting}
                  />
                </label>
                <label className="flex flex-col gap-2">
                  <span className="text-xs uppercase tracking-[0.22em] text-muted">Confirm password</span>
                  <input
                    className={inputCls}
                    type="password"
                    required
                    minLength={8}
                    autoComplete="new-password"
                    placeholder="Repeat password"
                    value={form.confirmPassword}
                    onChange={(e) => set('confirmPassword', e.target.value)}
                    disabled={submitting}
                  />
                </label>
              </div>

              <label className="flex flex-col gap-2">
                <span className="text-xs uppercase tracking-[0.22em] text-muted">Date of birth</span>
                <input
                  className={inputCls}
                  type="date"
                  required
                  max={today}
                  value={form.date_of_birth}
                  onChange={(e) => set('date_of_birth', e.target.value)}
                  disabled={submitting}
                />
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="flex flex-col gap-2">
                  <span className="text-xs uppercase tracking-[0.22em] text-muted">Nationality</span>
                  <select
                    className={inputCls}
                    required
                    value={form.nationality}
                    onChange={(e) => set('nationality', e.target.value)}
                    disabled={submitting}
                  >
                    {NATIONALITIES.map((n) => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </label>
                <label className="flex flex-col gap-2">
                  <span className="text-xs uppercase tracking-[0.22em] text-muted">Country of residence</span>
                  <select
                    className={inputCls}
                    required
                    value={form.country_of_residence}
                    onChange={(e) => set('country_of_residence', e.target.value)}
                    disabled={submitting}
                  >
                    {COUNTRIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </label>
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
                {submitting ? 'Creating account…' : 'Create account'}
              </button>

              <p className="mt-6 text-center text-sm text-muted">
                Already have an account?{' '}
                <Link
                  to={`/signin${returnTo !== '/' ? `?returnTo=${encodeURIComponent(returnTo)}` : ''}`}
                  className="text-accent-dark hover:text-accent"
                >
                  Sign in
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
