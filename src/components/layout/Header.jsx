import { useEffect, useState } from 'react'
import {
  Box, Container, Flex, HStack, IconButton, Button, Drawer, DrawerOverlay, DrawerContent, DrawerBody,
  DrawerHeader, DrawerCloseButton, VStack, useDisclosure, Text, Link as ChakraLink,
} from '@chakra-ui/react'
import { Link as RouterLink, NavLink, useLocation } from 'react-router-dom'
import { FiMenu, FiShoppingBag, FiPhone, FiInstagram } from 'react-icons/fi'
import Logo from '../brand/Logo'
import RegMark from '../brand/RegMark'
import useCartStore, { selectLineCount } from '../../store/cartStore'
import { useSettings } from '../../hooks/useSettings'

const NAV = [
  { to: '/shop', label: 'Shop' },
  { to: '/services', label: 'Services' },
  { to: '/work', label: 'Work' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

const navStyle = ({ isActive }) => ({
  fontFamily: "'Barlow Condensed', sans-serif",
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  fontSize: '1rem',
  color: isActive ? '#FF6A13' : '#D9D2C5',
  padding: '6px 2px',
  borderBottom: isActive ? '2px solid #FF6A13' : '2px solid transparent',
  transition: 'color .15s',
})

export default function Header() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const count = useCartStore(selectLineCount)
  const { settings } = useSettings()
  const { pathname } = useLocation()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { onClose() }, [pathname, onClose])

  const ann = settings?.announcement

  return (
    <Box as="header" position="sticky" top={0} zIndex={100}>
      {ann?.enabled && ann?.text && (
        <Box bg="ember.500" color="ink.900" py={1.5} textAlign="center" fontFamily="heading" fontWeight={700} textTransform="uppercase" letterSpacing="0.08em" fontSize="sm" px={4}>
          {ann.text}
        </Box>
      )}
      <Box
        bg={scrolled ? 'rgba(11,11,12,0.92)' : 'ink.900'}
        backdropFilter={scrolled ? 'blur(8px)' : undefined}
        borderBottom="1px solid"
        borderColor={scrolled ? 'ink.300' : 'transparent'}
        transition="background .2s, border-color .2s"
      >
        <Container size="page">
          <Flex h={{ base: '64px', md: '76px' }} align="center" justify="space-between" gap={4}>
            <ChakraLink as={RouterLink} to="/" aria-label="Fishbone Graphics — home" _hover={{ textDecoration: 'none', opacity: 0.9 }} display="flex">
              <Logo height="34px" />
            </ChakraLink>

            <HStack as="nav" aria-label="Primary" spacing={7} display={{ base: 'none', lg: 'flex' }}>
              {NAV.map((n) => (
                <NavLink key={n.to} to={n.to} style={navStyle}>{n.label}</NavLink>
              ))}
            </HStack>

            <HStack spacing={2}>
              <Button as={RouterLink} to="/quote" size="sm" display={{ base: 'none', md: 'inline-flex' }}>
                Get a quote
              </Button>
              <Box position="relative">
                <IconButton
                  as={RouterLink}
                  to="/cart"
                  aria-label={`Order sheet, ${count} ${count === 1 ? 'line' : 'lines'}`}
                  icon={<FiShoppingBag size={20} />}
                  variant="ghost"
                  color="bone.100"
                />
                {count > 0 && (
                  <Box
                    position="absolute" top="2px" right="2px" bg="hivis.500" color="ink.900" fontFamily="mono" fontSize="10px" fontWeight={600}
                    minW="17px" h="17px" px="4px" borderRadius="full" display="flex" alignItems="center" justifyContent="center" pointerEvents="none"
                  >
                    {count}
                  </Box>
                )}
              </Box>
              <IconButton
                aria-label="Open menu"
                icon={<FiMenu size={22} />}
                variant="ghost"
                color="bone.100"
                display={{ base: 'inline-flex', lg: 'none' }}
                onClick={onOpen}
              />
            </HStack>
          </Flex>
        </Container>
      </Box>

      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="xs">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton top={5} right={5} />
          <DrawerHeader pt={5}>
            <Logo height="30px" />
          </DrawerHeader>
          <DrawerBody display="flex" flexDir="column">
            <VStack as="nav" aria-label="Mobile" align="stretch" spacing={0} mt={4}>
              {NAV.map((n) => (
                <NavLink
                  key={n.to}
                  to={n.to}
                  style={({ isActive }) => ({
                    display: 'flex', alignItems: 'center', gap: 12,
                    fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em',
                    fontSize: '1.6rem', padding: '12px 0', borderBottom: '1px solid #26262B', color: isActive ? '#FF6A13' : '#F2EDE4',
                  })}
                >
                  <RegMark size="14px" color="currentColor" />
                  {n.label}
                </NavLink>
              ))}
            </VStack>
            <Button as={RouterLink} to="/quote" size="lg" mt={8} w="100%">Get a quote</Button>
            <Button as={RouterLink} to="/cart" variant="outline" size="lg" mt={3} w="100%" leftIcon={<FiShoppingBag />}>
              Order sheet {count > 0 ? `(${count})` : ''}
            </Button>
            <Box mt="auto" pt={8} pb={6}>
              <HStack spacing={5} color="bone.300">
                <ChakraLink href={`tel:${(settings?.store?.phone || '').replace(/\D/g, '')}`} display="flex" alignItems="center" gap={2} color="bone.300">
                  <FiPhone /> <Text fontFamily="mono" fontSize="sm">{settings?.store?.phone}</Text>
                </ChakraLink>
                <ChakraLink href={settings?.store?.instagram} isExternal aria-label="Instagram" color="bone.300"><FiInstagram size={18} /></ChakraLink>
              </HStack>
              <Text mt={3} fontSize="sm" color="bone.500">Ridgway, Colorado · Since 1985</Text>
            </Box>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  )
}
