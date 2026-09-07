/**
 * Square provider — STUB.
 *
 * TODO to wire:
 *  1. Set SQUARE_ACCESS_TOKEN and SQUARE_LOCATION_ID in Netlify env.
 *  2. In netlify/functions/create-checkout.js, when provider === 'square', call
 *     Square's Checkout API (POST /v2/online-checkout/payment-links) with the order total,
 *     redirect_url = `${SITE}/order/confirmed/${order_number}?paid=1`, and return { url: payment_link.url }.
 *  3. Add a Square webhook function (payment.updated -> COMPLETED) that marks the order paid.
 *  4. Flip settings.payments.provider to 'square' in Pulse.
 */
const square = {
  key: 'square',
  label: 'Card (Square)',
  description: 'Pay by card now. Secure checkout hosted by Square.',
  available: false,
  async start(orderResult) {
    const res = await fetch('/.netlify/functions/create-checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ provider: 'square', ...orderResult }),
    })
    if (!res.ok) throw new Error('Card checkout is not enabled yet. Your order was saved — we will invoice you instead.')
    const { url } = await res.json()
    return { type: 'redirect', url }
  },
}

export default square
