// src/pages/Home/index.jsx
//
// Less is better. The home page is one sentence, four things to do, the
// wall, and one paper card you can send a file through. No hero headline, no
// decoration, no slogans. The work is the argument.
//
// ── INK AND PAPER ───────────────────────────────────────────────────────────
// The page is ink. The form is paper, because asking and ordering happen on
// paper. It is the one light thing on the page and it is where the eye
// lands after the wall. The same form is on Shop info.
//
// No oxford commas, no em dashes.

import { Box, Button, Container, Grid, GridItem, Heading, HStack, Stack, Text, Link as ChakraLink } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import { FiArrowRight } from 'react-icons/fi'
import SEO from '../../components/common/SEO'
import OpenNow from '../../components/common/OpenNow'
import { FadeIn } from '../../components/common/Motion'
import WorkWall from '../../components/home/WorkWall'
import ContactForm from '../../components/common/ContactForm'
import { useSettings } from '../../hooks/useSettings'
import { BAND_Y, EASE } from '../../theme/layout'

// Five doors. Each one is a different person walking in. One line each, in
// the shop's voice, no more.
const ACTIONS = [
  { to: '/shop/', title: 'Start a run', copy: 'Pick the blank, the color and the count. A printer sends the number back.' },
  { to: '/quote/', title: 'Send your art', copy: 'You have the file. Drop it here and get a proof, not a form letter.' },
  { to: '/design/', title: 'Share your vision', copy: 'You have the idea and no art yet. The shop draws it. It has since 1985.' },
  { to: '/work/', title: 'See the work', copy: 'Forty seasons of festival tables, taprooms and crews. Still going.' },
  { to: '/prints/', title: 'Available prints', copy: 'Screens we already have, and the randoms off the pile. Priced to move.', soon: true },
]

const SERVICES = ['Screen printing', 'Art and design', 'Merch']

function ActionTile({ to, title, copy, soon }) {
  return (
    <ChakraLink
      as={RouterLink}
      to={to}
      display="grid"
      gridTemplateColumns="1fr auto"
      alignItems="center"
      gap={4}
      p={{ base: 4, md: 5 }}
      borderRadius="lg"
      border="1px solid"
      borderColor="ink.300"
      bg="ink.500"
      role="group"
      transition={`transform 450ms ${EASE}, border-color 450ms ${EASE}`}
      _hover={{ textDecoration: 'none', transform: 'translateY(-2px)', borderColor: 'ink.100' }}
    >
      <Box>
        <HStack spacing={3} align="baseline" mb={1}>
          <Heading as="h2" size="md">{title}</Heading>
          {soon && <Text variant="kicker" color="red.500">Soon</Text>}
        </HStack>
        <Text fontSize="sm" color="bone.300">{copy}</Text>
      </Box>
      <Box w="40px" h="40px" borderRadius="full" bg="red.500" color="#FBF8F2" display="grid" placeItems="center" flexShrink={0} transition={`transform 450ms ${EASE}`} _groupHover={{ transform: 'translateX(3px)' }}>
        <FiArrowRight size={18} />
      </Box>
    </ChakraLink>
  )
}

