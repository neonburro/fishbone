// src/components/layout/Layout.jsx
import { Box } from '@chakra-ui/react'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import ErrorBoundary from '../common/ErrorBoundary'

export default function Layout() {
  return (
    <Box minH="100vh" display="flex" flexDir="column" bg="ink.900">
      <Header />
      <Box as="main" id="main" flex="1">
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </Box>
      <Footer />
    </Box>
  )
}
