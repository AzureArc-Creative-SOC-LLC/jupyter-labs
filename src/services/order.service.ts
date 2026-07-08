import { http } from './http'
import type {
  CreateOrderRequest,
  CreateOrderResponse,
  OrderDetailResponse,
  OrdersByEmailResponse,
} from '../types/api'

/** Order endpoints — see API_DOCUMENTATION-USER-ORDER § Orders. */
export const orderService = {
  /** POST /api/user-orders — primary checkout. `orderId`/`orderNumber` in the response are the same order-number string. */
  create: (body: CreateOrderRequest) =>
    http.post<CreateOrderResponse>('/api/user-orders', body).then((r) => r.data),

  /** GET /api/user-orders/:orderNumber — full order + items + payments. 404 if not found. */
  getByNumber: (orderNumber: string) =>
    http
      .get<OrderDetailResponse>(`/api/user-orders/${encodeURIComponent(orderNumber)}`)
      .then((r) => r.data),

  /** GET /api/user-orders/by-email?email=… — order history (newest first, max 200). */
  getByEmail: (email: string) =>
    http
      .get<OrdersByEmailResponse>('/api/user-orders/by-email', { params: { email } })
      .then((r) => r.data),
}
