// src/components/layout/Footer.jsx
//
// The footer signs off with the line lockup, the clean fishbone and the
// FISHBONE / GRAPHICS words (components/brand/Logo.jsx). It sits bare on the
// page, no tile, no border, no glass. The shop's real oval logo leads the
// nav instead, where people meet it first. Under the signature the NAP,
// the hours as the printer typed them, the live open line and the
// LocalBusiness JSON-LD built from the same settings so what the search
// engines index is what the door says. No decoration.

import { Box, Container, Grid, GridItem, HStack, Stack, Text, Tooltip, Link as ChakraLink } from '@chakra-ui/react'
import { Helmet } from 'react-helmet-async'
import { Link as RouterLink } from 'react-router-dom'
import { FiInstagram, FiFacebook } from 'react-icons/fi'
import Logo from '../brand/Logo'
import OpenNow from '../common/OpenNow'
import InkPaperToggle from '../common/InkPaperToggle'
import AccentPicker from '../common/AccentPicker'
import { useSettings } from '../../hooks/useSettings'
import { hoursDisplay } from '../../lib/hours'
import { localBusiness, directionsUrl } from '../../lib/jsonld'
import { EASE } from '../../theme/layout'
import { NAV_LINKS } from './Nav'

const SERVICES = ['Screen printing', 'Art and design', 'Festival merch']
const PULSE_URL = import.meta.env.VITE_PULSE_URL || 'https://fishbonepulse.netlify.app/'

// A footer link is a 21px line of text. On a phone that is a thin thing to
// hit, so the row grows to 40px there and stays tight on a desktop where
// there is a pointer.
const FootLink = ({ to, children }) => (
  <ChakraLink
    as={RouterLink}
    to={to}
    color="bone.300"
    fontSize="sm"
    display="flex"
    alignItems="center"
    minH={{ base: '40px', md: 'auto' }}
    _hover={{ color: 'bone.100', textDecoration: 'none' }}
    transition={`color 200ms ${EASE}`}
  >
    {children}
  </ChakraLink>
)

