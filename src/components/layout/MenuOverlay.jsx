// src/components/layout/MenuOverlay.jsx
//
// The menu. A full screen flood of ink pulled down over the page like a
// squeegee pass (clip-path inset animating top to bottom), then seven links
// in the display face, each with a tiny mono index. The right column is the
// shop itself: whether it is open right now, the address, the phone and the
// Instagram, because half the people who open a print shop's menu are trying
// to find out whether they can drive over.
//
// Focus goes to the first link on open and returns to the trigger on close.
// Escape closes. Body scroll is locked while it is up.

import { useEffect, useRef } from 'react'
import { Box, Flex, Grid, GridItem, HStack, Stack, Text, Link as ChakraLink } from '@chakra-ui/react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { NavLink } from 'react-router-dom'
import { FiInstagram } from 'react-icons/fi'
import Halftone from '../brand/Halftone'
import RegMark from '../brand/RegMark'
import OpenNow from '../common/OpenNow'
import { useSettings } from '../../hooks/useSettings'
import { palette, alpha } from '../../theme'
import { RAIL, EASE, EASE_ARR, Z, NAV_VAR } from '../../theme/layout'
import { NAV_LINKS } from './Nav'

const MotionBox = motion(Box)

export default function MenuOverlay({ open, onClose }) {
  const { settings } = useSettings()
  const s = settings?.store || {}
  const reduce = useReducedMotion()
  const firstRef = useRef(null)
  const returnTo = useRef(null)

  useEffect(() => {
    if (!open) return undefined
    returnTo.current = document.activeElement
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    const t = setTimeout(() => firstRef.current?.focus(), 380)
    return () => {
      clearTimeout(t)
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
      returnTo.current?.focus?.()
    }
  }, [open, onClose])

  const tel = (s.phone || '').replace(/\D/g, '')
  const flood = reduce
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.2 } }
    : {
        initial: { clipPath: 'inset(0 0 100% 0)' },
        animate: { clipPath: 'inset(0 0 0% 0)' },
        exit: { clipPath: 'inset(100% 0 0 0)' },
        transition: { duration: 0.62, ease: EASE_ARR },
      }

  return (
    <AnimatePresence>
      {open && (
        <MotionBox
          key="menu"
          id="fb-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          position="fixed"
          inset={0}
          zIndex={Z.overlay}
          bg="ink.900"
          overflowY="auto"
          {...flood}
        >
          <Halftone fade="top" color={alpha(palette.ember, 0.14)} size={18} dot={2.2} top="auto" h="42%" />
          <Flex direction="column" minH="100%" pt={`calc(var(${NAV_VAR}, 84px) + 12px)`} pb={{ base: 8, md: 10 }} px={RAIL} position="relative">
            <Grid templateColumns={{ base: '1fr', lg: '7fr 4fr' }} gap={{ base: 10, lg: 16 }} flex={1} alignItems="end">
              <GridItem>
                <Stack as="nav" aria-label="Menu" spacing={0}>
                  {NAV_LINKS.map((l, i) => (
                    <MotionBox
                      key={l.to}
                      initial={reduce ? false : { opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, ease: EASE_ARR, delay: 0.22 + i * 0.045 }}
                    >
                      <NavLink to={l.to} ref={i === 0 ? firstRef : undefined} style={{ textDecoration: 'none', display: 'block' }} onClick={onClose}>
                        {({ isActive }) => (
                          <HStack
                            spacing={{ base: 4, md: 6 }}
                            align="baseline"
                            py={{ base: 1, md: 1.5 }}
                            borderBottom="1px solid"
                            borderColor="ink.300"
                            role="group"
                            transition={`padding-left 420ms ${EASE}`}
                            _hover={{ pl: { md: 3 } }}
                          >
                            <Text as="span" fontFamily="mono" fontSize="11px" letterSpacing="0.18em" color={isActive ? 'ember.500' : 'bone.500'} w="28px" flexShrink={0}>
                              {String(i + 1).padStart(2, '0')}
                            </Text>
                            <Text
                              as="span"
                              fontFamily="heading"
                              fontWeight={900}
                              textTransform="uppercase"
                              letterSpacing="-0.02em"
                              lineHeight={0.95}
                              fontSize={{ base: 'clamp(2.6rem, 11vw, 4.2rem)', md: 'clamp(3.4rem, 7.4vw, 6.6rem)' }}
                              color={isActive ? 'ember.500' : l.accent ? 'hivis.500' : 'bone.100'}
                              transition={`color 260ms ${EASE}`}
                              _groupHover={{ color: 'ember.500' }}
                            >
                              {l.label}
                            </Text>
                          </HStack>
                        )}
                      </NavLink>
                    </MotionBox>
                  ))}
                </Stack>
              </GridItem>

              <GridItem>
                <MotionBox
                  initial={reduce ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: EASE_ARR, delay: 0.5 }}
                >
                  <Stack spacing={6} maxW={{ lg: '360px' }} ml={{ lg: 'auto' }}>
                    <OpenNow size="md" />
                    <Stack spacing={1} as="address" fontStyle="normal">
                      <Text variant="kicker" color="bone.500">The shop</Text>
                      <Text color="bone.100" fontSize="md">{s.address1}{s.address2 ? `, ${s.address2}` : ''}</Text>
                      <Text color="bone.300" fontSize="md">{s.city}, {s.state} {s.zip}</Text>
                    </Stack>
                    <Stack spacing={1}>
                      <Text variant="kicker" color="bone.500">Call</Text>
                      <ChakraLink href={`tel:${tel}`} fontFamily="mono" fontSize="lg" color="bone.100" _hover={{ color: 'ember.500', textDecoration: 'none' }}>{s.phone}</ChakraLink>
                    </Stack>
                    <HStack spacing={5}>
                      {s.instagram && (
                        <ChakraLink href={s.instagram} isExternal display="inline-flex" alignItems="center" gap={2} color="bone.300" _hover={{ color: 'ember.500', textDecoration: 'none' }}>
                          <FiInstagram size={16} />
                          <Text as="span" fontFamily="mono" fontSize="11px" letterSpacing="0.14em" textTransform="uppercase">@fishbonegraphics</Text>
                        </ChakraLink>
                      )}
                    </HStack>
                    <HStack spacing={3} color="bone.600" pt={2}>
                      <RegMark size="12px" />
                      <Text fontFamily="mono" fontSize="11px" letterSpacing="0.14em" textTransform="uppercase">{s.tagline || 'Ridgway, Colorado. Since 1985.'}</Text>
                    </HStack>
                  </Stack>
                </MotionBox>
              </GridItem>
            </Grid>
          </Flex>
        </MotionBox>
      )}
    </AnimatePresence>
  )
}
