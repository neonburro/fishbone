import { useEffect, useMemo, useState } from 'react'
import {
  Alert, AlertDescription, AlertIcon, AlertTitle, Box, Button, Container, FormControl, FormErrorMessage, FormLabel, Grid, GridItem, Heading, HStack, Input,
  Radio, RadioGroup, Select, SimpleGrid, Stack, Text, Textarea, Divider, Badge,
} from '@chakra-ui/react'
import { Link as RouterLink, Navigate, useNavigate } from 'react-router-dom'
import { FiArrowLeft, FiArrowRight, FiPrinter } from 'react-icons/fi'
import SEO from '../../components/common/SEO'
import PulledRule from '../../components/common/PulledRule'
import RegMark from '../../components/brand/RegMark'
import Stepper from '../../components/checkout/Stepper'
import EstimateSummary from '../../components/cart/EstimateSummary'
import { FadeIn } from '../../components/common/Motion'
import useCartStore from '../../store/cartStore'
import { useSettings } from '../../hooks/useSettings'
import { placeOrder } from '../../lib/api/orders'
import { resolveProvider } from '../../lib/payments'
import { money, locationLabel, methodLabel, sizeBreakdownText, formatDate } from '../../lib/format'
import { priceLine } from '../../store/cartStore'

const STEPS = ['Contact', 'Fulfillment', 'Review', 'Place order']
const US_STATES = ['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY','DC']

const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(v || '').trim())
const phoneOk = (v) => String(v || '').replace(/\D/g, '').length >= 10

const DRAFT_KEY = 'fishbone-checkout-draft'
function loadDraft() {
  try { return JSON.parse(sessionStorage.getItem(DRAFT_KEY) || 'null') } catch { return null }
}

