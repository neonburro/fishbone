// src/lib/payments/stripe.js
/**
 * Stripe provider. STUB.
 *
 * TODO to wire:
 *  1. Set STRIPE_SECRET_KEY in Netlify env.
 *  2. Implement netlify/functions/create-checkout.js: accept { order_id, order_number, total, email },
 *     create a Stripe Checkout Session (mode: 'payment', line item = order total, metadata.order_number),
 *     success_url = `${SITE}/order/confirmed/${order_number}?paid=1`, cancel_url = `${SITE}/cart`,
 *     and return { url }.
 *  3. Add a Stripe webhook function (checkout.session.completed) that updates
 *     orders.payment_status='paid', payment_reference=session.id, status='paid' via service role.
 *  4. Flip settings.payments.provider to 'stripe' in Pulse.
 */
const stripe = {
  key: 'stripe',
  label: 'Card (Stripe)',
  description: 'Pay by card now. Secure checkout hosted by Stripe.',
  available: false,
  async start(orderResult) {
    const res = await fetch('/.netlify/functions/create-checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ provider: 'stripe', ...orderResult }),
    })
    if (!res.ok) throw new Error('Card checkout is not enabled yet. Your order was saved. We will invoice you instead.')
    const { url } = await res.json()
    return { type: 'redirect', url }
  },
}

export default stripe
