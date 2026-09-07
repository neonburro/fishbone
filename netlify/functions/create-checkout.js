/**
 * Netlify Function scaffold: create a hosted checkout session for a placed order.
 *
 * Request  (POST JSON): { provider: 'stripe' | 'square', order_id, order_number, total, email }
 * Response (200 JSON):  { url }  — hosted checkout URL to redirect the customer to
 *
 * Wiring notes live in src/lib/payments/stripe.js and src/lib/payments/square.js.
 * Until a provider is implemented this returns 501 so the storefront falls back to invoicing.
 */
export default async (request) => {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    })
  }
  let body = {}
  try {
    body = await request.json()
  } catch {
    /* ignore */
  }
  return new Response(
    JSON.stringify({
      error: 'not_implemented',
      message: `Hosted checkout for provider "${body.provider || 'unknown'}" is not wired yet. Order ${body.order_number || ''} was saved and will be invoiced.`,
    }),
    { status: 501, headers: { 'Content-Type': 'application/json' } }
  )
}

export const config = { path: '/.netlify/functions/create-checkout' }
