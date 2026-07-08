/**
 * TypeScript contracts for the User Order Service.
 * Source of truth: API_DOCUMENTATION-USER-ORDER.md — field names, string money
 * values, and DB booleans (1/0) are reproduced exactly as documented.
 */

/** Monetary values come back as strings (Postgres NUMERIC). Do not coerce until display. */
export type Money = string
/** DB booleans are serialized as 1 / 0, not true / false. */
export type DbBool = 0 | 1

/* ─────────────── Auth ─────────────── */

export interface User {
  id: number
  name: string
  email: string
  phone: string | null
  date_of_birth: string
  nationality: string
  country_of_residence: string
  role: string
}

export interface AuthResponse {
  success: true
  token: string
  user: User
}

export interface VerifyResponse {
  success: true
  user: User
}

export interface MessageResponse {
  success: true
  message: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
  date_of_birth: string
  nationality: string
  country_of_residence: string
}

export interface LoginRequest {
  email: string
  password: string
}

/* ─────────────── Promo ─────────────── */

export interface PromoValidateResponse {
  ok: true
  valid: true
  percent: number
}

/* ─────────────── Orders ─────────────── */

export interface CreateOrderItem {
  productId: number | string
  name: string
  sku?: string
  quantity: number
  unitPrice: number
}

/** POST /api/user-orders — only `email` is strictly required; the rest have server fallbacks. */
export interface CreateOrderRequest {
  email: string
  firstName?: string
  lastName?: string
  customerName?: string
  phone?: string
  address?: string
  city?: string
  postcode?: string
  country?: string
  orderId?: string
  promoCode?: string
  promoDiscount?: number
  subtotal?: number
  discountAmount?: number
  total?: number
  createdAtIso?: string
  items: CreateOrderItem[]
  paymentMethod?: string
}

export interface CreateOrderResponse {
  success: true
  /** NB: this is the order-number string, not a numeric DB id. */
  orderId: string
  orderNumber: string
  email_debug?: {
    paymentLinkCreated: boolean
    orderConfirmation: { attempted: boolean; ok: boolean; error: string | null }
    paymentCapture: { attempted: boolean; ok: boolean; error: string | null }
  }
}

/** Full `orders` table row (money = string, booleans = 1/0). */
export interface Order {
  id: number
  order_number: string
  user_id: number | null
  customer_email: string
  customer_name: string
  customer_phone: string | null
  shipping_address: string | null
  shipping_city: string | null
  shipping_state: string | null
  shipping_zip: string | null
  shipping_country: string | null
  tracking_number: string | null
  currency: string
  subtotal: Money
  shipping: Money
  total: Money
  status: string
  payment_status: string
  payment_method: string
  promo_code: string | null
  promo_discount: string | null
  discount_amount: Money | null
  bank_account_used: string | null
  created_at: string
  updated_at: string | null
  total_before_discount: Money | null
  total_after_discount: Money | null
  promo_discount_percent: string | null
  promo_valid: DbBool | null
  items_text: string | null
  credits_applied: Money | null
  total_before_credits: Money | null
  credits_reserved: Money | null
  [key: string]: unknown
}

export interface OrderItemRow {
  id: number
  order_id: number
  product_id: number | null
  name: string
  sku: string | null
  quantity: number
  unit_price: Money
  line_total: Money
}

export interface PaymentRow {
  id: number
  order_id: number
  user_id: number | null
  provider: string
  provider_id: string | null
  amount: Money
  currency: string
  status: string
  webhook_received: DbBool
  final_status: string | null
  created_at: string
  updated_at: string | null
  [key: string]: unknown
}

export interface OrderDetailResponse {
  order: Order
  items: OrderItemRow[]
  payments: PaymentRow[]
}

export interface OrdersByEmailResponse {
  orders: Order[]
}

/* ─────────────── Newsletter ─────────────── */

export interface NewsletterRequest {
  email: string
  consent: true
  source?: string
  /** Honeypot — must always be sent empty. */
  website: ''
}

export type NewsletterResponse =
  | { ok: true; id: number }
  | { ok: true; already_subscribed: true }
  | { ok: true }

/* ─────────────── Errors ─────────────── */

/** Normalized error thrown by the http layer (see services/http.ts). */
export interface ApiError extends Error {
  status: number
  /** The raw error string the API returned in `error`/`message`, if any. */
  serverMessage?: string
  data?: unknown
}
