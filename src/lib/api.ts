/**
 * Central Order Management — typed client.
 * Base URL: VITE_API_BASE_URL (defaults to the documented production host).
 */

const RAW_BASE =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? 'https://www.microservices.tech'
export const API_BASE = RAW_BASE.replace(/\/+$/, '')

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE'

export class ApiError extends Error {
  status: number
  body: unknown
  constructor(message: string, status: number, body: unknown) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.body = body
  }
}

async function request<T>(method: Method, path: string, body?: unknown): Promise<T> {
  const headers: Record<string, string> = { Accept: 'application/json' }
  if (body !== undefined) headers['Content-Type'] = 'application/json'

  let res: Response
  try {
    res = await fetch(`${API_BASE}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  } catch (e) {
    // Network failure, CORS rejection, offline, etc.
    const err = new ApiError(
      `Could not reach server (${API_BASE}). Check your connection and try again.`,
      0,
      e,
    )
    console.error('[api] network error', { path, error: e })
    throw err
  }

  const text = await res.text()
  let json: unknown = null
  if (text) {
    try {
      json = JSON.parse(text)
    } catch {
      console.warn('[api] non-JSON response', { path, status: res.status, text })
    }
  }

  if (!res.ok) {
    const serverMsg =
      (typeof json === 'object' && json && 'error' in json && (json as { error?: unknown }).error) ||
      (typeof json === 'object' && json && 'message' in json && (json as { message?: unknown }).message) ||
      text ||
      `Request failed (${res.status})`
    const msg = `${String(serverMsg)} (HTTP ${res.status})`
    console.error('[api] non-2xx response', { path, status: res.status, body: json ?? text })
    throw new ApiError(msg, res.status, json ?? text)
  }

  return (json ?? ({} as unknown)) as T
}

/* ─────────────────────────  Orders  ───────────────────────── */

export type CentralOrderItem = { name: string; price: number; qty: number }

export type CentralOrderPayload = {
  customer: { firstName: string; lastName: string; email: string; mobile: string }
  shippingAddress: {
    line1: string
    line2?: string
    city: string
    postcode: string
    country: string
  }
  promoCode?: string
  items: CentralOrderItem[]
  subtotal: number
  shipping: number
  discount: number
  total: number
}

export type CentralOrderResponse = {
  ok: true
  success: true
  orderNumber: string
  orderId: number
  status: string
  paymentStatus: string
  paymentMethod: string
  totals: { subtotal: number; shipping: number; discount: number; total: number }
  message: string
}

function clean<T extends Record<string, unknown>>(obj: T): T {
  const out: Record<string, unknown> = {}
  for (const [k, v] of Object.entries(obj)) {
    if (v === undefined || v === null) continue
    if (typeof v === 'string' && v.trim() === '') continue
    out[k] = typeof v === 'string' ? v.trim() : v
  }
  return out as T
}

export function createCentralOrder(payload: CentralOrderPayload) {
  const body = {
    customer: clean(payload.customer),
    shippingAddress: clean(payload.shippingAddress),
    items: payload.items.map((i) => ({
      name: String(i.name).trim(),
      price: Number(i.price) || 0,
      qty: Number(i.qty) || 1,
    })),
    subtotal: Number(payload.subtotal) || 0,
    shipping: Number(payload.shipping) || 0,
    discount: Number(payload.discount) || 0,
    total: Number(payload.total) || 0,
    ...(payload.promoCode ? { promoCode: payload.promoCode } : {}),
  }
  return request<CentralOrderResponse>('POST', '/api/central/orders', body)
}

/* ─────────────────────────  Promo codes  ───────────────────────── */

export type PromoValidateResponse = { ok: true; valid: true; percent: number }

export async function validatePromo(code: string): Promise<PromoValidateResponse> {
  return request<PromoValidateResponse>('POST', '/api/promos/validate', { code: code.trim() })
}

/* ─────────────────────────  Newsletter  ───────────────────────── */

export type NewsletterResponse =
  | { ok: true; id: number }
  | { ok: true; already_subscribed: true }
  | { ok: true }

export function subscribeNewsletter(email: string, source = 'footer_signup') {
  return request<NewsletterResponse>('POST', '/api/newsletter/subscribe', {
    email: email.trim(),
    consent: true,
    source,
    website: '',
  })
}
