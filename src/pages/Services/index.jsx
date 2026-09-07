import { Box, Button, Grid, GridItem, Heading, HStack, List, ListItem, SimpleGrid, Stack, Text } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import { FiArrowRight } from 'react-icons/fi'
import SEO from '../../components/common/SEO'
import PageHero from '../../components/layout/PageHero'
import { Section, SectionHeader } from '../../components/common/Section'
import Halftone from '../../components/brand/Halftone'
import RegMark from '../../components/brand/RegMark'
import { Reveal } from '../../components/common/Motion'

const SERVICES = [
  {
    id: 'screen-printing', n: '01', title: 'Screen printing', tag: 'The core of the shop since 1985',
    copy: 'Plastisol for punch and durability, water-based and discharge when you want it soft and vintage. Manual presses for the hand-pulled stuff, automatic for the big runs. We burn our own screens and mix our own Pantones.',
    bullets: ['Up to 8 spot colors, tight registration', 'Simulated process and halftones for photographic art', 'Specialty inks: puff, metallic, glow, high-density', 'Tees, hoodies, totes, bandanas, koozies, posters'],
    best: 'Runs of 24+ with 1–6 colors. The more you print, the cheaper each one gets.',
  },
  {
    id: 'embroidery', n: '02', title: 'Embroidery', tag: 'Stitched, not printed',
    copy: 'Hats, quarter-zips, work jackets, polos, beanies. Files are digitized in-house so the stitch count is honest and small text stays legible. 3D puff on caps if you want the logo to stand up.',
    bullets: ['Left chest, cap front, sleeve, back yoke', 'Up to 12 thread colors', 'Structured and unstructured caps, visors, beanies', 'Names and numbers for crews and teams'],
    best: 'Hats and outerwear. Anything a screen print would crack on.',
  },
  {
    id: 'dtf', n: '03', title: 'DTF transfers', tag: 'Full color, no screens',
    copy: 'Direct-to-film prints the whole image — gradients, photos, forty colors — onto a transfer we heat press onto almost any fabric. No screen fees, so short runs and one-offs finally make sense.',
    bullets: ['Any color count, no setup per color', 'Works on cotton, poly, blends, nylon, canvas', 'Mixed garments and sizes in one small order', 'Names, numbers, sponsor logos'],
    best: 'Under 24 pieces, or complex full-color art on a budget.',
  },
  {
    id: 'design', n: '04', title: 'Art & design', tag: 'Gig-poster roots',
    copy: 'We separate colors, trace low-res logos into clean vector, fix type, and build mockups. Or we draw the whole thing — event posters, festival marks, band merch, bar shirts.',
    bullets: ['Vector redraw and cleanup', 'Color separations and halftone prep', 'Original illustration and lettering', 'Print-ready files you keep'],
    best: 'When the art is a screenshot, a sketch, or an idea.',
  },
  {
    id: 'festival', n: '05', title: 'Festival merch program', tag: 'Our specialty',
    copy: 'We’ve stocked merch tables on the mountain circuit for decades. One ticket covers tees, hoodies, hats and posters in size curves that sell out evenly. Pre-event drop at the gate, on-call restocks over the weekend.',
    bullets: ['Multi-garment lines on one order', 'Size curves tuned for festival crowds', 'Venue delivery and weekend restocks', 'Poster runs and limited editions'],
    best: 'Festivals, tours, breweries, multi-day events. Ask for a quote.',
    cta: { to: '/quote', label: 'Request a festival quote' },
  },
]

