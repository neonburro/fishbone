import { estimateSetup, estimateTax, round2 } from '../lib/pricing'
import { priceLine } from '../store/cartStore'
import { useSettings } from './useSettings'

/** Shared estimate breakdown for Cart + Checkout. Server computes the real totals. */
export default function useEstimate(lines, fulfillment = 'pickup') {
  const { settings, decorationOptions } = useSettings()
  const subtotal = round2(lines.reduce((s, l) => s + priceLine(l).total, 0))
  const setup = estimateSetup(lines, decorationOptions)
  const taxRate = Number(settings?.tax?.rate) || 0
  const tax = estimateTax(subtotal, setup.total, taxRate)
  const shipEnabled = settings?.shipping?.enabled !== false
  const shipping = fulfillment === 'ship' && shipEnabled ? Number(settings?.shipping?.flat_rate) || 0 : 0
  const total = round2(subtotal + setup.total + tax + shipping)
  return { subtotal, setup, tax, taxRate, shipping, shipEnabled, total }
}

