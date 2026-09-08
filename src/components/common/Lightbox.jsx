// src/components/common/Lightbox.jsx
//
// Tap a print and it opens here, big, on a scrim. Tap anywhere and it goes.
// Arrow keys move through the set for people with a keyboard, Escape closes,
// and there is one small Close bottom right for anyone who wants a target.
// No zoom. The photos we have are not big enough to reward it.
//
// No animation library. It mounts with a CSS fade and unmounts at once on
// close, so nothing can ever be left over the page. See MenuSheet.jsx for
// why that matters.
//
// No oxford commas, no em dashes.

import { useCallback, useEffect } from 'react'
import { Box, Text } from '@chakra-ui/react'
import { keyframes } from '@emotion/react'
import { Z } from '../../theme/layout'

const fade = keyframes`from { opacity: 0 } to { opacity: 1 }`
const rise = keyframes`from { opacity: 0; transform: scale(0.97) } to { opacity: 1; transform: scale(1) }`

export default function Lightbox({ items = [], index = -1, onClose, onIndex }) {
  const open = index >= 0 && index < items.length
  const item = open ? items[index] : null

  const go = useCallback((d) => {
    if (!items.length) return
    onIndex?.((index + d + items.length) % items.length)
  }, [index, items.length, onIndex])

  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.()
      if (e.key === 'ArrowRight') go(1)
      if (e.key === 'ArrowLeft') go(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose, go])

  if (!open) return null

  return (
    <Box
      role="dialog"
      aria-modal="true"
      aria-label={item.alt || item.title || 'Print'}
      position="fixed"
      top={0}
      left={0}
      right={0}
      bottom={0}
      zIndex={Z.overlay + 10}
      bg="rgba(10,10,12,0.9)"
      display="flex"
      alignItems="center"
      justifyContent="center"
      cursor="zoom-out"
      onClick={onClose}
      animation={`${fade} 240ms ease-out`}
      sx={{ backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', '@media (prefers-reduced-motion: reduce)': { animation: 'none' } }}
    >
      <Box key={item.id} display="flex" flexDir="column" alignItems="center" gap={3} px={4} animation={`${rise} 320ms cubic-bezier(0.16, 1, 0.3, 1)`} sx={{ '@media (prefers-reduced-motion: reduce)': { animation: 'none' } }}>
        <Box as="img" src={item.src} alt={item.alt || item.title || ''} display="block" maxW="min(94vw, 1400px)" maxH="82vh" objectFit="contain" borderRadius="md" draggable={false} userSelect="none" />
        <Text fontFamily="mono" fontSize="11px" letterSpacing="0.12em" textTransform="uppercase" color="#CFC9BE" textAlign="center">
          {item.client_name || item.title}{item.title && item.client_name ? ` · ${item.title}` : ''}{item.year ? ` · ${item.year}` : ''}
          <Text as="span" color="#6B727C">{'  '}{index + 1} / {items.length}</Text>
        </Text>
      </Box>
      <Text as="button" type="button" onClick={onClose} aria-label="Close" position="absolute" right={{ base: 4, md: 6 }} bottom={{ base: 4, md: 6 }} fontFamily="mono" fontSize="11px" letterSpacing="0.16em" textTransform="uppercase" color="#9AA1AA" _hover={{ color: '#EFEAE0' }}>
        Close
      </Text>
    </Box>
  )
}
