// src/components/product/OrderSummary.jsx
import { Box, Button, Divider, HStack, Stack, Text } from '@chakra-ui/react'
import { FiArrowRight, FiCheck } from 'react-icons/fi'
import Price from '../common/Price'

/**
 * Sticky order summary for the PDP.
 * variant="card": desktop, lives in the left column under the gallery (column is sticky).
 * variant="bar": mobile, fixed to the viewport bottom; the page adds matching bottom padding
 *                    so the bar never covers the last controls.
 */
export default function OrderSummary({ variant = 'card', unit, qty, total, priceUnit = 'ea', canAdd, sizesOk, onAdd }) {
  if (variant === 'bar') {
    return (
      <Box position="fixed" left={0} right={0} bottom={0} zIndex={50} bg="rgba(20,20,22,0.97)" backdropFilter="blur(8px)" borderTop="1px solid" borderColor="ink.300" px={5} py={3} display={{ base: 'block', lg: 'none' }} role="region" aria-label="Order summary">
        <HStack justify="space-between" spacing={4}>
          <Box>
            <Text fontFamily="mono" fontSize="lg" lineHeight={1.1}><Price value={total} /></Text>
            <Text fontFamily="mono" fontSize="xs" color="bone.500">{qty} × <Price value={unit} short suffix={`/${priceUnit}`} /></Text>
          </Box>
          <Button size="md" onClick={onAdd} rightIcon={canAdd ? <FiCheck /> : <FiArrowRight />} opacity={canAdd ? 1 : 0.75} flexShrink={0}>
            Add to order
          </Button>
        </HStack>
      </Box>
    )
  }
  return (
    <Box bg="ink.500" border="1px solid" borderColor="ink.300" borderRadius="base" p={5} display={{ base: 'none', lg: 'block' }} role="region" aria-label="Order summary">
      <Text variant="eyebrow" mb={3}>Your line</Text>
      <Stack spacing={2} fontSize="sm">
        <HStack justify="space-between"><Text color="bone.300">Unit price</Text><Text fontFamily="mono"><Price value={unit} short suffix={`/${priceUnit}`} /></Text></HStack>
        <HStack justify="space-between"><Text color="bone.300">Quantity</Text><Text fontFamily="mono">{qty}</Text></HStack>
        <Divider my={1} />
        <HStack justify="space-between" align="baseline">
          <Text fontFamily="heading" fontWeight={700} textTransform="uppercase" letterSpacing="0.08em">Line total</Text>
          <Text fontFamily="mono" fontSize="2xl" fontWeight={500}><Price value={total} /></Text>
        </HStack>
      </Stack>
      <Button size="lg" w="100%" mt={5} onClick={onAdd} rightIcon={canAdd ? <FiCheck /> : <FiArrowRight />} opacity={canAdd ? 1 : 0.75}>
        Add to order
      </Button>
      <Text fontSize="xs" color={sizesOk ? 'bone.600' : 'bone.500'} mt={3} textAlign="center">
        {sizesOk ? 'Estimate. Tax and shipping added at review; final price confirmed on your proof.' : 'Assign sizes to match the quantity to continue.'}
      </Text>
    </Box>
  )
}
