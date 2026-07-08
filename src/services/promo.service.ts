import { http } from './http'
import type { PromoValidateResponse } from '../types/api'

/**
 * POST /api/promos/validate — server-side promo validation (never trust a
 * frontend-computed discount). Returns { ok, valid, percent }. A 404 means the
 * code is invalid/inactive.
 */
export const promoService = {
  validate: (code: string) =>
    http.post<PromoValidateResponse>('/api/promos/validate', { code }).then((r) => r.data),
}
