// src/lib/api/quotes.js
//
// One table for every way a customer can start a conversation. request_type
// tells Pulse which kind it is: 'quote' (business or crew order), 'festival'
// (event run), 'reorder', 'design' (art help) or 'contact' (just a question).
// The /quote/ form fills most columns. /contact/ fills a handful and sets
// request_type 'contact'. Everything the form does not know is sent as null
// or an empty array so the row never carries an undefined.
//
// quantity_estimate is TEXT in the schema ('250', '200-300', 'a few hundred')
// so we send whatever the customer typed, trimmed.

import { supabase, toError } from '../supabase'

export const REQUEST_TYPES = ['quote', 'festival', 'reorder', 'contact', 'design']
export const DELIVERY = ['pickup', 'ship', 'onsite']

const str = (v) => (v == null ? null : String(v).trim() || null)
const arr = (v) => (Array.isArray(v) ? v.map((x) => String(x).trim()).filter(Boolean) : [])
const int = (v) => (v === '' || v == null || Number.isNaN(Number(v)) ? null : Math.round(Number(v)))
const date = (v) => (v && /^\d{4}-\d{2}-\d{2}$/.test(String(v)) ? v : null)

/** Build the quote_requests row from a form object. Exported so the form can preview it. */
export function buildQuoteRow(form = {}) {
  const requestType = REQUEST_TYPES.includes(form.request_type) ? form.request_type : 'quote'
  const delivery = DELIVERY.includes(form.delivery) ? form.delivery : null
  const sizes = form.sizes_estimate && typeof form.sizes_estimate === 'object' && !Array.isArray(form.sizes_estimate) ? form.sizes_estimate : {}
  return {
    request_type: requestType,
    name: str(form.name),
    email: str(form.email)?.toLowerCase(),
    phone: str(form.phone),
    company: str(form.company),
    event_name: str(form.event_name),
    event_date: date(form.event_date),
    quantity_estimate: str(form.quantity_estimate),
    product_interest: arr(form.product_interest),
    garment_interest: arr(form.garment_interest),
    decoration_interest: arr(form.decoration_interest),
    colors_in_art: int(form.colors_in_art),
    print_locations: arr(form.print_locations),
    sizes_estimate: sizes,
    budget_range: str(form.budget_range),
    needed_by: date(form.needed_by),
    delivery,
    how_heard: str(form.how_heard),
    source_page: str(form.source_page) || (typeof window !== 'undefined' ? window.location.pathname : null),
    reference_links: arr(form.reference_links),
    description: str(form.description),
    artwork_files: Array.isArray(form.artwork_files) ? form.artwork_files : [],
  }
}

/** submitQuote(form) -> true. Throws a friendly Error on failure. */
export async function submitQuote(form) {
  const row = buildQuoteRow(form)
  if (!row.name || !row.email) throw new Error('We need a name and a working email to get back to you.')
  const { error } = await supabase.from('quote_requests').insert(row)
  if (error) throw toError(error, 'We couldn’t send your request. Call (970) 626-4437 and we’ll take it by phone.')
  return true
}
