import { Box, Container, SimpleGrid, Stack, Text, Link as ChakraLink, HStack, Divider } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import { FiInstagram, FiFacebook, FiPhone, FiMail, FiMapPin } from 'react-icons/fi'
import Logo from '../brand/Logo'
import Halftone from '../brand/Halftone'
import RegMark from '../brand/RegMark'
import { useSettings } from '../../hooks/useSettings'

const FootLink = ({ to, children }) => (
  <ChakraLink as={RouterLink} to={to} color="bone.300" _hover={{ color: 'ember.500', textDecoration: 'none' }} fontSize="sm">
    {children}
  </ChakraLink>
)

export default function Footer() {
  const { settings } = useSettings()
  const s = settings?.store || {}
  const tel = (s.phone || '').replace(/\D/g, '')
  const year = new Date().getFullYear()
  const hours = Array.isArray(s.hours) ? s.hours : []

  return (
    <Box as="footer" bg="ink.500" borderTop="1px solid" borderColor="ink.300" position="relative" overflow="hidden" mt="auto">
      <Halftone fade="top" color="rgba(242,237,228,0.05)" size={12} dot={1.4} h="120px" />
      <Container size="page" py={{ base: 12, md: 16 }} position="relative">
        <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing={{ base: 10, lg: 8 }}>
          <Stack spacing={4}>
            <Logo height="34px" />
            <Text color="bone.300" fontSize="sm" maxW="280px">
              Hand-pulled screen printing, embroidery and festival merch out of Ridgway, Colorado. Since 1985.
            </Text>
            <HStack spacing={3} pt={1}>
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

          <Stack spacing={2.5}>
            <Text variant="eyebrow" mb={1}>Shop</Text>
            <FootLink to="/shop">All products</FootLink>
            <FootLink to="/services">Services</FootLink>
            <FootLink to="/work">Our work</FootLink>
            <FootLink to="/quote">Festival &amp; custom quotes</FootLink>
            <FootLink to="/order/track">Track an order</FootLink>
          </Stack>

          <Stack spacing={2.5}>
            <Text variant="eyebrow" mb={1}>Shop hours</Text>
            {hours.map((h, i) => (
              <HStack key={i} justify="space-between" maxW="260px" fontSize="sm">
                <Text color="bone.300">{h.days}</Text>
                <Text fontFamily="mono" color="bone.100" fontSize="xs">{h.close ? `${h.open} – ${h.close}` : h.open}</Text>
              </HStack>
            ))}
            <Text fontSize="xs" color="bone.500" pt={1}>Festival season runs long. Call ahead for pickups after hours.</Text>
          </Stack>

          <Stack spacing={3} as="address" fontStyle="normal">
            <Text variant="eyebrow" mb={0}>Find us</Text>
            <HStack align="flex-start" spacing={3}>
              <Box color="ember.500" pt="3px"><FiMapPin /></Box>
              <ChakraLink href={s.map_url} isExternal color="bone.300" fontSize="sm" _hover={{ color: 'ember.500' }}>
                {s.address1}{s.address1?.includes(s.city) ? '' : <><br />{s.city}, {s.state} {s.zip}</>}
              </ChakraLink>
            </HStack>
            <HStack spacing={3}>
              <Box color="ember.500"><FiPhone /></Box>
              <ChakraLink href={`tel:${tel}`} color="bone.300" fontSize="sm" fontFamily="mono" _hover={{ color: 'ember.500' }}>{s.phone}</ChakraLink>
            </HStack>
            {s.email && (
              <HStack spacing={3}>
                <Box color="ember.500"><FiMail /></Box>
                <ChakraLink href={`mailto:${s.email}`} color="bone.300" fontSize="sm" _hover={{ color: 'ember.500' }}>{s.email}</ChakraLink>
              </HStack>
            )}
          </Stack>
        </SimpleGrid>

        <Divider my={{ base: 8, md: 10 }} />
        <Stack direction={{ base: 'column', md: 'row' }} justify="space-between" align={{ md: 'center' }} spacing={3}>
          <HStack spacing={3} color="bone.500" fontSize="xs">
            <RegMark size="12px" />
            <Text>© {year} {s.name || 'Fishbone Graphics & Screen Printing'}. Ridgway, CO 81432.</Text>
          </HStack>
          <Text fontFamily="mono" fontSize="xs" color="bone.600" letterSpacing="0.05em">PRINTING SINCE 1985 · HAND-PULLED IN THE SAN JUANS</Text>
        </Stack>
      </Container>
    </Box>
  )
}
