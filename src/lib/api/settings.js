// src/lib/api/settings.js
import { supabase, toError } from '../supabase'

export const DEFAULT_SETTINGS = {
  store: {
    name: 'Fishbone Graphics & Screen Printing',
    phone: '(970) 626-4437',
    email: 'hello@fishbonegraphics.com',
    address1: '250 S Lena St',
    city: 'Ridgway',
    state: 'CO',
    zip: '81432',
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
  ordering: { turnaround_days: 10, rush_available: true },
  announcement: { enabled: false, text: '' },
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
