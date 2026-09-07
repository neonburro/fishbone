// src/pages/Home/index.jsx
import { alpha, palette } from '../../theme'
import { Box, Button, Container, Heading, HStack, SimpleGrid, Stack, Text, Flex } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import { FiArrowRight } from 'react-icons/fi'
import SEO from '../../components/common/SEO'
import { Section, SectionHeader } from '../../components/common/Section'
import Halftone from '../../components/brand/Halftone'
import RegMark from '../../components/brand/RegMark'
import { FishMark } from '../../components/brand/Logo'
import PulledRule from '../../components/common/PulledRule'
import { FadeIn, Reveal } from '../../components/common/Motion'
import ProductGrid from '../../components/product/ProductGrid'
import { CardSkeleton, LoadError, EmptyState } from '../../components/common/States'
import useAsync from '../../hooks/useAsync'
import { getProducts } from '../../lib/api/catalog'
import { useSettings } from '../../hooks/useSettings'
import Marquee from '../../components/home/Marquee'

const SERVICES = [
  { key: 'screen', title: 'Screen printing', copy: 'Plastisol and water-based. Hand-pulled and auto-press. Up to 8 colors, tight registration, soft hand if you want it.' },
  { key: 'embroidery', title: 'Embroidery', copy: 'Hats, quarter-zips, work jackets. Digitized in-house so the stitch count is honest and the logo holds up.' },
  { key: 'dtf', title: 'DTF transfers', copy: 'Full-color art on small runs, mixed garments, odd fabrics. No screens, no minimums worth arguing about.' },
  { key: 'design', title: 'Art & design', copy: 'Gig-poster roots. We separate, vector and fix your file. Or draw the thing from scratch.' },
  { key: 'festival', title: 'Festival merch program', copy: 'Tour-quality shirts, hoodies, hats and posters for the Telluride-Ridgway-Ouray circuit. Pre-event drops and on-site restocks.' },
  { key: 'local', title: 'Crews, schools, shops', copy: 'Uniforms, spirit wear, staff tees, event shirts. Reorders on file so year two takes one phone call.' },
]

const STEPS = [
  { n: '01', title: 'Pick the goods', copy: 'Choose a blank, a color, sizes and where the ink goes. Upload art if you have it.' },
  { n: '02', title: 'We proof it', copy: 'A human looks at every order. You get a mockup and a firm price before anything hits a screen.' },
  { n: '03', title: 'Approve & pay', copy: 'Sign off on the proof, pay the invoice. Rush jobs welcome. Say so and we’ll tell you straight.' },
  { n: '04', title: 'Pull, pack, pick up', copy: 'Printed in Ridgway. Pick up at the shop or we ship. Standard turnaround is about two weeks.' },
]

