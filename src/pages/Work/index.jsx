// src/pages/Work/index.jsx
//
// The whole wall. Same component as the home page, no limit, every photo,
// with the lightbox. One line at the top and one ask at the bottom.

import { Button, Container, HStack, Text } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import SEO from '../../components/common/SEO'
import WorkWall from '../../components/home/WorkWall'
import { BAND_Y } from '../../theme/layout'

export default function Work() {
  return (
    <>
      <SEO title="Work" description="Festival shirts, band merch, brewery tees and crew runs printed by Fishbone Graphics in Ridgway, Colorado since 1985." path="/work/" />
      <Container size="page" pt={{ base: 6, md: 10 }} pb={BAND_Y}>
        <HStack justify="space-between" align="baseline" mb={{ base: 4, md: 6 }} flexWrap="wrap" gap={3}>
          <Text as="h1" fontFamily="heading" fontWeight={500} fontSize={{ base: '1.6rem', md: '2.2rem' }} lineHeight={1.1}>
            Forty seasons of <Text as="strong" fontWeight={700}>festival tables, taprooms and crews.</Text>
          </Text>
          <Text variant="kicker">Tap any print to see it big</Text>
        </HStack>
        <WorkWall />
        <HStack mt={{ base: 8, md: 12 }} spacing={4} flexWrap="wrap">
          <Text color="bone.300">Want yours on this wall?</Text>
          <Button as={RouterLink} to="/shop/" size="sm">Start a run</Button>
          <Button as={RouterLink} to="/quote/" size="sm" variant="outline">Send your art</Button>
        </HStack>
      </Container>
    </>
  )
}
