import { useEffect, useState } from 'react'
import { Box, HStack, Image } from '@chakra-ui/react'
import ProductImage from '../common/ProductImage'

export default function Gallery({ images = [], variantImage, label, caption }) {
  const list = [...(variantImage ? [{ url: variantImage, alt: `${label} — selected color` }] : []), ...images.filter((i) => i?.url)]
  const [idx, setIdx] = useState(0)
  useEffect(() => { setIdx(0) }, [variantImage])
  const current = list[idx] || list[0]

  return (
    <Box>
      <ProductImage src={current?.url} alt={current?.alt || label} label={label} caption={caption} ratio={1} border="1px solid" borderColor="ink.300" />
      {list.length > 1 && (
        <HStack mt={3} spacing={2} overflowX="auto" py={1} role="list" aria-label="Product images">
          {list.map((img, i) => (
            <Box
              key={`${img.url}-${i}`}
              as="button"
              type="button"
              role="listitem"
              aria-label={`View image ${i + 1}`}
              aria-current={i === idx ? 'true' : undefined}
              onClick={() => setIdx(i)}
              w="64px"
              h="64px"
              flexShrink={0}
              borderRadius="base"
              overflow="hidden"
              border="2px solid"
              borderColor={i === idx ? 'ember.500' : 'ink.300'}
              bg="ink.400"
              _focusVisible={{ boxShadow: 'outline' }}
            >
              <Image src={img.url} alt="" w="100%" h="100%" objectFit="cover" />
            </Box>
          ))}
        </HStack>
      )}
    </Box>
  )
}
