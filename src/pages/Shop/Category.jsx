// src/pages/Shop/Category.jsx
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, Text } from '@chakra-ui/react'
import { Link as RouterLink, useParams } from 'react-router-dom'
import SEO from '../../components/common/SEO'
import PageHero from '../../components/layout/PageHero'
import { Section } from '../../components/common/Section'
import ProductGrid from '../../components/product/ProductGrid'
import { CardSkeleton, LoadError, EmptyState } from '../../components/common/States'
import useAsync from '../../hooks/useAsync'
import { getCategory, getProducts } from '../../lib/api/catalog'
import NotFound from '../NotFound'

export default function Category() {
  const { categoryKey } = useParams()
  const cat = useAsync(() => getCategory(categoryKey), [categoryKey])
  const products = useAsync(() => getProducts({ categoryKey }), [categoryKey])

  if (!cat.loading && !cat.error && cat.data === null) return <NotFound title="No such category." />

  const name = cat.data?.name || categoryKey.replace(/[-_]/g, ' ')

  return (
    <>
      <SEO title={cat.data?.name || 'Shop'} description={cat.data?.description || cat.data?.tagline || `Shop ${name} from Fishbone Graphics in Ridgway, Colorado.`} path={`/shop/${categoryKey}`} />
      <PageHero eyebrow={
        <Breadcrumb fontFamily="heading" fontWeight={700} textTransform="uppercase" letterSpacing="0.12em" fontSize="sm" color="ember.500" separator="/">
          <BreadcrumbItem><BreadcrumbLink as={RouterLink} to="/shop/" color="ember.500">Shop</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbItem isCurrentPage><Text as="span" color="bone.300">{name}</Text></BreadcrumbItem>
        </Breadcrumb>
      } title={name} lead={cat.data?.description || cat.data?.tagline} />

      <Section py={{ base: 10, md: 16 }}>
        {products.loading ? (
          <CardSkeleton count={8} />
        ) : products.error ? (
          <LoadError onRetry={products.reload} error={products.error} />
        ) : products.data?.length ? (
          <>
            <Text variant="mono" mb={5}>{products.data.length} {products.data.length === 1 ? 'product' : 'products'}</Text>
            <ProductGrid products={products.data} />
          </>
        ) : (
          <EmptyState title="Nothing in this rack yet." message="We can still get it. Tell us what you’re after and we’ll source the blank." ctaLabel="Request a quote" ctaTo="/quote/" />
        )}
      </Section>
    </>
  )
}
