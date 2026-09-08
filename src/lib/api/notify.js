// src/lib/api/notify.js
//
// A courtesy ping to the shop. POSTs to the notify-admin Netlify function,
// which emails the admin address through Resend with a link into Pulse. The
// row in Supabase is the record, this is only the nudge, so it never throws
// and never blocks the form. In local dev there is no function and the call
// fails quietly.

export async function notifyAdmin(payload) {
  try {
    await fetch('/.netlify/functions/notify-admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...payload, page: typeof window !== 'undefined' ? window.location.pathname : null }),
      keepalive: true,
    })
  } catch {
    /* the row is saved, the email is a courtesy */
  }
}
