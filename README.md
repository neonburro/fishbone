# Fishbone Graphics — Storefront

Customer-facing storefront for **Fishbone Graphics & Screen Printing**, Ridgway, Colorado (printing since 1985). Customers browse blanks, configure a decorated garment (color, decoration method, print locations, quantity with live price breaks, size breakdown, artwork upload), build an order sheet, and place an order. Orders land in Supabase as `pending_review`; the shop proofs and invoices from the Pulse admin app.

Stack: Vite 6 · React 18 (JSX) · Chakra UI v2 · framer-motion · react-router v6 · Supabase JS v2 · zustand · react-helmet-async. Deployed on Netlify.

## Environment

Copy `.env.example` to `.env` and fill in:

| Var | Purpose |
| --- | --- |
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Public anon key (RLS protects data; never commit real keys) |
| `VITE_SITE_URL` | Optional canonical URL used in SEO tags (defaults to `https://fishbonegraphics.com`) |

`src/lib/supabase.js` throws a clear error at startup if the two Supabase vars are missing.

## Scripts

```
yarn            # install (Node >= 20)
yarn dev        # Vite dev server
yarn build      # production build to dist/
yarn preview    # serve the build locally
yarn lint       # eslint
```

`scripts/screenshots.mjs` is a dev-only Playwright helper that mocks Supabase and screenshots key routes into `.screens/` (gitignored). It is not part of the build.

## Layout

```
src/
  theme/index.js            Ink & Bone Chakra theme (ink/bone/ember/river/hivis, Barlow fonts, 4px radius)
  components/brand/         Logo.jsx (swap point), RegMark.jsx, Halftone.jsx
  components/common/        SEO, ErrorBoundary, ScrollToTop, Motion, Section, States, Placeholder, ArtworkDropzone
  components/layout/        Header (mobile drawer), Footer (NAP from settings.store), PageHero
  components/product/       ColorSwatches, PriceBreaks, SizeGrid, Gallery, OrderSummary, ProductCard/Grid
  components/cart/          CartLine, EstimateSummary
  components/checkout/      Stepper, JobTicket (receipt), NextSteps (timeline)
  lib/supabase.js           client
  lib/api/                  catalog, orders (place_order / lookup_order RPCs), quotes, settings, storage
  lib/pricing.js            client-side estimate mirroring the SQL (tiers + variant adjustment, setup fees)
  lib/payments/             provider registry: invoice (active), stripe + square (stubs)
  store/cartStore.js        zustand + persist order sheet
  pages/                    Home, Shop, Shop/Category, Product, Cart, Checkout, Order/Confirmed, Order/Track,
                            Quote, Services, Work, About, Contact, NotFound
netlify/functions/create-checkout.js   scaffold for hosted card checkout (returns 501 until wired)
```

## Pricing

All prices shown in the browser are **estimates**. `place_order` computes real totals server-side. `src/lib/pricing.js` mirrors that math so the estimate lines up:

- unit price = matching `pricing_tiers` row for the quantity (else `base_price`) + `variant.price_adjustment`
- setup = `decoration_options.setup_fee` **once per decoration method per order** + `per_location_fee × max(locations − 1, 0)` per item
- tax and shipping come from public `settings` (`tax.rate`, `shipping.flat_rate` / `enabled`)

## Payments

Provider abstraction lives in `src/lib/payments/`. Each provider exports `{ key, label, description, available, start(orderResult) }` and `start` resolves to `{ type: 'confirmation' }` or `{ type: 'redirect', url }`.

- `invoice.js` — active default. Order is saved, customer sees the job-ticket confirmation, the shop invoices after proof approval.
- `stripe.js` / `square.js` — stubs (`available: false`). Each file's header comment lists the exact wiring steps. Both POST to `netlify/functions/create-checkout.js`, which currently returns 501; implement the Checkout Session / Payment Link creation there, add the webhook function that marks the order paid, then set `settings.payments.provider` to `stripe` or `square` in Pulse. `resolveProvider()` in `index.js` falls back to invoice if the configured provider is not available.

Checkout flow: Contact → Fulfillment → Review → Place order. On success the cart is cleared, a stash is written to `sessionStorage` (`fishbone-order-<number>`), and the customer lands on `/order/confirmed/:orderNumber`, which also calls `lookup_order` to sync the server copy.

## Swapping the logo

Everything brand-mark related is in `src/components/brand/Logo.jsx`. Replace the SVG in `FishMark` and the wordmark `<text>` with the client's art, keep the `variant` (`full` | `mark`), `color`, and `height` props, and every header/footer/drawer updates. Update `public/favicon.svg` alongside it.

## Storage

- `product-images`, `site-media`: public buckets; URLs via `publicImageUrl(bucket, path)`.
- `artwork`: private. Customers upload to `uploads/<uuid>/<filename>` (the only path anon may write); the item stores `{ path, name, size, type }`. Admins read via signed URLs in Pulse.

## Deploy

`netlify.toml` builds with `yarn build`, publishes `dist`, pins Node 20, and adds the SPA redirect (`public/_redirects` too). Set the two `VITE_SUPABASE_*` vars in Netlify environment settings.
