// src/lib/format.js
const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 })

export function money(n) {
  const v = Number(n)
  if (!Number.isFinite(v)) return '-'
  return usd.format(v)
}

export function titleCase(s = '') {
  return String(s)
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

const LOCATION_LABELS = {
  front: 'Front',
  back: 'Back',
  full_front: 'Full front',
  full_back: 'Full back',
  left_chest: 'Left chest',
  right_chest: 'Right chest',
  left_sleeve: 'Left sleeve',
  right_sleeve: 'Right sleeve',
  sleeve: 'Sleeve',
  sleeves: 'Both sleeves',
  nape: 'Nape / back neck',
  neck: 'Back neck',
  pocket: 'Pocket',
  hem: 'Hem',
  hood: 'Hood',
  side: 'Side',
  front_panel: 'Front panel',
  back_panel: 'Back panel',
  crown: 'Crown',
  bill: 'Bill',
  left_side: 'Left side',
  right_side: 'Right side',
  leg: 'Leg',
  one_side: 'One side',
  two_sides: 'Two sides',
}

export function locationLabel(key = '') {
  return LOCATION_LABELS[key] || titleCase(key)
}

const METHOD_LABELS = {
  screen_print: 'Screen print',
  screenprint: 'Screen print',
  embroidery: 'Embroidery',
  dtf: 'DTF transfer',
  dtg: 'Direct-to-garment',
  heat_transfer: 'Heat transfer',
  vinyl: 'Vinyl',
  sublimation: 'Sublimation',
  none: 'Blank, no decoration',
}

export function methodLabel(key = '', options = []) {
  const found = options?.find?.((o) => o.key === key)
  return found?.name || METHOD_LABELS[key] || titleCase(key)
}

export function formatDate(d, opts = { month: 'short', day: 'numeric', year: 'numeric' }) {
  if (!d) return '-'
  const dt = typeof d === 'string' && d.length === 10 ? new Date(`${d}T12:00:00`) : new Date(d)
  if (Number.isNaN(dt.getTime())) return '-'
  return dt.toLocaleDateString('en-US', opts)
}

export function bytes(n) {
  const v = Number(n) || 0
  if (v < 1024) return `${v} B`
  if (v < 1024 * 1024) return `${(v / 1024).toFixed(0)} KB`
  return `${(v / (1024 * 1024)).toFixed(1)} MB`
}

export function sizeBreakdownText(sb = {}) {
  return Object.entries(sb || {})
    .filter(([, q]) => Number(q) > 0)
    .map(([s, q]) => `${s}×${q}`)
    .join('  ')
}
