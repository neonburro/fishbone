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
  const featured = useAsync(() => getProducts({ featured: true, limit: 8 }), [])

  return (
    <>
      <SEO title="Shop" description="Blank tees, hoodies, hats and more, decorated in Ridgway, Colorado. Pick a garment, choose print locations, upload art and order online." path="/shop/" />
      <PageHero eyebrow="Shop" title="Blanks worth printing on." lead="We stock what holds ink and survives a festival weekend. Every product page shows quantity price breaks up front. No login, no haggling." />

      <Section py={{ base: 10, md: 16 }}>
        <SectionHeader eyebrow="Browse by" title="Categories" mb={{ base: 6, md: 8 }} size="xl" />
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
          <EmptyState title="Categories are being set up." message="Check back shortly or send a quote request and we’ll point you at the right blank." ctaLabel="Request a quote" ctaTo="/quote/" />
        )}
      </Section>

      <Section bg="ink.500" borderTop="1px solid" borderColor="ink.300" py={{ base: 10, md: 16 }}>
        <SectionHeader eyebrow="Shop favorites" title="Featured" mb={{ base: 6, md: 8 }} size="xl" />
        {featured.loading ? (
          <CardSkeleton count={4} />
        ) : featured.error ? (
          <LoadError onRetry={featured.reload} error={featured.error} />
        ) : featured.data?.length ? (
          <ProductGrid products={featured.data} />
        ) : (
          <EmptyState title="Nothing featured yet." message="Pick a category above to see everything we carry." />
        )}
      </Section>
    </>
  )
}
