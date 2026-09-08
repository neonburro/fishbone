// src/components/layout/Nav.jsx
//
// The bar. Three things on it and nothing else: the logo tile on the left,
// the links in the middle on a desktop, and one round button on the right.
//
// ── THE TILE ────────────────────────────────────────────────────────────────
// The lockup sits on a piece of smoked glass, translucent ink over a blur with
// a hairline border, so it reads as sitting ON the page rather than as a
// hole cut through it. The tile's left edge is the rail. A plumb line drops
// from under it on a desktop and every heading on the page starts on that
// line. If a heading ever looks off, the line is how you catch it.
//
// ── LEAVES AND COMES BACK ───────────────────────────────────────────────────
// Past NAV_HIDE_AFTER, scrolling down hides the bar and scrolling up brings
// it straight back. Direction, not position. The job ticket pill covers the
// order while the bar is away. The menu button and the ticket count live in
// the round button, which is the single entry point on a phone.
//
// ── IT OWNS --fb-nav-h ──────────────────────────────────────────────────────
// The bar is fixed, so main pads by its measured height, published on the
// document as --fb-nav-h. Do not add a second measurement.
//
// No oxford commas, no em dashes.

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Box, Flex, HStack, Text, Link as ChakraLink, useColorModeValue } from '@chakra-ui/react'
import { Link as RouterLink, NavLink, useLocation } from 'react-router-dom'
import Logo from '../brand/Logo'
import MenuSheet from './MenuSheet'
import useCartStore, { selectLineCount } from '../../store/cartStore'
import { useSettings } from '../../hooks/useSettings'
import { palette, paletteLight, alpha, ON_RED } from '../../theme'
import { RAIL, RAIL_CSS, NAV_H, NAV_HIDE_AFTER, NAV_VAR, EASE, Z } from '../../theme/layout'

// The ribs. The one button on the bar is the middle of the fishbone mark:
// a spine with three ribs. It reads as a menu because three lines always
// do, and it is ours because nothing else draws its menu as a fish. It is
// drawn with the same stroke as the mark beside it.
function RibsGlyph({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 12h18" />
      <path d="M8 12l-2-6M8 12l-2 6M13 12l-2-7M13 12l-2 7M18 12l-2-6M18 12l-2 6" />
    </svg>
  )
}

// The words. A bulk order is a run. Premade stock is the rack (not built yet,
// it arrives with Pulse inventory). A quote is a proof. The cart is the ticket.
export const NAV_LINKS = [
  { to: '/shop/', label: 'Runs' },
  { to: '/prints/', label: 'Prints' },
  { to: '/work/', label: 'Work' },
  { to: '/services/', label: 'Printing' },
  { to: '/notes/', label: 'Notes' },
  { to: '/about/', label: 'About' },
  { to: '/contact/', label: 'Shop info' },
  { to: '/quote/', label: 'Send your art', accent: true },
  { to: '/design/', label: 'Share your vision' },
]

const INLINE = NAV_LINKS.filter((l) => ['Runs', 'Work', 'Printing', 'Shop info'].includes(l.label))

// Smoked glass on ink, frosted glass on paper. Same blur, different tint.
const glassFor = (p, shadow) => ({
  bg: alpha(p.inkSurface, 0.74),
  border: '1px solid',
  borderColor: alpha(p.bone, 0.1),
  boxShadow: `0 10px 30px ${alpha('#000000', shadow)}`,
  sx: { backdropFilter: 'blur(14px) saturate(140%)', WebkitBackdropFilter: 'blur(14px) saturate(140%)' },
})

