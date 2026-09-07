// src/components/checkout/Stepper.jsx
import { Box, HStack, Text } from '@chakra-ui/react'
import { FiCheck } from 'react-icons/fi'

export default function Stepper({ steps = [], current = 0, onJump }) {
  return (
    <Box as="ol" listStyleType="none" m={0} p={0} display="grid" gridTemplateColumns={{ base: steps.map((_, i) => (i === current ? "minmax(0, 3fr)" : "minmax(0, 1fr)")).join(" "), sm: `repeat(${steps.length}, minmax(0, 1fr))` }} gap={2} aria-label="Checkout progress">
      {steps.map((s, i) => {
        const done = i < current
        const active = i === current
        const clickable = done && onJump
        return (
          <Box as="li" key={s} aria-current={active ? 'step' : undefined}>
            <Box
              as={clickable ? 'button' : 'div'}
              type={clickable ? 'button' : undefined}
              onClick={clickable ? () => onJump(i) : undefined}
              w="100%"
              textAlign="left"
              cursor={clickable ? 'pointer' : 'default'}
              _focusVisible={{ boxShadow: 'outline', outline: 'none' }}
              borderRadius="base"
            >
              <Box h="3px" bg={done || active ? 'ember.500' : 'ink.300'} mb={2} borderRadius="full" />
              <HStack spacing={2}>
                <Box w="18px" h="18px" borderRadius="full" bg={done ? 'ember.500' : active ? 'ink.900' : 'ink.400'} border="2px solid" borderColor={done || active ? 'ember.500' : 'ink.300'} display="flex" alignItems="center" justifyContent="center" color="ink.900" fontSize="11px" flexShrink={0}>
                  {done ? <FiCheck /> : <Text as="span" fontFamily="mono" color={active ? 'ember.500' : 'bone.600'} fontSize="10px">{i + 1}</Text>}
                </Box>
                <Text fontFamily="heading" fontWeight={700} textTransform="uppercase" letterSpacing="0.08em" fontSize={{ base: 'xs', md: 'sm' }} color={active ? 'bone.100' : done ? 'bone.300' : 'bone.600'} noOfLines={1} minW={0} whiteSpace="nowrap" display={{ base: active ? 'block' : 'none', sm: 'block' }}>{s}</Text>
              </HStack>
            </Box>
          </Box>
        )
      })}
    </Box>
  )
}
