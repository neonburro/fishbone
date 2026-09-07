// src/lib/jsonld.js
//
// Structured data built from settings.store, so the footer's LocalBusiness
// block, the map section and the sign on the door all say the same thing.
// The geo point and the opening hours come straight from what the shop keeps
// in Pulse. Nothing here is hardcoded except the schema vocabulary.

import { openingHoursSpecification } from './hours'

export const SITE_URL = import.meta.env.VITE_SITE_URL || 'https://fishbonegraphics.com'

export function directionsUrl(store = {}) {
  if (store.lat && store.lng) return `https://www.google.com/maps/dir/?api=1&destination=${store.lat},${store.lng}`
  return store.map_url || null
}

export function appleMapsUrl(store = {}) {
  if (store.lat && store.lng) {
    const q = encodeURIComponent(store.name || 'Fishbone Graphics')
    return `https://maps.apple.com/?ll=${store.lat},${store.lng}&q=${q}`
  }
  return null
}

export function localBusiness(store = {}, { services = [] } = {}) {
  const hours = openingHoursSpecification(store.hours)
  const out = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${SITE_URL}/#shop`,
    name: store.name || 'Fishbone Graphics',
    legalName: store.legal_name || undefined,
    description: store.tagline || undefined,
    image: `${SITE_URL}/og.png`,
    logo: `${SITE_URL}/favicon.svg`,
    url: `${SITE_URL}/`,
    telephone: store.phone || undefined,
    email: store.email || undefined,
    foundingDate: store.founded ? String(store.founded) : '1985',
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      streetAddress: [store.address1, store.address2].filter(Boolean).join(', ') || undefined,
      addressLocality: store.city || 'Ridgway',
      addressRegion: store.state || 'CO',
      postalCode: store.zip || '81432',
      addressCountry: 'US',
    },
    geo: store.lat && store.lng ? { '@type': 'GeoCoordinates', latitude: store.lat, longitude: store.lng, elevation: store.elevation_ft ? `${store.elevation_ft} ft` : undefined } : undefined,
    hasMap: directionsUrl(store) || undefined,
    openingHoursSpecification: hours.length ? hours : undefined,
    sameAs: [store.instagram, store.facebook].filter(Boolean),
    areaServed: ['Ridgway', 'Ouray', 'Telluride', 'Montrose', 'Western Colorado'],
    makesOffer: services.length ? services.map((s) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: s } })) : undefined,
  }
  return prune(out)
}

export function blogPosting(post = {}, { path = '/' } = {}) {
  return prune({
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt || undefined,
    image: post.cover || `${SITE_URL}/og.png`,
    datePublished: post.published_at || undefined,
    author: { '@type': 'Organization', name: post.author_name || 'Fishbone Graphics' },
    publisher: { '@type': 'Organization', name: 'Fishbone Graphics', logo: { '@type': 'ImageObject', url: `${SITE_URL}/favicon.svg` } },
    mainEntityOfPage: `${SITE_URL}${path}`,
    keywords: post.tags?.length ? post.tags.join(', ') : undefined,
  })
}

/** Drop undefined and empty values so the emitted JSON is tidy. */
export function prune(obj) {
  if (Array.isArray(obj)) return obj.map(prune).filter((v) => v !== undefined)
  if (obj && typeof obj === 'object') {
    const out = {}
    for (const [k, v] of Object.entries(obj)) {
      const p = prune(v)
      if (p === undefined || p === null || p === '' || (Array.isArray(p) && p.length === 0)) continue
      out[k] = p
    }
    return out
  }
  return obj
}
