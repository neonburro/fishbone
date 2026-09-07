import { supabase, toError } from '../supabase'

const PRODUCT_CARD_FIELDS =
  'id, slug, name, brand, style_number, short_description, base_price, price_unit, min_quantity, badges, images, is_featured, featured_order, category_id, decoration_methods, categories:category_id!inner(key, name)'

export async function getCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('id, key, name, tagline, description, image_url, sort_order, is_active')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
  if (error) throw toError(error)
  return data || []
}

export async function getCategory(key) {
  const { data, error } = await supabase
    .from('categories')
    .select('id, key, name, tagline, description, image_url, sort_order, is_active')
    .eq('key', key)
    .eq('is_active', true)
    .maybeSingle()
  if (error) throw toError(error)
  return data || null
}

/**
 * getProducts({ categoryKey, featured, limit })
 * - categoryKey filters through the categories join
 * - featured: true -> only is_featured, ordered by featured_order
 */
export async function getProducts({ categoryKey, featured, limit } = {}) {
  let q = supabase.from('products').select(PRODUCT_CARD_FIELDS).eq('is_active', true)
  if (categoryKey) q = q.eq('categories.key', categoryKey)
  if (featured) q = q.eq('is_featured', true).order('featured_order', { ascending: true, nullsFirst: false })
  q = q.order('name', { ascending: true })
  if (limit) q = q.limit(limit)
  const { data, error } = await q
  if (error) throw toError(error)
  return data || []
}

export async function getProductBySlug(slug) {
  const { data, error } = await supabase
    .from('products')
    .select(
      `*, categories:category_id(id, key, name),
       product_variants(id, product_id, sku, color_name, color_hex, size, price_adjustment, image_url, in_stock, sort_order),
       pricing_tiers(id, product_id, min_qty, max_qty, unit_price)`
    )
    .eq('slug', slug)
    .eq('is_active', true)
    .order('sort_order', { referencedTable: 'product_variants', ascending: true })
    .order('min_qty', { referencedTable: 'pricing_tiers', ascending: true })
    .maybeSingle()
  if (error) throw toError(error)
  if (!data) return null
  return {
    ...data,
    product_variants: [...(data.product_variants || [])].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)),
    pricing_tiers: [...(data.pricing_tiers || [])].sort((a, b) => a.min_qty - b.min_qty),
  }
}

export async function getDecorationOptions() {
  const { data, error } = await supabase
    .from('decoration_options')
    .select('id, key, name, description, setup_fee, per_location_fee, sort_order, is_active')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
  if (error) throw toError(error)
  return data || []
}
