import { SimpleGrid } from '@chakra-ui/react'
import ProductCard from './ProductCard'
import { Reveal } from '../common/Motion'

export default function ProductGrid({ products = [], columns = { base: 2, md: 3, lg: 4 } }) {
  return (
    <SimpleGrid columns={columns} spacing={{ base: 4, md: 6 }}>
      {products.map((p, i) => (
        <Reveal key={p.id} delay={Math.min(i, 6) * 0.04} h="100%">
          <ProductCard product={p} />
        </Reveal>
      ))}
    </SimpleGrid>
  )
}
