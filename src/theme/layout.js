// src/theme/layout.js
//
// ── THE INVARIANT ───────────────────────────────────────────────────────────
//
//   The first glyph of the wordmark and the first character of every heading
//   sit at the same x. At every viewport width. On every page.
//
// The sheet is left aligned and capped at SHEET. On a display wider than that
// the right hand side is empty on purpose. The rail is one value on mobile and
// one value on desktop and it does not step again at lg, because a fixed
// position element (the nav lockup, the plumb line, the job ticket pill) has to
// be able to match it with a single number.
//
// The nav bar is full width and it never hides. A cart that is one scroll
// position away from unreachable is a cart people abandon. It condenses past
// NAV_CONDENSE_AFTER instead and publishes its measured height on the
// document as --fb-nav-h so anything sticky underneath it can sit at that
// offset and never be covered.
//
// No oxford commas, no em dashes.

// ── the rail ────────────────────────────────────────────────────────────────
export const RAIL = { base: 5, md: 10 }
export const RAIL_PX = { base: 20, md: 40 }

// ── the sheet ───────────────────────────────────────────────────────────────
export const SHEET = '1680px'
export const SHEET_PX = 1680

// ── the nav ─────────────────────────────────────────────────────────────────
// The lockup is wrapped in a tile with LOCKUP_PAD of padding. The tile is
// pulled back by that much so the LETTERFORM lands on the rail, not the box.
export const LOCKUP_PAD = 10
export const NAV_H = { base: '66px', md: '84px' }
export const NAV_H_TIGHT = { base: '56px', md: '62px' }
export const NAV_CONDENSE_AFTER = 24
export const NAV_VAR = '--fb-nav-h'

// ── measure ─────────────────────────────────────────────────────────────────
// SHEET is a viewport constraint. MEASURE is a typographic one.
export const MEASURE = '640px'
export const LEDE = '860px'

// ── rhythm ──────────────────────────────────────────────────────────────────
export const BAND_Y = { base: 14, md: 20, lg: 24 }
export const GUTTER = { base: 4, md: 6, lg: 8 }

// ── motion ──────────────────────────────────────────────────────────────────
// One easing everywhere. Smooth and minimal, never bouncy.
export const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)'
export const EASE_ARR = [0.16, 1, 0.3, 1]
export const DUR = { fast: 0.22, base: 0.42, slow: 0.7 }

// ── z ───────────────────────────────────────────────────────────────────────
export const Z = { plumb: 900, nav: 1000, pill: 1100, overlay: 1200, drawer: 1300 }

export default {
  RAIL, RAIL_PX, SHEET, SHEET_PX, LOCKUP_PAD, NAV_H, NAV_H_TIGHT, NAV_CONDENSE_AFTER, NAV_VAR,
  MEASURE, LEDE, BAND_Y, GUTTER, EASE, EASE_ARR, DUR, Z,
}
