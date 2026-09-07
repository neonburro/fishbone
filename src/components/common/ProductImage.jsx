// src/components/common/ProductImage.jsx
import { useState } from 'react'
import { Box, Image } from '@chakra-ui/react'
import Placeholder from './Placeholder'

/** Product image with branded fallback on missing/broken src. */
export default function ProductImage({ src, alt, label, ratio = 1, caption, ...rest }) {
  const [broken, setBroken] = useState(false)
  if (!src || broken) return <Placeholder label={label} ratio={ratio} caption={caption} {...rest} />
  return (
    <Box position="relative" w="100%" pt={`${100 / ratio}%`} bg="ink.400" overflow="hidden" borderRadius="base" {...rest}>
      <Image
        src={src}
        alt={alt || label || ''}
        position="absolute"
        inset={0}
        w="100%"
        h="100%"
        objectFit="cover"
        loading="lazy"
        onError={() => setBroken(true)}
      />
    </Box>
  )
}
