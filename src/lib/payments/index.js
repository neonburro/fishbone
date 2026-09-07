// src/lib/payments/index.js
import invoice from './invoice'
import stripe from './stripe'
import square from './square'

/**
 * Payment provider registry.
 * Each provider: { key, label, description, available, start(orderResult) -> { type: 'confirmation' | 'redirect', url? } }
 * The active provider comes from settings.payments.provider (Pulse -> Settings), falling back to 'invoice'.
 */
export const payments = { invoice, stripe, square }

export function resolveProvider(settings) {
  const key = settings?.payments?.provider || 'invoice'
  const p = payments[key]
  if (p && p.available) return p
  return payments.invoice
}

export default payments
