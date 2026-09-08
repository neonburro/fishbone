// src/components/common/Kicker.jsx
//
// The small mono uppercase label. It replaces badges, eyebrows and pills
// everywhere on the site. Optional red dot in front, optional index number
// ('01') for lists that count. `mark` is accepted for the older call sites
// and draws the dot.

import { Box, HStack, Text } from '@chakra-ui/react'

export default function Kicker({ children, color = 'bone.500', mark = false, dot = mark, index, as = 'p', ...rest }) {
  return (
    <HStack as={as} spacing={2.5} align="center" m={0} {...rest}>
      {dot && <Box as="span" w="7px" h="7px" borderRadius="full" bg="red.500" flexShrink={0} />}
      {index != null && (
        <Text as="span" variant="kicker" color="bone.600">
          {String(index).padStart(2, '0')}
        </Text>
      )}
      <Text as="span" variant="kicker" color={color}>
        {children}
      </Text>
    </HStack>
  )
}
