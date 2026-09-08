// src/pages/Cart/index.jsx
import { palette } from '../../theme'
import { Box, Button, Container, Grid, GridItem, Heading, HStack, Stack, Text } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import { FiArrowRight, FiArrowLeft } from 'react-icons/fi'
import SEO from '../../components/common/SEO'
import { EmptyState } from '../../components/common/States'
import PulledRule from '../../components/common/PulledRule'
import RegMark from '../../components/brand/RegMark'
import CartLine from '../../components/cart/CartLine'
import EstimateSummary from '../../components/cart/EstimateSummary'
import useCartStore from '../../store/cartStore'
import { FadeIn } from '../../components/common/Motion'

export default function Cart() {
  const lines = useCartStore((s) => s.lines)
  const updateLine = useCartStore((s) => s.updateLine)
  const removeLine = useCartStore((s) => s.removeLine)
  const clear = useCartStore((s) => s.clear)

  const invalid = lines.filter((l) => Object.values(l.sizeBreakdown || {}).reduce((n, v) => n + (Number(v) || 0), 0) !== l.quantity)

  return (
    <Container size="page" py={{ base: 8, md: 14 }}>
      <SEO title="Your order sheet" noIndex path="/cart/" />
      <FadeIn>
        <HStack spacing={3} mb={3}><RegMark size="14px" color={palette.ember} /><Text variant="eyebrow">Order sheet</Text></HStack>
        <Heading as="h1" size="2xl">What’s going on press.</Heading>
        <PulledRule mt={4} mb={{ base: 8, md: 12 }} />
      </FadeIn>

      {lines.length === 0 ? (
        <EmptyState title="Your order sheet is blank." message="Pick a garment, tell us where the ink goes and it shows up here. Or skip all that and just ask for a quote." ctaLabel="Start a run" ctaTo="/shop/">
          <Button as={RouterLink} to="/quote/" variant="link" mt={4} display="block" mx="auto">Send your art instead</Button>
        </EmptyState>
      ) : (
        <Grid templateColumns={{ base: '1fr', lg: '7fr 4fr' }} gap={{ base: 8, lg: 12 }} alignItems="start">
          <GridItem>
            <Stack spacing={4}>
              {lines.map((l) => (
                <CartLine key={l.lineId} line={l} onUpdate={(patch) => updateLine(l.lineId, patch)} onRemove={() => removeLine(l.lineId)} />
              ))}
            </Stack>
            <HStack mt={6} justify="space-between" flexWrap="wrap" rowGap={3}>
              <Button as={RouterLink} to="/shop/" variant="ghost" leftIcon={<FiArrowLeft />}>Add another product</Button>
              <Button variant="link" color="bone.500" onClick={() => { if (window.confirm('Clear the whole order sheet?')) clear() }}>Clear sheet</Button>
            </HStack>
          </GridItem>
          <GridItem position={{ lg: 'sticky' }} top={{ lg: '100px' }}>
            <Box bg="ink.500" border="1px solid" borderColor="ink.300" borderRadius="base" p={{ base: 5, md: 6 }}>
              <Heading as="h2" size="md" mb={4}>Estimate</Heading>
              <EstimateSummary lines={lines} />
              {invalid.length > 0 && (
                <Text mt={4} fontSize="sm" color="ember.400">
                  {invalid.length === 1 ? 'One line has' : `${invalid.length} lines have`} a size breakdown that doesn’t match the quantity. Fix it before checkout.
                </Text>
              )}
              <Button as={RouterLink} to="/checkout/" size="lg" w="100%" mt={6} rightIcon={<FiArrowRight />} isDisabled={invalid.length > 0} pointerEvents={invalid.length > 0 ? 'none' : undefined}>
                Check out
              </Button>
              <Text fontSize="xs" color="bone.500" mt={3} textAlign="center">No payment collected yet. We proof first, then invoice.</Text>
            </Box>
          </GridItem>
        </Grid>
      )}
    </Container>
  )
}
