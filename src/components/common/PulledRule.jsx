// src/components/common/PulledRule.jsx
import { Box } from '@chakra-ui/react'

/** 2px ember rule with a rough, squeegee-pulled end. */
export default function PulledRule({ color = 'ember.500', w = '96px', align = 'left', ...rest }) {
  return (
    <Box
      aria-hidden="true"
      position="relative"
      h="2px"
      w={w}
      bg={color}
      mx={align === 'center' ? 'auto' : undefined}
      ml={align === 'right' ? 'auto' : undefined}
      _after={{
        content: '""',
        position: 'absolute',
        right: '-10px',
        top: '-1px',
        w: '10px',
        h: '4px',
        bg: 'inherit',
        clipPath: 'polygon(0 25%, 55% 0, 100% 55%, 70% 100%, 30% 70%, 0 75%)',
        opacity: 0.85,
      }}
      {...rest}
    />
  )
}
