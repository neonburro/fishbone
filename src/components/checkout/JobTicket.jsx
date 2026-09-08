// src/components/checkout/JobTicket.jsx
import { palette } from '../../theme'
import { Box, Divider, Grid, GridItem, Heading, HStack, Stack, Text, Badge } from '@chakra-ui/react'
import RegMark from '../brand/RegMark'
import { money, locationLabel, methodLabel, formatDate } from '../../lib/format'
import { useSettings } from '../../hooks/useSettings'

const STATUS_LABEL = {
  pending_review: 'Pending review',
  quoted: 'Quoted',
  awaiting_payment: 'Awaiting payment',
  paid: 'Paid',
  in_production: 'In production',
  ready_for_pickup: 'Ready for pickup',
  shipped: 'Shipped',
  completed: 'Completed',
  cancelled: 'Cancelled',
}

/**
 * Job-ticket style receipt.
 * order: shape from lookup_order (order json w/ items) OR a local stash
 *   { order_number, status, payment_status, contact, fulfillment, shipping_address, subtotal, setup_fees, discount, shipping, tax, total,
 *     needed_by, created_at, customer_notes, items:[{product_name, variant_label, sku, quantity, unit_price, line_total, decoration_method, print_locations, size_breakdown, artwork_files, notes}] }
 */
export default function JobTicket({ order }) {
  const { decorationOptions } = useSettings()
  if (!order) return null
  const items = order.items || order.order_items || []
  const contact = order.contact || {}
  const status = order.status || 'pending_review'

  return (
    <Box bg="bone.100" color="ink.900" borderRadius="base" overflow="hidden" position="relative" boxShadow="raised" className="job-ticket">
      {/* header */}
      <Box px={{ base: 5, md: 8 }} pt={{ base: 5, md: 7 }} pb={4} borderBottom="2px solid" borderColor="ink.900" position="relative">
        <HStack justify="space-between" align="flex-start" flexWrap="wrap" rowGap={3}>
          <Box>
            <HStack spacing={2} mb={1}><RegMark size="14px" color={palette.ink} /><Text fontFamily="heading" fontWeight={700} textTransform="uppercase" letterSpacing="0.14em" fontSize="xs" color="bone.800">Job ticket</Text></HStack>
            <Text fontFamily="mono" fontSize={{ base: '2xl', md: '3xl' }} fontWeight={500} letterSpacing="0.02em" lineHeight={1}>{order.order_number}</Text>
          </Box>
          <Stack spacing={1} align={{ base: 'flex-start', sm: 'flex-end' }} fontSize="sm">
            <Badge bg="ink.900" color="bone.100" fontSize="0.7rem">{STATUS_LABEL[status] || status}</Badge>
            <Text fontFamily="mono" fontSize="xs" color="bone.800">Placed {formatDate(order.created_at || new Date().toISOString(), { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })}</Text>
            {order.payment_status && <Text fontFamily="mono" fontSize="xs" color="bone.800">Payment: {String(order.payment_status).replace(/_/g, ' ')}</Text>}
          </Stack>
        </HStack>
      </Box>

      {/* meta */}
      <Grid templateColumns={{ base: '1fr', sm: '1fr 1fr 1fr' }} gap={0} borderBottom="1px dashed" borderColor="bone.600" fontSize="sm">
        <Cell label="Customer">
          <Text fontWeight={600}>{contact.name}</Text>
          {contact.company && <Text color="bone.800">{contact.company}</Text>}
          <Text color="bone.800" wordBreak="break-all">{contact.email}</Text>
          {contact.phone && <Text color="bone.800" fontFamily="mono" fontSize="xs">{contact.phone}</Text>}
        </Cell>
        <Cell label="Fulfillment">
          <Text fontWeight={600} textTransform="capitalize">{order.fulfillment === 'ship' ? 'Ship' : 'Pick up in Ridgway'}</Text>
          {order.fulfillment === 'ship' && order.shipping_address && (
            <Text color="bone.800" fontSize="xs">
              {order.shipping_address.name && <>{order.shipping_address.name}<br /></>}
              {order.shipping_address.line1}{order.shipping_address.line2 ? `, ${order.shipping_address.line2}` : ''}<br />
              {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.zip}
            </Text>
          )}
        </Cell>
        <Cell label="Needed by" last>
          <Text fontFamily="mono" fontWeight={500}>{order.needed_by ? formatDate(order.needed_by) : 'Standard turnaround'}</Text>
          {order.customer_notes && <Text color="bone.800" fontSize="xs" mt={1} noOfLines={3}>“{order.customer_notes}”</Text>}
        </Cell>
      </Grid>

      {/* items */}
      <Box px={{ base: 5, md: 8 }} py={5}>
        <Text fontFamily="heading" fontWeight={700} textTransform="uppercase" letterSpacing="0.14em" fontSize="xs" color="bone.800" mb={3}>Items</Text>
        <Stack spacing={4} divider={<Divider borderColor="bone.400" />}>
          {items.map((it, i) => (
            <Grid key={it.id || i} templateColumns={{ base: '1fr', md: '1fr auto' }} gap={3}>
              <GridItem>
                <HStack spacing={2} align="baseline" flexWrap="wrap">
                  <Text fontFamily="heading" fontWeight={700} textTransform="uppercase" fontSize="lg" lineHeight={1}>{it.product_name || it.name}</Text>
                  {it.variant_label && <Text color="bone.800" fontSize="sm">{it.variant_label}</Text>}
                  {it.sku && <Text fontFamily="mono" fontSize="xs" color="bone.700">{it.sku}</Text>}
                </HStack>
                <HStack spacing={3} mt={1.5} fontSize="xs" color="bone.800" flexWrap="wrap" rowGap={1}>
                  {it.decoration_method && it.decoration_method !== 'none' && <Text>{methodLabel(it.decoration_method, decorationOptions)}</Text>}
                  {(it.print_locations || []).length > 0 && <Text>· {(it.print_locations || []).map(locationLabel).join(', ')}</Text>}
                </HStack>
                <SizeRow breakdown={it.size_breakdown} />
                {it.artwork_files?.length > 0 && <Text fontSize="xs" color="bone.800" mt={1}>Art: {it.artwork_files.map((f) => f.name).join(', ')}</Text>}
                {it.notes && <Text fontSize="xs" color="bone.800" mt={1}>Note: {it.notes}</Text>}
              </GridItem>
              <GridItem textAlign={{ md: 'right' }} fontFamily="mono">
                <Text fontWeight={500}>{money(it.line_total ?? Number(it.unit_price) * Number(it.quantity))}</Text>
                <Text fontSize="xs" color="bone.800">{it.quantity} × {money(it.unit_price)}</Text>
              </GridItem>
            </Grid>
          ))}
          {items.length === 0 && <Text color="bone.800" fontSize="sm">Line items will appear here once the order syncs.</Text>}
        </Stack>
      </Box>

      {/* totals */}
      <Box px={{ base: 5, md: 8 }} py={5} bg="paper.100" borderTop="1px dashed" borderColor="bone.600">
        <Stack spacing={1.5} maxW="360px" ml="auto" fontFamily="mono" fontSize="sm">
          <TotalRow label="Garments" value={money(order.subtotal)} />
          <TotalRow label="Setup / screens" value={money(order.setup_fees)} />
          {Number(order.discount) > 0 && <TotalRow label="Discount" value={`−${money(order.discount)}`} />}
          {(order.fulfillment === 'ship' || Number(order.shipping) > 0) && <TotalRow label="Shipping" value={Number(order.shipping) > 0 ? money(order.shipping) : 'TBD'} />}
          <TotalRow label="Tax" value={Number(order.tax) > 0 ? money(order.tax) : 'On invoice'} />
          <Divider borderColor="ink.900" my={1} />
          <HStack justify="space-between" align="baseline">
            <Text fontFamily="heading" fontWeight={800} textTransform="uppercase" letterSpacing="0.08em">Total</Text>
            <Text fontSize="2xl" fontWeight={500}>{money(order.total)}</Text>
          </HStack>
          <Text fontFamily="body" fontSize="xs" color="bone.800">Estimate until your proof is approved. Nothing has been charged.</Text>
        </Stack>
      </Box>
      <Box px={{ base: 5, md: 8 }} py={3} bg="ink.900" color="bone.300" fontFamily="mono" fontSize="xs" display="flex" justifyContent="space-between" flexWrap="wrap" gap={2}>
        <span>FISHBONE GRAPHICS · RIDGWAY, CO 81432</span>
        <span>(970) 626-4437</span>
      </Box>
    </Box>
  )
}

