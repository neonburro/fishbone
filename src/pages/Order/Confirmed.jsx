import { useEffect, useMemo, useState } from 'react'
import { Box, Button, Container, Grid, GridItem, Heading, HStack, Stack, Text, Input, FormControl, FormLabel, FormErrorMessage } from '@chakra-ui/react'
import { Link as RouterLink, useParams, useSearchParams } from 'react-router-dom'
import { FiPrinter, FiArrowRight } from 'react-icons/fi'
import SEO from '../../components/common/SEO'
import RegMark from '../../components/brand/RegMark'
import PulledRule from '../../components/common/PulledRule'
import { FadeIn } from '../../components/common/Motion'
import { BlockSkeleton, LoadError } from '../../components/common/States'
import JobTicket from '../../components/checkout/JobTicket'
import NextSteps from '../../components/checkout/NextSteps'
import { lookupOrder } from '../../lib/api/orders'

function readStash(orderNumber) {
  try { return JSON.parse(sessionStorage.getItem(`fishbone-order-${orderNumber}`) || 'null') } catch { return null }
}

/** Build a local ticket from the checkout stash so the page is useful even before lookup_order returns. */
function localOrder(stash) {
  if (!stash) return null
  const r = stash.result || {}
  return {
    order_number: stash.orderNumber,
    status: 'pending_review',
    payment_status: 'unpaid',
    contact: stash.contact,
    fulfillment: stash.fulfillment,
    created_at: stash.placedAt,
    subtotal: r.subtotal,
    setup_fees: r.setup_fees,
    shipping: r.shipping,
    tax: r.tax,
    total: r.total,
    items: (stash.lines || []).map((l) => ({
      id: l.lineId,
      product_name: l.name,
      variant_label: l.variantLabel,
      sku: l.sku,
      quantity: l.quantity,
      unit_price: l.unitPriceSnapshot,
      line_total: Number(l.unitPriceSnapshot) * Number(l.quantity),
      decoration_method: l.decorationMethod,
      print_locations: l.printLocations,
      size_breakdown: l.sizeBreakdown,
      artwork_files: l.artworkFiles,
      notes: l.notes,
    })),
  }
}

export default function OrderConfirmed() {
  const { orderNumber } = useParams()
  const [params] = useSearchParams()
  const stash = useMemo(() => readStash(orderNumber), [orderNumber])
  const [email, setEmail] = useState(stash?.email || '')
  const [order, setOrder] = useState(localOrder(stash))
  const [loading, setLoading] = useState(!!stash?.email)
  const [error, setError] = useState(null)
  const [touched, setTouched] = useState(false)

  const fetchOrder = async (em) => {
    setLoading(true); setError(null)
    try {
      const o = await lookupOrder(orderNumber, em)
      if (o) setOrder(o)
      else if (!order) setError(new Error('No order matched that number and email.'))
    } catch (e) {
      if (!order) setError(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (stash?.email) fetchOrder(stash.email)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderNumber])

  const paidFlag = params.get('paid') === '1'

  return (
    <Container size="page" py={{ base: 8, md: 14 }}>
      <SEO title={`Order ${orderNumber}`} noIndex path={`/order/confirmed/${orderNumber}`} />
      <FadeIn>
        <HStack spacing={3} mb={3}><RegMark size="14px" color="#C6F135" /><Text variant="eyebrow" color="hivis.500">Order received</Text></HStack>
        <Heading as="h1" size="2xl">It’s on the board.</Heading>
        <PulledRule mt={4} mb={4} />
        <Text color="bone.300" fontSize="lg" maxW="640px">
          Ticket <Text as="span" fontFamily="mono" color="bone.100">{orderNumber}</Text> is in the queue. A confirmation went to{' '}
          <Text as="span" color="bone.100">{email || 'your email'}</Text>. {paidFlag ? 'Payment received — thanks.' : 'A real person will look it over and send a proof before anything prints.'}
        </Text>
      </FadeIn>

      <Grid templateColumns={{ base: '1fr', lg: '7fr 4fr' }} gap={{ base: 10, lg: 14 }} mt={{ base: 8, md: 12 }} alignItems="start">
        <GridItem>
          {order ? (
            <FadeIn delay={0.05}>
              <JobTicket order={order} />
              {loading && <Text fontSize="xs" color="bone.500" mt={2} fontFamily="mono">Syncing with the shop…</Text>}
            </FadeIn>
          ) : loading ? (
            <BlockSkeleton lines={10} />
          ) : error ? (
            <Stack spacing={5}>
              <LoadError title="We can’t pull up this ticket." message={error.message} error={error} />
              <Box bg="ink.500" border="1px solid" borderColor="ink.300" p={5} borderRadius="base" as="form" onSubmit={(e) => { e.preventDefault(); setTouched(true); if (email) fetchOrder(email) }}>
                <FormControl isInvalid={touched && !email}>
                  <FormLabel htmlFor="conf-email">Email used on the order</FormLabel>
                  <HStack align="flex-start">
                    <Input id="conf-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <Button type="submit" flexShrink={0}>Look up</Button>
                  </HStack>
                  <FormErrorMessage>Enter the email you used at checkout.</FormErrorMessage>
                </FormControl>
              </Box>
            </Stack>
          ) : (
            <Box bg="ink.500" border="1px solid" borderColor="ink.300" p={5} borderRadius="base" as="form" onSubmit={(e) => { e.preventDefault(); setTouched(true); if (email) fetchOrder(email) }}>
              <Text color="bone.300" mb={4}>Enter the email from your order to see the full ticket.</Text>
              <FormControl isInvalid={touched && !email}>
                <FormLabel htmlFor="conf-email">Email</FormLabel>
                <HStack align="flex-start">
                  <Input id="conf-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                  <Button type="submit" flexShrink={0}>Look up</Button>
                </HStack>
                <FormErrorMessage>Enter the email you used at checkout.</FormErrorMessage>
              </FormControl>
            </Box>
          )}
          <HStack mt={6} spacing={3} flexWrap="wrap">
            <Button variant="outline" size="sm" leftIcon={<FiPrinter />} onClick={() => window.print()}>Print ticket</Button>
            <Button as={RouterLink} to="/shop" variant="ghost" size="sm" rightIcon={<FiArrowRight />}>Keep shopping</Button>
          </HStack>
        </GridItem>
        <GridItem>
          <FadeIn delay={0.1}>
            <NextSteps status={order?.status} fulfillment={order?.fulfillment} />
            <Box mt={8} p={5} bg="ink.500" border="1px solid" borderColor="ink.300" borderRadius="base">
              <Text variant="eyebrow" mb={2}>Questions?</Text>
              <Text fontSize="sm" color="bone.300">Call <Text as="a" href="tel:9706264437" fontFamily="mono" color="bone.100">(970) 626-4437</Text> with your ticket number, or reply to the confirmation email. You can also <Text as={RouterLink} to="/order/track" color="ember.500">track the order</Text> any time.</Text>
            </Box>
          </FadeIn>
        </GridItem>
      </Grid>
    </Container>
  )
}