export default function Services() {
  return (
    <>
      <SEO title="Services" description="Screen printing, embroidery, DTF transfers, art and design, and a festival merch program — all under one roof in Ridgway, Colorado." path="/services" />
      <PageHero eyebrow="Services" title="Five ways to put a mark on a thing." lead="One shop, one crew, forty years of knowing which method your job actually needs. If you’re not sure, call — we’ll tell you straight, even when the answer is the cheaper one." size="lg" />

      <Section py={{ base: 10, md: 16 }}>
        <HStack as="nav" aria-label="Services" spacing={2} flexWrap="wrap" rowGap={2} mb={{ base: 10, md: 16 }}>
          {SERVICES.map((s) => (
            <Button key={s.id} as="a" href={`#${s.id}`} size="sm" variant="outline">{s.title}</Button>
          ))}
        </HStack>
        <Stack spacing={{ base: 12, md: 20 }}>
          {SERVICES.map((s, i) => (
            <Reveal key={s.id}>
              <Grid id={s.id} templateColumns={{ base: '1fr', md: '2fr 3fr' }} gap={{ base: 6, md: 12 }} scrollMarginTop="100px" borderTop="1px solid" borderColor="ink.300" pt={{ base: 8, md: 12 }}>
                <GridItem>
                  <Text fontFamily="mono" color="ember.500" mb={2}>{s.n}</Text>
                  <Heading as="h2" size="2xl">{s.title}</Heading>
                  <Text color="river.400" fontFamily="heading" fontWeight={600} textTransform="uppercase" letterSpacing="0.1em" fontSize="sm" mt={3}>{s.tag}</Text>
                </GridItem>
                <GridItem>
                  <Text color="bone.300" fontSize={{ base: 'md', md: 'lg' }} mb={6}>{s.copy}</Text>
                  <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={6}>
                    <Box>
                      <Text variant="eyebrow" mb={3} color="bone.500">Good for</Text>
                      <List spacing={2}>
                        {s.bullets.map((b) => (
                          <ListItem key={b} display="flex" gap={3} alignItems="flex-start" fontSize="sm" color="bone.100"><RegMark size="12px" color={i % 2 ? '#2BB3A3' : '#FF6A13'} mt="4px" />{b}</ListItem>
                        ))}
                      </List>
                    </Box>
                    <Box bg="ink.500" border="1px solid" borderColor="ink.300" borderRadius="base" p={5} alignSelf="start">
                      <Text variant="eyebrow" mb={2} color="bone.500">Best when</Text>
                      <Text fontSize="sm" color="bone.300">{s.best}</Text>
                      {s.cta && <Button as={RouterLink} to={s.cta.to} size="sm" mt={4} rightIcon={<FiArrowRight />}>{s.cta.label}</Button>}
                    </Box>
                  </SimpleGrid>
                </GridItem>
              </Grid>
            </Reveal>
          ))}
        </Stack>
      </Section>

      <Section bg="ink.500" borderTop="1px solid" borderColor="ink.300">
        <Halftone fade="left" color="rgba(255,106,19,0.10)" size={14} dot={1.6} left="50%" />
        <SectionHeader eyebrow="Pricing, plainly" title="How the number gets made." lead="No secret menu. Three things move the price: how many, how many colors, how many places on the shirt." />
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
          {[
            ['Quantity', 'Every product page shows price breaks. The unit price drops at 24, 48, 72, 144 — because screens and setup are the same whether we print 12 or 120.'],
            ['Setup', 'A one-time fee per decoration method covers burning screens or digitizing your logo. It’s charged once per order, not once per shirt. Reorders with the same art skip it.'],
            ['Locations', 'Front only is the baseline. A back print, sleeve or nape adds a small setup fee for the extra screen. The proof lists every line so nothing surprises you.'],
          ].map(([t, c]) => (
            <Box key={t} bg="ink.900" border="1px solid" borderColor="ink.300" borderRadius="base" p={6}>
              <Heading as="h3" size="md" mb={2}>{t}</Heading>
              <Text color="bone.300" fontSize="sm">{c}</Text>
            </Box>
          ))}
        </SimpleGrid>
        <Stack direction={{ base: 'column', sm: 'row' }} spacing={3} mt={10}>
          <Button as={RouterLink} to="/shop" rightIcon={<FiArrowRight />}>Shop blanks &amp; see pricing</Button>
          <Button as={RouterLink} to="/quote" variant="outline">Ask for a custom quote</Button>
        </Stack>
      </Section>
    </>
  )
}
