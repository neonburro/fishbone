// src/pages/About/index.jsx
import { alpha, palette } from '../../theme'
import { Box, Grid, GridItem, Heading, SimpleGrid, Stack, Text, Button } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import SEO from '../../components/common/SEO'
import PageHero from '../../components/layout/PageHero'
import { Section, SectionHeader } from '../../components/common/Section'
import Halftone from '../../components/brand/Halftone'
import RegMark from '../../components/brand/RegMark'
import { FishMark } from '../../components/brand/Logo'
import { Reveal } from '../../components/common/Motion'

const TIMELINE = [
  ['1985', 'First press', 'A manual four-color press, a shop vac and a stack of blank tees in Ridgway. The first job was for a bar that’s still open.'],
  ['1990s', 'Festival years', 'The mountain circuit found us. Bluegrass, film, jazz, brewfests. We learned size curves the hard way: by running out of mediums.'],
  ['2000s', 'Embroidery in-house', 'Hats and jackets were going out the door to other shops. We bought the machines, learned to digitize, kept it here.'],
  ['2010s', 'Automatic press', 'The big runs got big. An automatic press meant thousand-piece festival drops without losing the hand-pulled work we love.'],
  ['Now', 'Same shop, more ways', 'DTF for the short runs, water-based for the soft stuff and an online storefront so you can order at midnight the week before your show.'],
]

const VALUES = [
  ['A human proofs every job', 'Nothing prints from a form submission. A printer looks at your art, your sizes and your date before a screen gets burned.'],
  ['We tell you the cheaper answer', 'If DTF beats screen print for your 15 shirts, we’ll say so. If your art needs work, we’ll say that too.'],
  ['Reorders are easy', 'Your screens and files stay on record. Year two of your event is one phone call.'],
  ['We show up', 'Festival restocks at 7am on a Sunday. Pickup after hours because you’re driving over from Ouray. That’s the job.'],
]

export default function About() {
  return (
    <>
      <SEO title="About" description="Fishbone Graphics has printed shirts, posters and festival merch in Ridgway, Colorado since 1985. Meet the shop." path="/about/" />
      <PageHero eyebrow="About" title="Printing in Ridgway since 1985." lead="Fishbone Graphics is a screen print and embroidery shop at the foot of the San Juans. We’ve outlasted three presses, a few economies and more festival lineups than we can count." size="lg" />

      <Section>
        <Grid templateColumns={{ base: '1fr', lg: '3fr 2fr' }} gap={{ base: 10, lg: 16 }} alignItems="center">
          <GridItem>
            <Stack spacing={5} fontSize={{ base: 'md', md: 'lg' }} color="bone.300">
              <Text>
                Ridgway is a town of about a thousand people wedged between Ouray and Telluride and for forty years it’s had a print shop that punches above its weight. That’s us. We started with one manual press and a habit of saying yes to bands who needed shirts by Friday.
              </Text>
              <Text>
                The work grew with the valley. Festival crews, breweries, ski patrol, river outfitters, schools, fire departments, ranches. If you’ve been to a show in the San Juans, you’ve probably worn our ink or stood next to someone who was.
              </Text>
              <Text>
                We still hand-pull the short runs and the specialty stuff. We still mix ink to Pantone by eye and check it with a swatch. The automatic press and the embroidery heads let us do the big jobs too. But every ticket, big or small, gets looked at by a person who’s been pulling squeegees longer than most shops have existed.
              </Text>
            </Stack>
            <Button as={RouterLink} to="/contact/" mt={8} variant="outline">Come see the shop</Button>
          </GridItem>
          <GridItem>
            <Reveal>
              <Box position="relative" bg="ink.500" border="1px solid" borderColor="ink.300" borderRadius="base" p={{ base: 8, md: 12 }} overflow="hidden">
                <Halftone fade="radial" color={alpha(palette.ember, 0.14)} size={12} dot={1.6} />
                <Box position="relative" maxW="320px" mx="auto">
                  <FishMark color={palette.bone} accent={palette.ember} />
                </Box>
                <Stack spacing={1} mt={8} textAlign="center" position="relative">
                  <Text fontFamily="heading" fontWeight={800} fontSize="5xl" lineHeight={1} color="bone.100">40<Text as="span" color="ember.500">+</Text></Text>
                  <Text fontSize="xs" color="bone.500" textTransform="uppercase" letterSpacing="0.14em">Years of ink in Ouray County</Text>
                </Stack>
              </Box>
            </Reveal>
          </GridItem>
        </Grid>
      </Section>

      <Section bg="ink.500" borderY="1px solid" borderColor="ink.300">
        <SectionHeader eyebrow="Timeline" title="Four decades, five presses." />
        <Stack spacing={0}>
          {TIMELINE.map(([year, title, copy], i) => (
            <Reveal key={year} delay={i * 0.03}>
              <Grid templateColumns={{ base: '80px 1fr', md: '140px 1fr' }} gap={{ base: 4, md: 8 }} py={6} borderTop="1px solid" borderColor="ink.300">
                <GridItem><Text fontFamily="mono" color="ember.500" fontSize={{ base: 'md', md: 'lg' }}>{year}</Text></GridItem>
                <GridItem>
                  <Heading as="h3" size="md" mb={1}>{title}</Heading>
                  <Text color="bone.300" fontSize="sm" maxW="640px">{copy}</Text>
                </GridItem>
              </Grid>
            </Reveal>
          ))}
        </Stack>
      </Section>

      <Section>
        <SectionHeader eyebrow="How we work" title="The shop rules." />
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={{ base: 5, md: 8 }}>
          {VALUES.map(([t, c], i) => (
            <Reveal key={t} delay={i * 0.04}>
              <Box display="flex" gap={4}>
                <RegMark size="20px" color={palette.river} mt="4px" />
                <Box>
                  <Heading as="h3" size="md" mb={1.5}>{t}</Heading>
                  <Text color="bone.300" fontSize="sm">{c}</Text>
                </Box>
              </Box>
            </Reveal>
          ))}
        </SimpleGrid>
      </Section>
    </>
  )
}
