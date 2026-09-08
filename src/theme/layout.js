// src/theme/layout.js
//
// ── THE INVARIANT ───────────────────────────────────────────────────────────
//
//   The nav tile, the plumb line and the first character of every heading
//   sit at the same x. At every viewport width. On every page.
//
// The sheet is full width. On a phone it keeps a 16px rail. On a desktop the
// rail is 1.5vw on each side, which leaves 97 percent of the screen for the
// page, and everything from the logo tile to the footer sits on that line.
// There is no cap and there is no centring. A wide screen gets a wide wall.
//
// The nav bar is fixed. It leaves when you scroll down past NAV_HIDE_AFTER
// and comes straight back when you scroll up, because a reader going down is
// reading and a reader going up is looking for something. The job ticket
// pill stays on screen whenever the ticket has lines, so the order is never
// more than one tap away even while the bar is gone. The bar publishes its
// measured height on the document as --fb-nav-h so main can pad by it.
//
// No oxford commas, no em dashes.

// ── the rail ────────────────────────────────────────────────────────────────
// RAIL is the Chakra padding value. RAIL_CSS is the same thing as a string
// for fixed elements that cannot take a responsive object.
export const RAIL = { base: '16px', md: '1.5vw' }
export const RAIL_CSS = { base: '16px', md: '1.5vw' }
export const RAIL_PX = { base: 16, md: 24 }

// ── the sheet ───────────────────────────────────────────────────────────────
export const SHEET = 'none'
export const SHEET_PX = Infinity

// ── the nav ─────────────────────────────────────────────────────────────────
export const LOCKUP_PAD = 10
export const NAV_H = { base: '72px', md: '84px' }
export const NAV_H_TIGHT = { base: '72px', md: '84px' }
export const NAV_CONDENSE_AFTER = 24
export const NAV_HIDE_AFTER = 120
export const NAV_VAR = '--fb-nav-h'

// ── measure ─────────────────────────────────────────────────────────────────
export const MEASURE = '640px'
export const LEDE = '860px'

// ── rhythm ──────────────────────────────────────────────────────────────────
export const BAND_Y = { base: 12, md: 16, lg: 20 }
export const GUTTER = { base: 3, md: 4, lg: 5 }

// ── motion ──────────────────────────────────────────────────────────────────
export const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)'
export const EASE_ARR = [0.16, 1, 0.3, 1]
export const DUR = { fast: 0.22, base: 0.42, slow: 0.7 }

// ── z ───────────────────────────────────────────────────────────────────────
export const Z = { plumb: 900, nav: 1000, pill: 1100, overlay: 1200, drawer: 1300 }

export default {
  RAIL, RAIL_CSS, RAIL_PX, SHEET, SHEET_PX, LOCKUP_PAD, NAV_H, NAV_H_TIGHT, NAV_CONDENSE_AFTER, NAV_HIDE_AFTER, NAV_VAR,
  MEASURE, LEDE, BAND_Y, GUTTER, EASE, EASE_ARR, DUR, Z,
}
