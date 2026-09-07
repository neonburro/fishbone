import { Box, Text, HStack, Badge, LinkBox, LinkOverlay, Stack } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import ProductImage from '../common/ProductImage'
import { money } from '../../lib/format'

export default function ProductCard({ product }) {
  const img = product.images?.[0]
  const badges = Array.isArray(product.badges) ? product.badges.slice(0, 2) : []
  return (
    <LinkBox
      as="article"
      bg="ink.500"
      border="1px solid"
      borderColor="ink.300"
      borderRadius="base"
      overflow="hidden"
      transition="transform .2s ease, border-color .2s ease"
      _hover={{ transform: 'translateY(-3px)', borderColor: 'bone.700' }}
      _focusWithin={{ boxShadow: 'outline' }}
      h="100%"
      display="flex"
      flexDir="column"
    >
      <Box position="relative">
        <ProductImage src={img?.url} alt={img?.alt || product.name} label={product.brand || product.name} caption={product.style_number} borderRadius="0" />
        {badges.length > 0 && (
          <HStack position="absolute" top={2} left={2} spacing={1.5}>
            {badges.map((b) => (
              <Badge key={b} variant={/new|hot|festival/i.test(b) ? 'hivis' : 'ember'}>{b}</Badge>
            ))}
          </HStack>
        )}
      </Box>
      <Stack p={{ base: 3, md: 4 }} spacing={1.5} flex={1}>
        <HStack justify="space-between" align="baseline">
          <Text fontFamily="mono" fontSize="xs" color="bone.500" textTransform="uppercase" letterSpacing="0.06em" noOfLines={1}>
            {[product.brand, product.style_number].filter(Boolean).join(' · ')}
          </Text>
          {product.categories?.name && <Text fontSize="xs" color="bone.600" noOfLines={1}>{product.categories.name}</Text>}
        </HStack>
        <LinkOverlay as={RouterLink} to={`/product/${product.slug}`}>
          <Text fontFamily="heading" fontWeight={700} textTransform="uppercase" fontSize={{ base: 'md', md: 'lg' }} lineHeight={1.1} letterSpacing="0.01em" color="bone.100">
            {product.name}
          </Text>
        </LinkOverlay>
        {product.short_description && <Text fontSize="sm" color="bone.300" noOfLines={2} display={{ base: 'none', md: 'block' }}>{product.short_description}</Text>}
        <HStack justify="space-between" pt={2} mt="auto" align="baseline">
          <Text fontFamily="mono" color="bone.100" fontSize={{ base: 'sm', md: 'md' }}>
            <Text as="span" color="bone.500" fontSize="xs" mr={1}>from</Text>
            {money(product.base_price)}
            <Text as="span" color="bone.500" fontSize="xs">/{product.price_unit || 'ea'}</Text>
          </Text>
          {product.min_quantity > 1 && <Text fontSize="xs" color="bone.500" fontFamily="mono">min {product.min_quantity}</Text>}
        </HStack>
      </Stack>
    </LinkBox>
  )
}
