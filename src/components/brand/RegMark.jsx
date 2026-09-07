// src/components/brand/RegMark.jsx
import { Box } from '@chakra-ui/react'

/** Printer's registration mark: circle + crosshair. Decorative by default. */
export default function RegMark({ size = '18px', color = 'currentColor', strokeWidth = 1.5, ...rest }) {
  return (
    <Box as="span" display="inline-block" w={size} h={size} flexShrink={0} lineHeight={0} {...rest}>
      <svg viewBox="0 0 24 24" width="100%" height="100%" aria-hidden="true" focusable="false">
        <g fill="none" stroke={color} strokeWidth={strokeWidth}>
          <circle cx="12" cy="12" r="7" />
          <circle cx="12" cy="12" r="2.2" fill={color} stroke="none" />
          <path d="M12 1v6M12 17v6M1 12h6M17 12h6" />
        </g>
      </svg>
    </Box>
  )
}
