import { http } from './http'
import type { NewsletterResponse } from '../types/api'

/**
 * POST /api/newsletter/subscribe. `consent` must be truthy; `website` is the
 * honeypot and must always be empty. Rate-limited to 5/hour per IP (429).
 */
export const newsletterService = {
  /** `website` is the honeypot: pass the hidden field's value verbatim (empty for
   * real users; a bot that fills it gets silently caught server-side). */
  subscribe: (email: string, source = 'footer_signup', website = '') =>
    http
      .post<NewsletterResponse>('/api/newsletter/subscribe', {
        email,
        consent: true,
        source,
        website,
      })
      .then((r) => r.data),
}
