// src/components/common/SEO.jsx
import { Helmet } from 'react-helmet-async'

const SITE = import.meta.env.VITE_SITE_URL || 'https://fishbonegraphics.com'
const BRAND = 'Fishbone Graphics'

export default function SEO({ title, description, path = '/', image, type = 'website', structuredData = null, noIndex = false }) {
  const fullTitle = title ? `${title} | ${BRAND}` : `${BRAND} | Screen printing and design for music and festival merch`
  const url = `${SITE}${path.startsWith('/') ? path : `/${path}`}`
  const img = image ? (image.startsWith('http') ? image : `${SITE}${image}`) : `${SITE}/og.png`
  return (
    <Helmet>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      <link rel="canonical" href={url} />
      {noIndex && <meta name="robots" content="noindex,nofollow" />}
      <meta property="og:site_name" content={BRAND} />
      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:image" content={img} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      {description && <meta name="twitter:description" content={description} />}
      <meta name="twitter:image" content={img} />
      {structuredData && <script type="application/ld+json">{JSON.stringify(structuredData)}</script>}
    </Helmet>
  )
}
