// src/components/common/Section.jsx
import { Box, Container, Heading, Text, Stack } from '@chakra-ui/react'
import PulledRule from './PulledRule'

export function Section({ children, bg, py = { base: 14, md: 24 }, containerSize = 'page', position = 'relative', ...rest }) {
  return (
    <Box as="section" bg={bg} py={py} position={position} overflow="hidden" {...rest}>
      <Container size={containerSize} position="relative">
        {children}
      </Container>
    </Box>
  )
}

export function SectionHeader({ eyebrow, title, lead, align = 'left', mb = { base: 8, md: 12 }, as = 'h2', size = '2xl', children }) {
  const center = align === 'center'
  return (
    <Stack spacing={4} mb={mb} align={center ? 'center' : 'flex-start'} textAlign={center ? 'center' : 'left'} maxW={center ? '760px' : '820px'} mx={center ? 'auto' : undefined}>
      {eyebrow && <Text variant="eyebrow">{eyebrow}</Text>}
      {title && (
        <Heading as={as} size={size}>
          {title}
        </Heading>
      )}
      <PulledRule align={center ? 'center' : 'left'} />
      {lead && (
        <Text color="bone.300" fontSize={{ base: 'md', md: 'lg' }} maxW="640px">
          {lead}
        </Text>
      )}
      {children}
    </Stack>
  )
}
