// src/components/cart/CartDrawer.jsx
//
// The job ticket, opened. Slides in from the right on any width. Opened by
// the ticket button in the nav, the floating pill and the product page. It
// shows the lines compactly and the same estimate the /cart/ page shows, and
// sends people to /cart/ for per-line editing or straight to /checkout/.
// It never opens itself on add. The pill and the counter do the announcing.

import {
  Box, Button, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, HStack, IconButton, Stack, Text,
} from '@chakra-ui/react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { FiArrowRight, FiX } from 'react-icons/fi'
import useCartStore, { priceLine, selectLineCount } from '../../store/cartStore'
import EstimateSummary from './EstimateSummary'
import ProductImage from '../common/ProductImage'
import { money, locationLabel, methodLabel } from '../../lib/format'
import { useSettings } from '../../hooks/useSettings'
import { palette, alpha } from '../../theme'
import { Z } from '../../theme/layout'

export default function CartDrawer() {
  const navigate = useNavigate()
  const { decorationOptions } = useSettings()
  const isOpen = useCartStore((s) => s.drawerOpen)
  const close = useCartStore((s) => s.closeDrawer)
  const lines = useCartStore((s) => s.lines)
  const removeLine = useCartStore((s) => s.removeLine)
  const count = useCartStore(selectLineCount)

  const go = (path) => { close(); navigate(path) }

  return (
    <Drawer isOpen={isOpen} placement="right" onClose={close} size="sm">
      <DrawerOverlay bg={alpha(palette.ink, 0.7)} sx={{ backdropFilter: 'blur(4px)' }} zIndex={Z.drawer} />
      <DrawerContent bg="ink.900" borderLeft="1px solid" borderColor="ink.300" maxW={{ base: '100%', sm: '440px' }} containerProps={{ zIndex: Z.drawer }}>
        <DrawerCloseButton top="18px" right="18px" color="bone.300" _hover={{ color: 'bone.100', bg: 'ink.400' }} />
        <DrawerHeader pt={5} pb={4} px={6} borderBottom="1px solid" borderColor="ink.300">
          <HStack spacing={3} align="baseline">
            <Text variant="kicker" color="bone.100">Job ticket</Text>
            <Text fontFamily="mono" fontSize="11px" letterSpacing="0.1em" color={count > 0 ? 'hivis.500' : 'bone.500'}>{String(count).padStart(2, '0')}</Text>
          </HStack>
        </DrawerHeader>

        <DrawerBody px={6} py={5}>
          {lines.length === 0 ? (
            <Stack spacing={4} pt={6}>
              <Text fontFamily="heading" fontWeight={800} textTransform="uppercase" fontSize="2xl" lineHeight={1}>Nothing on the ticket yet.</Text>
              <Text color="bone.300" fontSize="sm">Pick a blank, tell us where the ink goes and it shows up here.</Text>
              <Button as={RouterLink} to="/shop/" onClick={close} alignSelf="flex-start" rightIcon={<FiArrowRight />}>Start a run</Button>
            </Stack>
          ) : (
            <Stack spacing={3} as="ul" listStyleType="none" m={0} p={0}>
              {lines.map((l) => {
                const { unit, total } = priceLine(l)
                return (
                  <HStack as="li" key={l.lineId} align="flex-start" spacing={3} pb={3} borderBottom="1px solid" borderColor="ink.300">
                    <Box w="56px" flexShrink={0}>
                      <ProductImage src={l.image} alt={l.name} label={l.brand || l.name} />
                    </Box>
                    <Box flex={1} minW={0}>
                      <Text as={RouterLink} to={`/product/${l.slug}/`} onClick={close} fontFamily="heading" fontWeight={700} textTransform="uppercase" fontSize="md" lineHeight={1.05} display="block" noOfLines={2} _hover={{ color: 'ember.500' }}>{l.name}</Text>
                      <Text fontFamily="mono" fontSize="10px" letterSpacing="0.08em" color="bone.500" mt={1} textTransform="uppercase" noOfLines={1}>
                        {[l.variantLabel, l.decorationMethod && l.decorationMethod !== 'none' ? methodLabel(l.decorationMethod, decorationOptions) : null, ...(l.printLocations || []).map(locationLabel)].filter(Boolean).join(' / ')}
                      </Text>
                      <Text fontFamily="mono" fontSize="12px" color="bone.100" mt={1.5}>
                        {l.quantity} x {money(unit)} <Text as="span" color="bone.500">=</Text> {money(total)}
                      </Text>
                    </Box>
                    <IconButton aria-label={`Remove ${l.name}`} icon={<FiX />} size="sm" variant="ghost" color="bone.500" onClick={() => removeLine(l.lineId)} _hover={{ color: 'ember.500', bg: 'ink.400' }} />
                  </HStack>
                )
              })}
            </Stack>
          )}
        </DrawerBody>

        {lines.length > 0 && (
          <DrawerFooter px={6} py={5} borderTop="1px solid" borderColor="ink.300" display="block">
            <EstimateSummary lines={lines} compact />
            <Stack spacing={2} mt={5}>
              <Button size="lg" w="100%" rightIcon={<FiArrowRight />} onClick={() => go('/checkout/')}>Check out</Button>
              <Button variant="outline" w="100%" onClick={() => go('/cart/')}>Edit the ticket</Button>
            </Stack>
          </DrawerFooter>
        )}
      </DrawerContent>
    </Drawer>
  )
}
