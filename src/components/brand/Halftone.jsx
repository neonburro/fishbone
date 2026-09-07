// src/components/brand/Halftone.jsx
import { alpha, palette } from '../../theme'
import { Box } from '@chakra-ui/react'

/**
 * Halftone dot texture. Absolutely positioned overlay by default.
 * `fade` controls which edge the dots dissolve toward: 'top' | 'bottom' | 'left' | 'right' | 'none'
 */
export default function Halftone({
  color = alpha(palette.bone, 0.10),
  size = 14,
  dot = 1.6,
  fade = 'bottom',
  opacity = 1,
  ...rest
}) {
  const masks = {
    top: 'linear-gradient(to bottom, rgba(0,0,0,1), rgba(0,0,0,0))',
    bottom: 'linear-gradient(to top, rgba(0,0,0,1), rgba(0,0,0,0))',
    left: 'linear-gradient(to right, rgba(0,0,0,1), rgba(0,0,0,0))',
    right: 'linear-gradient(to left, rgba(0,0,0,1), rgba(0,0,0,0))',
    radial: 'radial-gradient(circle at center, rgba(0,0,0,1), rgba(0,0,0,0) 70%)',
    none: 'none',
  }
  const mask = masks[fade] || masks.none
  return (
    <Box
      aria-hidden="true"
      position="absolute"
      inset={0}
      pointerEvents="none"
      opacity={opacity}
      backgroundImage={`radial-gradient(circle, ${color} ${dot}px, transparent ${dot + 0.6}px)`}
      backgroundSize={`${size}px ${size}px`}
      sx={mask !== 'none' ? { WebkitMaskImage: mask, maskImage: mask } : undefined}
      {...rest}
    />
  )
}