export default function Footer() {
  const { settings } = useSettings()
  const s = settings?.store || {}
  const tel = (s.phone || '').replace(/\D/g, '')
  const year = new Date().getFullYear()
  const hours = (Array.isArray(s.hours) ? s.hours : []).map(hoursDisplay)
  const jsonLd = localBusiness(s, { services: SERVICES })

  return (
    <Box as="footer" borderTop="1px solid" borderColor="ink.300" mt="auto">
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>
      <Container size="page" pt={{ base: 10, md: 14 }} pb={{ base: 6, md: 8 }}>
        <Grid templateColumns={{ base: '1fr', sm: '1fr 1fr', lg: '5fr 2fr 3fr 3fr' }} gap={{ base: 10, lg: 8 }}>
          <GridItem>
            <Stack spacing={5} align="flex-start">
              <Logo height={{ base: '42px', md: '50px' }} />
              <Text color="bone.300" fontSize="sm" maxW="300px">
                {s.tagline || 'Ridgway, Colorado. Printing since 1985.'}
              </Text>
              <OpenNow />
              {/* The glyph stays 20px, the target is 44. A 20px link is a
                  coin toss with a thumb, and these two are the only way out
                  of the site on a phone. Negative margin keeps the row
                  optically aligned with the text above it. */}
              <HStack spacing={1} pt={1} ml="-10px">
                {s.instagram && (
                  <ChakraLink href={s.instagram} isExternal aria-label="Fishbone Graphics on Instagram" color="bone.300" _hover={{ color: 'bone.100' }} display="inline-flex" alignItems="center" justifyContent="center" w="44px" h="44px">
                    <FiInstagram size={20} />
                  </ChakraLink>
                )}
                {s.facebook && (
                  <ChakraLink href={s.facebook} isExternal aria-label="Fishbone Graphics on Facebook" color="bone.300" _hover={{ color: 'bone.100' }} display="inline-flex" alignItems="center" justifyContent="center" w="44px" h="44px">
                    <FiFacebook size={20} />
                  </ChakraLink>
                )}
              </HStack>
            </Stack>
          </GridItem>

          <GridItem>
            <Stack spacing={{ base: 0, md: 2.5 }}>
              <Text variant="kicker" mb={1}>Menu</Text>
              {NAV_LINKS.map((l) => <FootLink key={l.to} to={l.to}>{l.label}</FootLink>)}
              <FootLink to="/order/track/">Track a run</FootLink>
            </Stack>
          </GridItem>

          <GridItem>
            <Stack spacing={2.5}>
              <Text variant="kicker" mb={1}>Hours</Text>
              {hours.map((h, i) => (
                <HStack key={i} justify="space-between" maxW="280px" fontSize="sm" align="baseline">
                  <Text color="bone.300">{h.days}</Text>
                  <Text fontFamily="mono" color="bone.100" fontSize="xs">{h.time}</Text>
                </HStack>
              ))}
              <Text fontSize="xs" color="bone.500" pt={1}>Festival season runs long. Call ahead for pickups after hours.</Text>
            </Stack>
          </GridItem>

          <GridItem>
            <Stack spacing={3} as="address" fontStyle="normal">
              <Text variant="kicker">Find the shop</Text>
              <Box fontSize="sm" color="bone.300" lineHeight={1.6}>
                <Text color="bone.100">{s.legal_name || s.name}</Text>
                <Text>{s.address1}{s.address2 ? `, ${s.address2}` : ''}</Text>
                <Text>{s.city}, {s.state} {s.zip}</Text>
              </Box>
              <ChakraLink href={`tel:${tel}`} color="bone.100" fontSize="sm" fontFamily="mono" _hover={{ color: 'red.500' }}>{s.phone}</ChakraLink>
              {s.email && <ChakraLink href={`mailto:${s.email}`} color="bone.300" fontSize="sm" _hover={{ color: 'bone.100' }}>{s.email}</ChakraLink>}
              {directionsUrl(s) && <ChakraLink href={directionsUrl(s)} isExternal fontFamily="mono" fontSize="11px" letterSpacing="0.14em" textTransform="uppercase" color="bone.100" _hover={{ color: 'red.500' }}>Directions</ChakraLink>}
            </Stack>
          </GridItem>
        </Grid>

        <Stack direction={{ base: 'column', md: 'row' }} justify="space-between" align={{ md: 'center' }} spacing={3} mt={{ base: 10, md: 14 }} pt={6} borderTop="1px solid" borderColor="ink.300">
          {/* On a phone the switches take a line of their own and the copyright sits
              flat under them, full width. On a desktop it is all one row. */}
          <Stack direction={{ base: 'column', md: 'row' }} spacing={{ base: 3, md: 5 }} align={{ base: 'flex-start', md: 'center' }}>
            <HStack spacing={5}>
              <InkPaperToggle />
              <AccentPicker />
            </HStack>
            <Text color="bone.500" fontSize="xs">© {year} {s.legal_name || s.name || 'Fishbone Graphics'}. {s.city || 'Ridgway'}, {s.state || 'CO'} {s.zip || '81432'}.</Text>
          </Stack>
          <HStack spacing={4} justify={{ base: 'space-between', md: 'flex-end' }} w={{ base: '100%', md: 'auto' }}>
            <Text fontFamily="mono" fontSize="11px" color="bone.500" letterSpacing="0.14em" textTransform="uppercase">Printing since {s.founded || 1985}</Text>
            {/* Backstage. The door to Pulse for the crew. A pulse line, not a lock. */}
            <Tooltip label="Fishbone backstage" placement="top" hasArrow openDelay={150}>
              <ChakraLink href={PULSE_URL} isExternal aria-label="Fishbone backstage, the shop's Pulse admin" display="inline-flex" alignItems="center" justifyContent="center" w="44px" h="44px" borderRadius="full" border="1px solid" borderColor="ink.300" color="bone.500" _hover={{ color: 'red.500', borderColor: 'red.500' }} transition={`color 200ms ${EASE}, border-color 200ms ${EASE}`}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M2 12h4l2-6 4 12 3-8 2 2h5" /></svg>
              </ChakraLink>
            </Tooltip>
          </HStack>
        </Stack>
      </Container>
    </Box>
  )
}
