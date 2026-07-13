import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { AuthResponse, LoginRequest, RegisterRequest, User } from '../types/api'
import { getToken, setToken as persistToken, clearToken, UNAUTHORIZED_EVENT } from './authToken'

/**
 * Loaded on demand rather than imported at module scope.
 *
 * AuthProvider wraps every route, so a static import drags the service layer and
 * the whole of axios into the landing page's initial bundle — where a signed-out
 * visitor never calls any of it (`refresh` returns early when there is no token).
 * Deferring it keeps that weight off the critical path that gates LCP.
 */
const loadAuthService = () => import('../services/auth.service').then((m) => m.authService)

type AuthStatus = 'loading' | 'authenticated' | 'guest'

interface AuthContextValue {
  user: User | null
  status: AuthStatus
  isAuthenticated: boolean
  login: (creds: LoginRequest) => Promise<User>
  register: (body: RegisterRequest) => Promise<User>
  logout: () => void
  /** Re-hydrate from /api/auth/verify (used on mount + manual refresh). */
  refresh: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [status, setStatus] = useState<AuthStatus>('loading')

  const applyAuth = useCallback((res: AuthResponse) => {
    persistToken(res.token)
    setUser(res.user)
    setStatus('authenticated')
    return res.user
  }, [])

  const logout = useCallback(() => {
    clearToken()
    setUser(null)
    setStatus('guest')
  }, [])

  const refresh = useCallback(async () => {
    if (!getToken()) {
      setUser(null)
      setStatus('guest')
      return
    }
    try {
      const { user } = await (await loadAuthService()).verify()
      setUser(user)
      setStatus('authenticated')
    } catch {
      // Invalid/expired token — verify already triggered a 401 clear.
      clearToken()
      setUser(null)
      setStatus('guest')
    }
  }, [])

  // Session restore on load.
  useEffect(() => {
    void refresh()
  }, [refresh])

  // React to a 401 from anywhere in the app (interceptor emits this).
  useEffect(() => {
    const onUnauthorized = () => {
      setUser(null)
      setStatus('guest')
    }
    window.addEventListener(UNAUTHORIZED_EVENT, onUnauthorized)
    return () => window.removeEventListener(UNAUTHORIZED_EVENT, onUnauthorized)
  }, [])

  const login = useCallback(
    async (creds: LoginRequest) => applyAuth(await (await loadAuthService()).login(creds)),
    [applyAuth],
  )
  const register = useCallback(
    async (body: RegisterRequest) => applyAuth(await (await loadAuthService()).register(body)),
    [applyAuth],
  )

  const value = useMemo<AuthContextValue>(
    () => ({ user, status, isAuthenticated: status === 'authenticated', login, register, logout, refresh }),
    [user, status, login, register, logout, refresh],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>')
  return ctx
}
