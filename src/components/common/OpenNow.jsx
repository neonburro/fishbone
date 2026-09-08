// src/components/common/OpenNow.jsx
//
// The live line. A dot and 'Open now. Closes 5:00 PM' or 'Closed. Opens Mon
// 9:00 AM', computed in America/Denver from settings.store.hours. Used in the
// menu overlay, the footer and the map panel so all three agree.

import { Box, HStack, Text } from '@chakra-ui/react'
import useOpenStatus from '../../hooks/useOpenStatus'

export default function OpenNow({ size = 'sm', ...rest }) {
  const status = useOpenStatus()
  // Open is the red dot, the one live thing on the page. Closed is quiet.
  const color = status.isOpen ? 'red.500' : 'bone.500'
  const glow = 'rgba(236,29,59,0.35)'
  return (
    <HStack spacing={3} align="center" {...rest} role="status" aria-live="polite">
      <Box position="relative" w="10px" h="10px" flexShrink={0}>
        <Box position="absolute" inset={0} borderRadius="full" bg={color} />
        {status.isOpen && <Box position="absolute" inset="-4px" borderRadius="full" border="1px solid" borderColor={color} opacity={0.6} boxShadow={`0 0 12px ${glow}`} />}
      </Box>
      <Text fontFamily="mono" fontSize={size === 'md' ? '13px' : '11px'} letterSpacing="0.12em" textTransform="uppercase" color="bone.100">
        <Text as="span" color={color}>{status.short}.</Text>{' '}
        <Text as="span" color="bone.300">{status.label.replace(/^[^.]+\.\s*/, '')}</Text>
      </Text>
    </HStack>
  )
}
