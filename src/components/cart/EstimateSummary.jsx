// src/components/cart/EstimateSummary.jsx
import { Box, Divider, HStack, Stack, Text } from '@chakra-ui/react'
import { money } from '../../lib/format'
import Price from '../common/Price'
import useEstimate from '../../hooks/useEstimate'

const taxPct = (r) => String(Math.round((r > 1 ? r : r * 100) * 1000) / 1000)

export default function EstimateSummary({ lines, fulfillment = 'pickup', compact = false }) {
  const est = useEstimate(lines, fulfillment)
  const Row = ({ label, value, muted, strong, note }) => (
    <HStack justify="space-between" align="baseline">
      <Box>
        <Text fontSize={strong ? 'md' : 'sm'} color={muted ? 'bone.500' : 'bone.300'} fontFamily={strong ? 'heading' : undefined} textTransform={strong ? 'uppercase' : undefined} letterSpacing={strong ? '0.08em' : undefined} fontWeight={strong ? 700 : 400}>{label}</Text>
        {note && <Text fontSize="xs" color="bone.600">{note}</Text>}
      </Box>
      <Text fontFamily="mono" fontSize={strong ? 'xl' : 'sm'} color={strong ? 'bone.100' : 'bone.100'} fontWeight={strong ? 500 : 400}>{value}</Text>
    </HStack>
  )
  return (
    <Stack spacing={compact ? 2 : 3}>
      <Row label="Garments" value={<Price value={est.subtotal} />} />
      <Row label="Setup / screens" value={est.setup.total > 0 ? money(est.setup.total) : 'Quoted on proof'} note={Object.values(est.setup.byMethod).map((m) => m.name).join(', ') || undefined} />
      {fulfillment === 'ship' && <Row label="Shipping" value={est.shipping > 0 ? money(est.shipping) : 'Quoted'} />}
      <Row label={est.taxRate > 0 ? `Tax (${taxPct(est.taxRate)}%)` : 'Tax'} value={est.taxRate > 0 ? money(est.tax) : 'Calculated on invoice'} muted={est.taxRate === 0} />
      <Divider />
      <Row label="Estimated total" value={<Price value={est.total} />} strong />
      <Text fontSize="xs" color="bone.600">This is an estimate. We confirm every price on your proof before anything gets printed or charged.</Text>
    </Stack>
  )
}
