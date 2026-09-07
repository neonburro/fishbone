import { Box, Table, Tbody, Td, Th, Thead, Tr, Text } from '@chakra-ui/react'
import { money } from '../../lib/format'
import { tierFor } from '../../lib/pricing'

export default function PriceBreaks({ tiers = [], basePrice, qty, priceAdjustment = 0, unit = 'ea' }) {
  const active = tierFor(tiers, qty)
  const adj = Number(priceAdjustment) || 0
  if (!tiers.length) {
    return (
      <Text fontFamily="mono" fontSize="sm" color="bone.300">
        Flat {money(Number(basePrice) + adj)} / {unit}. Ask about volume pricing on larger runs.
      </Text>
    )
  }
  return (
    <Box border="1px solid" borderColor="ink.300" borderRadius="base" overflow="hidden">
      <Table variant="ticket" size="sm">
        <Thead>
          <Tr>
            <Th>Quantity</Th>
            <Th isNumeric>Unit price</Th>
          </Tr>
        </Thead>
        <Tbody>
          {tiers.map((t) => {
            const isActive = active?.id === t.id
            const range = t.max_qty == null ? `${t.min_qty}+` : `${t.min_qty} – ${t.max_qty}`
            return (
              <Tr key={t.id} bg={isActive ? 'rgba(255,106,19,0.10)' : undefined} aria-current={isActive ? 'true' : undefined}>
                <Td color={isActive ? 'ember.400' : 'bone.300'} fontWeight={isActive ? 500 : 400}>
                  {isActive && <Text as="span" mr={2} aria-hidden="true">▸</Text>}
                  {range}
                </Td>
                <Td isNumeric color={isActive ? 'bone.100' : 'bone.300'} fontWeight={isActive ? 500 : 400}>
                  {money(Number(t.unit_price) + adj)}
                </Td>
              </Tr>
            )
          })}
        </Tbody>
      </Table>
      {adj !== 0 && (
        <Text fontSize="xs" color="bone.500" px={3} py={2} borderTop="1px solid" borderColor="ink.300">
          Includes {adj > 0 ? '+' : '−'}{money(Math.abs(adj))} for this color.
        </Text>
      )}
    </Box>
  )
}
