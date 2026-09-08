// src/data/work.js
//
// The wall, before Pulse has anything on it. These are the shop's own prints,
// pulled off fishbonegraphics.com and their Facebook on 2026-09-07 and saved
// to public/work as webp. The home page and /work/ read showcase_items first
// and fall back to this list when the table is empty, so the site never
// opens on placeholder tiles. When Pulse's showcase manager lands and the
// shop uploads its own photos, this file stops being read and can go.
//
// `wide` marks the one landscape photo that takes two columns.
// No oxford commas, no em dashes.

export const WORK = [
  { slug: 'telluride-bluegrass-tent', title: 'Merch tent', client: 'Telluride Bluegrass', year: 2018, wide: true },
  { slug: 'telluride-bluegrass-45', title: '45th festival tee', client: 'Telluride Bluegrass', year: 2018 },
  { slug: 'ouray-brewery', title: 'Taproom tee', client: 'Ouray Brewery' },
  { slug: 'telluride-horror-show', title: 'Poster tee', client: 'Telluride Horror Show' },
  { slug: 'big-blues-bender', title: 'Festival tee', client: 'Big Blues Bender' },
  { slug: 'folks-festival-lyons', title: 'Festival tee', client: 'Folks Festival, Lyons' },
  { slug: 'string-cheese-nye', title: 'New Years run', client: 'String Cheese Incident' },
  { slug: 'del-mccoury', title: 'Tour tee', client: 'Del McCoury Band' },
  { slug: 'tamba-boar', title: 'Boar', client: 'Tamba' },
  { slug: 'tamba-tribal', title: 'Tribal circle', client: 'Tamba' },
  { slug: 'aloha-olympic-cafe', title: 'Staff tee', client: 'Aloha Olympic Cafe' },
  { slug: 'andy-thorn', title: 'Artist tee', client: 'Andy Thorn' },
  { slug: 'weathered', title: 'Weathered print', client: 'Shop' },
  { slug: 'festival-merch-tent', title: 'Merch tent', client: 'Festival circuit' },
  { slug: 'gallery-09', title: 'Poster tee', client: 'Shop' },
  { slug: 'gallery-15', title: 'Poster tee', client: 'Shop' },
  { slug: 'tee-02', title: 'Tee', client: 'Shop' },
  { slug: 'tee-05', title: 'Tee', client: 'Shop' },
  { slug: 'tee-06', title: 'Tee', client: 'Shop' },
  { slug: 'tee-03', title: 'Tee', client: 'Shop' },
  { slug: 'tee-10', title: 'Tee', client: 'Shop' },
  { slug: 'tee-11', title: 'Tee', client: 'Shop' },
  { slug: 'tee-12', title: 'Tee', client: 'Shop' },
  { slug: 'tee-01', title: 'Tee', client: 'Shop' },
  { slug: 'tee-04', title: 'Tee', client: 'Shop' },
  { slug: 'tee-08', title: 'Tee', client: 'Shop' },
  { slug: 'tee-09', title: 'Tee', client: 'Shop' },
  { slug: 'gallery-06', title: 'Shop', client: 'Shop' },
  { slug: 'gallery-11', title: 'Shop', client: 'Shop' },
  { slug: 'gallery-13', title: 'Shop', client: 'Shop' },
].map((w) => ({ ...w, src: `/work/${w.slug}.webp`, alt: `${w.title}, ${w.client}` }))

/** The same shape showcase_items rows resolve to, so one wall reads both. */
export function workAsShowcase(list = WORK) {
  return list.map((w, i) => ({
    id: `local-${w.slug}`,
    placement: 'home',
    title: w.title,
    subtitle: null,
    client_name: w.client,
    year: w.year || null,
    src: w.src,
    alt: w.alt,
    tags: [],
    ratio: w.wide ? 4 / 3 : 3 / 4,
    wide: !!w.wide,
    sort_order: i,
    is_active: true,
  }))
}
