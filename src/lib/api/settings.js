// src/lib/api/settings.js
import { supabase, toError } from '../supabase'

export const DEFAULT_SETTINGS = {
  pricing: { show_prices: true, size_upcharges_enabled: false, size_upcharges: {} },
  store: {
    name: 'Fishbone Graphics',
    legal_name: 'Fishbone Graphics & Screen Printing',
    tagline: 'Ridgway, Colorado. Printing since 1985.',
    founded: 1985,
    phone: '(970) 626-4350',
    email: 'sales@fishbonegraphics.com',
    address1: '250 S Lena St',
    address2: '',
    city: 'Ridgway',
    state: 'CO',
    zip: '81432',
    lat: 38.1512,
    lng: -107.7593,
    plus_code: '5622+5Q Ridgway, Colorado',
    region: 'Uncompahgre Valley, San Juan Mountains',
    elevation_ft: 6985,
    directions_note: 'On South Lena Street, two blocks south of Hartwell Park and Highway 62. Street parking out front.',
    landmarks: [
      { name: 'Ridgway Town Park', distance: '2 blocks' },
      { name: 'Ouray', distance: '10 mi south on US-550' },
      { name: 'Telluride', distance: '37 mi via CO-62' },
      { name: 'Montrose', distance: '26 mi north on US-550' },
    ],
    hours: [
      { days: 'Mon-Fri', open: '9:00 AM', close: '5:00 PM' },
      { days: 'Sat', open: 'By appointment', close: '' },
      { days: 'Sun', open: 'Closed', close: '' },
    ],
    instagram: 'https://instagram.com/fishbonegraphics',
    facebook: 'https://facebook.com/fishbonegraphics',
    map_url: 'https://maps.google.com/?q=Fishbone+Graphics+Ridgway+CO',
  },
  tax: { rate: 0 },
  shipping: { flat_rate: 0, enabled: true },
  payments: { provider: 'invoice' },
  ordering: { turnaround_days: 10, rush_available: true, min_order_note: 'Most screen print jobs start at 12 pieces.' },
  announcement: { enabled: false, text: '', tone: 'accent' },
  design: { accent: 'red', switcher: true },
}

/** getPublicSettings() -> { store: {...}, tax: {...}, ... } merged over defaults */
export async function getPublicSettings() {
  const { data, error } = await supabase.from('settings').select('key, value').eq('is_public', true)
  if (error) throw toError(error)
  const map = {}
  for (const row of data || []) map[row.key] = row.value
  return mergeSettings(map)
}

export function mergeSettings(map = {}) {
  const out = { ...DEFAULT_SETTINGS }
  for (const key of Object.keys(map)) {
    const v = map[key]
    out[key] = v && typeof v === 'object' && !Array.isArray(v) ? { ...(DEFAULT_SETTINGS[key] || {}), ...v } : v
  }
  return out
}
