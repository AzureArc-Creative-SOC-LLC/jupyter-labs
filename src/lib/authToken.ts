/**
 * Small, dependency-free token store shared by the http client and AuthContext
 * (kept separate to avoid a circular import between them).
 * Token is persisted in localStorage for persistent login / session restore.
 */
const TOKEN_KEY = 'jl_auth_token'

/** Fired when the API returns 401 so the app can clear session / redirect. */
export const UNAUTHORIZED_EVENT = 'jl-auth-unauthorized'

export function getToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

export function setToken(token: string): void {
  try {
    localStorage.setItem(TOKEN_KEY, token)
  } catch {
    /* storage unavailable (private mode) — session becomes in-memory only */
  }
}

export function clearToken(): void {
  try {
    localStorage.removeItem(TOKEN_KEY)
  } catch {
    /* ignore */
  }
}

export function emitUnauthorized(): void {
  window.dispatchEvent(new CustomEvent(UNAUTHORIZED_EVENT))
}
