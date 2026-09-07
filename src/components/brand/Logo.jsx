// src/components/brand/Logo.jsx
import { palette } from '../../theme'
import { Box } from '@chakra-ui/react'

/**
 * Fishbone Graphics logo. Placeholder wordmark until the client's art arrives.
 * Swap this one file to replace the logo site-wide.
 *
 * props:
 *  variant: 'full' (mark + wordmark) | 'mark' (mark only)
 *  color:   stroke/fill color for the mark + wordmark (default bone.100 hex)
 *  accent:  eye/dot color (default ember)
 *  height:  CSS height (width scales)
 */
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
      <svg viewBox="0 0 300 64" height="100%" role="img" aria-label="Fishbone Graphics" style={{ display: 'block' }}>
        <text
          x="0"
          y="40"
          fill={color}
          fontFamily="'Barlow Condensed', 'Arial Narrow', sans-serif"
          fontWeight="800"
          fontSize="46"
          letterSpacing="-0.5"
        >
          FISHBONE
        </text>
        <text
          x="1"
          y="58"
          fill={color}
          fontFamily="'Barlow Condensed', 'Arial Narrow', sans-serif"
          fontWeight="600"
          fontSize="14"
          letterSpacing="6.2"
          opacity="0.8"
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
