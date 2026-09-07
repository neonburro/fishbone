// Dev-only: capture screenshots of key routes with mocked Supabase responses.
// Usage: NODE_PATH=/opt/node22/lib/node_modules node scripts/screenshots.mjs http://localhost:5173
const { chromium } = await import(process.env.PW_MODULE || 'playwright')
import { mkdirSync } from 'node:fs'

const base = process.argv[2] || 'http://localhost:5173'
const out = new URL('../.screens/', import.meta.url).pathname
mkdirSync(out, { recursive: true })

const category = { id: 'c1', key: 'tees', name: 'T-Shirts', tagline: 'Soft, heavy, and everything between.', description: 'Ring-spun and heavy cotton tees that take ink.', image_url: null, sort_order: 1, is_active: true }
const categories = [category,
  { id: 'c2', key: 'hoodies', name: 'Hoodies & Fleece', tagline: 'For the night set.', image_url: null, sort_order: 2, is_active: true },
  { id: 'c3', key: 'hats', name: 'Hats', tagline: 'Embroidered, puffed, patched.', image_url: null, sort_order: 3, is_active: true }]
const product = {
  id: 'p1', slug: 'gildan-5000-heavy-cotton-tee', name: 'Gildan 5000 Heavy Cotton Tee', brand: 'Gildan', style_number: 'G500', category_id: 'c1',
  short_description: 'The festival workhorse. 5.3 oz heavy cotton, holds a 6-color print without complaint.',
  description: 'Classic fit, taped neck and shoulders, double-needle hems. Preshrunk. Available in 60+ colors — the swatches here are what we keep on the shelf.',
  base_price: 12.5, price_unit: 'ea', min_quantity: 12, decoration_methods: ['screen_print', 'dtf'], print_locations: ['front', 'back', 'left_chest', 'left_sleeve'],
  features: ['5.3 oz, 100% preshrunk cotton', 'Taped neck and shoulders', 'Tear-away label', 'CPSIA compliant youth sizes on request'], badges: ['Best seller'],
  specs: { sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL'], weight: '5.3 oz', fit: 'Classic' }, images: [], is_featured: true, featured_order: 1, is_active: true,
  categories: { id: 'c1', key: 'tees', name: 'T-Shirts' },
  product_variants: [
    { id: 'v1', product_id: 'p1', sku: 'G500-BLK', color_name: 'Black', color_hex: '#111111', price_adjustment: 0, image_url: null, in_stock: true, sort_order: 1 },
    { id: 'v2', product_id: 'p1', sku: 'G500-WHT', color_name: 'White', color_hex: '#F4F4F2', price_adjustment: -1, image_url: null, in_stock: true, sort_order: 2 },
    { id: 'v3', product_id: 'p1', sku: 'G500-ORG', color_name: 'Safety Orange', color_hex: '#FF6A13', price_adjustment: 0.5, image_url: null, in_stock: true, sort_order: 3 },
    { id: 'v4', product_id: 'p1', sku: 'G500-FOR', color_name: 'Forest Green', color_hex: '#1F4D3A', price_adjustment: 0, image_url: null, in_stock: true, sort_order: 4 },
    { id: 'v5', product_id: 'p1', sku: 'G500-HTH', color_name: 'Sport Grey', color_hex: '#9A9A98', price_adjustment: 0, image_url: null, in_stock: false, sort_order: 5 },
  ],
  pricing_tiers: [
    { id: 't1', product_id: 'p1', min_qty: 12, max_qty: 23, unit_price: 12.5 },
    { id: 't2', product_id: 'p1', min_qty: 24, max_qty: 47, unit_price: 10.75 },
    { id: 't3', product_id: 'p1', min_qty: 48, max_qty: 71, unit_price: 9.25 },
    { id: 't4', product_id: 'p1', min_qty: 72, max_qty: 143, unit_price: 8.4 },
    { id: 't5', product_id: 'p1', min_qty: 144, max_qty: null, unit_price: 7.6 },
  ],
}
const cards = [product,
  { ...product, id: 'p2', slug: 'bella-3001-jersey-tee', name: 'Bella+Canvas 3001 Jersey Tee', brand: 'Bella+Canvas', style_number: '3001', base_price: 14.25, badges: ['Soft hand'], min_quantity: 12 },
  { ...product, id: 'p3', slug: 'gildan-18500-heavy-blend-hoodie', name: 'Gildan 18500 Heavy Blend Hoodie', brand: 'Gildan', style_number: 'G185', base_price: 29.5, badges: ['Festival'], categories: { key: 'hoodies', name: 'Hoodies & Fleece' } },
  { ...product, id: 'p4', slug: 'richardson-112-trucker', name: 'Richardson 112 Trucker', brand: 'Richardson', style_number: '112', base_price: 18, badges: [], min_quantity: 24, categories: { key: 'hats', name: 'Hats' } },
].map(({ product_variants, pricing_tiers, ...c }) => c)
const settings = [
  { key: 'store', value: { name: 'Fishbone Graphics & Screen Printing', phone: '(970) 626-4437', email: 'hello@fishbonegraphics.com', address1: '250 S Lena St', city: 'Ridgway', state: 'CO', zip: '81432', hours: [{ days: 'Mon – Fri', open: '9:00 AM', close: '5:00 PM' }, { days: 'Sat', open: 'By appointment', close: '' }, { days: 'Sun', open: 'Closed', close: '' }], instagram: 'https://instagram.com/fishbonegraphics', facebook: 'https://facebook.com/fishbonegraphics' } },
  { key: 'tax', value: { rate: 0.0865 } }, { key: 'shipping', value: { flat_rate: 18, enabled: true } }, { key: 'payments', value: { provider: 'invoice' } },
  { key: 'ordering', value: { turnaround_days: 10 } }, { key: 'announcement', value: { enabled: true, text: 'Festival season: get summer orders in by May 15 for guaranteed June delivery.' } },
]
const decoration = [
  { id: 'd1', key: 'screen_print', name: 'Screen print', description: 'Hand-pulled or auto. Best for 1–6 colors at quantity.', setup_fee: 25, per_location_fee: 15, sort_order: 1, is_active: true },
  { id: 'd2', key: 'dtf', name: 'DTF transfer', description: 'Full color, no screens. Great for small runs.', setup_fee: 0, per_location_fee: 0, sort_order: 2, is_active: true },
  { id: 'd3', key: 'embroidery', name: 'Embroidery', description: 'Digitized in-house.', setup_fee: 35, per_location_fee: 20, sort_order: 3, is_active: true },
  { id: 'd4', key: 'vinyl', name: 'Vinyl', description: 'Names and numbers.', setup_fee: 0, per_location_fee: 0, sort_order: 4, is_active: true },
]

async function mock(page) {
  await page.route('**/rest/v1/**', (route) => {
    const u = new URL(route.request().url())
    const p = u.pathname, q = u.search
    const json = (body) => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(body) })
    if (p.endsWith('/categories')) return json(q.includes('key=eq.') ? category : categories)
    if (p.endsWith('/products')) return json(q.includes('slug=eq.') ? product : cards)
    if (p.endsWith('/settings')) return json(settings)
    if (p.endsWith('/decoration_options')) return json(decoration)
    if (p.endsWith('/quote_requests')) return json([])
    return json([])
  })
  await page.route('**/storage/v1/**', (route) => route.fulfill({ status: 200, contentType: 'application/json', body: '[]' }))
}

