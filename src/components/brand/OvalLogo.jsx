// src/components/brand/OvalLogo.jsx
//
// The shop's real logo, the oval with the hand cut skeleton and the lowercase
// wordmark, traced from the only file they have (a 213px white PNG on their
// site) into public/brand-oval.svg. It is drawn here as a CSS mask over a
// box painted in a token color, so it is off white on ink and near black on
// paper with no second asset. The red eye is a separate dot laid over the
// fish's eye, the same var(--fb-red-500) as the nav mark, so both logos share it.
//
// The mask is a plain <img> to the browser, so it stays out of the bundle.
// Width drives everything, the oval's ratio is 213 to 100.
//
// No oxford commas, no em dashes.

import { Box } from '@chakra-ui/react'

const RATIO = 100 / 213

export default function OvalLogo({ w = '160px', color = 'bone.100', eye = true, ...rest }) {
  return (
    <Box position="relative" w={w} display="inline-block" aria-label="Fishbone Graphics" role="img" {...rest}>
      <Box
        w="100%"
        pt={`${RATIO * 100}%`}
        bg={color}
        sx={{
          maskImage: 'url(/brand-oval.svg)',
          WebkitMaskImage: 'url(/brand-oval.svg)',
          maskSize: '100% 100%',
          WebkitMaskSize: '100% 100%',
          maskRepeat: 'no-repeat',
          WebkitMaskRepeat: 'no-repeat',
        }}
      />
      {eye && (
        <Box
          aria-hidden="true"
          position="absolute"
          left="23.1%"
          top="31.8%"
          w="2.7%"
          pt="2.7%"
          transform="translate(-50%, -50%)"
          borderRadius="full"
          bg="red.500"
        />
      )}
    </Box>
  )
}
