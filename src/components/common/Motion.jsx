// src/components/common/Motion.jsx
import { motion, useReducedMotion } from 'framer-motion'
import { Box } from '@chakra-ui/react'

const MotionBox = motion(Box)

/**
 * Subtle entrance: fade + 12px slide, 0.35s, triggered on mount (not on intersection),
 * so content is never left invisible if an observer doesn't fire. Respects reduced motion.
 */
export function Reveal({ children, delay = 0, y = 12, ...rest }) {
  const reduce = useReducedMotion()
  return (
    <MotionBox
      initial={reduce ? false : { opacity: 0, y }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 0.61, 0.36, 1], delay: Math.min(delay, 0.3) }}
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
      initial={reduce ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 0.61, 0.36, 1], delay }}
      {...rest}
    >
      {children}
    </MotionBox>
  )
}

export { MotionBox }