function Cell({ label, children, last }) {
  return (
    <Box px={{ base: 5, md: 8 }} py={4} borderRight={{ sm: last ? 'none' : '1px dashed' }} borderColor="bone.600" borderBottom={{ base: last ? 'none' : '1px dashed', sm: 'none' }}>
      <Text fontFamily="heading" fontWeight={700} textTransform="uppercase" letterSpacing="0.14em" fontSize="xs" color="bone.800" mb={1}>{label}</Text>
      {children}
    </Box>
  )
}

function TotalRow({ label, value }) {
  return (
    <HStack justify="space-between"><Text color="bone.800">{label}</Text><Text>{value}</Text></HStack>
  )
}

function SizeRow({ breakdown }) {
  const entries = Object.entries(breakdown || {}).filter(([, q]) => Number(q) > 0)
  if (!entries.length) return null
  return (
    <HStack mt={2} spacing={0} flexWrap="wrap" border="1px solid" borderColor="bone.500" borderRadius="sm" display="inline-flex" overflow="hidden">
      {entries.map(([s, q]) => (
        <Box key={s} px={2.5} py={1} borderRight="1px solid" borderColor="bone.500" _last={{ borderRight: 'none' }} textAlign="center" minW="44px">
          <Text fontFamily="heading" fontWeight={700} fontSize="xs" letterSpacing="0.06em" color="bone.800">{s}</Text>
          <Text fontFamily="mono" fontSize="sm" fontWeight={500}>{q}</Text>
        </Box>
      ))}
    </HStack>
  )
}
