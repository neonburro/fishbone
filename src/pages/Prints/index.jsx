// src/pages/Prints/index.jsx
//
// Available prints. Two kinds of shirt live here once it is built. Designs
// the shop already has screens for, printed to order in small runs with a
// quick turn. And the randoms: extras off the end of a run, odd sizes, the
// color they printed too many of, priced to sell and gone when gone. No
// returns on the randoms, and it says so plainly. Until Pulse inventory
// lands this page says what is coming and points at the two open doors.
//
// No oxford commas, no em dashes.

import { Box, Button, Container, Grid, GridItem, Heading, Stack, Text } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import SEO from '../../components/common/SEO'
import { FadeIn } from '../../components/common/Motion'
import { BAND_Y, MEASURE } from '../../theme/layout'

const RACKS = [
  {
    kicker: 'Screens on file',
    title: 'Print to order',
    copy: 'Designs we already burned screens for. Pick one, pick a blank and a size, and it prints in the next small run. Quick turn, no setup, because the setup already happened.',
  },
  {
    kicker: 'The randoms',
    title: 'Off the pile',
    copy: 'Extras off the end of a run. Odd sizes, the color we printed too many of, last year’s festival shirt. Random sizes, random prints, priced to sell, gone when they are gone.',
    fine: 'No returns on the randoms. You knew that when you bought a shirt off the pile.',
  },
]

export default function Prints() {
  return (
    <>
      <SEO title="Available prints" description="Designs with screens already burned and the randoms off the end of a run. Small runs, quick turns, priced to sell. Fishbone Graphics, Ridgway, Colorado. Coming soon." path="/prints/" />
      <Container size="page" pt={{ base: 6, md: 12 }} pb={BAND_Y}>
        <FadeIn>
          <Text variant="kicker" color="red.500">Soon</Text>
          <Text as="h1" fontFamily="heading" fontWeight={500} fontSize={{ base: '1.75rem', md: '2.4rem', lg: '3rem' }} lineHeight={1.08} maxW="22ch" mt={3}>
            Available prints. <Box as="strong" fontWeight={700}>Screens we already have, and the randoms off the pile.</Box>
          </Text>
          <Text mt={5} color="bone.300" fontSize={{ base: 'md', md: 'lg' }} maxW={MEASURE}>
            We are photographing the flat files and counting the pile now. Until then, start a run or send your art.
          </Text>
        </FadeIn>

        <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={{ base: 4, md: 6 }} mt={{ base: 8, md: 12 }} maxW="1100px">
          {RACKS.map((r, i) => (
            <GridItem key={r.title}>
              <FadeIn delay={0.05 * (i + 1)}>
                <Stack spacing={3} p={{ base: 5, md: 6 }} borderRadius="lg" border="1px solid" borderColor="ink.300" h="100%">
                  <Text variant="kicker">{r.kicker}</Text>
                  <Heading as="h2" size="lg">{r.title}</Heading>
                  <Text color="bone.300" fontSize="sm">{r.copy}</Text>
                  {r.fine && <Text fontFamily="mono" fontSize="11px" letterSpacing="0.1em" textTransform="uppercase" color="bone.500" pt={2}>{r.fine}</Text>}
                </Stack>
              </FadeIn>
            </GridItem>
          ))}
        </Grid>

        <Stack direction={{ base: 'column', sm: 'row' }} spacing={3} mt={{ base: 8, md: 10 }}>
          <Button as={RouterLink} to="/shop/" size="md">Start a run</Button>
          <Button as={RouterLink} to="/quote/" size="md" variant="outline">Send your art</Button>
        </Stack>
      </Container>
    </>
  )
}
