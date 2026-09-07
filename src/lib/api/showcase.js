// src/lib/api/showcase.js
//
// showcase_items is the wall. Pulse adds a row per graphic with a placement:
// 'hero' (the art behind the home headline), 'home' (the drifting wall on the
// home page) and 'work' (the /work/ gallery, which also shows 'home'). Images
// live in the public 'showcase' bucket, or anywhere at all via image_url.
//
// Every row comes back with a resolved `src` so no component has to know
// which of the two columns was filled in.

import { supabase, toError } from '../supabase'
import { publicImageUrl } from './storage'

export const SHOWCASE_BUCKET = 'showcase'
export const PLACEMENTS = ['home', 'work', 'hero']

const FIELDS = 'id, placement, title, subtitle, client_name, year, image_path, image_url, alt, link_url, tags, accent_hex, width, height, sort_order, is_active'

export function resolveShowcase(row) {
  if (!row) return null
  const src = row.image_url || publicImageUrl(SHOWCASE_BUCKET, row.image_path)
  const ratio = row.width > 0 && row.height > 0 ? row.width / row.height : null
  return { ...row, src, ratio, tags: Array.isArray(row.tags) ? row.tags : [] }
}

/**
 * getShowcase({ placement: 'home' | ['home', 'work'], limit })
 * Active rows only, ordered by sort_order then newest.
 */
export async function getShowcase({ placement, limit } = {}) {
  let q = supabase.from('showcase_items').select(FIELDS).eq('is_active', true)
  if (Array.isArray(placement)) q = q.in('placement', placement)
  else if (placement) q = q.eq('placement', placement)
  q = q.order('sort_order', { ascending: true }).order('created_at', { ascending: false })
  if (limit) q = q.limit(limit)
  const { data, error } = await q
  if (error) throw toError(error)
  return (data || []).map(resolveShowcase).filter((r) => r.src)
}

/** Every distinct tag across a list of rows, most used first. */
export function collectTags(rows = []) {
  const counts = new Map()
  for (const r of rows) for (const t of r.tags || []) counts.set(t, (counts.get(t) || 0) + 1)
  return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).map(([t]) => t)
}
