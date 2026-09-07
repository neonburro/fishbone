import { motion, useReducedMotion } from 'framer-motion'
import { Box } from '@chakra-ui/react'

const MotionBox = motion(Box)

/** Subtle entrance: fade + 12px slide, 0.35s. Respects reduced motion. */
export function Reveal({ children, delay = 0, y = 12, once = true, ...rest }) {
  const reduce = useReducedMotion()
  return (
    <MotionBox
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: '-40px' }}
      transition={{ duration: 0.35, ease: [0.22, 0.61, 0.36, 1], delay }}
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
