import { orderService } from './order.service'

// jupyter-labs is a static Vite SPA, not Next.js — it has no server-side API
// routes of its own. The order confirmation email is sent by a tiny companion
// server (see /server) that this frontend calls after the order is created;
// that server forwards to the shared order-confirmation email module.
//
// The path below is intentionally relative, in every environment:
//   - production: same-origin, nginx proxies /api/send-order-confirmation to
//     the companion server.
//   - dev: the Vite dev server proxies the same path to the companion server on
//     :4001 (see `server.proxy` in vite.config.ts).
//
// So there is no base URL to switch and nothing to comment back out at deploy
// time. If this 404s locally, the companion server isn't running:
//   cd server && npm start
const EMAIL_ENDPOINT = '/api/send-order-confirmation'

/**
 * Posts to this frontend's own companion server (server/index.js), which
 * forwards to the shared order-confirmation email module. This is a
 * different origin from the main API base — it never talks to the shared
 * backend directly for sending mail.
 *
 * `orderService.create`'s own response only carries {orderId, orderNumber,
 * email_debug} — it doesn't echo back the persisted order. So the email is
 * built from a fresh `orderService.getByNumber` read (the order-creation
 * API's own stored record) rather than local checkout form/cart state, so it
 * reflects what was actually persisted server-side, not what the client
 * guessed pre-submission.
 *
 * Never throws: a failed send must not break the checkout success flow. It
 * reports the outcome instead, so the confirmation screen can tell the customer
 * what actually happened rather than guessing.
 */
export interface EmailSendResult {
  ok: boolean
  error: string | null
}

export async function sendOrderConfirmationEmail(orderNumber: string): Promise<EmailSendResult> {
  try {
    const { order, items } = await orderService.getByNumber(orderNumber)

    const customerName = order.customer_name || order.customer_email
    const shippingAddress = [
      order.shipping_address,
      order.shipping_city,
      order.shipping_zip,
      order.shipping_country,
    ]
      .filter(Boolean)
      .join(', ')

    const res = await fetch(EMAIL_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer: { name: customerName, email: order.customer_email },
        order: {
          orderNumber: order.order_number,
          currency: order.currency || 'USD',
          items: items.map((it) => ({
            name: it.name,
            quantity: it.quantity,
            price: Number(it.unit_price),
          })),
          subtotal: Number(order.subtotal),
          shipping: Number(order.shipping) || 0,
          discount: Number(order.discount_amount ?? 0),
          total: Number(order.total),
          shippingAddress,
        },
      }),
    })

    if (!res.ok) {
      const body = await res.text()
      console.error('[email.service] order confirmation email failed', { status: res.status, body })
      return {
        ok: false,
        error:
          res.status === 404
            ? 'Email endpoint not reachable — is the companion server running? (cd server && npm start)'
            : `Email server responded ${res.status}`,
      }
    }

    return { ok: true, error: null }
  } catch (err) {
    console.error('[email.service] order confirmation email request failed', err)
    return { ok: false, error: err instanceof Error ? err.message : 'Email request failed' }
  }
}

export const emailService = { sendOrderConfirmationEmail }
