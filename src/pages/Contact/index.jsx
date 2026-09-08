// src/pages/Contact/index.jsx
//
// Shop info. Not a contact page. The left column is the shop as a place:
// open right now or not, the address with directions, the phone, the hours
// as the printer typed them. The right column is one paper card, "Send us
// something", because the thing people actually want to do is hand over a
// file and a sentence. It writes a quote_requests row with request_type
// 'contact' and puts the files in the private artwork bucket, so it lands
// in Pulse next to every other request. The form itself is ContactForm and
// the home page shows the same one.
//
// No oxford commas, no em dashes.

import { Box, Container, Grid, GridItem, HStack, Stack, Text, Link as ChakraLink } from '@chakra-ui/react'
import { FiInstagram, FiArrowUpRight } from 'react-icons/fi'
import SEO from '../../components/common/SEO'
import OpenNow from '../../components/common/OpenNow'
import ContactForm from '../../components/common/ContactForm'
import { FadeIn } from '../../components/common/Motion'
import { useSettings } from '../../hooks/useSettings'
import { directionsUrl } from '../../lib/jsonld'
import { hoursDisplay } from '../../lib/hours'
import { MEASURE } from '../../theme/layout'

export default function Contact() {
  const { settings } = useSettings()
  const s = settings?.store || {}
  const tel = (s.phone || '9706264350').replace(/\D/g, '')
  const hours = (Array.isArray(s.hours) ? s.hours : []).map(hoursDisplay)
  return (
    <>
      <SEO
        title="Shop info"
        description="High quality screen printing and merch with graphic design in house. Fishbone Graphics, 250 S Lena St, Ridgway, Colorado. Visits by appointment. Get a quote or send a file."
        path="/contact/"
        structuredData={{ '@context': 'https://schema.org', '@type': 'LocalBusiness', name: s.name, telephone: s.phone, email: s.email, address: { '@type': 'PostalAddress', streetAddress: s.address1, addressLocality: 'Ridgway', addressRegion: 'CO', postalCode: '81432', addressCountry: 'US' } }}
      />
      <Container size="page" pt={{ base: 6, md: 12 }} pb={{ base: 12, md: 20 }}>
        <Grid templateColumns={{ base: '1fr', lg: '1fr 1.15fr' }} gap={{ base: 10, lg: 14 }} alignItems="start">
          {/* THE SHOP */}
          <GridItem>
            <FadeIn>
              <Stack spacing={{ base: 7, md: 9 }}>
                <Text as="h1" fontFamily="heading" fontWeight={500} fontSize={{ base: '1.75rem', md: '2.4rem', lg: '3rem' }} lineHeight={1.08} maxW="20ch">
                  High quality screen printing and merch, <Box as="strong" fontWeight={700}>with graphic design in house.</Box> Multiple colors, any size run, every order estimated up front.
                </Text>
                <Text color="bone.300" fontSize={{ base: 'md', md: 'lg' }} maxW={MEASURE}>
                  Get a quote, send a file or just ask. We are happy to help.
                </Text>

                <Stack spacing={2}>
                  <OpenNow size="md" />
                  <HStack spacing={2.5} align="center">
                    <Box w="7px" h="7px" borderRadius="full" border="1px solid" borderColor="red.500" flexShrink={0} />
                    <Text fontFamily="mono" fontSize="12px" letterSpacing="0.12em" textTransform="uppercase" color="bone.100">
                      Visits by appointment. <Text as="span" color="bone.300">Call or write first and the door is open.</Text>
                    </Text>
                  </HStack>
                </Stack>

                <Grid templateColumns={{ base: '1fr', sm: '1fr 1fr' }} gap={{ base: 6, md: 8 }}>
                  <Stack spacing={1.5} as="address" fontStyle="normal">
                    <Text variant="kicker">The shop</Text>
                    <Text color="bone.100" fontSize="lg" lineHeight={1.3}>{s.address1 || '250 S Lena St'}</Text>
                    <Text color="bone.300">{s.city || 'Ridgway'}, {s.state || 'CO'} {s.zip || '81432'}</Text>
                    {directionsUrl(s) && (
                      <ChakraLink href={directionsUrl(s)} isExternal display="inline-flex" alignItems="center" gap={1} fontFamily="mono" fontSize="11px" letterSpacing="0.14em" textTransform="uppercase" color="bone.100" _hover={{ color: 'red.500', textDecoration: 'none' }} pt={1}>
                        Directions <FiArrowUpRight size={13} />
                      </ChakraLink>
                    )}
                  </Stack>
                  <Stack spacing={1.5}>
                    <Text variant="kicker">Call or write</Text>
                    <ChakraLink href={`tel:${tel}`} fontFamily="mono" fontSize="lg" color="bone.100" _hover={{ color: 'red.500', textDecoration: 'none' }}>{s.phone || '(970) 626-4350'}</ChakraLink>
                    {s.email && <ChakraLink href={`mailto:${s.email}`} color="bone.300" _hover={{ color: 'bone.100', textDecoration: 'none' }}>{s.email}</ChakraLink>}
                    {s.instagram && (
                      <ChakraLink href={s.instagram} isExternal display="inline-flex" alignItems="center" gap={2} color="bone.300" _hover={{ color: 'bone.100', textDecoration: 'none' }} pt={1}>
                        <FiInstagram size={15} />
                        <Text as="span" fontFamily="mono" fontSize="11px" letterSpacing="0.14em" textTransform="uppercase">@fishbonegraphics</Text>
                      </ChakraLink>
                    )}
                  </Stack>
                </Grid>

                <Stack spacing={2}>
                  <Text variant="kicker">Hours</Text>
                  {hours.map((h, i) => (
                    <HStack key={i} justify="space-between" maxW="300px" align="baseline" borderBottom="1px solid" borderColor="ink.300" pb={2}>
                      <Text color="bone.300" fontSize="sm">{h.days}</Text>
                      <Text fontFamily="mono" color="bone.100" fontSize="xs">{h.time}</Text>
                    </HStack>
                  ))}
                  <Text fontSize="xs" color="bone.500" pt={1} maxW={MEASURE}>Festival season runs long. Call ahead for pickups after hours.</Text>
                </Stack>
              </Stack>
            </FadeIn>
          </GridItem>

          {/* PAPER. The same form as the home page. */}
          <GridItem>
            <FadeIn delay={0.08}>
              <ContactForm source="contact" phone={s.phone || '(970) 626-4350'} />
            </FadeIn>
          </GridItem>
        </Grid>
      </Container>
    </>
  )
}