const cartLine = {
  lineId: 'l1', productId: 'p1', slug: product.slug, name: product.name, brand: 'Gildan', styleNumber: 'G500', variantId: 'v1', variantLabel: 'Black', sku: 'G500-BLK', colorHex: '#111111',
  quantity: 48, sizeBreakdown: { S: 6, M: 12, L: 14, XL: 10, '2XL': 6 }, decorationMethod: 'screen_print', printLocations: ['front', 'back'],
  artworkFiles: [{ path: 'uploads/x/fest-front.ai', name: 'fest-front.ai', size: 812345, type: 'application/postscript' }], notes: 'PMS 165 orange + white. Discharge if the black allows.',
  minQuantity: 12, image: null, snapshot: { tiers: product.pricing_tiers, basePrice: 12.5, priceAdjustment: 0, sizes: product.specs.sizes }, priceUnit: 'ea', unitPriceSnapshot: 9.25,
}

const browser = await chromium.launch()
const errors = []
for (const width of [1280, 390]) {
  const ctx = await browser.newContext({ viewport: { width, height: width === 390 ? 844 : 900 }, deviceScaleFactor: 1 })
  const page = await ctx.newPage()
  page.on('console', (m) => { if (m.type() === 'error') errors.push(`[${width}] ${m.text().slice(0, 200)}`) })
  page.on('pageerror', (e) => errors.push(`[${width}] PAGEERROR ${e.message}`))
  await mock(page)
  await page.addInitScript((line) => {
    localStorage.setItem('fishbone-cart', JSON.stringify({ state: { lines: [line] }, version: 1 }))
  }, cartLine)
  const shots = [['/', 'home'], ['/shop', 'shop'], ['/product/gildan-5000-heavy-cotton-tee', 'pdp'], ['/cart', 'cart'], ['/checkout', 'checkout']]
  for (const [path, name] of shots) {
    await page.goto(base + path, { waitUntil: 'networkidle' })
    await page.waitForTimeout(700)
    // scroll through to trigger whileInView reveals, then back to top
    await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)) } window.scrollTo(0, 0) })
    await page.waitForTimeout(400)
    await page.screenshot({ path: `${out}${name}-${width}.png`, fullPage: true })
    console.log('shot', name, width)
  }
  await ctx.close()
}
await browser.close()
console.log(errors.length ? `CONSOLE ERRORS:\n${errors.join('\n')}` : 'No console errors.')
