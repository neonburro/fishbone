// src/components/common/AccentPicker.jsx
//
// The ink shelf in the footer. One chip per accent, next to the Scale and
// Bone switch, and the name of the one that is on spelled out beside them.
//
// The chips are square because they are ink chips, the little painted
// rectangles on a card you hold up to a shirt, not app buttons. The one that
// is on gets a ring in its own color.
//
// ── THE NAME IS ON SCREEN, NOT ON HOVER ─────────────────────────────────────
// It used to be a tooltip only. A phone has no hover, so on a phone the shelf
// was four unlabelled squares and the visitor picking a color could not tell
// you which one they picked. The active name now reads in mono next to the
// row. The tooltips stay for a mouse.
//
// ── THE TARGET IS BIGGER THAN THE CHIP ──────────────────────────────────────
// The chip stays 22px because a bigger one would shout. The button around it
// is 44px on a phone, which is the smallest thing a thumb reliably hits, so
// the shelf is comfortable without looking heavy.
//
// No oxford commas, no em dashes.

import { Box, HStack, Text, Tooltip } from '@chakra-ui/react'
import { useAccent } from '../../hooks/useAccent'
import { scaleFrom } from '../../theme/accents'
import { EASE } from '../../theme/layout'

export default function AccentPicker(props) {
  const { accent, setAccent, accents, switcher } = useAccent()
  if (!switcher) return null
  const current = accents.find((a) => a.key === accent)
  return (
    <HStack spacing={3} align="center" {...props}>
      <HStack spacing={{ base: 0, md: 1 }} role="radiogroup" aria-label="Accent color">
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
                // The target, not the chip. Invisible, and big enough for a thumb.
                display="inline-flex"
                alignItems="center"
                justifyContent="center"
                w={{ base: '44px', md: '30px' }}
                h={{ base: '44px', md: '30px' }}
                bg="transparent"
                _focusVisible={{ outline: 'none', boxShadow: `0 0 0 2px ${s[500]}, 0 0 0 4px rgba(239,234,224,0.35)` }}
              >
                {/* The chip. */}
                <Box
                  as="span"
                  display="block"
                  w="22px"
                  h="22px"
                  borderRadius="2px"
                  bg={a.base}
                  border="2px solid"
                  borderColor={on ? 'bone.100' : 'transparent'}
                  boxShadow={on ? `0 0 0 2px ${s[500]}` : 'inset 0 0 0 1px rgba(0,0,0,0.18)'}
                  transform={on ? 'scale(1.08)' : 'scale(1)'}
                  transition={`transform 260ms ${EASE}, border-color 200ms ${EASE}, box-shadow 200ms ${EASE}`}
                />
              </Box>
            </Tooltip>
          )
        })}
      </HStack>
      {current && (
        <Text
          fontFamily="mono"
          fontSize="11px"
          letterSpacing="0.12em"
          textTransform="uppercase"
          color="bone.300"
          whiteSpace="nowrap"
          aria-live="polite"
        >
          {current.name}
        </Text>
      )}
    </HStack>
  )
}
