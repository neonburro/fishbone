// src/pages/Quote/index.jsx
//
// Send your art. The bigger form, for a run that needs a proof before it
// needs a price: who you are, what the job is, when, how many, what we are
// making, and the art. On paper, like every ask on the site. Writes a
// quote_requests row with request_type 'quote' and pings the shop.
//
// No oxford commas, no em dashes.

import { useState } from 'react'
import { Alert, AlertDescription, AlertIcon, Box, Button, Checkbox, CheckboxGroup, Container, FormControl, FormErrorMessage, FormLabel, Grid, GridItem, Heading, HStack, Input, Stack, Text, Textarea, Wrap, WrapItem } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import { FiArrowRight } from 'react-icons/fi'
import SEO from '../../components/common/SEO'
import ArtworkDropzone from '../../components/common/ArtworkDropzone'
import { paperField } from '../../components/common/ContactForm'
import { FadeIn } from '../../components/common/Motion'
import { submitQuote } from '../../lib/api/quotes'
import { notifyAdmin } from '../../lib/api/notify'
import { BAND_Y, MEASURE } from '../../theme/layout'

const INTERESTS = [
  ['tees', 'Tees'], ['longsleeves', 'Long sleeves'], ['hoodies', 'Hoodies and crews'], ['tanks', 'Tanks'], ['totes', 'Totes and bandanas'],
  ['posters', 'Posters'], ['festival_program', 'A whole merch line'], ['design', 'Design help'], ['other', 'Something else'],
]

const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(v || '').trim())

