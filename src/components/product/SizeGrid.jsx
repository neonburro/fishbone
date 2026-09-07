// src/components/product/SizeGrid.jsx
import { Box, FormLabel, HStack, Input, SimpleGrid, Text, Button } from '@chakra-ui/react'

/**
 * Size breakdown grid. value: {S: 0, M: 0 ...}; total must equal quantity.
 */
export default function SizeGrid({ sizes = [], value = {}, onChange, quantity = 0, onAutoFill }) {
  const total = sizes.reduce((n, s) => n + (Number(value[s]) || 0), 0)
  const remaining = (Number(quantity) || 0) - total
  const ok = remaining === 0 && total > 0

  const set = (size, raw) => {
    const n = Math.max(0, parseInt(raw, 10) || 0)
    onChange?.({ ...value, [size]: n })
  }

  return (
    <Box>
      <HStack justify="space-between" mb={2} align="baseline" flexWrap="wrap" rowGap={1}>
        <Text as="span" fontFamily="heading" fontWeight={600} textTransform="uppercase" letterSpacing="0.08em" fontSize="sm" color="bone.300">Size breakdown</Text>
        <Text fontFamily="mono" fontSize="sm" color={ok ? 'river.400' : remaining < 0 ? 'ember.400' : 'bone.300'} role="status" aria-live="polite">
          {ok ? `${total} of ${quantity} assigned ✓` : remaining < 0 ? `${Math.abs(remaining)} over, remove some` : `${remaining} of ${quantity} left to assign`}
        </Text>
      </HStack>
      <SimpleGrid columns={{ base: 4, sm: 6, md: Math.min(Math.max(sizes.length, 4), 8) }} spacing={2}>
        {sizes.map((s) => (
          <Box key={s}>
            <FormLabel htmlFor={`size-${s}`} fontSize="xs" mb={1} textAlign="center" color="bone.500">{s}</FormLabel>
            <Input
              id={`size-${s}`}
              type="number"
              inputMode="numeric"
              min={0}
              value={value[s] ?? ''}
              placeholder="0"
              onChange={(e) => set(s, e.target.value)}
              onFocus={(e) => e.target.select()}
              textAlign="center"
              fontFamily="mono"
              size="md"
              px={1}
              borderColor={Number(value[s]) > 0 ? 'river.500' : undefined}
            />
          </Box>
        ))}
      </SimpleGrid>
      {onAutoFill && sizes.length > 0 && !ok && (
        <Button variant="link" size="sm" mt={2} onClick={onAutoFill}>Split {quantity} evenly across sizes</Button>
      )}
    </Box>
  )
}
