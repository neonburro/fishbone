// src/components/layout/MenuSheet.jsx
//
// The menu. A sheet from the right over a scrim. About three quarters of a
// phone, 400px on a desktop. Tap the scrim, press Escape, tap Close or tap
// any link and it goes. A link also puts you at the top of the page it
// opens, even when it is the page you are already on.
//
// ── NO ANIMATION LIBRARY HERE, ON PURPOSE ───────────────────────────────────
// This used framer-motion's AnimatePresence. Its exit fade froze part way
// in Chrome and left a one third opacity scrim over the whole page that ate
// every click, which read as "none of the links work". The sheet and the
// scrim are now always mounted and move with plain CSS transitions. Closed
// means opacity 0, pointer-events none and visibility hidden after the
// transition, so nothing invisible can ever sit on top of the page.
//
// No body scroll lock either. The scrim covers the page and the sheet
// scrolls on its own. No dots, no marks. Type and hairlines.
//
// No oxford commas, no em dashes.

import { useEffect, useRef, useState } from 'react'
import { Box, HStack, Stack, Text, Link as ChakraLink } from '@chakra-ui/react'
import { NavLink, useLocation } from 'react-router-dom'
import { FiInstagram } from 'react-icons/fi'
import OpenNow from '../common/OpenNow'
import useCartStore, { selectLineCount } from '../../store/cartStore'
import { useSettings } from '../../hooks/useSettings'
import { EASE, Z } from '../../theme/layout'
import { NAV_LINKS } from './Nav'

const MS = 420

