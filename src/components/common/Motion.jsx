// src/components/common/Motion.jsx
//
// Entrance motion. Fade plus a short slide, on mount rather than on
// intersection so content is never left invisible if an observer does not
// fire. One easing, the house one. Respects reduced motion.

import { motion, useReducedMotion } from 'framer-motion'
import { Box } from '@chakra-ui/react'
import { EASE_ARR, DUR } from '../../theme/layout'

const MotionBox = motion(Box)

export function Reveal({ children, delay = 0, y = 14, ...rest }) {
  const reduce = useReducedMotion()
  return (
    <MotionBox
      initial={reduce ? false : { opacity: 0, y }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: DUR.base, ease: EASE_ARR, delay: Math.min(delay, 0.4) }}
      {...rest}
    >
      {children}
    </MotionBox>
  )
}

export function FadeIn({ children, delay = 0, ...rest }) {
  const reduce = useReducedMotion()
  return (
    <MotionBox
      initial={reduce ? false : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: DUR.base, ease: EASE_ARR, delay }}
      {...rest}
    >
      {children}
    </MotionBox>
  )
}

export { MotionBox }
