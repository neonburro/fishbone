// src/components/layout/PageHero.jsx
//
// The top of every inner page. Kicker, one big uppercase heading, pulled
// rule, optional lede. Left aligned to the rail like everything else.

import { Box, Container, Heading, Text, Stack } from '@chakra-ui/react'
import Halftone from '../brand/Halftone'
import PulledRule from '../common/PulledRule'
import Kicker from '../common/Kicker'
import { FadeIn } from '../common/Motion'
import { palette, alpha } from '../../theme'
import { LEDE, MEASURE } from '../../theme/layout'

export default function PageHero({ eyebrow, kicker, title, lead, children, size = 'sm' }) {
  const big = size === 'lg'
  const label = kicker || eyebrow
  return (
    <Box as="section" position="relative" bg="ink.500" borderBottom="1px solid" borderColor="ink.300" overflow="hidden">
      <Halftone fade="left" color={alpha(palette.bone, 0.07)} size={14} dot={1.6} right="0" left="45%" />
      <Container size="page" py={big ? { base: 14, md: 24 } : { base: 10, md: 16 }} position="relative">
        <FadeIn>
          <Stack spacing={4} maxW={LEDE}>
            {label && <Kicker mark>{label}</Kicker>}
            <Heading as="h1" size={big ? '3xl' : '2xl'}>{title}</Heading>
            <PulledRule />
            {lead && <Text color="bone.300" fontSize={{ base: 'md', md: 'lg' }} maxW={MEASURE}>{lead}</Text>}
            {children}
          </Stack>
        </FadeIn>
      </Container>
    </Box>
  )
}
