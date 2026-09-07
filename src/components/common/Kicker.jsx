// src/components/common/Kicker.jsx
//
// The small mono uppercase label. It replaces badges, eyebrows and pills
// everywhere on the site. Optional registration mark in front, optional
// index number ('01') for lists that count.

import { HStack, Text } from '@chakra-ui/react'
import RegMark from '../brand/RegMark'

export default function Kicker({ children, color = 'ember.500', mark = false, index, as = 'p', ...rest }) {
  return (
    <HStack as={as} spacing={2.5} align="center" m={0} {...rest}>
      {mark && <RegMark size="12px" color="currentColor" sx={{ color }} />}
      {index != null && (
        <Text as="span" variant="kicker" color="bone.500">
          {String(index).padStart(2, '0')}
        </Text>
      )}
      <Text as="span" variant="kicker" color={color}>
        {children}
      </Text>
    </HStack>
  )
}
