// src/components/brand/Logo.jsx
//
// The nav mark. A clean line fishbone with one red dot for the eye, next to
// FISHBONE in the display face and GRAPHICS in small mono. This is the
// everyday lockup for the bar and the menu. The shop's real logo, the oval
// with the hand cut skeleton, is a photograph of a thing and it lives in the
// footer only (public/brand-oval.png). Keep the props (variant, color,
// accent, height) and every nav, footer and overlay updates.

import { Box } from '@chakra-ui/react'

// Colors are tokens, not hex, so the lockup flips with ink and paper. Pass a
// raw color only when drawing onto something that does not flip.
export default function Logo({ variant = 'full', color = 'currentColor', accent = '#EC1D3B', height = '36px', ...rest }) {
  if (variant === 'mark') {
    return (
      <Box as="span" display="inline-flex" h={height} color="bone.100" {...rest}>
        <FishMark color={color} accent={accent} />
      </Box>
    )
  }
  return (
    <Box as="span" display="inline-flex" alignItems="center" gap="10px" h={height} color="bone.100" {...rest}>
      <FishMark color={color} accent={accent} />
      <svg viewBox="0 0 166 64" height="100%" role="img" aria-label="Fishbone Graphics" style={{ display: 'block' }}>
        <text x="0" y="38" fill={color} fontFamily="'Barlow Condensed', 'Arial Narrow', sans-serif" fontWeight="700" fontSize="46" letterSpacing="0.5">
          FISHBONE
        </text>
        {/* GRAPHICS spans exactly the width of FISHBONE. textLength pins the
            run and lengthAdjust spreads the tracking evenly, so the two words
            share left and right edges at every size. */}
        <text x="0" y="60" fill={color} fontFamily="'Barlow Condensed', 'Arial Narrow', sans-serif" fontWeight="600" fontSize="24" textLength="163" lengthAdjust="spacing" opacity="0.85">
          GRAPHICS
        </text>
      </svg>
    </Box>
  )
}

export function FishMark({ color = 'currentColor', accent = '#EC1D3B' }) {
  return (
    <svg viewBox="0 0 96 64" height="100%" aria-hidden="true" focusable="false" style={{ display: 'block' }}>
      <g fill="none" stroke={color} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 32c0-10 8-18 18-18 5 0 9 2 11 4l-4 14 4 14c-2 2-6 4-11 4-10 0-18-8-18-18z" />
        <path d="M35 32h40" />
        <path d="M42 32l-3-11M42 32l-3 11M50 32l-3-13M50 32l-3 13M58 32l-3-11M58 32l-3 11M66 32l-2.5-8M66 32l-2.5 8" />
        <path d="M75 32l14-13M75 32l14 13M89 19v26" />
      </g>
      <circle cx="17" cy="27" r="3.4" fill={accent} />
    </svg>
  )
}