export default function Home() {
  const { settings } = useSettings()
  const store = settings?.store || {}
  const featured = useAsync(() => getProducts({ featured: true, limit: 8 }), [])

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: store.name || 'Fishbone Graphics & Screen Printing',
    image: 'https://fishbonegraphics.com/og.png',
    url: 'https://fishbonegraphics.com/',
    telephone: store.phone || '(970) 626-4437',
    email: store.email,
    foundingDate: '1985',
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      streetAddress: store.address1 && !store.address1.includes('Ridgway') ? store.address1 : undefined,
      addressLocality: 'Ridgway',
      addressRegion: 'CO',
      postalCode: '81432',
      addressCountry: 'US',
    },
    geo: { '@type': 'GeoCoordinates', latitude: 38.1525, longitude: -107.7617 },
    sameAs: [store.instagram, store.facebook].filter(Boolean),
    areaServed: ['Ridgway', 'Ouray', 'Telluride', 'Montrose', 'Western Colorado'],
    makesOffer: SERVICES.map((s) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: s.title } })),
  }

  return (
    <>
      <SEO
        description="Hand-pulled screen printing, embroidery, DTF and festival merch out of Ridgway, Colorado. Printing since 1985. Order online or get a quote."
        path="/"
        structuredData={jsonLd}
      />

      {/* HERO */}
      <Box as="section" position="relative" bg="ink.900" overflow="hidden" borderBottom="1px solid" borderColor="ink.300">
        <Halftone fade="left" color={alpha(palette.ember, 0.16)} size={16} dot={2} left="40%" />
        <Halftone fade="top" color={alpha(palette.bone, 0.06)} size={10} dot={1.2} h="45%" />
        <Box position="absolute" right={{ base: '-10%', lg: '4%' }} top={{ base: '8%', lg: '10%' }} w={{ base: '360px', md: '520px', lg: '640px' }} opacity={0.08} pointerEvents="none" aria-hidden="true">
          <FishMark color={palette.bone} accent={palette.ember} />
        </Box>
        <Container size="page" position="relative" pt={{ base: 16, md: 28 }} pb={{ base: 16, md: 28 }}>
          <FadeIn>
            <HStack spacing={3} mb={6} color="bone.300">
              <RegMark size="16px" color={palette.ember} />
              <Text variant="eyebrow" color="bone.300">Ridgway, Colorado · Screen printing since 1985</Text>
            </HStack>
          </FadeIn>
          <FadeIn delay={0.05}>
            <Heading as="h1" size="4xl" maxW="14ch">
              Ink for the <Box as="span" color="ember.500">mountains.</Box>
            </Heading>
          </FadeIn>
          <FadeIn delay={0.1}>
            <PulledRule mt={6} mb={6} w="140px" />
            <Text fontSize={{ base: 'lg', md: 'xl' }} color="bone.300" maxW="560px">
              Festival shirts, band merch, crew hoodies and shop tees. Hand-pulled in the San Juans by people who’ve been doing it for forty years. Order online. A human proofs every job.
            </Text>
          </FadeIn>
          <FadeIn delay={0.15}>
            <Stack direction={{ base: 'column', sm: 'row' }} spacing={3} mt={8}>
              <Button as={RouterLink} to="/shop/" size="lg" rightIcon={<FiArrowRight />}>Shop blanks &amp; order</Button>
              <Button as={RouterLink} to="/quote/" size="lg" variant="outline">Festival &amp; custom quote</Button>
            </Stack>
          </FadeIn>
          <FadeIn delay={0.25}>
            <HStack spacing={{ base: 6, md: 10 }} mt={{ base: 12, md: 16 }} flexWrap="wrap" rowGap={4}>
              {[['1985', 'Year one'], ['8', 'Colors per press'], ['~2 wk', 'Standard turnaround'], ['0', 'Bots proofing your art']].map(([v, l]) => (
                <Box key={l}>
                  <Text fontFamily="heading" fontWeight={800} fontSize={{ base: '2xl', md: '3xl' }} lineHeight={1} color="bone.100">{v}</Text>
                  <Text fontSize="xs" color="bone.500" textTransform="uppercase" letterSpacing="0.1em" mt={1}>{l}</Text>
                </Box>
              ))}
            </HStack>
          </FadeIn>
        </Container>
      </Box>

      {/* PROOF STRIP */}
      <Marquee
        items={['Bluegrass festivals', 'Brewery taprooms', 'Ski patrol', 'Film fest crews', 'Mountain bike races', 'River outfitters', 'Hot springs', 'School spirit wear', 'Tour merch tables', 'Fire departments', 'Wedding weekends', 'Trail crews', 'Jam bands', 'Ranches']}
      />

      {/* FEATURED */}
      <Section>
        <Flex justify="space-between" align="flex-end" mb={{ base: 8, md: 12 }} gap={6} flexWrap="wrap">
          <SectionHeader eyebrow="Ready to print" title="Shop the blanks" lead="Pick a garment, tell us where the ink goes, drop your art. Price breaks kick in fast." mb={0} />
          <Button as={RouterLink} to="/shop/" variant="outline" size="md" rightIcon={<FiArrowRight />}>All products</Button>
        </Flex>
        {featured.loading ? (
          <CardSkeleton count={4} />
        ) : featured.error ? (
          <LoadError onRetry={featured.reload} error={featured.error} />
        ) : featured.data?.length ? (
          <ProductGrid products={featured.data} />
        ) : (
          <EmptyState title="Featured picks are on the press." message="The catalog is loading up. Browse the shop or send us a quote request in the meantime." ctaLabel="Browse the shop" ctaTo="/shop/" />
        )}
      </Section>

      {/* SERVICES */}
      <Section bg="ink.500" borderY="1px solid" borderColor="ink.300">
        <Halftone fade="right" color={alpha(palette.river, 0.12)} size={14} dot={1.6} left="60%" />
        <SectionHeader eyebrow="What we do" title="Every way to put a mark on a thing." lead="One shop, four decoration methods, forty years of knowing which one your job actually needs." />
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={{ base: 4, md: 6 }}>
          {SERVICES.map((s, i) => (
            <Reveal key={s.key} delay={i * 0.04}>
              <Box bg="ink.900" border="1px solid" borderColor="ink.300" borderRadius="base" p={6} h="100%" position="relative" _hover={{ borderColor: 'river.500' }} transition="border-color .2s">
                <RegMark size="16px" color={palette.river} mb={4} />
                <Heading as="h3" size="md" mb={2}>{s.title}</Heading>
                <Text color="bone.300" fontSize="sm">{s.copy}</Text>
              </Box>
            </Reveal>
          ))}
        </SimpleGrid>
        <Button as={RouterLink} to="/services/" variant="link" mt={8} rightIcon={<FiArrowRight />}>More on services</Button>
      </Section>

      {/* HOW IT WORKS */}
      <Section>
        <SectionHeader eyebrow="How it works" title="Four steps. No surprises." align="center" />
        <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing={{ base: 6, md: 8 }} position="relative">
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.06}>
              <Box position="relative" pt={2}>
                <Text fontFamily="mono" fontSize="sm" color="ember.500" mb={3}>{s.n}</Text>
                <Box h="2px" bg="ink.300" mb={5} position="relative">
                  <Box position="absolute" left={0} top="-4px" w="10px" h="10px" bg="ember.500" borderRadius="full" />
                </Box>
                <Heading as="h3" size="md" mb={2}>{s.title}</Heading>
                <Text color="bone.300" fontSize="sm">{s.copy}</Text>
              </Box>
            </Reveal>
          ))}
        </SimpleGrid>
      </Section>

      {/* QUOTE CTA */}
      <Box as="section" position="relative" bg="ember.500" color="ink.900" overflow="hidden">
        <Halftone fade="right" color={alpha(palette.ink, 0.22)} size={12} dot={1.8} left="50%" />
        <Container size="page" py={{ base: 16, md: 24 }} position="relative">
          <Stack direction={{ base: 'column', lg: 'row' }} justify="space-between" align={{ lg: 'center' }} spacing={8}>
            <Box maxW="720px">
              <Text variant="eyebrow" color="ink.900" opacity={0.75}>Festivals · Tours · Big runs</Text>
              <Heading as="h2" size="3xl" color="ink.900" mt={3}>Got a date and a headcount? <br />Tell us. We’ll get you a number.</Heading>
              <Text mt={5} fontSize={{ base: 'md', md: 'lg' }} color="ink.900" opacity={0.85} maxW="560px">
                Multi-garment merch lines, on-site restocks, poster runs. We’ve printed for the mountain circuit since before the lineups had websites.
              </Text>
            </Box>
            <Stack direction={{ base: 'column', sm: 'row' }} spacing={3} flexShrink={0}>
              <Button as={RouterLink} to="/quote/" size="lg" bg="ink.900" color="bone.100" _hover={{ bg: 'ink.700' }} _active={{ bg: 'ink.800' }}>Request a quote</Button>
              <Button as="a" href={`tel:${(store.phone || '9706264437').replace(/\D/g, '')}`} size="lg" variant="outline" borderColor="ink.900" color="ink.900" _hover={{ bg: 'ink.900', color: 'bone.100' }}>
                {store.phone || '(970) 626-4437'}
              </Button>
            </Stack>
          </Stack>
        </Container>
      </Box>
    </>
  )
}
