// src/lib/pricing.js
/**
 * Client-side price ESTIMATES. The server (place_order RPC) is the source of truth.
 * Mirrors: unit_price_for(product_id, qty) + variant.price_adjustment and setup fee math.
 */

const num = (v, d = 0) => {
  const n = Number(v)
  return Number.isFinite(n) ? n : d
}

/** Active tier for qty or null when no tier matches. */
export function tierFor(tiers = [], qty = 0) {
  const q = num(qty)
  const list = [...(tiers || [])].sort((a, b) => num(a.min_qty) - num(b.min_qty))
  let match = null
  for (const t of list) {
    const min = num(t.min_qty)
    const max = t.max_qty == null ? Infinity : num(t.max_qty)
    if (q >= min && q <= max) match = t
  }
  // If qty exceeds every tier's max, fall to the highest tier (open-ended pricing).
  if (!match && list.length && q > num(list[list.length - 1].min_qty)) match = list[list.length - 1]
  return match
}

/**
 * unitPriceFor(product, qty, variant?)
 * product: { base_price, pricing_tiers: [...] } (or a cart snapshot {basePrice, tiers})
 */
export function unitPriceFor(product, qty, variant = null) {
  if (!product) return 0
  const tiers = product.pricing_tiers || product.tiers || []
  const base = num(product.base_price ?? product.basePrice)
  const tier = tierFor(tiers, qty)
  const tierPrice = tier ? num(tier.unit_price) : base
  const adj = num(variant?.price_adjustment ?? product.priceAdjustment)
  return Math.max(0, round2(tierPrice + adj))
}

export function round2(n) {
  return Math.round((num(n) + Number.EPSILON) * 100) / 100
}

/**
 * estimateSetup(items, decorationOptions)
 * items: [{ decorationMethod, printLocations: [] }]
 * Mirrors SQL: setup_fee charged ONCE per decoration method per order,
 * plus per_location_fee * max(locations - 1, 0) for every item.
 * Returns { total, byMethod: { [method]: { setup, locations, count } } }
 */
export function estimateSetup(items = [], decorationOptions = []) {
  const byMethod = {}
  let total = 0
  const optMap = Object.fromEntries((decorationOptions || []).map((o) => [o.key, o]))
  for (const it of items || []) {
    const key = it.decorationMethod || it.decoration_method
    if (!key || key === 'none') continue
    const opt = optMap[key]
    if (!opt) continue
    if (!byMethod[key]) {
      const setup = num(opt.setup_fee)
      byMethod[key] = { name: opt.name || key, setup, locations: 0, count: 0 }
      total += setup
    }
    const locs = (it.printLocations || it.print_locations || []).length
    const extra = Math.max(locs - 1, 0) * num(opt.per_location_fee)
    byMethod[key].locations += extra
    byMethod[key].count += 1
    total += extra
  }
  return { total: round2(total), byMethod }
}

export function lineTotal(line) {
  return round2(num(line.unitPriceSnapshot) * num(line.quantity))
}

/** Compute the unit price from the snapshot stored on a cart line. */
export function lineUnitPrice(line) {
  if (line?.snapshot) return unitPriceFor(line.snapshot, line.quantity)
  return num(line?.unitPriceSnapshot)
}

export function estimateTax(subtotal, setup, taxRate = 0) {
  const rate = num(taxRate)
  return round2((num(subtotal) + num(setup)) * (rate > 1 ? rate / 100 : rate))
}
