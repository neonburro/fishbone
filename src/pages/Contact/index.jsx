import { useState } from 'react'
import { Alert, AlertDescription, AlertIcon, Box, Button, FormControl, FormErrorMessage, FormLabel, Grid, GridItem, Heading, HStack, Input, SimpleGrid, Stack, Text, Textarea, Link as ChakraLink } from '@chakra-ui/react'
import { FiPhone, FiMail, FiMapPin, FiInstagram, FiFacebook, FiSend, FiCheck, FiClock } from 'react-icons/fi'
import SEO from '../../components/common/SEO'
import PageHero from '../../components/layout/PageHero'
import { Section } from '../../components/common/Section'
import { useSettings } from '../../hooks/useSettings'
import { submitQuote } from '../../lib/api/quotes'

const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(v || '').trim())

export default function Contact() {
  const { settings } = useSettings()
  const s = settings?.store || {}
  const tel = (s.phone || '9706264437').replace(/\D/g, '')
  const [form, setForm] = useState({ name: '', email: '', phone: '', description: '' })
  const [touched, setTouched] = useState(false)
  const [sending, setSending] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState(null)
  const errors = { name: form.name.trim().length < 2 ? 'Your name, please.' : null, email: !emailOk(form.email) ? 'Need a working email to reply.' : null, description: form.description.trim().length < 5 ? 'Say a little more.' : null }
  const valid = !Object.values(errors).some(Boolean)
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault(); setTouched(true)
    if (!valid) return
    setSending(true); setError(null)
    try {
      await submitQuote({ ...form, product_interest: ['contact'], artwork_files: [] })
      setDone(true)
    } catch (err) { setError(err) } finally { setSending(false) }
  }

  const hours = Array.isArray(s.hours) ? s.hours : []

  return (
    <>
      <SEO title="Contact" description="Call, email or stop by Fishbone Graphics in Ridgway, Colorado. Shop hours, address and a quick message form." path="/contact"
        structuredData={{ '@context': 'https://schema.org', '@type': 'LocalBusiness', name: s.name, telephone: s.phone, email: s.email, address: { '@type': 'PostalAddress', addressLocality: 'Ridgway', addressRegion: 'CO', postalCode: '81432', addressCountry: 'US' } }} />
      <PageHero eyebrow="Contact" title="Call, write, or swing by." lead="We’re a working shop — if the phone rings out we’re at the press. Leave a message and we call back the same day." />
      <Section py={{ base: 10, md: 16 }}>
        <Grid templateColumns={{ base: '1fr', lg: '2fr 3fr' }} gap={{ base: 10, lg: 16 }} alignItems="start">
          <GridItem>
            <Stack spacing={8}>
              <Stack spacing={4} as="address" fontStyle="normal">
                <Row icon={<FiPhone />} label="Phone"><ChakraLink href={`tel:${tel}`} fontFamily="mono" fontSize="lg" color="bone.100">{s.phone}</ChakraLink></Row>
                {s.email && <Row icon={<FiMail />} label="Email"><ChakraLink href={`mailto:${s.email}`} color="bone.100">{s.email}</ChakraLink></Row>}
                <Row icon={<FiMapPin />} label="Shop">
                  <Text color="bone.100">{s.address1}{s.address1?.includes('Ridgway') ? '' : <><br />{s.city}, {s.state} {s.zip}</>}</Text>
                  {s.map_url && <ChakraLink href={s.map_url} isExternal fontSize="sm">Open in maps</ChakraLink>}
                </Row>
                <Row icon={<FiClock />} label="Hours">
                  <Stack spacing={0.5}>
                    {hours.map((h, i) => <HStack key={i} justify="space-between" maxW="260px" fontSize="sm"><Text color="bone.300">{h.days}</Text><Text fontFamily="mono" fontSize="xs">{h.close ? `${h.open} – ${h.close}` : h.open}</Text></HStack>)}
                  </Stack>
                </Row>
              </Stack>
              <HStack spacing={3}>
                {s.instagram && <Button as="a" href={s.instagram} target="_blank" rel="noopener noreferrer" variant="outline" size="sm" leftIcon={<FiInstagram />}>@fishbonegraphics</Button>}
                {s.facebook && <Button as="a" href={s.facebook} target="_blank" rel="noopener noreferrer" variant="ghost" size="sm" leftIcon={<FiFacebook />}>Facebook</Button>}
              </HStack>
            </Stack>
          </GridItem>
          <GridItem>
            {done ? (
              <Box bg="ink.500" border="1px solid" borderColor="river.500" borderRadius="base" p={{ base: 6, md: 8 }}>
                <HStack spacing={3} mb={3}><Box color="river.500"><FiCheck size={24} /></Box><Heading size="lg">Message sent.</Heading></HStack>
                <Text color="bone.300">We’ll get back to you today or first thing tomorrow. If it’s urgent, call {s.phone}.</Text>
              </Box>
            ) : (
              <Box as="form" onSubmit={submit} noValidate bg="ink.500" border="1px solid" borderColor="ink.300" borderRadius="base" p={{ base: 5, md: 8 }}>
                <Heading as="h2" size="md" mb={5}>Send a quick note</Heading>
                <Stack spacing={5}>
                  {error && <Alert status="error" colorScheme="ember"><AlertIcon /><AlertDescription fontSize="sm">{error.message}</AlertDescription></Alert>}
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5}>
                    <FormControl isRequired isInvalid={touched && !!errors.name}><FormLabel htmlFor="ct-name">Name</FormLabel><Input id="ct-name" autoComplete="name" value={form.name} onChange={set('name')} /><FormErrorMessage>{errors.name}</FormErrorMessage></FormControl>
                    <FormControl><FormLabel htmlFor="ct-phone">Phone</FormLabel><Input id="ct-phone" type="tel" autoComplete="tel" value={form.phone} onChange={set('phone')} /></FormControl>
                  </SimpleGrid>
                  <FormControl isRequired isInvalid={touched && !!errors.email}><FormLabel htmlFor="ct-email">Email</FormLabel><Input id="ct-email" type="email" autoComplete="email" value={form.email} onChange={set('email')} /><FormErrorMessage>{errors.email}</FormErrorMessage></FormControl>
                  <FormControl isRequired isInvalid={touched && !!errors.description}><FormLabel htmlFor="ct-msg">Message</FormLabel><Textarea id="ct-msg" rows={5} value={form.description} onChange={set('description')} placeholder="What can we help with?" /><FormErrorMessage>{errors.description}</FormErrorMessage></FormControl>
                  <HStack justify="flex-end"><Button type="submit" isLoading={sending} rightIcon={<FiSend />}>Send</Button></HStack>
                </Stack>
              </Box>
            )}
          </GridItem>
        </Grid>
      </Section>
    </>
  )
}

function Row({ icon, label, children }) {
  return (
    <HStack align="flex-start" spacing={4}>
      <Box color="ember.500" pt="3px" flexShrink={0}>{icon}</Box>
      <Box>
        <Text variant="eyebrow" fontSize="xs" mb={0.5} color="bone.500">{label}</Text>
        {children}
      </Box>
    </HStack>
  )
}
