// src/lib/api/quotes.js
import { supabase, toError } from '../supabase'

/**
 * submitQuote(form) -> inserted row (or true if RLS hides the row)
 * form: { name, email, phone, company, event_name, event_date, quantity_estimate,
 *         product_interest: [], description, artwork_files: [{path,name,size,type}] }
 */
export async function submitQuote(form) {
  const row = {
    name: form.name?.trim(),
    email: form.email?.trim().toLowerCase(),
    phone: form.phone?.trim() || null,
    company: form.company?.trim() || null,
    event_name: form.event_name?.trim() || null,
    event_date: form.event_date || null,
    quantity_estimate: form.quantity_estimate ? Number(form.quantity_estimate) : null,
    product_interest: Array.isArray(form.product_interest) ? form.product_interest : [],
    description: form.description?.trim() || null,
    artwork_files: Array.isArray(form.artwork_files) ? form.artwork_files : [],
  }
  const { error } = await supabase.from('quote_requests').insert(row)
  if (error) throw toError(error, 'We couldn’t send your request. Call (970) 626-4437 and we’ll take it by phone.')
  return true
}