export default function Home() {
  const { settings } = useSettings()
  const store = settings?.store || {}
  const tel = (store.phone || '9706264350').replace(/\D/g, '')

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: store.name || 'Fishbone Graphics & Screen Printing',
    image: 'https://fishbonegraphics.com/og.png',
    url: 'https://fishbonegraphics.com/',
    telephone: store.phone || '(970) 626-4350',
    email: store.email,
    foundingDate: '1985',
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      streetAddress: store.address1 || '250 S Lena St',
      addressLocality: 'Ridgway',
      addressRegion: 'CO',
      postalCode: '81432',
      addressCountry: 'US',
    },
    geo: { '@type': 'GeoCoordinates', latitude: 38.1525, longitude: -107.7617 },
    sameAs: [store.instagram, store.facebook].filter(Boolean),
    areaServed: ['Ridgway', 'Ouray', 'Telluride', 'Montrose', 'Western Colorado'],
    makesOffer: SERVICES.map((s) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: s } })),
  }

  return (
    <>
      <SEO
        description="High quality screen printing and graphic design, specializing in music and festival merchandising. Ridgway, Colorado, est 1985."
        path="/"
        structuredData={jsonLd}
      />

      {/* THE OPENER. A place line, one sentence about what we do, one about who
          for, and five doors. The who line stays open on purpose, the shop
          prints for whoever needs a shirt by Friday. */}
      <Container size="page" pt={{ base: 6, md: 12 }} pb={{ base: 8, md: 12 }}>
        <Grid templateColumns={{ base: '1fr', lg: '1.1fr 0.9fr' }} gap={{ base: 8, lg: 12 }} alignItems="start">
          <GridItem position={{ lg: 'sticky' }} top={{ lg: '108px' }}>
            <FadeIn>
              <Text variant="kicker" color="red.500">Ridgway, Colorado, since 1985</Text>
              <Text
                as="h1"
                fontFamily="heading"
                fontWeight={700}
                fontSize={{ base: '2.1rem', md: '3rem', lg: '3.6rem' }}
                lineHeight={1.02}
                color="bone.100"
                maxW="14ch"
                mt={3}
              >
                Screen printing, merch and the art to go on it.
              </Text>
              <Text mt={5} fontSize={{ base: 'md', md: 'lg' }} color="bone.300" maxW="34ch" lineHeight={1.45}>
                For festivals, bands, breweries, crews, schools and anyone who needs a shirt by Friday.
              </Text>
              <HStack spacing={2} mt={7} flexWrap="wrap">
                {SERVICES.map((s) => (
                  <Text key={s} fontFamily="mono" fontSize="11px" letterSpacing="0.14em" textTransform="uppercase" color="bone.300" border="1px solid" borderColor="ink.200" borderRadius="full" px={3} py={1.5}>{s}</Text>
                ))}
              </HStack>
            </FadeIn>
          </GridItem>
          <GridItem>
            <FadeIn delay={0.08}>
              <Stack spacing={3}>
                {ACTIONS.map((a) => <ActionTile key={a.to} {...a} />)}
              </Stack>
            </FadeIn>
          </GridItem>
        </Grid>
      </Container>

      {/* THE WALL. */}
      <Container size="page" pb={BAND_Y}>
        <WorkWall limit={11} more />
        <HStack mt={{ base: 4, md: 5 }} justify="space-between" align="baseline">
          <Text variant="kicker">Recent runs</Text>
          <Button as={RouterLink} to="/work/" variant="link" rightIcon={<FiArrowRight />}>All the work</Button>
        </HStack>
      </Container>

      {/* PAPER. Send us something, and where the shop is. */}
      <Container size="page" pb={BAND_Y}>
        <Grid templateColumns={{ base: '1fr', lg: '1.2fr 0.8fr' }} gap={{ base: 6, lg: 8 }} alignItems="stretch">
          <GridItem>
            <ContactForm source="home" phone={store.phone || '(970) 626-4350'} h="100%" />
          </GridItem>
          <GridItem>
            <Stack spacing={4} h="100%" justify="space-between" p={{ base: 5, md: 6 }} borderRadius="lg" border="1px solid" borderColor="ink.300">
              <Stack spacing={5}>
                <OpenNow size="md" />
                <Stack spacing={1} as="address" fontStyle="normal">
                  <Text variant="kicker">The shop</Text>
                  <Text color="bone.100">{store.address1 || '250 S Lena St'}</Text>
                  <Text color="bone.300">{store.city || 'Ridgway'}, {store.state || 'CO'} {store.zip || '81432'}</Text>
                </Stack>
                <Stack spacing={1}>
                  <Text variant="kicker">Call</Text>
                  <ChakraLink href={`tel:${tel}`} fontFamily="mono" color="bone.100" _hover={{ color: 'red.500', textDecoration: 'none' }}>{store.phone || '(970) 626-4350'}</ChakraLink>
                </Stack>
              </Stack>
              <Stack spacing={3}>
                <Stack spacing={1.5}>
                  <Text variant="kicker">What we do</Text>
                  <Text color="bone.300" fontSize="sm">{SERVICES.join(' · ')}</Text>
                </Stack>
                <Button as={RouterLink} to="/services/" variant="link" alignSelf="flex-start" rightIcon={<FiArrowRight />}>How a run works</Button>
              </Stack>
            </Stack>
          </GridItem>
        </Grid>
      </Container>
    </>
  )
}
