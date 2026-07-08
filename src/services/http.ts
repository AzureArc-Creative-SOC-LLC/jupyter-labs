/**
 * Reusable Axios client for the User Order Service.
 *
 * - Base URL from VITE_USER_ORDER_API_BASE_URL (defaults to the documented
 *   local host). Set it to your deployed domain in production.
 * - Request interceptor injects the customer JWT as `Authorization: Bearer`.
 * - Response interceptor normalizes every failure into a typed ApiError and
 *   emits an app-wide event on 401 so the session can be cleared/redirected.
 *
 * No endpoint logic lives here — only transport concerns. Services call it.
 */
import axios, { AxiosError, type AxiosInstance } from 'axios'
import type { ApiError } from '../types/api'
import { getToken, clearToken, emitUnauthorized } from '../lib/authToken'

const BASE_URL =
 
  "https://www.microservices.tech";

export const http: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 20000,
  headers: { Accept: 'application/json' },
})

// ── Request interceptor: attach bearer token ──
http.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.set?.('Authorization', `Bearer ${token}`)
  }
  return config
})

// ── Response interceptor: normalize errors ──
http.interceptors.response.use(
  (res) => res,
  (error: AxiosError<{ error?: string; message?: string }>) => {
    const status = error.response?.status ?? 0
    const data = error.response?.data
    const serverMessage =
      (data && (data.error || data.message)) ||
      (error.code === 'ECONNABORTED' ? 'The request timed out. Please try again.' : undefined) ||
      (status === 0 ? 'Network error — please check your connection.' : undefined)

    // 401 → the token is stale/invalid; clear it and let the app react.
    if (status === 401) {
      clearToken()
      emitUnauthorized()
    }

    const apiError: ApiError = Object.assign(new Error(serverMessage || `Request failed (${status})`), {
      status,
      serverMessage: serverMessage || undefined,
      data,
    })
    return Promise.reject(apiError)
  },
)

export const API_BASE_URL = BASE_URL
