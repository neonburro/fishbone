// src/components/layout/Footer.jsx
//
// The footer is the shop's full name, address and phone (the NAP), the hours
// as the printer typed them, the live open line and the LocalBusiness JSON-LD
// built from the same settings so what the search engines index is what the
// door says. The huge ghost wordmark at the bottom is the one indulgence.

import { Box, Container, Grid, GridItem, HStack, Stack, Text, Link as ChakraLink } from '@chakra-ui/react'
import { Helmet } from 'react-helmet-async'
import { Link as RouterLink } from 'react-router-dom'
import { FiInstagram, FiFacebook } from 'react-icons/fi'
import Logo from '../brand/Logo'
import Halftone from '../brand/Halftone'
import RegMark from '../brand/RegMark'
import OpenNow from '../common/OpenNow'
import { useSettings } from '../../hooks/useSettings'
import { hoursDisplay } from '../../lib/hours'
import { localBusiness, directionsUrl } from '../../lib/jsonld'
import { palette, alpha } from '../../theme'
import { EASE } from '../../theme/layout'
import { NAV_LINKS } from './Nav'

const SERVICES = ['Screen printing', 'Embroidery', 'DTF transfers', 'Art and design', 'Festival merch program']

const FootLink = ({ to, children }) => (
  <ChakraLink as={RouterLink} to={to} color="bone.300" fontSize="sm" _hover={{ color: 'ember.500', textDecoration: 'none' }} transition={`color 200ms ${EASE}`}>
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
    <Box as="footer" bg="ink.500" borderTop="1px solid" borderColor="ink.300" position="relative" overflow="hidden" mt="auto">
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>
      <Halftone fade="top" color={alpha(palette.bone, 0.05)} size={12} dot={1.4} h="120px" />
      <Container size="page" pt={{ base: 12, md: 16 }} pb={{ base: 6, md: 8 }} position="relative">
        <Grid templateColumns={{ base: '1fr', sm: '1fr 1fr', lg: '5fr 2fr 3fr 3fr' }} gap={{ base: 10, lg: 8 }}>
          <GridItem>
            <Stack spacing={5} align="flex-start">
              <Logo height="34px" />
              <Text color="bone.300" fontSize="sm" maxW="300px">
                {s.tagline || 'Ridgway, Colorado. Printing since 1985.'} Hand-pulled screen printing, embroidery and festival merch for the mountain circuit.
              </Text>
              <OpenNow />
              <HStack spacing={4} pt={1}>
                {s.instagram && (
                  <ChakraLink href={s.instagram} isExternal aria-label="Fishbone Graphics on Instagram" color="bone.300" _hover={{ color: 'ember.500' }}>
                    <FiInstagram size={20} />
                  </ChakraLink>
                )}
                {s.facebook && (
                  <ChakraLink href={s.facebook} isExternal aria-label="Fishbone Graphics on Facebook" color="bone.300" _hover={{ color: 'ember.500' }}>
                    <FiFacebook size={20} />
                  </ChakraLink>
                )}
              </HStack>
            </Stack>
          </GridItem>

          <GridItem>
            <Stack spacing={2.5}>
              <Text variant="kicker" color="bone.500" mb={1}>Menu</Text>
              {NAV_LINKS.map((l) => <FootLink key={l.to} to={l.to}>{l.label}</FootLink>)}
              <FootLink to="/order/track/">Track an order</FootLink>
            </Stack>
          </GridItem>

          <GridItem>
            <Stack spacing={2.5}>
              <Text variant="kicker" color="bone.500" mb={1}>Hours</Text>
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
              <Text variant="kicker" color="bone.500">Find the shop</Text>
              <Box fontSize="sm" color="bone.300" lineHeight={1.6}>
                <Text color="bone.100">{s.legal_name || s.name}</Text>
                <Text>{s.address1}{s.address2 ? `, ${s.address2}` : ''}</Text>
                <Text>{s.city}, {s.state} {s.zip}</Text>
              </Box>
              <ChakraLink href={`tel:${tel}`} color="bone.100" fontSize="sm" fontFamily="mono" _hover={{ color: 'ember.500' }}>{s.phone}</ChakraLink>
              {s.email && <ChakraLink href={`mailto:${s.email}`} color="bone.300" fontSize="sm" _hover={{ color: 'ember.500' }}>{s.email}</ChakraLink>}
              {directionsUrl(s) && <ChakraLink href={directionsUrl(s)} isExternal fontFamily="mono" fontSize="11px" letterSpacing="0.14em" textTransform="uppercase" color="ember.500" _hover={{ color: 'ember.400' }}>Directions</ChakraLink>}
              {s.plus_code && <Text fontFamily="mono" fontSize="xs" color="bone.600">{s.plus_code}</Text>}
            </Stack>
          </GridItem>
        </Grid>

        <Stack direction={{ base: 'column', md: 'row' }} justify="space-between" align={{ md: 'center' }} spacing={3} mt={{ base: 12, md: 16 }} pt={6} borderTop="1px solid" borderColor="ink.300">
          <HStack spacing={3} color="bone.500" fontSize="xs">
            <RegMark size="12px" />
            <Text>© {year} {s.legal_name || s.name || 'Fishbone Graphics'}. {s.city || 'Ridgway'}, {s.state || 'CO'} {s.zip || '81432'}.</Text>
          </HStack>
          <Text fontFamily="mono" fontSize="11px" color="bone.600" letterSpacing="0.14em" textTransform="uppercase">Printing since {s.founded || 1985}. Hand-pulled in the San Juans.</Text>
        </Stack>
      </Container>

      {/* Ghost wordmark. Cut off at the bottom of the page on purpose. */}
      <Box aria-hidden="true" px={{ base: 5, md: 10 }} mt={{ base: 4, md: 6 }} mb="-2.5vw" overflow="hidden" userSelect="none" pointerEvents="none">
        <Text fontFamily="heading" fontWeight={900} textTransform="uppercase" letterSpacing="-0.03em" lineHeight={0.78} fontSize="clamp(4rem, 15.6vw, 15rem)" color="ink.400" whiteSpace="nowrap">
          Fishbone
        </Text>
      </Box>
    </Box>
  )
}