export default function Checkout() {
  const navigate = useNavigate()
  const lines = useCartStore((s) => s.lines)
  const clear = useCartStore((s) => s.clear)
  const { settings, decorationOptions } = useSettings()
  const provider = resolveProvider(settings)
  const shipEnabled = settings?.shipping?.enabled !== false

  const draft = useMemo(loadDraft, [])
  const [step, setStep] = useState(0)
  const [contact, setContact] = useState(draft?.contact || { name: '', email: '', phone: '', company: '' })
  const [fulfillment, setFulfillment] = useState(draft?.fulfillment || 'pickup')
  const [address, setAddress] = useState(draft?.address || { name: '', line1: '', line2: '', city: '', state: 'CO', zip: '' })
  const [neededBy, setNeededBy] = useState(draft?.neededBy || '')
  const [notes, setNotes] = useState(draft?.notes || '')
  const [touched, setTouched] = useState(false)
  const [placing, setPlacing] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    try { sessionStorage.setItem(DRAFT_KEY, JSON.stringify({ contact, fulfillment, address, neededBy, notes })) } catch { /* ignore */ }
  }, [contact, fulfillment, address, neededBy, notes])

  const contactErrors = {
    name: contact.name.trim().length < 2 ? 'We need a name for the ticket.' : null,
    email: !emailOk(contact.email) ? 'Enter a working email — proofs and invoices go there.' : null,
    phone: !phoneOk(contact.phone) ? 'Enter a phone number with area code.' : null,
  }
  const contactValid = !Object.values(contactErrors).some(Boolean)

  const addressErrors = fulfillment === 'ship' ? {
    line1: !address.line1.trim() ? 'Street address required.' : null,
    city: !address.city.trim() ? 'City required.' : null,
    state: !address.state ? 'State required.' : null,
    zip: !/^\d{5}(-\d{4})?$/.test(address.zip.trim()) ? 'Enter a 5-digit ZIP.' : null,
  } : {}
  const fulfillmentValid = !Object.values(addressErrors).some(Boolean)

  const minDate = useMemo(() => {
    const d = new Date(); d.setDate(d.getDate() + 3)
    return d.toISOString().slice(0, 10)
  }, [])

  if (lines.length === 0 && !placing) return <Navigate to="/cart" replace />

  const next = () => {
    setTouched(true)
    if (step === 0 && !contactValid) return
    if (step === 1 && !fulfillmentValid) return
    setTouched(false)
    setStep((s) => Math.min(s + 1, STEPS.length - 1))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  const back = () => { setStep((s) => Math.max(s - 1, 0)); setTouched(false) }

  const buildPayload = () => ({
    contact: { name: contact.name.trim(), email: contact.email.trim().toLowerCase(), phone: contact.phone.trim(), company: contact.company.trim() || null },
    fulfillment,
    shipping_address: fulfillment === 'ship' ? { name: address.name.trim() || contact.name.trim(), line1: address.line1.trim(), line2: address.line2.trim() || null, city: address.city.trim(), state: address.state, zip: address.zip.trim(), country: 'US' } : null,
    needed_by: neededBy || null,
    customer_notes: notes.trim() || null,
    payment_provider: provider.key,
    items: lines.map((l) => ({
      product_id: l.productId,
      variant_id: l.variantId || null,
      quantity: Number(l.quantity),
      decoration_method: l.decorationMethod || 'none',
      print_locations: l.printLocations || [],
      size_breakdown: l.sizeBreakdown || {},
      artwork_files: l.artworkFiles || [],
      notes: l.notes || null,
    })),
  })

  const submit = async () => {
    setError(null)
    setPlacing(true)
    try {
      const result = await placeOrder(buildPayload())
      const outcome = await provider.start(result)
      try {
        sessionStorage.setItem(`fishbone-order-${result.order_number}`, JSON.stringify({ orderNumber: result.order_number, email: contact.email.trim().toLowerCase(), result, contact, fulfillment, lines, placedAt: new Date().toISOString() }))
        sessionStorage.removeItem(DRAFT_KEY)
      } catch { /* storage may be unavailable */ }
      if (outcome?.type === 'redirect' && outcome.url) {
        clear()
        window.location.assign(outcome.url)
        return
      }
      clear()
      navigate(`/order/confirmed/${encodeURIComponent(result.order_number)}`, { replace: true })
    } catch (e) {
      setError(e)
      setPlacing(false)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <Container size="page" py={{ base: 8, md: 14 }}>
      <SEO title="Checkout" noIndex path="/checkout" />
      <FadeIn>
        <HStack spacing={3} mb={3}><RegMark size="14px" color="#FF6A13" /><Text variant="eyebrow">Checkout</Text></HStack>
        <Heading as="h1" size="2xl">Write up the ticket.</Heading>
        <PulledRule mt={4} mb={{ base: 8, md: 10 }} />
      </FadeIn>

      <Grid templateColumns={{ base: '1fr', lg: '7fr 4fr' }} gap={{ base: 8, lg: 12 }} alignItems="start">
        <GridItem>
          <Stepper steps={STEPS} current={step} onJump={(i) => { setStep(i); setTouched(false) }} />

          {error && (
            <Alert status="error" mt={6} colorScheme="ember" alignItems="flex-start">
              <AlertIcon />
              <Box>
                <AlertTitle>Order didn’t go through.</AlertTitle>
                <AlertDescription fontSize="sm">{error.message} Nothing was charged. Try again, or call (970) 626-4437 and we’ll write it up by hand.</AlertDescription>
              </Box>
            </Alert>
          )}

          <Box mt={8} bg="ink.500" border="1px solid" borderColor="ink.300" borderRadius="base" p={{ base: 5, md: 8 }}>
            {step === 0 && (
              <Stack spacing={5} as="form" onSubmit={(e) => { e.preventDefault(); next() }} noValidate>
                <Heading as="h2" size="lg">Who’s this for?</Heading>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5}>
                  <FormControl isRequired isInvalid={touched && !!contactErrors.name}>
                    <FormLabel htmlFor="c-name">Name</FormLabel>
                    <Input id="c-name" autoComplete="name" value={contact.name} onChange={(e) => setContact({ ...contact, name: e.target.value })} />
                    <FormErrorMessage>{contactErrors.name}</FormErrorMessage>
                  </FormControl>
                  <FormControl>
                    <FormLabel htmlFor="c-company">Band / business / crew</FormLabel>
                    <Input id="c-company" autoComplete="organization" value={contact.company} onChange={(e) => setContact({ ...contact, company: e.target.value })} placeholder="Optional" />
                  </FormControl>
                  <FormControl isRequired isInvalid={touched && !!contactErrors.email}>
                    <FormLabel htmlFor="c-email">Email</FormLabel>
                    <Input id="c-email" type="email" autoComplete="email" inputMode="email" value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} />
                    <FormErrorMessage>{contactErrors.email}</FormErrorMessage>
                  </FormControl>
                  <FormControl isRequired isInvalid={touched && !!contactErrors.phone}>
                    <FormLabel htmlFor="c-phone">Phone</FormLabel>
                    <Input id="c-phone" type="tel" autoComplete="tel" inputMode="tel" value={contact.phone} onChange={(e) => setContact({ ...contact, phone: e.target.value })} placeholder="(970) 555-0100" />
                    <FormErrorMessage>{contactErrors.phone}</FormErrorMessage>
                  </FormControl>
                </SimpleGrid>
                <Text fontSize="sm" color="bone.500">Proofs and the invoice go to this email. We call if something on the art needs a decision.</Text>
                <HStack justify="flex-end"><Button type="submit" rightIcon={<FiArrowRight />}>Fulfillment</Button></HStack>
              </Stack>
            )}

            {step === 1 && (
              <Stack spacing={6} as="form" onSubmit={(e) => { e.preventDefault(); next() }} noValidate>
                <Heading as="h2" size="lg">Pick up or ship?</Heading>
                <RadioGroup value={fulfillment} onChange={setFulfillment}>
                  <Stack spacing={3}>
                    <Box as="label" display="flex" gap={3} p={4} bg={fulfillment === 'pickup' ? 'ink.400' : 'ink.900'} border="1px solid" borderColor={fulfillment === 'pickup' ? 'ember.500' : 'ink.300'} borderRadius="base" cursor="pointer">
                      <Radio value="pickup" mt="3px" />
                      <Box>
                        <Text fontWeight={600}>Pick up in Ridgway</Text>
                        <Text fontSize="sm" color="bone.300">Free. We’ll text or call when the job is boxed. {settings?.store?.address1 || 'Ridgway, CO 81432'}.</Text>
                      </Box>
                    </Box>
                    <Box as="label" display="flex" gap={3} p={4} bg={fulfillment === 'ship' ? 'ink.400' : 'ink.900'} border="1px solid" borderColor={fulfillment === 'ship' ? 'ember.500' : 'ink.300'} borderRadius="base" cursor={shipEnabled ? 'pointer' : 'not-allowed'} opacity={shipEnabled ? 1 : 0.5}>
                      <Radio value="ship" mt="3px" isDisabled={!shipEnabled} />
                      <Box>
                        <Text fontWeight={600}>Ship it</Text>
                        <Text fontSize="sm" color="bone.300">
                          {shipEnabled ? (Number(settings?.shipping?.flat_rate) > 0 ? `Flat ${money(settings.shipping.flat_rate)} within the US. ` : 'Shipping quoted on your proof. ') + 'UPS Ground from Ridgway; festival drops to a venue are fine.' : 'Shipping is paused right now — pickup only.'}
                        </Text>
                      </Box>
                    </Box>
                  </Stack>
                </RadioGroup>

                {fulfillment === 'ship' && (
                  <Stack spacing={4} pt={2}>
                    <Heading as="h3" size="sm" color="bone.300">Ship-to address</Heading>
                    <FormControl>
                      <FormLabel htmlFor="a-name">Attention</FormLabel>
                      <Input id="a-name" autoComplete="shipping name" value={address.name} onChange={(e) => setAddress({ ...address, name: e.target.value })} placeholder={contact.name || 'Name on the box'} />
                    </FormControl>
                    <FormControl isRequired isInvalid={touched && !!addressErrors.line1}>
                      <FormLabel htmlFor="a-line1">Street</FormLabel>
                      <Input id="a-line1" autoComplete="shipping address-line1" value={address.line1} onChange={(e) => setAddress({ ...address, line1: e.target.value })} />
                      <FormErrorMessage>{addressErrors.line1}</FormErrorMessage>
                    </FormControl>
                    <FormControl>
                      <FormLabel htmlFor="a-line2">Unit / venue / gate</FormLabel>
                      <Input id="a-line2" autoComplete="shipping address-line2" value={address.line2} onChange={(e) => setAddress({ ...address, line2: e.target.value })} placeholder="Optional" />
                    </FormControl>
                    <SimpleGrid columns={{ base: 1, sm: 3 }} spacing={4}>
                      <FormControl isRequired isInvalid={touched && !!addressErrors.city}>
                        <FormLabel htmlFor="a-city">City</FormLabel>
                        <Input id="a-city" autoComplete="shipping address-level2" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} />
                        <FormErrorMessage>{addressErrors.city}</FormErrorMessage>
                      </FormControl>
                      <FormControl isRequired isInvalid={touched && !!addressErrors.state}>
                        <FormLabel htmlFor="a-state">State</FormLabel>
                        <Select id="a-state" autoComplete="shipping address-level1" value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })}>
                          {US_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                        </Select>
                      </FormControl>
                      <FormControl isRequired isInvalid={touched && !!addressErrors.zip}>
                        <FormLabel htmlFor="a-zip">ZIP</FormLabel>
                        <Input id="a-zip" autoComplete="shipping postal-code" inputMode="numeric" value={address.zip} onChange={(e) => setAddress({ ...address, zip: e.target.value })} />
                        <FormErrorMessage>{addressErrors.zip}</FormErrorMessage>
                      </FormControl>
                    </SimpleGrid>
                  </Stack>
                )}

                <Divider />
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5}>
                  <FormControl>
                    <FormLabel htmlFor="needed">Need it by</FormLabel>
                    <Input id="needed" type="date" min={minDate} value={neededBy} onChange={(e) => setNeededBy(e.target.value)} fontFamily="mono" />
                    <Text fontSize="xs" color="bone.500" mt={1}>Standard turnaround is about {settings?.ordering?.turnaround_days || 10} business days after proof approval. Tight date? Put it here and we’ll tell you straight.</Text>
                  </FormControl>
                  <FormControl>
                    <FormLabel htmlFor="o-notes">Notes for the shop</FormLabel>
                    <Textarea id="o-notes" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Event name, PO number, ink color preferences, who to call." />
                  </FormControl>
                </SimpleGrid>
                <HStack justify="space-between">
                  <Button variant="ghost" onClick={back} leftIcon={<FiArrowLeft />}>Back</Button>
                  <Button type="submit" rightIcon={<FiArrowRight />}>Review</Button>
                </HStack>
              </Stack>
            )}

            {step === 2 && (
              <Stack spacing={6}>
                <Heading as="h2" size="lg">Look it over.</Heading>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                  <ReviewBlock title="Contact" onEdit={() => setStep(0)}>
                    <Text>{contact.name}{contact.company ? ` · ${contact.company}` : ''}</Text>
                    <Text color="bone.300" fontSize="sm">{contact.email}</Text>
                    <Text color="bone.300" fontSize="sm" fontFamily="mono">{contact.phone}</Text>
                  </ReviewBlock>
                  <ReviewBlock title="Fulfillment" onEdit={() => setStep(1)}>
                    {fulfillment === 'pickup' ? (
                      <Text>Pick up at the shop in Ridgway</Text>
                    ) : (
                      <>
                        <Text>Ship to {address.name || contact.name}</Text>
                        <Text color="bone.300" fontSize="sm">{address.line1}{address.line2 ? `, ${address.line2}` : ''}</Text>
                        <Text color="bone.300" fontSize="sm">{address.city}, {address.state} {address.zip}</Text>
                      </>
                    )}
                    {neededBy && <Text fontSize="sm" color="bone.300" mt={1}>Needed by <Text as="span" fontFamily="mono" color="hivis.500">{formatDate(neededBy)}</Text></Text>}
                    {notes && <Text fontSize="sm" color="bone.500" mt={1} noOfLines={2}>“{notes}”</Text>}
                  </ReviewBlock>
                </SimpleGrid>

                <Box>
                  <HStack justify="space-between" mb={3}>
                    <Text variant="eyebrow">Items</Text>
                    <Button as={RouterLink} to="/cart" variant="link" size="sm">Edit items</Button>
                  </HStack>
                  <Stack spacing={3}>
                    {lines.map((l) => {
                      const { unit, total } = priceLine(l)
                      return (
                        <Box key={l.lineId} border="1px solid" borderColor="ink.300" borderRadius="base" p={4} bg="ink.900">
                          <HStack justify="space-between" align="flex-start">
                            <Box>
                              <Text fontFamily="heading" fontWeight={700} textTransform="uppercase">{l.name}</Text>
                              <HStack spacing={2} mt={1} flexWrap="wrap" rowGap={1}>
                                {l.variantLabel && <HStack spacing={1.5}><Box w="12px" h="12px" bg={l.colorHex || '#888'} borderRadius="sm" border="1px solid" borderColor="ink.100" /><Text fontSize="sm" color="bone.300">{l.variantLabel}</Text></HStack>}
                                {l.decorationMethod !== 'none' && <Badge variant="river">{methodLabel(l.decorationMethod, decorationOptions)}</Badge>}
                                {(l.printLocations || []).map((p) => <Badge key={p} variant="outline">{locationLabel(p)}</Badge>)}
                              </HStack>
                              <Text fontFamily="mono" fontSize="xs" color="bone.500" mt={2}>{sizeBreakdownText(l.sizeBreakdown)}</Text>
                              {l.artworkFiles?.length > 0 && <Text fontSize="xs" color="bone.500">{l.artworkFiles.length} art file{l.artworkFiles.length > 1 ? 's' : ''} attached</Text>}
                            </Box>
                            <Box textAlign="right" flexShrink={0}>
                              <Text fontFamily="mono">{money(total)}</Text>
                              <Text fontFamily="mono" fontSize="xs" color="bone.500">{l.quantity} × {money(unit)}</Text>
                            </Box>
                          </HStack>
                        </Box>
                      )
                    })}
                  </Stack>
                </Box>
                <HStack justify="space-between">
                  <Button variant="ghost" onClick={back} leftIcon={<FiArrowLeft />}>Back</Button>
                  <Button onClick={next} rightIcon={<FiArrowRight />}>Place order</Button>
                </HStack>
              </Stack>
            )}

            {step === 3 && (
              <Stack spacing={6}>
                <Heading as="h2" size="lg">Payment</Heading>
                <Box border="1px solid" borderColor="ember.500" bg="ink.400" borderRadius="base" p={5}>
                  <HStack spacing={3} mb={2}><RegMark size="16px" color="#FF6A13" /><Text fontFamily="heading" fontWeight={700} textTransform="uppercase" letterSpacing="0.06em">{provider.label}</Text></HStack>
                  <Text color="bone.300" fontSize="sm">{provider.description}</Text>
                </Box>
                <Text fontSize="sm" color="bone.300">
                  By placing this order you’re asking us to review the art and send a proof. Nothing prints until you approve it. Prices shown are estimates; the proof carries the final number.
                </Text>
                <HStack justify="space-between">
                  <Button variant="ghost" onClick={back} leftIcon={<FiArrowLeft />} isDisabled={placing}>Back</Button>
                  <Button size="lg" onClick={submit} isLoading={placing} loadingText="Writing the ticket…" rightIcon={<FiPrinter />}>Place order</Button>
                </HStack>
              </Stack>
            )}
          </Box>
        </GridItem>

        <GridItem position={{ lg: 'sticky' }} top={{ lg: '100px' }}>
          <Box bg="ink.500" border="1px solid" borderColor="ink.300" borderRadius="base" p={{ base: 5, md: 6 }}>
            <Heading as="h2" size="md" mb={4}>Estimate</Heading>
            <EstimateSummary lines={lines} fulfillment={fulfillment} />
            <Divider my={4} />
            <Text fontSize="xs" color="bone.500">{lines.length} line{lines.length === 1 ? '' : 's'} · {lines.reduce((n, l) => n + Number(l.quantity), 0)} pieces</Text>
          </Box>
        </GridItem>
      </Grid>
    </Container>
  )
}

function ReviewBlock({ title, onEdit, children }) {
  return (
    <Box border="1px solid" borderColor="ink.300" borderRadius="base" p={4} bg="ink.900">
      <HStack justify="space-between" mb={2}>
        <Text variant="eyebrow">{title}</Text>
        <Button variant="link" size="sm" onClick={onEdit}>Edit</Button>
      </HStack>
      <Stack spacing={0.5}>{children}</Stack>
    </Box>
  )
}
