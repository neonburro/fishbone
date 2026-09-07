// src/components/layout/Layout.jsx
//
// The shell. Fixed nav on top, main padded by the nav's published height so
// nothing starts under the bar, footer, then the two pieces of the cart that
// live outside the page flow: the floating job ticket pill and the drawer.

import { Box } from '@chakra-ui/react'
import { Outlet } from 'react-router-dom'
import Nav from './Nav'
import Footer from './Footer'
import JobTicketPill from '../cart/JobTicketPill'
import CartDrawer from '../cart/CartDrawer'
import ErrorBoundary from '../common/ErrorBoundary'
import { NAV_VAR } from '../../theme/layout'

export default function Layout() {
  return (
    <Box minH="100vh" display="flex" flexDir="column" bg="ink.900">
      <Nav />
      <Box as="main" id="main" flex="1" pt={`var(${NAV_VAR}, 84px)`}>
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </Box>
      <Footer />
      <JobTicketPill />
      <CartDrawer />
    </Box>
  )
}
