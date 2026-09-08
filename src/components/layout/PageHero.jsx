// src/components/layout/PageHero.jsx
//
// The top of every inner page. Kicker, one heading, optional lede. Left
// aligned to the rail like everything else. No decoration.

import { Box, Container, Heading, Text, Stack } from '@chakra-ui/react'
import Kicker from '../common/Kicker'
import { FadeIn } from '../common/Motion'
import { LEDE, MEASURE } from '../../theme/layout'

export default function PageHero({ eyebrow, kicker, title, lead, children, size = 'sm' }) {
  const big = size === 'lg'
  const label = kicker || eyebrow
  return (
    <Box as="section" position="relative" borderBottom="1px solid" borderColor="ink.300">
      <Container size="page" pt={big ? { base: 10, md: 16 } : { base: 8, md: 12 }} pb={big ? { base: 10, md: 14 } : { base: 8, md: 10 }} position="relative">
        <FadeIn>
          <Stack spacing={4} maxW={LEDE}>
            {label && <Kicker>{label}</Kicker>}
            <Heading as="h1" size={big ? '3xl' : '2xl'}>{title}</Heading>
            {lead && <Text color="bone.300" fontSize={{ base: 'md', md: 'lg' }} maxW={MEASURE}>{lead}</Text>}
            {children}
          </Stack>
        </FadeIn>
      </Container>
    </Box>
  )
}
