// src/components/layout/Nav.jsx
//
// Full width bar. It never hides. A cart that is one scroll position away
// from unreachable is a cart people abandon, so past NAV_CONDENSE_AFTER the
// bar loses about twenty pixels of height and the ink surface arrives across
// the band. Same information, less shouting.
//
// ── THE ALIGNMENT ───────────────────────────────────────────────────────────
// The wordmark's first glyph lands on the rail, the same x as the first
// character of every heading. The lockup carries LOCKUP_PAD of padding so it
// is pulled back by that much to put the LETTERFORM on the line, not the box.
// The plumb line under it (desktop only) is the visible proof: if a heading
// ever drifts you see it against that hairline.
//
// ── IT OWNS --fb-nav-h ──────────────────────────────────────────────────────
// The bar is fixed, so the page needs to know how tall it is, and the answer
// changes with the announcement strip, the breakpoint and the condensed
// state. The height is MEASURED off the real element and published on the
// document as --fb-nav-h. Layout pads main by it. Anything sticky reads it.
// Do not add a second measurement.
//
// No oxford commas, no em dashes.

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Box, Flex, HStack, IconButton, Text, Link as ChakraLink } from '@chakra-ui/react'
import { Link as RouterLink, NavLink, useLocation } from 'react-router-dom'
import Logo from '../brand/Logo'
import MenuOverlay from './MenuOverlay'
import useCartStore, { selectLineCount } from '../../store/cartStore'
import { useSettings } from '../../hooks/useSettings'
import { palette, alpha } from '../../theme'
import { RAIL, RAIL_PX, LOCKUP_PAD, NAV_H, NAV_H_TIGHT, NAV_CONDENSE_AFTER, NAV_VAR, EASE, Z } from '../../theme/layout'

export const NAV_LINKS = [
  { to: '/shop/', label: 'Shop' },
  { to: '/work/', label: 'Work' },
  { to: '/notes/', label: 'Notes' },
  { to: '/services/', label: 'Services' },
  { to: '/about/', label: 'About' },
  { to: '/contact/', label: 'Contact' },
  { to: '/quote/', label: 'Get a quote', accent: true },
]

const INLINE = NAV_LINKS.filter((l) => ['Shop', 'Work', 'Notes', 'Get a quote'].includes(l.label))

function TicketGlyph({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 7h18v4a2 2 0 0 0 0 4v4H3v-4a2 2 0 0 0 0-4V7z" />
      <path d="M9 7v13" strokeDasharray="2 2" />
    </svg>
  )
}

