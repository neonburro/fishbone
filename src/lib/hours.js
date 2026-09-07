// src/lib/hours.js
//
// The shop's hours live in settings.store.hours as the printer typed them in
// Pulse: [{ days: 'Mon-Fri', open: '9:00 AM', close: '5:00 PM' }, ...]. Days
// may be a range ('Mon-Fri', 'Mon – Fri', 'Mon to Fri'), a list ('Tue, Thu'),
// a single day or 'Daily'. Open may be a time or a word ('By appointment',
// 'Closed'). This file turns that loose text into a weekly schedule and answers
// one question, in the shop's own time zone, on three surfaces: the menu
// overlay, the footer and the map panel.
//
//   openStatus(hours) -> { isOpen, label, ... }
//   'Open now. Closes 5:00 PM'  |  'Closed. Opens Mon 9:00 AM'
//
// It also emits schema.org openingHoursSpecification for the LocalBusiness
// JSON-LD so the footer and the search engines agree with the sign on the door.
//
// No oxford commas, no em dashes.

export const SHOP_TZ = 'America/Denver'

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const DAY_LONG = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const DAY_LOOKUP = {
  sun: 0, sunday: 0, mon: 1, monday: 1, tue: 2, tues: 2, tuesday: 2, wed: 3, weds: 3, wednesday: 3,
  thu: 4, thur: 4, thurs: 4, thursday: 4, fri: 5, friday: 5, sat: 6, saturday: 6,
}

const dayIndex = (word) => {
  const k = String(word || '').toLowerCase().replace(/[^a-z]/g, '')
  return k in DAY_LOOKUP ? DAY_LOOKUP[k] : null
}

