// src/pages/Order/Track.jsx
import { useState } from 'react'
import { Box, Button, Container, FormControl, FormErrorMessage, FormLabel, Grid, GridItem, HStack, Input, Stack, Text } from '@chakra-ui/react'
import { FiSearch } from 'react-icons/fi'
import SEO from '../../components/common/SEO'
import PageHero from '../../components/layout/PageHero'
import { LoadError } from '../../components/common/States'
import JobTicket from '../../components/checkout/JobTicket'
import NextSteps from '../../components/checkout/NextSteps'
import { lookupOrder } from '../../lib/api/orders'
import { FadeIn } from '../../components/common/Motion'

export default function Track() {
  const [number, setNumber] = useState('')
  const [email, setEmail] = useState('')
  const [touched, setTouched] = useState(false)
  const [loading, setLoading] = useState(false)
  const [order, setOrder] = useState(null)
  const [error, setError] = useState(null)
  const [notFound, setNotFound] = useState(false)

  const numOk = /^FB-\d{2}-\d{4,}$/i.test(number.trim())
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())

  const submit = async (e) => {
    e.preventDefault()
    setTouched(true)
    if (!numOk || !emailOk) return
    setLoading(true); setError(null); setNotFound(false); setOrder(null)
    try {
      const o = await lookupOrder(number, email)
      if (o) setOrder(o)
      else setNotFound(true)
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <SEO title="Track an order" description="Look up a Fishbone Graphics order by ticket number and email." path="/order/track/" noIndex />
      <PageHero eyebrow="Track" title="Where’s my job?" lead="Enter the ticket number from your confirmation (looks like FB-26-01001) and the email you ordered with." />
      <Container size="page" py={{ base: 10, md: 16 }}>
        <Box as="form" onSubmit={submit} noValidate bg="ink.500" border="1px solid" borderColor="ink.300" borderRadius="base" p={{ base: 5, md: 7 }} maxW="760px">
          <Stack direction={{ base: 'column', md: 'row' }} spacing={4} align="flex-start">
            <FormControl isInvalid={touched && !numOk}>
              <FormLabel htmlFor="t-number">Ticket number</FormLabel>
              <Input id="t-number" value={number} onChange={(e) => setNumber(e.target.value.toUpperCase())} placeholder="FB-26-01001" fontFamily="mono" autoComplete="off" />
              <FormErrorMessage>Format is FB-YY-NNNNN.</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={touched && !emailOk}>
              <FormLabel htmlFor="t-email">Email</FormLabel>
              <Input id="t-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
              <FormErrorMessage>Enter the email you used at checkout.</FormErrorMessage>
            </FormControl>
            <Button type="submit" mt={{ md: '26px' }} isLoading={loading} leftIcon={<FiSearch />} flexShrink={0} w={{ base: '100%', md: 'auto' }}>Find it</Button>
          </Stack>
        </Box>

        <Box mt={10}>
          {error && <LoadError title="Lookup failed." message={error.message} error={error} />}
          {notFound && (
            <Box bg="ink.500" border="1px solid" borderColor="ember.600" p={5} borderRadius="base" maxW="760px">
              <Text fontFamily="heading" fontWeight={700} textTransform="uppercase" letterSpacing="0.06em" mb={1}>No match.</Text>
              <Text color="bone.300" fontSize="sm">Double-check the ticket number and that the email is the one from your confirmation. Still stuck? Call (970) 626-4437.</Text>
            </Box>
          )}
          {order && (
            <FadeIn>
              <Grid templateColumns={{ base: '1fr', lg: '7fr 4fr' }} gap={{ base: 10, lg: 14 }} alignItems="start">
                <GridItem><JobTicket order={order} /></GridItem>
                <GridItem>
                  <NextSteps status={order.status} fulfillment={order.fulfillment} />
                  {Array.isArray(order.events) && order.events.length > 0 && (
                    <Box mt={8}>
                      <Text variant="eyebrow" mb={3}>Timeline</Text>
                      <Stack spacing={2}>
                        {order.events.map((ev) => (
                          <HStack key={ev.id} align="flex-start" spacing={3} fontSize="sm">
                            <Text fontFamily="mono" fontSize="xs" color="bone.500" flexShrink={0} w="90px">{new Date(ev.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</Text>
                            <Text color="bone.300">{ev.message || ev.type}</Text>
                          </HStack>
                        ))}
                      </Stack>
                    </Box>
                  )}
                </GridItem>
              </Grid>
            </FadeIn>
          )}
        </Box>
      </Container>
    </>
  )
}
