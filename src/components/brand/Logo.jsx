// src/components/brand/Logo.jsx
//
// Fishbone Graphics logo. Placeholder lockup until the client's art arrives.
// Swap this one file to replace the logo site-wide. Keep the props (variant,
// color, accent, height) and every nav, footer and overlay updates.
//
// The wordmark is SVG text in the display face so its first glyph sits at
// x=0 of its box. The nav pulls the lockup back by its own padding so that
// glyph lands on the rail, the same x as every heading on the site.

import { Box } from '@chakra-ui/react'
import { palette } from '../../theme'

export default function Logo({ variant = 'full', color = palette.bone, accent = palette.ember, height = '36px', ...rest }) {
  if (variant === 'mark') {
    return (
      <Box as="span" display="inline-flex" h={height} {...rest}>
        <FishMark color={color} accent={accent} />
      </Box>
    )
  }
  return (
    <Box as="span" display="inline-flex" alignItems="center" gap="10px" h={height} {...rest}>
      <FishMark color={color} accent={accent} />
      <svg viewBox="0 0 250 64" height="100%" role="img" aria-label="Fishbone Graphics" style={{ display: 'block' }}>
        <text
          x="0"
          y="42"
          fill={color}
          fontFamily="'Big Shoulders Display', 'Arial Narrow', Impact, sans-serif"
          fontWeight="900"
          fontSize="50"
          letterSpacing="-1"
        >
          FISHBONE
        </text>
        <text
          x="1"
          y="59"
          fill={color}
          fontFamily="'JetBrains Mono', Menlo, monospace"
          fontWeight="500"
          fontSize="10.5"
          letterSpacing="5.6"
          opacity="0.75"
        >
          GRAPHICS
        </text>
      </svg>
    </Box>
  )
}

export function FishMark({ color = palette.bone, accent = palette.ember }) {
  return (
    <svg viewBox="0 0 96 64" height="100%" aria-hidden="true" focusable="false" style={{ display: 'block' }}>
      <g fill="none" stroke={color} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
        {/* skull */}
        <path d="M6 32c0-10 8-18 18-18 5 0 9 2 11 4l-4 14 4 14c-2 2-6 4-11 4-10 0-18-8-18-18z" />
        {/* jaw notch */}
        <path d="M14 40l6-3" />
        {/* spine */}
        <path d="M35 32h40" />
        {/* ribs */}
        <path d="M42 32l-3-11M42 32l-3 11M50 32l-3-13M50 32l-3 13M58 32l-3-11M58 32l-3 11M66 32l-2.5-8M66 32l-2.5 8" />
        {/* tail */}
        <path d="M75 32l14-13M75 32l14 13M89 19v26" />
      </g>
      <circle cx="17" cy="27" r="3.4" fill={accent} />
    </svg>
  )
}
