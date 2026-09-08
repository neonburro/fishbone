// src/pages/Product/index.jsx
import { palette } from '../../theme'
import { useEffect, useMemo, useState } from 'react'
import {
  Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Button, Checkbox, CheckboxGroup, Container, Divider, FormControl, FormLabel,
  Grid, GridItem, Heading, HStack, List, ListItem, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField,
  NumberInputStepper, Radio, RadioGroup, Stack, Text, Textarea, Badge, useToast, Wrap, WrapItem, Skeleton, SkeletonText, SimpleGrid,
} from '@chakra-ui/react'
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom'
import SEO from '../../components/common/SEO'
import { LoadError } from '../../components/common/States'
import { FadeIn } from '../../components/common/Motion'
import RegMark from '../../components/brand/RegMark'
import PulledRule from '../../components/common/PulledRule'
import ArtworkDropzone from '../../components/common/ArtworkDropzone'
import Gallery from '../../components/product/Gallery'
import ColorSwatches from '../../components/product/ColorSwatches'
import PriceBreaks from '../../components/product/PriceBreaks'
import SizeGrid from '../../components/product/SizeGrid'
import OrderSummary from '../../components/product/OrderSummary'
import useAsync from '../../hooks/useAsync'
import { useSettings } from '../../hooks/useSettings'
import { getProductBySlug } from '../../lib/api/catalog'
import { publicImageUrl } from '../../lib/api/storage'
import { unitPriceFor, round2, sizeUpcharge } from '../../lib/pricing'
import { locationLabel } from '../../lib/format'
import useCartStore from '../../store/cartStore'
import NotFound from '../NotFound'

const DEFAULT_SIZES = ['S', 'M', 'L', 'XL', '2XL']

function resolveImg(u) {
  if (!u) return null
  return /^https?:\/\//i.test(u) ? u : publicImageUrl('product-images', u)
}

