import { supabase, toError } from '../supabase'

/**
 * placeOrder(payload) -> { order_id, order_number, subtotal, setup_fees, shipping, tax, total }
 * payload per brief: { contact, fulfillment, shipping_address|null, needed_by|null, customer_notes,
 *                      payment_provider, items:[{product_id, variant_id, quantity, decoration_method,
 *                      print_locations, size_breakdown, artwork_files, notes}] }
 */
export async function placeOrder(payload) {
  const { data, error } = await supabase.rpc('place_order', { payload })
  if (error) throw toError(error, 'We couldn’t place the order. Nothing was charged.')
  // RPC may return a row set or a single json object depending on how it's declared.
  const result = Array.isArray(data) ? data[0] : data
  if (!result?.order_number) throw new Error('Order placed but no order number came back. Call the shop to confirm.')
  return result
}

export async function lookupOrder(orderNumber, email) {
  const { data, error } = await supabase.rpc('lookup_order', {
    p_order_number: String(orderNumber || '').trim().toUpperCase(),
    p_email: String(email || '').trim().toLowerCase(),
  })
  if (error) throw toError(error, 'We couldn’t find that order.')
  const result = Array.isArray(data) ? data[0] : data
  return result || null
}
