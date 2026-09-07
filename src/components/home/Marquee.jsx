// src/components/home/Marquee.jsx
import { palette } from '../../theme'
import { Box, HStack, Text } from '@chakra-ui/react'
import { keyframes } from '@emotion/react'
import RegMark from '../brand/RegMark'

const scroll = keyframes`
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
`

/** Text marquee proof strip. Duplicates the list so the loop is seamless. */
export default function Marquee({ items = [], speed = 40 }) {
  const list = [...items, ...items]
  return (
    <Box
      as="section"
      aria-label="Who we print for"
      bg="ink.500"
      borderBottom="1px solid"
      borderColor="ink.300"
      py={4}
      overflow="hidden"
      position="relative"
      _before={{ content: '""', position: 'absolute', left: 0, top: 0, bottom: 0, w: '80px', bgGradient: 'linear(to-r, ink.500, transparent)', zIndex: 1 }}
      _after={{ content: '""', position: 'absolute', right: 0, top: 0, bottom: 0, w: '80px', bgGradient: 'linear(to-l, ink.500, transparent)', zIndex: 1 }}
    >
      <HStack
        spacing={0}
        w="max-content"
        animation={`${scroll} ${speed}s linear infinite`}
        sx={{ '@media (prefers-reduced-motion: reduce)': { animation: 'none' } }}
      >
        {list.map((item, i) => (
          <HStack key={i} spacing={5} px={5} aria-hidden={i >= items.length ? 'true' : undefined}>
            <Text fontFamily="heading" fontWeight={700} textTransform="uppercase" letterSpacing="0.1em" fontSize={{ base: 'md', md: 'lg' }} color="bone.300" whiteSpace="nowrap">
              {item}
            </Text>
            <RegMark size="12px" color={palette.ember} />
          </HStack>
        ))}
      </HStack>
    </Box>
  )
}
