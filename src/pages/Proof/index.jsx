// src/pages/Proof/index.jsx
//
// The quote, the customer's side. Opened from the email link at
// /proof/<token>/. A paper card with the job, the number and one button.
// Accepting stamps the run, moves it to awaiting payment, and pings the
// shop. If it was already accepted, or the link expired, it says so
// plainly. Subtle and professional, this is the page a band manager reads
// in a parking lot.
//
// No oxford commas, no em dashes.

import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Box, Button, Container, Divider, FormControl, FormLabel, Grid, GridItem, HStack, Input, Stack, Text } from '@chakra-ui/react'
import SEO from '../../components/common/SEO'
import { FadeIn } from '../../components/common/Motion'
import { paperField } from '../../components/common/ContactForm'
import { getQuoteByToken, acceptQuote } from '../../lib/api/orders'
import { notifyAdmin } from '../../lib/api/notify'
import { money } from '../../lib/format'
import { BAND_Y, MEASURE } from '../../theme/layout'

const dateText = (d) => (d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : null)

export default function Proof() {
  const { token } = useParams()
  const [q, setQ] = useState(null)
  const [state, setState] = useState('loading')
  const [name, setName] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    let alive = true
    getQuoteByToken(token).then((d) => { if (!alive) return; setQ(d); setName(d?.contact?.name || ''); setState(d ? 'ready' : 'missing') }).catch(() => alive && setState('missing'))
    return () => { alive = false }
  }, [token])

  const accept = async () => {
    setBusy(true); setError(null)
    try {
      const r = await acceptQuote(token, name)
      setQ((cur) => ({ ...cur, quote_accepted_at: r.accepted_at, quote_accepted_by: name, status: 'awaiting_payment' }))
      if (!r.already) notifyAdmin({ kind: 'quote_accepted', name: name || q.contact?.name, email: q.contact?.email || '', description: `Accepted quote ${q.order_number} for ${money(q.total)}.`, extra: { Run: q.order_number, Total: money(q.total) } })
    } catch (err) { setError(err) } finally { setBusy(false) }
  }

  if (state === 'loading') return <Container size="page" py={BAND_Y}><Text variant="kicker">Opening your quote</Text></Container>
  if (state === 'missing' || !q) {
    return (
      <Container size="page" py={BAND_Y}>
        <SEO title="Quote" noIndex path={`/proof/${token}/`} />
        <Text variant="kicker" color="red.500">Quote</Text>
        <Text as="h1" fontFamily="heading" fontWeight={500} fontSize={{ base: '1.75rem', md: '2.4rem' }} lineHeight={1.08} mt={3} maxW="20ch">That link did not open a quote.</Text>
        <Text color="bone.300" mt={4} maxW={MEASURE}>It may have been replaced by a newer one. Call the shop at (970) 626-4350 and we will send it again.</Text>
      </Container>
    )
  }

  const accepted = Boolean(q.quote_accepted_at)
  const first = String(q.contact?.name || '').split(/\s+/)[0] || 'there'

  return (
    <>
      <SEO title={`Quote ${q.order_number}`} noIndex path={`/proof/${token}/`} />
      <Container size="page" pt={{ base: 6, md: 12 }} pb={BAND_Y}>
        <Grid templateColumns={{ base: '1fr', lg: '0.8fr 1.2fr' }} gap={{ base: 8, lg: 12 }} alignItems="start">
          <GridItem>
            <FadeIn>
              <Text variant="kicker" color="red.500">Quote · {q.order_number}</Text>
              <Text as="h1" fontFamily="heading" fontWeight={500} fontSize={{ base: '1.75rem', md: '2.4rem', lg: '3rem' }} lineHeight={1.08} mt={3} maxW="16ch">
                {accepted ? <>Thanks, {first}. <Box as="strong" fontWeight={700}>Your run is on the board.</Box></> : <>Here is your quote, {first}. <Box as="strong" fontWeight={700}>Accept it and we book the press.</Box></>}
              </Text>
              <Text color="bone.300" mt={4} maxW={MEASURE}>
                {accepted
                  ? `Accepted ${dateText(q.quote_accepted_at)}${q.quote_accepted_by ? ` by ${q.quote_accepted_by}` : ''}. The invoice comes next. If anything about the job needs a decision, the shop will call.`
                  : `A printer looked at the job and this is the number. It is good until ${dateText(q.quote_expires_at) || 'the shop says otherwise'}. Questions, call (970) 626-4350 or reply to the email.`}
              </Text>
              {q.quote_note && <Text mt={5} color="bone.100" whiteSpace="pre-wrap" maxW={MEASURE} borderLeft="2px solid" borderColor="red.500" pl={4}>{q.quote_note}</Text>}
            </FadeIn>
          </GridItem>

          <GridItem>
            <FadeIn delay={0.08}>
              <Box bg="paper.50" color="paper.900" borderRadius="lg" p={{ base: 5, md: 8 }} boxShadow="paper">
                <HStack justify="space-between" align="baseline" mb={4}>
                  <Text variant="kicker" color="paper.500">Job ticket</Text>
                  <Text fontFamily="mono" fontSize="12px" color="paper.500">{q.order_number}{q.needed_by ? ` · needed by ${dateText(q.needed_by)}` : ''}</Text>
                </HStack>
                <Stack spacing={0} divider={<Divider borderColor="paper.200" />}>
                  {(q.items || []).map((it, i) => {
                    const sizes = it.size_breakdown && typeof it.size_breakdown === 'object' ? Object.entries(it.size_breakdown).filter(([, n]) => Number(n) > 0).map(([s, n]) => `${s} ${n}`).join(' · ') : ''
                    const where = Array.isArray(it.print_locations) && it.print_locations.length ? it.print_locations.join(', ').replace(/_/g, ' ') : ''
                    return (
                      <Grid key={i} templateColumns="1fr auto" gap={4} py={3}>
                        <Box>
                          <Text fontWeight={600}>{it.product_name}{it.variant_label ? ` · ${it.variant_label}` : ''}</Text>
                          <Text fontFamily="mono" fontSize="11px" color="paper.500" mt={0.5}>{[it.quantity ? `${it.quantity} pcs` : null, where, sizes].filter(Boolean).join(' · ')}</Text>
                          {it.notes && <Text fontSize="sm" color="paper.500" mt={1}>{it.notes}</Text>}
                        </Box>
                        <Text fontFamily="mono" fontSize="sm" whiteSpace="nowrap">{money(it.line_total)}</Text>
                      </Grid>
                    )
                  })}
                  {(q.items || []).length === 0 && <Text py={3} fontSize="sm" color="paper.500">The shop will list the garments on the invoice.</Text>}
                </Stack>
                <Stack spacing={1.5} mt={4} pt={4} borderTop="1px solid" borderColor="paper.200" fontSize="sm">
                  <HStack justify="space-between"><Text color="paper.500">Garments and print</Text><Text fontFamily="mono">{money(q.subtotal)}</Text></HStack>
                  {Number(q.setup_fees) > 0 && <HStack justify="space-between"><Text color="paper.500">Screens and setup</Text><Text fontFamily="mono">{money(q.setup_fees)}</Text></HStack>}
                  {Number(q.discount) > 0 && <HStack justify="space-between"><Text color="paper.500">Discount</Text><Text fontFamily="mono">-{money(q.discount)}</Text></HStack>}
                  {Number(q.shipping) > 0 && <HStack justify="space-between"><Text color="paper.500">Shipping</Text><Text fontFamily="mono">{money(q.shipping)}</Text></HStack>}
                  {Number(q.tax) > 0 && <HStack justify="space-between"><Text color="paper.500">Tax</Text><Text fontFamily="mono">{money(q.tax)}</Text></HStack>}
                  <HStack justify="space-between" pt={2}><Text fontFamily="heading" fontWeight={700} textTransform="uppercase" fontSize="lg">Total</Text><Text fontFamily="mono" fontSize="xl" fontWeight={500}>{money(q.total)}</Text></HStack>
                </Stack>

                {accepted ? (
                  <HStack mt={6} spacing={3}>
                    <Box w="8px" h="8px" borderRadius="full" bg="red.500" />
                    <Text fontFamily="mono" fontSize="11px" letterSpacing="0.14em" textTransform="uppercase" color="paper.900">Accepted</Text>
                  </HStack>
                ) : q.expired ? (
                  <Text mt={6} fontSize="sm" color="paper.500">This quote has expired. Call the shop and we will refresh it.</Text>
                ) : (
                  <Stack spacing={3} mt={6}>
                    {error && <Text fontSize="sm" color="red.600">{error.message}</Text>}
                    <FormControl maxW="360px">
                      <FormLabel color="paper.500">Your name</FormLabel>
                      <Input value={name} onChange={(e) => setName(e.target.value)} {...paperField} />
                    </FormControl>
                    <HStack>
                      <Button onClick={accept} isLoading={busy} isDisabled={name.trim().length < 2}>Accept this quote</Button>
                    </HStack>
                    <Text fontSize="xs" color="paper.500" maxW={MEASURE}>Accepting books the run. The shop sends the invoice next, and nothing prints until the proof is approved.</Text>
                  </Stack>
                )}
              </Box>
            </FadeIn>
          </GridItem>
        </Grid>
      </Container>
    </>
  )
}