export default function Product() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const { settings } = useSettings()
  const addLine = useCartStore((s) => s.addLine)
  const { data: product, loading, error, reload } = useAsync(() => getProductBySlug(slug), [slug])

  const variants = product?.product_variants || []
  const tiers = product?.pricing_tiers || []
  const sizes = useMemo(() => {
    const s = product?.specs?.sizes
    return Array.isArray(s) && s.length ? s.map(String) : DEFAULT_SIZES
  }, [product])
  const methods = product?.decoration_methods?.length ? product.decoration_methods : []
  const locations = product?.print_locations?.length ? product.print_locations : []
  const minQty = Math.max(1, Number(product?.min_quantity) || 1)

  const [variantId, setVariantId] = useState(null)
  const [method, setMethod] = useState('')
  const [locs, setLocs] = useState([])
  const [qty, setQty] = useState(minQty)
  const [sizeBreakdown, setSizeBreakdown] = useState({})
  const [artwork, setArtwork] = useState([])
  const [notes, setNotes] = useState('')
  const [touched, setTouched] = useState(false)

  // Reset form when product loads / changes
  useEffect(() => {
    if (!product) return
    const firstInStock = variants.find((v) => v.in_stock !== false) || variants[0]
    setVariantId(firstInStock?.id || null)
    setMethod(methods[0] || 'none')
    setLocs(locations.length ? [locations[0]] : [])
    setQty(minQty)
    setSizeBreakdown({})
    setArtwork([])
    setNotes('')
    setTouched(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product?.id])

  const variant = variants.find((v) => v.id === variantId) || null
  const unit = product ? unitPriceFor(product, qty, variant) : 0
  const sizeUp = sizeUpcharge(sizeBreakdown, settings?.pricing)
  const total = round2(unit * qty + sizeUp)
  const sizeTotal = sizes.reduce((n, s) => n + (Number(sizeBreakdown[s]) || 0), 0)
  const sizesOk = sizeTotal === qty && qty > 0
  const qtyOk = qty >= minQty
  const needsLocation = method && method !== 'none' && locations.length > 0
  const locsOk = !needsLocation || locs.length > 0
  const variantOk = variants.length === 0 || !!variant
  const canAdd = qtyOk && sizesOk && locsOk && variantOk

  const autoFill = () => {
    const per = Math.floor(qty / sizes.length)
    let rem = qty - per * sizes.length
    const next = {}
    // weight the middle sizes with the remainder
    const order = [...sizes].sort((a, b) => Math.abs(sizes.indexOf(a) - sizes.length / 2) - Math.abs(sizes.indexOf(b) - sizes.length / 2))
    for (const s of sizes) next[s] = per
    for (const s of order) { if (rem <= 0) break; next[s] += 1; rem -= 1 }
    setSizeBreakdown(next)
  }

  const onAdd = () => {
    setTouched(true)
    if (!canAdd) {
      toast({ title: 'Almost there.', description: !sizesOk ? 'Your size breakdown needs to add up to the quantity.' : !locsOk ? 'Pick at least one print location.' : 'Check the quantity minimum.', status: 'warning' })
      return
    }
    const cleanSizes = Object.fromEntries(Object.entries(sizeBreakdown).filter(([, v]) => Number(v) > 0))
    addLine({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      brand: product.brand,
      styleNumber: product.style_number,
      variantId: variant?.id || null,
      variantLabel: variant?.color_name || null,
      sku: variant?.sku || null,
      colorHex: variant?.color_hex || null,
      quantity: qty,
      sizeBreakdown: cleanSizes,
      decorationMethod: method || 'none',
      printLocations: needsLocation ? locs : [],
      artworkFiles: artwork,
      notes: notes.trim(),
      minQuantity: minQty,
      image: resolveImg(variant?.image_url || product.images?.[0]?.url) || null,
      snapshot: { tiers, basePrice: Number(product.base_price) || 0, priceAdjustment: Number(variant?.price_adjustment) || 0, sizes },
      priceUnit: product.price_unit || 'ea',
      unitPriceSnapshot: unit,
    })
    toast({
      title: 'Added to your order sheet.',
      description: `${qty} × ${product.name}${variant ? ` · ${variant.color_name}` : ''}`,
      status: 'success',
      render: undefined,
    })
    navigate('/cart/')
  }

  if (loading) return <ProductSkeleton />
  if (error) {
    return (
      <Container size="page" py={{ base: 10, md: 16 }}>
        <SEO title="Product" noIndex />
        <LoadError onRetry={reload} error={error} title="Couldn’t load this product." />
      </Container>
    )
  }
  if (!product) return <NotFound title="That product walked off." />

  const images = (product.images || []).map((i) => ({ ...i, url: resolveImg(i.url) }))
  const summaryProps = { unit, qty, total, priceUnit: product.price_unit || 'ea', canAdd, sizesOk, onAdd }
  const seoDesc = product.short_description || `${product.name} decorated by Fishbone Graphics in Ridgway, Colorado. Quantity pricing, custom colors and print locations.`

  return (
    <>
      <SEO title={product.name} description={seoDesc} path={`/product/${product.slug}`} image={images[0]?.url} type="product"
        structuredData={{
          '@context': 'https://schema.org', '@type': 'Product', name: product.name, brand: product.brand ? { '@type': 'Brand', name: product.brand } : undefined,
          sku: product.style_number, description: seoDesc, image: images.map((i) => i.url).filter(Boolean),
          offers: { '@type': 'AggregateOffer', priceCurrency: 'USD', lowPrice: Math.min(...[Number(product.base_price), ...tiers.map((t) => Number(t.unit_price))].filter(Number.isFinite)), highPrice: Math.max(...[Number(product.base_price), ...tiers.map((t) => Number(t.unit_price))].filter(Number.isFinite)), availability: 'https://schema.org/InStock' },
        }}
      />
      <Container size="page" pt={{ base: 5, md: 8 }} pb={{ base: '120px', lg: 24 }}>
        <Breadcrumb separator="/" fontSize="sm" color="bone.500" mb={{ base: 5, md: 8 }} fontFamily="heading" textTransform="uppercase" letterSpacing="0.08em" fontWeight={600} sx={{ ol: { flexWrap: 'wrap' }, li: { whiteSpace: 'nowrap' } }}>
          <BreadcrumbItem><BreadcrumbLink as={RouterLink} to="/shop/" color="bone.300">Shop</BreadcrumbLink></BreadcrumbItem>
          {product.categories?.key && (
            <BreadcrumbItem><BreadcrumbLink as={RouterLink} to={`/shop/${product.categories.key}/`} color="bone.300">{product.categories.name}</BreadcrumbLink></BreadcrumbItem>
          )}
          <BreadcrumbItem isCurrentPage><Text as="span" color="ember.500">{product.name}</Text></BreadcrumbItem>
        </Breadcrumb>

        <Grid templateColumns={{ base: '1fr', lg: '5fr 7fr' }} gap={{ base: 8, lg: 14 }} alignItems="start">
          {/* GALLERY */}
          <GridItem position={{ lg: 'sticky' }} top={{ lg: '96px' }}>
            <FadeIn>
              <Stack spacing={5}>
                <Gallery images={images} variantImage={resolveImg(variant?.image_url)} label={product.brand || product.name} caption={product.style_number} />
                <OrderSummary variant="card" {...summaryProps} />
              </Stack>
            </FadeIn>
          </GridItem>

          {/* CONFIGURATOR */}
          <GridItem>
            <FadeIn delay={0.05}>
              <Stack spacing={7}>
                <Box>
                  <HStack spacing={3} mb={2} flexWrap="wrap">
                    <Text fontFamily="mono" fontSize="sm" color="bone.500" textTransform="uppercase" letterSpacing="0.06em">{[product.brand, product.style_number].filter(Boolean).join(' · ')}</Text>
                    {(product.badges || []).map((b) => <Badge key={b} variant="hivis">{b}</Badge>)}
                  </HStack>
                  <Heading as="h1" size="2xl">{product.name}</Heading>
                  <PulledRule mt={4} />
                  {product.short_description && <Text color="bone.300" mt={4} fontSize="lg">{product.short_description}</Text>}
                </Box>

                {variants.length > 0 && (
                  <ColorSwatches variants={variants} value={variantId} onChange={setVariantId} />
                )}

                {needsLocation && (
                  <FormControl as="fieldset" isInvalid={touched && !locsOk}>
                    <FormLabel as="legend">Where the ink goes</FormLabel>
                    <CheckboxGroup value={locs} onChange={(v) => setLocs(v)}>
                      <Wrap spacing={2}>
                        {locations.map((l) => {
                          const on = locs.includes(l)
                          return (
                            <WrapItem key={l}>
                              <Box as="label" display="flex" alignItems="center" gap={2} bg={on ? 'ink.400' : 'ink.500'} border="1px solid" borderColor={on ? 'red.500' : 'ink.300'} borderRadius="sm" px={3} py={2} cursor="pointer" transition="border-color .15s">
                                <Checkbox value={l} colorScheme="red" />
                                <Text fontSize="sm">{locationLabel(l)}</Text>
                              </Box>
                            </WrapItem>
                          )
                        })}
                      </Wrap>
                    </CheckboxGroup>
                  </FormControl>
                )}

                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} alignItems="start">
                  <FormControl isInvalid={touched && !qtyOk}>
                    <FormLabel htmlFor="qty">Quantity <Text as="span" color="bone.500" fontWeight={400} textTransform="none" letterSpacing={0}>(min {minQty})</Text></FormLabel>
                    <NumberInput id="qty" value={qty} min={minQty} max={100000} step={1} clampValueOnBlur onChange={(_, n) => setQty(Number.isFinite(n) ? n : minQty)} size="lg">
                      <NumberInputField fontFamily="mono" />
                      <NumberInputStepper><NumberIncrementStepper /><NumberDecrementStepper /></NumberInputStepper>
                    </NumberInput>
                    {!qtyOk && <Text fontSize="sm" color="ember.400" mt={1}>Minimum order is {minQty} pieces.</Text>}
                    <HStack mt={3} spacing={2} flexWrap="wrap">
                      {[minQty, 24, 48, 72, 144].filter((n, i, a) => n >= minQty && a.indexOf(n) === i).slice(0, 5).map((n) => (
                        <Button key={n} size="xs" variant={qty === n ? 'ember' : 'outline'} onClick={() => setQty(n)} fontFamily="mono">{n}</Button>
                      ))}
                    </HStack>
                  </FormControl>
                  <Box>
                    <Text fontFamily="heading" fontWeight={600} textTransform="uppercase" letterSpacing="0.08em" fontSize="sm" color="bone.300" mb={1.5}>Price breaks</Text>
                    <PriceBreaks tiers={tiers} basePrice={product.base_price} qty={qty} priceAdjustment={variant?.price_adjustment} unit={product.price_unit || 'ea'} />
                  </Box>
                </SimpleGrid>

                <Box border="1px solid" borderColor={touched && !sizesOk ? 'ember.600' : 'ink.300'} borderRadius="base" p={4} bg="ink.500">
                  <SizeGrid sizes={sizes} value={sizeBreakdown} onChange={setSizeBreakdown} quantity={qty} onAutoFill={autoFill} />
                </Box>

                <FormControl>
                  <FormLabel>Artwork</FormLabel>
                  <ArtworkDropzone value={artwork} onChange={setArtwork} id="pdp-artwork" />
                </FormControl>

                <FormControl>
                  <FormLabel htmlFor="notes">Notes for the shop</FormLabel>
                  <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} placeholder="Ink colors, Pantones, placement notes, event date, anything we should know." />
                </FormControl>

                {(product.features?.length > 0 || product.description) && (
                  <Box>
                    <Divider mb={5} />
                    {product.description && <Text color="bone.300" whiteSpace="pre-line" mb={4}>{product.description}</Text>}
                    {product.features?.length > 0 && (
                      <List spacing={1.5}>
                        {product.features.map((f) => (
                          <ListItem key={f} display="flex" gap={3} alignItems="flex-start" color="bone.300" fontSize="sm">
                            <RegMark size="12px" color={palette.river} mt="4px" /> {f}
                          </ListItem>
                        ))}
                      </List>
                    )}
                    {product.specs && Object.keys(product.specs).filter((k) => k !== 'sizes').length > 0 && (
                      <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={2} mt={4}>
                        {Object.entries(product.specs).filter(([k]) => k !== 'sizes').map(([k, v]) => (
                          <HStack key={k} fontSize="sm" spacing={3} align="baseline">
                            <Text color="bone.500" textTransform="capitalize" minW="90px">{k.replace(/_/g, ' ')}</Text>
                            <Text fontFamily="mono" color="bone.100" fontSize="xs">{Array.isArray(v) ? v.join(', ') : String(v)}</Text>
                          </HStack>
                        ))}
                      </SimpleGrid>
                    )}
                  </Box>
                )}
              </Stack>
            </FadeIn>
          </GridItem>
        </Grid>
      </Container>

      {/* MOBILE FIXED BAR */}
      <OrderSummary variant="bar" {...summaryProps} />
    </>
  )
}

function ProductSkeleton() {
  return (
    <Container size="page" pt={{ base: 5, md: 8 }} pb={24} aria-busy="true">
      <Skeleton h={4} w="200px" mb={8} />
      <Grid templateColumns={{ base: '1fr', lg: '5fr 7fr' }} gap={{ base: 8, lg: 14 }}>
        <GridItem><Skeleton pt="100%" /></GridItem>
        <GridItem>
          <Skeleton h={4} w="140px" mb={3} />
          <Skeleton h={12} w="70%" mb={5} />
          <SkeletonText noOfLines={3} spacing={3} skeletonHeight={3} mb={8} />
          <Skeleton h={10} w="60%" mb={6} />
          <Skeleton h={28} mb={6} />
          <Skeleton h={40} />
        </GridItem>
      </Grid>
    </Container>
  )
}