export default function Nav() {
  const { pathname } = useLocation()
  const { settings } = useSettings()
  const count = useCartStore(selectLineCount)
  const [hidden, setHidden] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const headerRef = useRef(null)
  const lastY = useRef(0)
  const hiddenRef = useRef(false)

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      const dy = y - lastY.current
      if (Math.abs(dy) < 4) return
      const next = y > NAV_HIDE_AFTER && dy > 0
      if (next !== hiddenRef.current) {
        hiddenRef.current = next
        setHidden(next)
      }
      lastY.current = y
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

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

  const glass = useColorModeValue(glassFor(paletteLight, 0.12), glassFor(palette, 0.34))
  const hoverBorder = useColorModeValue(alpha(paletteLight.bone, 0.28), alpha(palette.bone, 0.18))
  const wash = useColorModeValue(alpha(paletteLight.bone, 0.08), alpha(palette.bone, 0.08))
  const plumb = useColorModeValue(alpha(paletteLight.bone, 0.28), alpha(palette.bone, 0.22))
  const ann = settings?.announcement
  const showAnn = ann?.enabled && ann?.text
  const away = hidden && !menuOpen

  return (
    <>
      {/* The plumb line. Desktop only. Drops from under the tile down the rail. */}
      <Box
        display={{ base: 'none', md: 'block' }}
        position="fixed"
        aria-hidden="true"
        left={RAIL_CSS.md}
        top={`var(${NAV_VAR}, 76px)`}
        h="140px"
        w="1px"
        zIndex={Z.plumb}
        pointerEvents="none"
        bg={`linear-gradient(to bottom, var(--fb-red-500), ${plumb} 40%, transparent)`}
      />

      <Box
        as="header"
        ref={headerRef}
        position="fixed"
        top={0}
        left={0}
        right={0}
        zIndex={Z.nav}
        transform={away ? 'translate3d(0, -110%, 0)' : 'translate3d(0, 0, 0)'}
        opacity={away ? 0 : 1}
        transition={`transform 460ms ${EASE}, opacity 380ms ${EASE}`}
        pointerEvents={away ? 'none' : 'auto'}
      >
        {/* The stripe. Wears the accent, so it follows the ink picked in the footer. */}
        {showAnn && !menuOpen && (
          <Box bg={ann.tone === 'ink' ? 'ink.500' : 'red.500'} borderBottom={ann.tone === 'ink' ? '1px solid' : 'none'} borderColor="ink.300" px={RAIL} py="6px" transition={`background 300ms ${EASE}`}>
            <Text fontFamily="mono" fontSize="11px" fontWeight={500} letterSpacing="0.14em" textTransform="uppercase" color={ann.tone === 'ink' ? 'bone.300' : ON_RED} noOfLines={1}>
              {ann.text}
            </Text>
          </Box>
        )}
        <Flex align="center" justify="space-between" px={RAIL} h={NAV_H}>
          {/* The tile. Its left edge is the rail. */}
          <ChakraLink
            as={RouterLink}
            to="/"
            aria-label="Fishbone Graphics. Home"
            display="inline-flex"
            alignItems="center"
            px="14px"
            py="9px"
            borderRadius="md"
            {...glass}
            _hover={{ textDecoration: 'none', borderColor: hoverBorder }}
            transition={`border-color 260ms ${EASE}`}
            onClick={() => setMenuOpen(false)}
          >
            <Box h={{ base: '32px', md: '38px' }}>
              <Logo height="100%" />
            </Box>
          </ChakraLink>

          {/* The links. Desktop only. */}
          <HStack as="nav" aria-label="Primary" spacing={1} display={{ base: 'none', lg: 'flex' }} px="6px" py="6px" borderRadius="full" {...glass}>
            {INLINE.map((l) => (
              <NavLink key={l.to} to={l.to} style={{ textDecoration: 'none' }}>
                {({ isActive }) => (
                  <Text
                    as="span"
                    display="block"
                    px={4}
                    py={2}
                    borderRadius="full"
                    fontFamily="heading"
                    fontSize="17px"
                    fontWeight={600}
                    letterSpacing="0.06em"
                    textTransform="uppercase"
                    color={isActive ? 'bone.100' : 'bone.300'}
                    bg={isActive ? wash : 'transparent'}
                    transition={`color 260ms ${EASE}, background-color 260ms ${EASE}`}
                    _hover={{ color: 'bone.100', bg: wash }}
                  >
                    {l.label}
                  </Text>
                )}
              </NavLink>
            ))}
          </HStack>

          {/* The one button. The ribs. Opens the menu, carries the ticket count. */}
          <HStack
            as="button"
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? 'Close menu' : count > 0 ? `Open menu, ${count} on your ticket` : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="fb-menu"
            spacing={2}
            h={{ base: '44px', md: '48px' }}
            minW={{ base: '44px', md: '48px' }}
            px={count > 0 && !menuOpen ? 3.5 : 0}
            justifyContent="center"
            borderRadius="full"
            bg="bone.100"
            color="ink.900"
            boxShadow={`0 10px 30px ${alpha('#000000', 0.34)}`}
            transition={`transform 260ms ${EASE}, background-color 260ms ${EASE}`}
            _hover={{ transform: 'translateY(-1px)' }}
            _active={{ transform: 'translateY(0)' }}
            _focusVisible={{ boxShadow: 'outline', outline: 'none' }}
          >
            <Box display="inline-flex" transform={menuOpen ? 'rotate(90deg)' : 'none'} transition={`transform 420ms ${EASE}`}>
              <RibsGlyph />
            </Box>
            {count > 0 && !menuOpen && (
              <Text as="span" fontFamily="mono" fontSize="11px" fontWeight={500} letterSpacing="0.08em" lineHeight={1}>
                {String(count).padStart(2, '0')}
              </Text>
            )}
          </HStack>
        </Flex>
      </Box>

      <MenuSheet open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  )
}
