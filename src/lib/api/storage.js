import { supabase, toError } from '../supabase'

export const ARTWORK_BUCKET = 'artwork'
export const ARTWORK_ACCEPT = {
  'image/png': ['.png'],
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/svg+xml': ['.svg'],
  'image/webp': ['.webp'],
  'image/tiff': ['.tif', '.tiff'],
  'application/pdf': ['.pdf'],
  'application/postscript': ['.ai', '.eps'],
  'image/vnd.adobe.photoshop': ['.psd'],
  'application/zip': ['.zip'],
}
export const ARTWORK_EXTENSIONS = Object.values(ARTWORK_ACCEPT).flat()
export const ARTWORK_ACCEPT_ATTR = [...Object.keys(ARTWORK_ACCEPT), ...ARTWORK_EXTENSIONS].join(',')
export const ARTWORK_MAX_BYTES = 50 * 1024 * 1024

export function safeFileName(name = 'file') {
  const base = String(name).split(/[\\/]/).pop() || 'file'
  return base
    .normalize('NFKD')
    .replace(/[^\w.-]+/g, "-")
    .replace(/-+/g, '-')
    .replace(/^[-.]+/, '')
    .slice(0, 120) || 'file'
}

export function validateArtwork(file) {
  const ext = `.${(file.name.split('.').pop() || '').toLowerCase()}`
  if (!ARTWORK_EXTENSIONS.includes(ext)) {
    return `We can’t take ${ext || 'that file type'}. Send PNG, JPG, SVG, PDF, AI, EPS, PSD, TIFF or ZIP.`
  }
  if (file.size > ARTWORK_MAX_BYTES) return 'That file is over 50 MB. Zip it or email us a link.'
  return null
}

/**
 * uploadArtwork(file, onProgress?) -> { path, name, size, type }
 * Uploads to private bucket 'artwork' at uploads/<uuid>/<safeName> (the only path anon may write).
 * Supabase JS has no upload progress hook, so onProgress is called at 0 and 100 (and a mid tick).
 */
export async function uploadArtwork(file, onProgress) {
  const invalid = validateArtwork(file)
  if (invalid) throw new Error(invalid)
  const id = crypto.randomUUID()
  const name = safeFileName(file.name)
  const path = `uploads/${id}/${name}`
  onProgress?.(5)
  const tick = setTimeout(() => onProgress?.(60), 400)
  const { error } = await supabase.storage.from(ARTWORK_BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
    contentType: file.type || 'application/octet-stream',
  })
  clearTimeout(tick)
  if (error) throw toError(error, 'Upload failed. Try again or email the art to us after ordering.')
  onProgress?.(100)
  return { path, name: file.name, size: file.size, type: file.type || 'application/octet-stream' }
}

export async function removeArtwork(path) {
  // Anon may not be able to delete; ignore failures — the file is orphaned but harmless.
  try {
    await supabase.storage.from(ARTWORK_BUCKET).remove([path])
  } catch {
    /* noop */
  }
}

export function publicImageUrl(bucket, path) {
  if (!path) return null
  if (/^https?:\/\//i.test(path)) return path
  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  return data?.publicUrl || null
}

/** List gallery images from site-media (public). Returns [{name, url}] */
export async function listSiteMedia(prefix = 'work', limit = 60) {
  const { data, error } = await supabase.storage.from('site-media').list(prefix, {
    limit,
    sortBy: { column: 'name', order: 'asc' },
  })
  if (error) throw toError(error)
  return (data || [])
    .filter((f) => f.name && !f.name.startsWith('.') && /\.(png|jpe?g|webp|gif|avif)$/i.test(f.name))
    .map((f) => ({ name: f.name, url: publicImageUrl('site-media', `${prefix}/${f.name}`) }))
}
