// src/components/cart/JobTicketPill.jsx
//
// The job ticket. Bottom right, every page, only while there is something on
// it. Mono line count and estimate. It slides up on the first add, bumps once
// on every add after that (keyed on lastAdded.at, so a second add of the
// same thing still bumps) and flashes what just went on. Tap opens the drawer.
//
// It does not show when the drawer is open, on /cart/ or /checkout/, where
// the ticket is already the whole page. The nav's ticket button is the quiet
// always-there echo of this for when the sheet is empty.

import { useEffect, useState } from 'react'
import { Box, HStack, Text } from '@chakra-ui/react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import useCartStore, { selectLineCount } from '../../store/cartStore'
import useEstimate from '../../hooks/useEstimate'
import { money } from '../../lib/format'
import { palette, alpha } from '../../theme'
import { RAIL_PX, EASE, EASE_ARR, Z } from '../../theme/layout'

const MotionBox = motion(Box)
const FLASH_MS = 2200

export default function JobTicketPill() {
  const { pathname } = useLocation()
  const reduce = useReducedMotion()
  const lines = useCartStore((s) => s.lines)
  const count = useCartStore(selectLineCount)
  const drawerOpen = useCartStore((s) => s.drawerOpen)
  const openDrawer = useCartStore((s) => s.openDrawer)
  const lastAdded = useCartStore((s) => s.lastAdded)
  const est = useEstimate(lines)
  const [flash, setFlash] = useState(null)

  useEffect(() => {
    if (!lastAdded) return undefined
    setFlash(lastAdded)
    const t = setTimeout(() => setFlash(null), FLASH_MS)
    return () => clearTimeout(t)
  }, [lastAdded])

  const onTicketPage = /^\/(cart|checkout)\/?$/.test(pathname)
  const show = count > 0 && !drawerOpen && !onTicketPage

  return (
    <AnimatePresence>
      {show && (
        <MotionBox
          key="job-ticket-pill"
          position="fixed"
          right={{ base: `${RAIL_PX.base}px`, md: `${RAIL_PX.md}px` }}
          bottom={{ base: '18px', md: '26px' }}
          zIndex={Z.pill}
          initial={reduce ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.42, ease: EASE_ARR }}
        >
          <AnimatePresence>
            {flash && (
              <MotionBox
                key={`flash-${flash.at}`}
                position="absolute"
                right={0}
                bottom="calc(100% + 10px)"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.28, ease: EASE_ARR }}
                px={3}
                py={2}
                borderRadius="base"
                bg="ink.400"
                border="1px solid"
                borderColor="ink.300"
                whiteSpace="nowrap"
                pointerEvents="none"
                maxW="min(80vw, 360px)"
              >
                <Text fontFamily="mono" fontSize="10px" letterSpacing="0.14em" textTransform="uppercase" color="bone.300" noOfLines={1}>
                  <Box as="span" color="hivis.500">Added</Box>
                  {'  '}{flash.quantity} x {flash.name}{flash.variantLabel ? `, ${flash.variantLabel}` : ''}
                </Text>
              </MotionBox>
            )}
          </AnimatePresence>

          <MotionBox key={lastAdded?.at || 'still'} initial={reduce ? false : { scale: 1.06 }} animate={{ scale: 1 }} transition={{ duration: 0.42, ease: EASE_ARR }}>
            <HStack
              as="button"
              type="button"
              onClick={openDrawer}
              aria-label={`Open your job ticket, ${count} ${count === 1 ? 'line' : 'lines'}, estimated ${money(est.total)}`}
              spacing={0}
              h={{ base: '48px', md: '52px' }}
              borderRadius="base"
              bg={alpha(palette.ink, 0.82)}
              border="1px solid"
              borderColor="ink.200"
              boxShadow={`0 12px 30px ${alpha('#000000', 0.45)}`}
              sx={{ backdropFilter: 'blur(14px) saturate(140%)' }}
              overflow="hidden"
              transition={`border-color 260ms ${EASE}, transform 260ms ${EASE}`}
              _hover={{ borderColor: 'ember.500', transform: 'translateY(-1px)' }}
              _active={{ transform: 'translateY(0)' }}
              _focusVisible={{ borderColor: 'ember.500', outline: 'none' }}
            >
              {/* The stub. Perforated edge. */}
              <Box h="100%" px={3} display="flex" alignItems="center" bg="ember.500" color="ink.900" position="relative" _after={{ content: '""', position: 'absolute', right: '-1px', top: 0, bottom: 0, w: '2px', bg: `repeating-linear-gradient(to bottom, ${palette.ink} 0 3px, transparent 3px 6px)` }}>
                <Text fontFamily="heading" fontWeight={800} fontSize="13px" letterSpacing="0.08em" textTransform="uppercase" lineHeight={1}>Ticket</Text>
              </Box>
              <HStack spacing={4} px={4} align="baseline">
                <Text fontFamily="mono" fontSize="12px" letterSpacing="0.1em" color="bone.100">
                  {String(count).padStart(2, '0')} <Text as="span" color="bone.500">{count === 1 ? 'line' : 'lines'}</Text>
                </Text>
                <Text fontFamily="mono" fontSize="12px" letterSpacing="0.06em" color="hivis.500">
                  {money(est.total)} <Text as="span" color="bone.500">est</Text>
                </Text>
              </HStack>
            </HStack>
          </MotionBox>
        </MotionBox>
      )}
    </AnimatePresence>
  )
}
