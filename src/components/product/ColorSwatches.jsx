// src/components/product/ColorSwatches.jsx
import { palette } from '../../theme'
import { Box, HStack, Text, Tooltip, Wrap, WrapItem } from '@chakra-ui/react'

function isLight(hex = '') {
  const h = hex.replace('#', '')
  if (h.length < 6) return false
  const r = parseInt(h.slice(0, 2), 16), g = parseInt(h.slice(2, 4), 16), b = parseInt(h.slice(4, 6), 16)
  return (r * 299 + g * 587 + b * 114) / 1000 > 180
}

export default function ColorSwatches({ variants = [], value, onChange, labelId = 'color-label' }) {
  const selected = variants.find((v) => v.id === value)
  return (
    <Box>
      <HStack justify="space-between" mb={2}>
        <Text id={labelId} fontFamily="heading" fontWeight={600} textTransform="uppercase" letterSpacing="0.08em" fontSize="sm" color="bone.300">Color</Text>
        <Text fontFamily="mono" fontSize="sm" color="bone.100">{selected?.color_name || 'Choose a color'}{selected?.sku ? <Text as="span" color="bone.500"> · {selected.sku}</Text> : null}</Text>
      </HStack>
      <Wrap role="radiogroup" aria-labelledby={labelId} spacing={2}>
        {variants.map((v) => {
          const active = v.id === value
          const light = isLight(v.color_hex)
          return (
            <WrapItem key={v.id}>
              <Tooltip label={`${v.color_name}${v.in_stock === false ? ', out of stock' : ''}`} hasArrow openDelay={200}>
                <Box
                  as="button"
                  type="button"
                  role="radio"
                  aria-checked={active}
                  aria-label={`${v.color_name}${v.in_stock === false ? ', out of stock' : ''}`}
                  disabled={v.in_stock === false}
                  onClick={() => onChange?.(v.id)}
                  w="36px"
                  h="36px"
                  borderRadius="base"
                  bg={v.color_hex || '#888'}
                  border="2px solid"
                  borderColor={active ? 'ember.500' : light ? 'bone.700' : 'ink.300'}
                  outline={active ? '2px solid' : 'none'}
                  outlineColor="ember.500"
                  outlineOffset="2px"
                  position="relative"
                  opacity={v.in_stock === false ? 0.35 : 1}
                  cursor={v.in_stock === false ? 'not-allowed' : 'pointer'}
                  transition="transform .12s"
                  _hover={{ transform: v.in_stock === false ? undefined : 'scale(1.06)' }}
                  _focusVisible={{ boxShadow: 'outline' }}
                >
                  {active && (
                    <Box position="absolute" inset={0} display="flex" alignItems="center" justifyContent="center" color={light ? palette.ink : palette.bone} fontSize="14px" aria-hidden="true">✓</Box>
                  )}
                  {v.in_stock === false && (
                    <Box position="absolute" left="-4px" right="-4px" top="50%" h="2px" bg="ember.500" transform="rotate(-45deg)" aria-hidden="true" />
                  )}
                </Box>
              </Tooltip>
            </WrapItem>
          )
        })}
      </Wrap>
    </Box>
  )
}
