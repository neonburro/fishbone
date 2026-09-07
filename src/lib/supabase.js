import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!url || !anonKey) {
  throw new Error(
    '[Fishbone] Missing Supabase config. Copy .env.example to .env and set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY, then restart the dev server.'
  )
}

export const supabase = createClient(url, anonKey, {
  auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
})

/** Normalize Supabase/PostgREST/network errors into a plain Error with a friendly message. */
export function toError(err, fallback = 'Something went wrong talking to the shop.') {
  if (!err) return new Error(fallback)
  if (err instanceof Error) return err
  const msg = err.message || err.error_description || err.details || fallback
  const e = new Error(msg)
  e.code = err.code
  e.hint = err.hint
  return e
}

export default supabase
