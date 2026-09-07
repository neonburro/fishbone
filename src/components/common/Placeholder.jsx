import { Box, Text } from '@chakra-ui/react'
import Halftone from '../brand/Halftone'
import RegMark from '../brand/RegMark'

/**
 * Branded placeholder tile for products/gallery without images.
 * Never renders a broken <img>.
 */
export default function Placeholder({ label = 'FB', caption, ratio = 1, tone = 'ink.400', ...rest }) {
  const initial = String(label || 'FB').trim().charAt(0).toUpperCase() || 'F'
  return (
    <Box position="relative" w="100%" pt={`${100 / ratio}%`} bg={tone} overflow="hidden" borderRadius="base" {...rest}>
      <Halftone fade="radial" color="rgba(242,237,228,0.09)" size={12} dot={1.5} />
      <Box position="absolute" inset={0} display="flex" alignItems="center" justifyContent="center" flexDir="column">
        <Text
          fontFamily="heading"
          fontWeight={800}
          fontSize={{ base: '5rem', md: '7rem' }}
          lineHeight={1}
          color="bone.100"
          opacity={0.12}
          userSelect="none"
          aria-hidden="true"
        >
          {initial}
        </Text>
        {caption && (
          <Text position="absolute" bottom={3} left={3} variant="mono" fontSize="xs" color="bone.500" textTransform="uppercase" letterSpacing="0.1em">
            {caption}
          </Text>
        )}
      </Box>
      <RegMark position="absolute" top={2} left={2} size="14px" color="rgba(242,237,228,0.35)" />
      <RegMark position="absolute" bottom={2} right={2} size="14px" color="rgba(242,237,228,0.35)" />
    </Box>
  )
}
