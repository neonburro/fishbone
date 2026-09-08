// src/pages/Services/index.jsx
//
// Printing. One page that says how a run works, what moves the price, what
// we print on and what we need from your art. It lives at /services/ and
// the nav calls it Printing, because that is the service. No list of five
// services, this shop does one thing well.
//
// No oxford commas, no em dashes.

import { Box, Button, Container, Grid, GridItem, Heading, Stack, Text } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import { FiArrowRight } from 'react-icons/fi'
import SEO from '../../components/common/SEO'
import { FadeIn } from '../../components/common/Motion'
import { BAND_Y, MEASURE } from '../../theme/layout'

const STEPS = [
  { n: '01', title: 'Garment and color', copy: 'Real blanks in real colors. We will tell you straight which one suits your art and your budget.' },
  { n: '02', title: 'Print and placement', copy: 'Where the ink goes and how many colors. Front, back, nape. One color or eight.' },
  { n: '03', title: 'Sizes', copy: 'A grid that adds up as you fill it, so the ticket is right before you send it.' },
  { n: '04', title: 'Proof', copy: 'A person looks at every run before a screen is burned. You approve the proof, we pull the run.' },
]

const PRICE = [
  ['Quantity', 'Screens cost the same whether we print two dozen or two hundred, so the more you print the less each shirt costs. The proof shows the number.'],
  ['Colors', 'Each color is a screen. One color is the cheapest shirt we make. Six colors is a poster on a shirt and priced like one.'],
  ['Locations', 'Front is the baseline. A back or a nape is another screen, set up once per run, not per shirt.'],
  ['Reorders', 'Your screens and files stay on record. Year two of your event is one phone call.'],
]

const ART = [
  'Vector is gold. AI, EPS, PDF or SVG with type outlined.',
  'No vector? A PNG or PSD at 300 dpi at print size works.',
  'A sketch or a screenshot is fine to start. We separate, redraw and clean up, and quote the art time up front.',
  'Tell us the Pantone if you have one. We mix by eye and check with a swatch.',
]

export default function Services() {
  return (
    <>
      <SEO title="Printing" description="How a run works at Fishbone Graphics. Garment, print, sizes, proof. What moves the price and what we need from your art. Ridgway, Colorado." path="/services/" />
      <Container size="page" pt={{ base: 6, md: 12 }} pb={BAND_Y}>
        <FadeIn>
          <Text as="h1" fontFamily="heading" fontWeight={500} fontSize={{ base: '1.75rem', md: '2.4rem', lg: '3rem' }} lineHeight={1.08} maxW="22ch">
            Screen printing, <Box as="strong" fontWeight={700}>start to finish.</Box> Here is how a run works and what moves the number.
          </Text>
        </FadeIn>

        <Grid templateColumns={{ base: '1fr', lg: '1.2fr 0.8fr' }} gap={{ base: 6, lg: 8 }} mt={{ base: 8, md: 12 }} alignItems="start">
          <GridItem>
            <FadeIn delay={0.05}>
              <Box bg="paper.50" color="paper.900" borderRadius="lg" p={{ base: 6, md: 8 }} boxShadow="paper">
                <Text variant="kicker" color="paper.500">How a run works</Text>
                <Heading as="h2" size="xl" mt={3} mb={6} color="paper.900">Four steps on paper.</Heading>
                <Stack spacing={0} divider={<Box borderBottom="1px dashed" borderColor="paper.200" />}>
                  {STEPS.map((s) => (
                    <Grid key={s.n} templateColumns="auto 1fr" gap={4} py={3.5} alignItems="baseline">
                      <Text fontFamily="mono" fontSize="12px" color="red.500">{s.n}</Text>
                      <Box>
                        <Heading as="h3" size="sm" color="paper.900" letterSpacing="0.02em">{s.title}</Heading>
                        <Text fontSize="sm" color="paper.500" mt={1} maxW={MEASURE}>{s.copy}</Text>
                      </Box>
                    </Grid>
                  ))}
                </Stack>
                <Stack direction={{ base: 'column', sm: 'row' }} spacing={3} mt={7}>
                  <Button as={RouterLink} to="/shop/" size="md" rightIcon={<FiArrowRight />}>Start a run</Button>
                  <Button as={RouterLink} to="/quote/" size="md" variant="outline" borderColor="paper.200" color="paper.900" _hover={{ borderColor: 'paper.300', bg: 'paper.100' }}>Send your art</Button>
                </Stack>
              </Box>
            </FadeIn>
          </GridItem>
          <GridItem>
            <FadeIn delay={0.1}>
              <Stack spacing={0} borderRadius="lg" border="1px solid" borderColor="ink.300" p={{ base: 5, md: 6 }}>
                <Text variant="kicker" mb={3}>What moves the price</Text>
                {PRICE.map(([k, v]) => (
                  <Box key={k} py={3.5} borderTop="1px solid" borderColor="ink.300">
                    <Heading as="h3" size="sm" letterSpacing="0.02em">{k}</Heading>
                    <Text fontSize="sm" color="bone.300" mt={1}>{v}</Text>
                  </Box>
                ))}
              </Stack>
            </FadeIn>
          </GridItem>
        </Grid>

        <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={{ base: 6, lg: 8 }} mt={{ base: 6, lg: 8 }}>
          <GridItem>
            <FadeIn>
              <Stack spacing={3} p={{ base: 5, md: 6 }} borderRadius="lg" border="1px solid" borderColor="ink.300" h="100%">
                <Text variant="kicker">What we print on</Text>
                <Text color="bone.100">Tees, long sleeves, hoodies and crewnecks, tanks, totes and bandanas. Comfort Colors, Gildan, Independent and the rest of the catalog, in every color they make.</Text>
                <Text color="bone.300" fontSize="sm" maxW={MEASURE}>Bring your own blanks and we will print them too. Ask first about nylon, waterproof shells and anything with a lot of seams where the art goes.</Text>
              </Stack>
            </FadeIn>
          </GridItem>
          <GridItem>
            <FadeIn delay={0.05}>
              <Stack spacing={3} p={{ base: 5, md: 6 }} borderRadius="lg" border="1px solid" borderColor="ink.300" h="100%">
                <Text variant="kicker">What we need from your art</Text>
                <Stack spacing={2}>
                  {ART.map((a) => (
                    <Grid key={a} templateColumns="auto 1fr" gap={3} alignItems="baseline">
                      <Box w="6px" h="6px" borderRadius="full" bg="red.500" transform="translateY(-2px)" />
                      <Text fontSize="sm" color="bone.100">{a}</Text>
                    </Grid>
                  ))}
                </Stack>
              </Stack>
            </FadeIn>
          </GridItem>
        </Grid>
      </Container>
    </>
  )
}
