// src/lib/payments/invoice.js
/**
 * Invoice provider (default). Order is placed as pending_review; the shop reviews art,
 * sends a proof, then emails an invoice. No card is collected on the site.
 */
const invoice = {
  key: 'invoice',
  label: 'Invoice from the shop',
  description:
    'Place the order now, pay nothing yet. We review your art, send a proof, then email an invoice you can pay by card or check before we print.',
  available: true,
  async start(_orderResult) {
    return { type: 'confirmation' }
  },
}

export default invoice
