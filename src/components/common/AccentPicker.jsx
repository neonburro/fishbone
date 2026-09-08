// src/components/common/AccentPicker.jsx
//
// The ink shelf in the footer. Four rounded squares, one per accent, next
// to the Ink and Bone switch. The one that is on gets a ring in its own
// color. Names show on hover and to screen readers, nothing is labelled on
// screen because the colors are the label.

import { Box, HStack, Tooltip } from '@chakra-ui/react'
import { useAccent } from '../../hooks/useAccent'
import { scaleFrom } from '../../theme/accents'
import { EASE } from '../../theme/layout'

export default function AccentPicker(props) {
  const { accent, setAccent, accents, switcher } = useAccent()
  if (!switcher) return null
  return (
    <HStack spacing={2} role="radiogroup" aria-label="Accent color" {...props}>
      {accents.map((a) => {
        const on = a.key === accent
        const s = scaleFrom(a.base)
        return (
          <Tooltip key={a.key} label={a.name} placement="top" hasArrow openDelay={150}>
            <Box
              as="button"
              type="button"
              role="radio"
              aria-checked={on}
              aria-label={a.name}
              onClick={() => setAccent(a.key)}
              w="22px"
              h="22px"
              borderRadius="7px"
              bg={a.base}
              border="2px solid"
              borderColor={on ? 'bone.100' : 'transparent'}
              boxShadow={on ? `0 0 0 2px ${s[500]}` : `inset 0 0 0 1px rgba(0,0,0,0.18)`}
              transform={on ? 'scale(1.08)' : 'scale(1)'}
              transition={`transform 260ms ${EASE}, border-color 200ms ${EASE}, box-shadow 200ms ${EASE}`}
              _hover={{ transform: 'scale(1.12)' }}
              _focusVisible={{ outline: 'none', boxShadow: `0 0 0 2px ${s[500]}, 0 0 0 4px rgba(239,234,224,0.35)` }}
            />
          </Tooltip>
        )
      })}
    </HStack>
  )
}