export default function MenuSheet({ open, onClose }) {
  const { settings } = useSettings()
  const { pathname } = useLocation()
  const s = settings?.store || {}
  const firstRef = useRef(null)
  const returnTo = useRef(null)
  const count = useCartStore(selectLineCount)
  const openDrawer = useCartStore((st) => st.openDrawer)

  // visible lags open on the way out so the slide can finish before the
  // sheet is hidden from the accessibility tree and from pointer events.
  const [visible, setVisible] = useState(open)
  useEffect(() => {
    if (open) { setVisible(true); return undefined }
    const t = setTimeout(() => setVisible(false), MS)
    return () => clearTimeout(t)
  }, [open])

  useEffect(() => {
    if (!open) return undefined
    returnTo.current = document.activeElement
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    const t = setTimeout(() => firstRef.current?.focus({ preventScroll: true }), MS)
    return () => {
      clearTimeout(t)
      window.removeEventListener('keydown', onKey)
      returnTo.current?.focus?.({ preventScroll: true })
    }
  }, [open, onClose])

  const go = (to) => {
    onClose()
    if (to === pathname) window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }

  const tel = (s.phone || '').replace(/\D/g, '')
  const shown = open || visible

  return (
    <>
      <Box
        position="fixed"
        top={0}
        left={0}
        right={0}
        bottom={0}
        zIndex={Z.overlay}
        bg="rgba(10,10,12,0.6)"
        cursor="pointer"
        onClick={onClose}
        aria-hidden="true"
        opacity={open ? 1 : 0}
        visibility={shown ? 'visible' : 'hidden'}
        pointerEvents={open ? 'auto' : 'none'}
        transition={`opacity ${MS}ms ${EASE}, visibility 0s linear ${open ? '0s' : `${MS}ms`}`}
      />
      <Box
        id="fb-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        aria-hidden={!open}
        position="fixed"
        top={0}
        right={0}
        bottom={0}
        zIndex={Z.overlay + 1}
        w={{ base: '76%', sm: '360px', md: '400px' }}
        maxW="100%"
        bg="ink.900"
        borderLeft="1px solid"
        borderColor="ink.300"
        boxShadow="-24px 0 60px rgba(0,0,0,0.4)"
        display="flex"
        flexDir="column"
        overflowY="auto"
        sx={{ overscrollBehavior: 'contain', WebkitOverflowScrolling: 'touch' }}
        px={{ base: 6, md: 8 }}
        pt={{ base: 5, md: 6 }}
        pb={{ base: 6, md: 8 }}
        transform={open ? 'translate3d(0, 0, 0)' : 'translate3d(105%, 0, 0)'}
        visibility={shown ? 'visible' : 'hidden'}
        pointerEvents={open ? 'auto' : 'none'}
        transition={`transform ${MS}ms ${EASE}, visibility 0s linear ${open ? '0s' : `${MS}ms`}`}
      >
        <HStack justify="space-between" align="center" mb={{ base: 6, md: 8 }}>
          <Text variant="kicker">Fishbone Graphics</Text>
          <Text as="button" type="button" onClick={onClose} aria-label="Close menu" tabIndex={open ? 0 : -1} fontFamily="mono" fontSize="11px" letterSpacing="0.16em" textTransform="uppercase" color="bone.500" _hover={{ color: 'bone.100' }} py={2} pl={4}>
            Close
          </Text>
        </HStack>

        <Stack as="nav" aria-label="Menu" spacing={0} flex="0 0 auto">
          {NAV_LINKS.map((l, i) => (
            <NavLink key={l.to} to={l.to} ref={i === 0 ? firstRef : undefined} tabIndex={open ? 0 : -1} style={{ textDecoration: 'none', display: 'block' }} onClick={() => go(l.to)}>
              {({ isActive }) => (
                <Text
                  as="span"
                  display="block"
                  py={{ base: 3, md: 3.5 }}
                  borderBottom="1px solid"
                  borderColor="ink.300"
                  fontFamily="heading"
                  fontWeight={isActive ? 700 : 600}
                  textTransform="uppercase"
                  lineHeight={1}
                  fontSize={{ base: '1.6rem', md: '1.9rem' }}
                  color={isActive ? 'bone.100' : 'bone.300'}
                  transition={`color 200ms ${EASE}, padding-left 300ms ${EASE}`}
                  _hover={{ color: 'bone.100', pl: 2 }}
                >
                  {l.label}
                </Text>
              )}
            </NavLink>
          ))}
          <Text
            as="button"
            type="button"
            tabIndex={open ? 0 : -1}
            onClick={() => { onClose(); openDrawer() }}
            display="flex"
            alignItems="baseline"
            gap={3}
            w="100%"
            textAlign="left"
            py={{ base: 3, md: 3.5 }}
            fontFamily="heading"
            fontWeight={600}
            textTransform="uppercase"
            lineHeight={1}
            fontSize={{ base: '1.6rem', md: '1.9rem' }}
            color="bone.300"
            _hover={{ color: 'bone.100' }}
          >
            Job ticket
            <Text as="span" fontFamily="mono" fontSize="12px" letterSpacing="0.14em" color={count > 0 ? 'red.500' : 'bone.600'}>{String(count).padStart(2, '0')}</Text>
          </Text>
        </Stack>

        <Stack spacing={4} mt="auto" pt={8}>
          <Stack spacing={1.5}>
            <OpenNow />
            <Text fontFamily="mono" fontSize="11px" letterSpacing="0.12em" textTransform="uppercase" color="bone.300" pl="22px">By appointment. Call or write first.</Text>
          </Stack>
          <Stack spacing={0.5} as="address" fontStyle="normal">
            <Text color="bone.100" fontSize="sm">{s.address1}{s.address2 ? `, ${s.address2}` : ''}</Text>
            <Text color="bone.300" fontSize="sm">{s.city}, {s.state} {s.zip}</Text>
          </Stack>
          <ChakraLink href={`tel:${tel}`} tabIndex={open ? 0 : -1} fontFamily="mono" fontSize="md" color="bone.100" _hover={{ color: 'red.500', textDecoration: 'none' }}>{s.phone}</ChakraLink>
          {s.instagram && (
            <ChakraLink href={s.instagram} isExternal tabIndex={open ? 0 : -1} display="inline-flex" alignItems="center" gap={2} color="bone.300" _hover={{ color: 'bone.100', textDecoration: 'none' }}>
              <FiInstagram size={15} />
              <Text as="span" fontFamily="mono" fontSize="11px" letterSpacing="0.14em" textTransform="uppercase">@fishbonegraphics</Text>
            </ChakraLink>
          )}
        </Stack>
      </Box>
    </>
  )
}
