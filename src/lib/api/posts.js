// src/lib/api/posts.js
//
// Notes. Short posts the shop writes in Pulse: festival planning, what makes a
// shirt print well, which art files to send. RLS returns only published rows
// to anon, so nothing here filters on is_published beyond ordering by it.
// Covers live in the public 'journal' bucket or anywhere via cover_image_url.
// Body is markdown and is rendered through lib/markdown.js, never raw.

import { supabase, toError } from '../supabase'
import { publicImageUrl } from './storage'

export const JOURNAL_BUCKET = 'journal'

const LIST_FIELDS = 'id, slug, title, kicker, excerpt, cover_image_path, cover_image_url, cover_alt, tags, author_name, is_published, published_at, is_pinned'

export function resolvePost(row) {
  if (!row) return null
  return {
    ...row,
    cover: row.cover_image_url || publicImageUrl(JOURNAL_BUCKET, row.cover_image_path),
    tags: Array.isArray(row.tags) ? row.tags : [],
  }
}

/** getPosts({ limit, tag }) -> pinned first, then newest. */
export async function getPosts({ limit, tag } = {}) {
  let q = supabase.from('posts').select(LIST_FIELDS).eq('is_published', true)
  if (tag) q = q.contains('tags', [tag])
  q = q.order('is_pinned', { ascending: false }).order('published_at', { ascending: false, nullsFirst: false })
  if (limit) q = q.limit(limit)
  const { data, error } = await q
  if (error) throw toError(error)
  return (data || []).map(resolvePost)
}

/** getPost(slug) -> full row with body, or null. */
export async function getPost(slug) {
  const { data, error } = await supabase.from('posts').select(`${LIST_FIELDS}, body`).eq('slug', slug).eq('is_published', true).maybeSingle()
  if (error) throw toError(error)
  return resolvePost(data)
}
