// src/components/common/Section.jsx
//
// A band of the page. Section is the full-bleed wrapper with the sheet inside
// it. SectionHeader is kicker, heading, pulled rule and an optional lede, all
// left aligned to the rail so the first character sits on the plumb line.

import { Box, Container, Heading, Text, Stack } from '@chakra-ui/react'
import PulledRule from './PulledRule'
import Kicker from './Kicker'
import { BAND_Y, LEDE, MEASURE } from '../../theme/layout'

export function Section({ children, bg, py = BAND_Y, containerSize = 'page', position = 'relative', ...rest }) {
  return (
    <Box as="section" bg={bg} py={py} position={position} overflow="hidden" {...rest}>
      <Container size={containerSize} position="relative">
        {children}
      </Container>
    </Box>
  )
}

export function SectionHeader({ eyebrow, kicker, title, lead, mb = { base: 8, md: 12 }, as = 'h2', size = '2xl', rule = true, children }) {
  const label = kicker || eyebrow
  return (
    <Stack spacing={4} mb={mb} align="flex-start" maxW={LEDE}>
      {label && <Kicker mark>{label}</Kicker>}
      {title && (
        <Heading as={as} size={size}>
          {title}
        </Heading>
      )}
      {rule && <PulledRule />}
      {lead && (
        <Text color="bone.300" fontSize={{ base: 'md', md: 'lg' }} maxW={MEASURE}>
          {lead}
        </Text>
      )}
      {children}
    </Stack>
  )
}
