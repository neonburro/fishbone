// src/pages/Shop/index.jsx
import { Box, Heading, LinkBox, LinkOverlay, SimpleGrid, Text, Stack, HStack } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import { FiArrowRight } from 'react-icons/fi'
import SEO from '../../components/common/SEO'
import PageHero from '../../components/layout/PageHero'
import { Section, SectionHeader } from '../../components/common/Section'
import ProductGrid from '../../components/product/ProductGrid'
import ProductImage from '../../components/common/ProductImage'
import { CardSkeleton, LoadError, EmptyState } from '../../components/common/States'
import { Reveal } from '../../components/common/Motion'
import useAsync from '../../hooks/useAsync'
import { getCategories, getProducts } from '../../lib/api/catalog'

export function CategoryCard({ category }) {
  return (
    <LinkBox as="article" bg="ink.500" border="1px solid" borderColor="ink.300" borderRadius="base" overflow="hidden" transition="border-color .2s, transform .2s" _hover={{ borderColor: 'ember.500', transform: 'translateY(-3px)' }} _focusWithin={{ boxShadow: 'outline' }} h="100%">
      <ProductImage src={category.image_url} alt={category.name} label={category.name} ratio={4 / 3} borderRadius="0" />
      <Stack p={5} spacing={1.5}>
        <HStack justify="space-between">
          <Heading as="h3" size="md">
            <LinkOverlay as={RouterLink} to={`/shop/${category.key}/`}>{category.name}</LinkOverlay>
          </Heading>
          <Box color="ember.500"><FiArrowRight /></Box>
        </HStack>
        {category.tagline && <Text color="bone.300" fontSize="sm">{category.tagline}</Text>}
      </Stack>
    </LinkBox>
  )
}

export default function Shop() {
  const cats = useAsync(getCategories, [])
  const shelf = useAsync(() => getProducts({ limit: 12 }), [])

  return (
    <>
      <SEO title="Runs" description="Create a run. Pick a blank, a color and where the ink goes, say how many, and a printer in Ridgway sends the proof and the number back." path="/shop/" />
      <PageHero eyebrow="Runs" title="Create a run." lead="Pick a blank, a color and where the ink goes. Say how many. A printer sends the proof and the number back. No file yet, or just a thought? Share it anyway, the form takes pictures, sketches and opinions." />

      <Section py={{ base: 10, md: 16 }}>
        <SectionHeader eyebrow="Pick a rack" title="What we print on" mb={{ base: 6, md: 8 }} size="xl" />
        {cats.loading ? (
          <CardSkeleton count={3} columns={{ base: 1, sm: 2, lg: 3 }} />
        ) : cats.error ? (
          <LoadError onRetry={cats.reload} error={cats.error} />
        ) : cats.data?.length ? (
          <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} spacing={{ base: 4, md: 6 }}>
            {cats.data.map((c, i) => (
              <Reveal key={c.id} delay={i * 0.04} h="100%"><CategoryCard category={c} /></Reveal>
            ))}
          </SimpleGrid>
        ) : (
          <EmptyState title="The racks are being built." message="Send what you are after and the shop points you at the right blank." ctaLabel="Send your art" ctaTo="/quote/" />
        )}
      </Section>

      <Section bg="ink.500" borderTop="1px solid" borderColor="ink.300" py={{ base: 10, md: 16 }}>
        <SectionHeader eyebrow="On the shelf" title="Blanks we keep" mb={{ base: 6, md: 8 }} size="xl" />
        {shelf.loading ? (
          <CardSkeleton count={3} />
        ) : shelf.error ? (
          <LoadError onRetry={shelf.reload} error={shelf.error} />
        ) : shelf.data?.length ? (
          <ProductGrid products={shelf.data} />
        ) : (
          <EmptyState title="The shelf is being stocked." message="Tell us what you are after and the shop sources the blank." ctaLabel="Send your art" ctaTo="/quote/" />
        )}
      </Section>
    </>
  )
}