/** 'Mon-Fri' | 'Mon – Fri' | 'Tue, Thu' | 'Sat' | 'Daily' -> [dayIndex, ...] */
export function parseDays(text) {
  const t = String(text || '').trim()
  if (!t) return []
  if (/^(daily|every ?day|all week|7 days)/i.test(t)) return [0, 1, 2, 3, 4, 5, 6]
  if (/^weekdays?$/i.test(t)) return [1, 2, 3, 4, 5]
  if (/^weekends?$/i.test(t)) return [0, 6]
  const out = new Set()
  for (const part of t.split(/,|&|\band\b|\//i)) {
    const range = part.split(/\s*(?:-|–|—|\bto\b|\bthrough\b|\bthru\b)\s*/i).map((s) => s.trim()).filter(Boolean)
    if (range.length >= 2) {
      const a = dayIndex(range[0])
      const b = dayIndex(range[range.length - 1])
      if (a == null || b == null) continue
      let d = a
      out.add(d)
      while (d !== b) { d = (d + 1) % 7; out.add(d) }
    } else if (range.length === 1) {
      const d = dayIndex(range[0])
      if (d != null) out.add(d)
    }
  }
  return [...out].sort()
}

/** '9:00 AM' | '9am' | '17:00' | 'Noon' -> minutes since midnight, or null */
export function parseTime(text) {
  const t = String(text || '').trim().toLowerCase()
  if (!t) return null
  if (/^noon$/.test(t)) return 12 * 60
  if (/^midnight$/.test(t)) return 0
  const m = t.match(/^(\d{1,2})(?::(\d{2}))?\s*(a\.?m\.?|p\.?m\.?)?$/)
  if (!m) return null
  let h = Number(m[1])
  const min = Number(m[2] || 0)
  const ap = m[3]?.replace(/\./g, '')
  if (ap === 'pm' && h < 12) h += 12
  if (ap === 'am' && h === 12) h = 0
  if (h > 23 || min > 59) return null
  return h * 60 + min
}

export function formatTime(minutes) {
  if (minutes == null) return ''
  const h24 = Math.floor(minutes / 60) % 24
  const m = minutes % 60
  const ap = h24 >= 12 ? 'PM' : 'AM'
  const h = h24 % 12 === 0 ? 12 : h24 % 12
  return `${h}:${String(m).padStart(2, '0')} ${ap}`
}

/**
 * weekSchedule(hours) -> Array(7) of
 *   { open, close }           a normal day (minutes)
 *   { appointment: true }     'By appointment'
 *   null                      closed or unlisted
 */
export function weekSchedule(hours = []) {
  const week = Array(7).fill(null)
  for (const row of Array.isArray(hours) ? hours : []) {
    const days = parseDays(row?.days)
    const open = parseTime(row?.open)
    const close = parseTime(row?.close)
    let value = null
    if (open != null && close != null) value = { open, close: close <= open ? close + 24 * 60 : close }
    else if (/appoint|call/i.test(String(row?.open || '') + String(row?.close || ''))) value = { appointment: true }
    for (const d of days) week[d] = value
  }
  return week
}

/** Current weekday and minutes in a time zone. */
export function nowInZone(tz = SHOP_TZ, now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: tz, weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(now)
  const get = (type) => parts.find((p) => p.type === type)?.value
  const day = dayIndex(get('weekday')) ?? now.getDay()
  const minutes = Number(get('hour')) * 60 + Number(get('minute'))
  return { day, minutes }
}

/**
 * openStatus(hours, { now, tz }) ->
 *   { isOpen, appointment, label, short, closesAt, nextOpen: { day, minutes } | null }
 */
export function openStatus(hours = [], { now = new Date(), tz = SHOP_TZ } = {}) {
  const week = weekSchedule(hours)
  const listed = week.some(Boolean)
  const { day, minutes } = nowInZone(tz, now)
  const today = week[day]

  if (!listed) return { isOpen: false, appointment: false, label: 'Call for hours', short: 'Call for hours', closesAt: null, nextOpen: null }

  if (today && today.open != null && minutes >= today.open && minutes < today.close) {
    const left = today.close - minutes
    const closes = left <= 60 ? `Closes in ${left} min` : `Closes ${formatTime(today.close)}`
    return { isOpen: true, appointment: false, label: `Open now. ${closes}`, short: 'Open now', closesAt: today.close, nextOpen: null }
  }

  // Find the next opening, starting today if it has not happened yet.
  let nextOpen = null
  for (let i = 0; i < 7 && !nextOpen; i += 1) {
    const d = (day + i) % 7
    const row = week[d]
    if (!row || row.open == null) continue
    if (i === 0 && row.open <= minutes) continue
    nextOpen = { day: d, minutes: row.open, offset: i }
  }

  const when = !nextOpen ? '' : nextOpen.offset === 0 ? `today ${formatTime(nextOpen.minutes)}` : nextOpen.offset === 1 ? `tomorrow ${formatTime(nextOpen.minutes)}` : `${DAY_NAMES[nextOpen.day]} ${formatTime(nextOpen.minutes)}`
  const opens = when ? `Opens ${when}` : 'Call for hours'

  if (today?.appointment) {
    return { isOpen: false, appointment: true, label: `By appointment today. ${opens}`, short: 'By appointment', closesAt: null, nextOpen }
  }
  return { isOpen: false, appointment: false, label: `Closed. ${opens}`, short: 'Closed', closesAt: null, nextOpen }
}

/** One row of hours, cleaned for display. Plain hyphen for the range, 'to' between times. */
export function hoursDisplay(row = {}) {
  const days = String(row.days || '').replace(/\s*(?:–|—|-)\s*/g, '-').trim()
  const open = parseTime(row.open)
  const close = parseTime(row.close)
  const time = open != null && close != null ? `${formatTime(open)} to ${formatTime(close)}` : String(row.open || row.close || '').trim()
  return { days, time }
}

/** schema.org OpeningHoursSpecification[] for the LocalBusiness JSON-LD. */
export function openingHoursSpecification(hours = []) {
  const week = weekSchedule(hours)
  const groups = new Map()
  week.forEach((row, d) => {
    if (!row || row.open == null) return
    const key = `${row.open}-${row.close}`
    if (!groups.has(key)) groups.set(key, { open: row.open, close: row.close, days: [] })
    groups.get(key).days.push(DAY_LONG[d])
  })
  const hhmm = (m) => `${String(Math.floor((m % (24 * 60)) / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`
  return [...groups.values()].map((g) => ({ '@type': 'OpeningHoursSpecification', dayOfWeek: g.days, opens: hhmm(g.open), closes: hhmm(g.close) }))
}

export { DAY_NAMES, DAY_LONG }