const dropzoneOnPaper = {
  '& [role=button], & button[aria-label], & div[aria-label]': { bg: '#FFFFFF', borderColor: 'paper.200', color: 'paper.900' },
  '& button[aria-label]:hover': { borderColor: 'paper.300' },
}

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
    description: form.description.trim().length < 10 && form.artwork_files.length === 0 ? 'A sentence about the job, or the art. Either one.' : null,
  }
  const valid = !Object.values(errors).some(Boolean)

  const submit = async (e) => {
    e.preventDefault(); setTouched(true)
    if (!valid) return
    setSending(true); setError(null)
    try {
      const id = await submitQuote({ ...form, request_type: 'quote' })
      notifyAdmin({ kind: 'quote', request_id: typeof id === 'string' ? id : null, name: form.name, email: form.email, phone: form.phone, description: form.description, files: form.artwork_files.map((f) => f.name), extra: { Org: form.company, Event: form.event_name, 'In hand by': form.event_date, Quantity: form.quantity_estimate, Making: form.product_interest.join(', ') } })
      setDone(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err) { setError(err) } finally { setSending(false) }
  }

  return (
    <>
      <SEO title="Send your art" description="Send Fishbone Graphics your art or your idea and get a proof and a price back. Festival merch, band shirts, brewery tees and crew runs. Ridgway, Colorado." path="/quote/" />
      <Container size="page" pt={{ base: 6, md: 12 }} pb={BAND_Y}>
        <Grid templateColumns={{ base: '1fr', lg: '0.8fr 1.2fr' }} gap={{ base: 8, lg: 12 }} alignItems="start">
          <GridItem>
            <FadeIn>
              <Text as="h1" fontFamily="heading" fontWeight={500} fontSize={{ base: '1.75rem', md: '2.4rem', lg: '3rem' }} lineHeight={1.08} maxW="16ch">
                Send the art. <Box as="strong" fontWeight={700}>Get a proof and a number back.</Box>
              </Text>
              <Text mt={5} color="bone.300" maxW={MEASURE}>Festival lines, tour merch, staff tees, a weird idea on a napkin. Give us the headcount and the date and a printer replies, usually within a business day.</Text>
              <Stack spacing={2} mt={8} maxW="420px">
                {[['Know the blank and the count?', 'Build the run yourself and watch the ticket fill in.', '/shop/', 'Start a run'], ['No art yet, just the idea?', 'That door is over here. The shop draws.', '/design/', 'Share your vision']].map(([h, c, to, label]) => (
                  <Box key={to} p={4} borderRadius="md" border="1px solid" borderColor="ink.300">
                    <Text fontSize="sm" color="bone.100">{h}</Text>
                    <Text fontSize="sm" color="bone.300" mt={0.5}>{c}</Text>
                    <Button as={RouterLink} to={to} variant="link" size="sm" mt={2} rightIcon={<FiArrowRight />}>{label}</Button>
                  </Box>
                ))}
              </Stack>
            </FadeIn>
          </GridItem>

          <GridItem>
            <FadeIn delay={0.08}>
              <Box bg="paper.50" color="paper.900" borderRadius="lg" p={{ base: 5, md: 8 }} boxShadow="paper">
                {done ? (
                  <Stack spacing={3}>
                    <Text variant="kicker" color="red.500">Sent</Text>
                    <Heading as="h2" size="xl" color="paper.900">Got it. We are on it.</Heading>
                    <Text color="paper.500" maxW={MEASURE}>Your request is in the shop. Expect a reply from a printer, not a form letter. On a rush timeline, call (970) 626-4350 and say so.</Text>
                    <HStack spacing={3} pt={2}><Button as={RouterLink} to="/work/" size="sm">See the work</Button></HStack>
                  </Stack>
                ) : (
                  <Box as="form" onSubmit={submit} noValidate>
                    <Text variant="kicker" color="paper.500">Send your art</Text>
                    <Heading as="h2" size="xl" mt={3} mb={6} color="paper.900">The job.</Heading>
                    <Stack spacing={6}>
                      {error && <Alert status="error" colorScheme="red" bg="paper.100" color="paper.900" borderRadius="md"><AlertIcon /><AlertDescription fontSize="sm">{error.message}</AlertDescription></Alert>}
                      <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={5}>
                        <FormControl isRequired isInvalid={touched && !!errors.name}><FormLabel htmlFor="q-name" color="paper.500">Name</FormLabel><Input id="q-name" autoComplete="name" value={form.name} onChange={set('name')} {...paperField} /><FormErrorMessage>{errors.name}</FormErrorMessage></FormControl>
                        <FormControl><FormLabel htmlFor="q-company" color="paper.500">Band, org or business</FormLabel><Input id="q-company" autoComplete="organization" value={form.company} onChange={set('company')} {...paperField} /></FormControl>
                        <FormControl isRequired isInvalid={touched && !!errors.email}><FormLabel htmlFor="q-email" color="paper.500">Email</FormLabel><Input id="q-email" type="email" autoComplete="email" value={form.email} onChange={set('email')} {...paperField} /><FormErrorMessage>{errors.email}</FormErrorMessage></FormControl>
                        <FormControl><FormLabel htmlFor="q-phone" color="paper.500">Phone</FormLabel><Input id="q-phone" type="tel" autoComplete="tel" value={form.phone} onChange={set('phone')} {...paperField} /></FormControl>
                      </Grid>
                      <Grid templateColumns={{ base: '1fr', md: '1.4fr 1fr 1fr' }} gap={5}>
                        <FormControl><FormLabel htmlFor="q-event" color="paper.500">Event or project</FormLabel><Input id="q-event" value={form.event_name} onChange={set('event_name')} placeholder="Summer fest, tour, staff shirts" {...paperField} /></FormControl>
                        <FormControl><FormLabel htmlFor="q-date" color="paper.500">In hand by</FormLabel><Input id="q-date" type="date" value={form.event_date} onChange={set('event_date')} fontFamily="mono" {...paperField} /></FormControl>
                        <FormControl><FormLabel htmlFor="q-qty" color="paper.500">Rough quantity</FormLabel><Input id="q-qty" type="number" inputMode="numeric" min={1} value={form.quantity_estimate} onChange={set('quantity_estimate')} placeholder="250" fontFamily="mono" {...paperField} /></FormControl>
                      </Grid>
                      <FormControl>
                        <FormLabel as="legend" color="paper.500">What are we making</FormLabel>
                        <CheckboxGroup value={form.product_interest} onChange={(v) => setForm((f) => ({ ...f, product_interest: v }))}>
                          <Wrap spacing={2}>
                            {INTERESTS.map(([k, label]) => {
                              const on = form.product_interest.includes(k)
                              return (
                                <WrapItem key={k}>
                                  <Box as="label" display="flex" alignItems="center" gap={2} bg={on ? 'paper.900' : '#FFFFFF'} color={on ? '#FBF8F2' : 'paper.900'} border="1px solid" borderColor={on ? 'paper.900' : 'paper.200'} borderRadius="full" px={3.5} py={1.5} cursor="pointer" fontSize="sm" transition="all 200ms">
                                    <Checkbox value={k} display="none" />{label}
                                  </Box>
                                </WrapItem>
                              )
                            })}
                          </Wrap>
                        </CheckboxGroup>
                      </FormControl>
                      <FormControl isInvalid={touched && !!errors.description}>
                        <FormLabel htmlFor="q-desc" color="paper.500">Details</FormLabel>
                        <Textarea id="q-desc" rows={5} value={form.description} onChange={set('description')} placeholder="Garments, colors, print locations, ink colors, sizes if you know them, where it is going. The more you give us the tighter the number." {...paperField} />
                        <FormErrorMessage>{errors.description}</FormErrorMessage>
                      </FormControl>
                      <Box sx={dropzoneOnPaper}>
                        <ArtworkDropzone id="quote-art" value={form.artwork_files} onChange={(files) => setForm((f) => ({ ...f, artwork_files: files }))} label="Art" helper="Logos, sketches, napkin drawings. Anything helps. Vector is gold." />
                      </Box>
                      <HStack justify="flex-end"><Button type="submit" size="md" isLoading={sending}>Send it</Button></HStack>
                    </Stack>
                  </Box>
                )}
              </Box>
            </FadeIn>
          </GridItem>
        </Grid>
      </Container>
    </>
  )
}
