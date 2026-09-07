import { useState } from 'react'
import {
  Box, Button, Checkbox, CheckboxGroup, Container, FormControl, FormErrorMessage, FormLabel, Grid, GridItem, Heading, HStack, Input,
  SimpleGrid, Stack, Text, Textarea, Wrap, WrapItem, Alert, AlertIcon, AlertDescription,
} from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import { FiSend, FiCheck } from 'react-icons/fi'
import SEO from '../../components/common/SEO'
import PageHero from '../../components/layout/PageHero'
import ArtworkDropzone from '../../components/common/ArtworkDropzone'
import RegMark from '../../components/brand/RegMark'
import { FadeIn } from '../../components/common/Motion'
import { submitQuote } from '../../lib/api/quotes'

const INTERESTS = [
  ['tees', 'T-shirts'], ['hoodies', 'Hoodies / crewnecks'], ['hats', 'Hats'], ['posters', 'Posters / prints'], ['embroidery', 'Embroidery'],
  ['dtf', 'Full-color / DTF'], ['tote', 'Totes & bags'], ['stickers', 'Stickers'], ['festival_program', 'Full festival merch program'], ['other', 'Something else'],
]

const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(v || '').trim())

export default function Quote() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', event_name: '', event_date: '', quantity_estimate: '', product_interest: [], description: '', artwork_files: [] })
  const [touched, setTouched] = useState(false)
  const [sending, setSending] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState(null)
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e?.target ? e.target.value : e }))

  const errors = {
    name: form.name.trim().length < 2 ? 'Tell us who to talk to.' : null,
    email: !emailOk(form.email) ? 'We need a working email.' : null,
    description: form.description.trim().length < 10 ? 'Give us a sentence or two about the job.' : null,
  }
  const valid = !Object.values(errors).some(Boolean)

  const submit = async (e) => {
    e.preventDefault()
    setTouched(true)
    if (!valid) return
    setSending(true); setError(null)
    try {
      await submitQuote(form)
      setDone(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err) {
      setError(err)
    } finally {
      setSending(false)
    }
  }

  return (
    <>
      <SEO title="Festival & custom merch quote" description="Request a quote for festival merch, tour merch, band shirts, crew hoodies and large custom runs from Fishbone Graphics in Ridgway, Colorado." path="/quote" />
      <PageHero eyebrow="Quote request" title="Big run? Odd job? Tell us." lead="Festival programs, multi-garment merch lines, poster runs, weird substrates. Give us the headcount and the date; we’ll come back with real numbers, usually within a business day." />
      <Container size="page" py={{ base: 10, md: 16 }}>
        {done ? (
          <FadeIn>
            <Box maxW="720px" bg="ink.500" border="1px solid" borderColor="river.500" borderRadius="base" p={{ base: 6, md: 10 }}>
              <HStack spacing={3} mb={4}><Box color="river.500"><FiCheck size={28} /></Box><Text variant="eyebrow" color="river.400">Sent</Text></HStack>
              <Heading size="xl" mb={3}>Got it. We’re on it.</Heading>
              <Text color="bone.300" mb={6}>Your request is in the shop’s inbox. Expect a reply from a printer — not a form letter — within a business day. Rush timeline? Call <Text as="a" href="tel:9706264437" fontFamily="mono" color="bone.100">(970) 626-4437</Text> and say so.</Text>
              <HStack spacing={3}><Button as={RouterLink} to="/shop">Browse blanks</Button><Button as={RouterLink} to="/work" variant="outline">See our work</Button></HStack>
            </Box>
          </FadeIn>
        ) : (
          <Grid templateColumns={{ base: '1fr', lg: '7fr 4fr' }} gap={{ base: 10, lg: 14 }} alignItems="start">
            <GridItem>
              <Box as="form" onSubmit={submit} noValidate bg="ink.500" border="1px solid" borderColor="ink.300" borderRadius="base" p={{ base: 5, md: 8 }}>
                <Stack spacing={7}>
                  {error && <Alert status="error" colorScheme="ember"><AlertIcon /><AlertDescription fontSize="sm">{error.message}</AlertDescription></Alert>}
                  <Box>
                    <Heading as="h2" size="md" mb={4}>You</Heading>
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5}>
                      <FormControl isRequired isInvalid={touched && !!errors.name}><FormLabel htmlFor="q-name">Name</FormLabel><Input id="q-name" autoComplete="name" value={form.name} onChange={set('name')} /><FormErrorMessage>{errors.name}</FormErrorMessage></FormControl>
                      <FormControl><FormLabel htmlFor="q-company">Band / org / business</FormLabel><Input id="q-company" autoComplete="organization" value={form.company} onChange={set('company')} /></FormControl>
                      <FormControl isRequired isInvalid={touched && !!errors.email}><FormLabel htmlFor="q-email">Email</FormLabel><Input id="q-email" type="email" autoComplete="email" value={form.email} onChange={set('email')} /><FormErrorMessage>{errors.email}</FormErrorMessage></FormControl>
                      <FormControl><FormLabel htmlFor="q-phone">Phone</FormLabel><Input id="q-phone" type="tel" autoComplete="tel" value={form.phone} onChange={set('phone')} /></FormControl>
                    </SimpleGrid>
                  </Box>
                  <Box>
                    <Heading as="h2" size="md" mb={4}>The job</Heading>
                    <SimpleGrid columns={{ base: 1, md: 3 }} spacing={5}>
                      <FormControl><FormLabel htmlFor="q-event">Event / project</FormLabel><Input id="q-event" value={form.event_name} onChange={set('event_name')} placeholder="Summer fest, tour, staff shirts…" /></FormControl>
                      <FormControl><FormLabel htmlFor="q-date">In hand by</FormLabel><Input id="q-date" type="date" value={form.event_date} onChange={set('event_date')} fontFamily="mono" /></FormControl>
                      <FormControl><FormLabel htmlFor="q-qty">Rough quantity</FormLabel><Input id="q-qty" type="number" inputMode="numeric" min={1} value={form.quantity_estimate} onChange={set('quantity_estimate')} placeholder="250" fontFamily="mono" /></FormControl>
                    </SimpleGrid>
                    <FormControl mt={5}>
                      <FormLabel as="legend">What are we making?</FormLabel>
                      <CheckboxGroup value={form.product_interest} onChange={(v) => setForm((f) => ({ ...f, product_interest: v }))}>
                        <Wrap spacing={2}>
                          {INTERESTS.map(([k, label]) => {
                            const on = form.product_interest.includes(k)
                            return (
                              <WrapItem key={k}>
                                <Box as="label" display="flex" alignItems="center" gap={2} bg={on ? 'ink.400' : 'ink.900'} border="1px solid" borderColor={on ? 'river.500' : 'ink.300'} borderRadius="base" px={3} py={2} cursor="pointer">
                                  <Checkbox value={k} colorScheme="river" /><Text fontSize="sm">{label}</Text>
                                </Box>
                              </WrapItem>
                            )
                          })}
                        </Wrap>
                      </CheckboxGroup>
                    </FormControl>
                    <FormControl mt={5} isRequired isInvalid={touched && !!errors.description}>
                      <FormLabel htmlFor="q-desc">Details</FormLabel>
                      <Textarea id="q-desc" rows={5} value={form.description} onChange={set('description')} placeholder="Garments, colors, how many print locations, ink colors, sizes if you know them, where it’s going. The more you give us the tighter the number." />
                      <FormErrorMessage>{errors.description}</FormErrorMessage>
                    </FormControl>
                  </Box>
                  <FormControl>
                    <FormLabel>Art (optional)</FormLabel>
                    <ArtworkDropzone id="quote-art" value={form.artwork_files} onChange={(files) => setForm((f) => ({ ...f, artwork_files: files }))} helper="Logos, sketches, napkin drawings — anything helps. Vector is gold." />
                  </FormControl>
                  <HStack justify="flex-end">
                    <Button type="submit" size="lg" isLoading={sending} loadingText="Sending…" rightIcon={<FiSend />}>Send the request</Button>
                  </HStack>
                </Stack>
              </Box>
            </GridItem>
            <GridItem>
              <Stack spacing={6} position={{ lg: 'sticky' }} top={{ lg: '100px' }}>
                <Box bg="ink.500" border="1px solid" borderColor="ink.300" borderRadius="base" p={6}>
                  <Text variant="eyebrow" mb={3}>Festival merch program</Text>
                  <Stack spacing={3} fontSize="sm" color="bone.300">
                    {['Pre-event run plus on-call restocks during the weekend.', 'Mixed garments on one ticket — tees, hoodies, hats, posters.', 'Size curves from forty years of merch tables. We know what sells at altitude.', 'Delivery to the venue gate or the shop, your call.'].map((t) => (
                      <HStack key={t} align="flex-start" spacing={3}><RegMark size="12px" color="#2BB3A3" mt="4px" /><Text>{t}</Text></HStack>
                    ))}
                  </Stack>
                </Box>
                <Box bg="ink.500" border="1px solid" borderColor="ink.300" borderRadius="base" p={6}>
                  <Text variant="eyebrow" mb={3}>Rather just order?</Text>
                  <Text fontSize="sm" color="bone.300" mb={4}>Single garment, known quantity, art in hand? Skip the quote and build it on the product page. You see price breaks live.</Text>
                  <Button as={RouterLink} to="/shop" variant="outline" size="sm">Shop blanks</Button>
                </Box>
              </Stack>
            </GridItem>
          </Grid>
        )}
      </Container>
    </>
  )
}