export default function Nav() {
  const { pathname } = useLocation()
  const { settings } = useSettings()
  const count = useCartStore(selectLineCount)
  const openDrawer = useCartStore((s) => s.openDrawer)
  const [condensed, setCondensed] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const headerRef = useRef(null)
  const stateRef = useRef(false)

  // Condense flag flips only when the boolean changes, so a scroll does not
  // re-render the tree sixty times a second.
  useEffect(() => {
    const onScroll = () => {
      const next = window.scrollY > NAV_CONDENSE_AFTER
      if (next !== stateRef.current) {
        stateRef.current = next
        setCondensed(next)
      }
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Publish the measured height. ResizeObserver catches the announcement strip
  // arriving, the breakpoint changing and the condense transition settling.
  useLayoutEffect(() => {
    const el = headerRef.current
    if (!el) return undefined
    const publish = () => document.documentElement.style.setProperty(NAV_VAR, `${el.offsetHeight}px`)
    publish()
    const ro = new ResizeObserver(publish)
    ro.observe(el)
    return () => {
      ro.disconnect()
      document.documentElement.style.removeProperty(NAV_VAR)
    }
  }, [])

  useEffect(() => { setMenuOpen(false) }, [pathname])

  const ann = settings?.announcement
  const showAnn = ann?.enabled && ann?.text

  return (
    <>
      {/* The plumb line. Desktop only. Sits on the rail, not on the lockup. */}
      <Box
        display={{ base: 'none', md: 'block' }}
        position="fixed"
        aria-hidden="true"
        left={`${RAIL_PX.md}px`}
        top={`var(${NAV_VAR}, 84px)`}
        bottom="0"
        w="1px"
        zIndex={Z.plumb}
        pointerEvents="none"
        bg={`linear-gradient(to bottom, ${alpha(palette.bone, 0.16)}, transparent 70%)`}
      />

      <Box
        as="header"
        ref={headerRef}
        position="fixed"
        top={0}
        left={0}
        right={0}
        zIndex={Z.nav}
        bg={condensed || menuOpen ? alpha(palette.ink, 0.86) : 'transparent'}
        borderBottom="1px solid"
        borderColor={condensed && !menuOpen ? 'ink.300' : 'transparent'}
        transition={`background-color 420ms ${EASE}, border-color 420ms ${EASE}`}
        sx={{ backdropFilter: condensed && !menuOpen ? 'blur(14px) saturate(140%)' : 'none' }}
      >
        {showAnn && !menuOpen && (
          <Box bg="ember.500" color="ink.900" px={RAIL} py="6px">
            <Text fontFamily="mono" fontSize="11px" fontWeight={500} letterSpacing="0.14em" textTransform="uppercase" noOfLines={1}>
              {ann.text}
            </Text>
          </Box>
        )}
        <Flex align="center" justify="space-between" px={RAIL} h={condensed ? NAV_H_TIGHT : NAV_H} transition={`height 420ms ${EASE}`}>
          {/* The lockup, pulled back so the glyph lands on the rail. */}
          <ChakraLink
            as={RouterLink}
            to="/"
            aria-label="Fishbone Graphics. Home"
            display="inline-flex"
            alignItems="center"
            ml={`-${LOCKUP_PAD}px`}
            px={`${LOCKUP_PAD}px`}
            py="6px"
            borderRadius="base"
            _hover={{ textDecoration: 'none', opacity: 0.88 }}
            transition={`opacity 260ms ${EASE}`}
            onClick={() => setMenuOpen(false)}
          >
            <Box h={condensed ? { base: '26px', md: '30px' } : { base: '30px', md: '38px' }} transition={`height 420ms ${EASE}`}>
              <Logo height="100%" />
            </Box>
          </ChakraLink>

          <HStack spacing={{ base: 1, md: 2 }}>
            <HStack as="nav" aria-label="Primary" spacing={1} display={{ base: 'none', lg: 'flex' }} mr={3}>
              {INLINE.map((l) => (
                <NavLink key={l.to} to={l.to} style={{ textDecoration: 'none' }}>
                  {({ isActive }) => (
                    <Text
                      as="span"
                      display="block"
                      px={3}
                      py={2}
                      fontFamily="mono"
                      fontSize="11px"
                      fontWeight={500}
                      letterSpacing="0.18em"
                      textTransform="uppercase"
                      color={isActive ? 'ember.500' : l.accent ? 'hivis.500' : 'bone.300'}
                      borderBottom="1px solid"
                      borderColor={isActive ? 'ember.500' : 'transparent'}
                      transition={`color 260ms ${EASE}, border-color 260ms ${EASE}`}
                      _hover={{ color: 'bone.100' }}
                    >
                      {l.label}
                    </Text>
                  )}
                </NavLink>
              ))}
            </HStack>

            {/* The ticket. Always reachable. Opens the drawer. */}
            <HStack
              as="button"
              type="button"
              onClick={() => { setMenuOpen(false); openDrawer() }}
              aria-label={count > 0 ? `Open your job ticket, ${count} ${count === 1 ? 'line' : 'lines'}` : 'Open your job ticket, empty'}
              spacing={2}
              px={3}
              h="40px"
              borderRadius="base"
              border="1px solid transparent"
              color="bone.100"
              transition={`border-color 260ms ${EASE}, background-color 260ms ${EASE}`}
              _hover={{ borderColor: 'ink.300', bg: alpha(palette.bone, 0.04) }}
              _focusVisible={{ borderColor: 'ember.500', outline: 'none' }}
            >
              <TicketGlyph />
              <Text as="span" fontFamily="mono" fontSize="11px" fontWeight={500} letterSpacing="0.1em" color={count > 0 ? 'hivis.500' : 'bone.500'} transition={`color 260ms ${EASE}`}>
                {String(count).padStart(2, '0')}
              </Text>
            </HStack>

            {/* Menu. Two lines that become an X. */}
            <IconButton
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              aria-controls="fb-menu"
              onClick={() => setMenuOpen((v) => !v)}
              variant="ghost"
              color="bone.100"
              h="40px"
              w="48px"
              _hover={{ bg: alpha(palette.bone, 0.06) }}
              icon={
                <Box position="relative" w="22px" h="14px" aria-hidden="true">
                  <Box position="absolute" left={0} right={0} top={menuOpen ? '6px' : 0} h="2px" bg="currentColor" transform={menuOpen ? 'rotate(45deg)' : 'none'} transition={`transform 420ms ${EASE}, top 420ms ${EASE}`} />
                  <Box position="absolute" left={0} right={0} bottom={menuOpen ? '6px' : 0} h="2px" bg="currentColor" transform={menuOpen ? 'rotate(-45deg)' : 'none'} transition={`transform 420ms ${EASE}, bottom 420ms ${EASE}`} />
                </Box>
              }
            />
          </HStack>
        </Flex>
      </Box>

      <MenuOverlay open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  )
}
