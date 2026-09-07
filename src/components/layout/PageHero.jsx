import { Box, Container, Heading, Text, Stack } from '@chakra-ui/react'
import Halftone from '../brand/Halftone'
import PulledRule from '../common/PulledRule'
import { FadeIn } from '../common/Motion'

export default function PageHero({ eyebrow, title, lead, children, size = 'sm' }) {
  const big = size === 'lg'
  return (
    <Box as="section" position="relative" bg="ink.500" borderBottom="1px solid" borderColor="ink.300" overflow="hidden">
      <Halftone fade="left" color="rgba(242,237,228,0.07)" size={14} dot={1.6} right="0" left="45%" />
      <Container size="page" py={big ? { base: 14, md: 24 } : { base: 10, md: 16 }} position="relative">
        <FadeIn>
          <Stack spacing={4} maxW="860px">
            {eyebrow && <Text variant="eyebrow">{eyebrow}</Text>}
            <Heading as="h1" size={big ? '3xl' : '2xl'}>{title}</Heading>
            <PulledRule />
            {lead && <Text color="bone.300" fontSize={{ base: 'md', md: 'lg' }} maxW="640px">{lead}</Text>}
            {children}
          </Stack>
        </FadeIn>
      </Container>
    </Box>
  )
}
