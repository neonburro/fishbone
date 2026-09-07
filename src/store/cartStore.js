// src/store/cartStore.js
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { unitPriceFor, round2 } from '../lib/pricing'

/**
 * Cart line shape:
 * { lineId, productId, slug, name, brand, variantId, variantLabel, colorHex, quantity,
 *   sizeBreakdown: {S: 5, ...}, decorationMethod, printLocations: [], artworkFiles: [{path,name,size,type}],
 *   notes, unitPriceSnapshot, minQuantity, image,
 *   snapshot: { tiers: [...pricing_tiers], basePrice, priceAdjustment } }
 */

const newId = () => (crypto?.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`)

export function priceLine(line) {
  const snap = line.snapshot
  const unit = snap ? unitPriceFor(snap, line.quantity) : Number(line.unitPriceSnapshot) || 0
  return { unit, total: round2(unit * (Number(line.quantity) || 0)) }
}

const useCartStore = create(
  persist(
    (set, get) => ({
      lines: [],

      addLine: (line) => {
        const lineId = newId()
        const l = { ...line, lineId, quantity: Number(line.quantity) || 0 }
        l.unitPriceSnapshot = priceLine(l).unit
        set((s) => ({ lines: [...s.lines, l] }))
        return lineId
      },

      updateLine: (lineId, patch) =>
        set((s) => ({
          lines: s.lines.map((l) => {
            if (l.lineId !== lineId) return l
            const next = { ...l, ...patch }
            if (patch.quantity != null) next.quantity = Number(patch.quantity) || 0
            next.unitPriceSnapshot = priceLine(next).unit
            return next
          }),
        })),

      removeLine: (lineId) => set((s) => ({ lines: s.lines.filter((l) => l.lineId !== lineId) })),

      clear: () => set({ lines: [] }),

      // selectors (call as functions)
      lineCount: () => get().lines.length,
      itemCount: () => get().lines.reduce((n, l) => n + (Number(l.quantity) || 0), 0),
      subtotal: () => round2(get().lines.reduce((sum, l) => sum + priceLine(l).total, 0)),
    }),
    {
      name: 'fishbone-cart',
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ lines: s.lines }),
    }
  )
)

// Hook-friendly derived selectors (subscribe to lines so components re-render).
export const selectLineCount = (s) => s.lines.length
export const selectItemCount = (s) => s.lines.reduce((n, l) => n + (Number(l.quantity) || 0), 0)
export const selectSubtotal = (s) => round2(s.lines.reduce((sum, l) => sum + priceLine(l).total, 0))

export default useCartStore
