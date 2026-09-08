// src/App.jsx
//
// Routes. Every route has a trailing slash (/shop/, /product/:slug/). React
// Router matches with or without it, so TrailingSlash redirects the bare form
// to the canonical one before anything renders, and every link on the site
// is written with the slash so nothing bounces.

import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Box, Spinner, Center } from '@chakra-ui/react'
import Layout from './components/layout/Layout'
import ScrollToTop from './components/common/ScrollToTop'
import { SettingsProvider } from './hooks/useSettings'
import { AccentProvider } from './hooks/useAccent'

const Home = lazy(() => import('./pages/Home'))
const Shop = lazy(() => import('./pages/Shop'))
const Category = lazy(() => import('./pages/Shop/Category'))
const Product = lazy(() => import('./pages/Product'))
const Cart = lazy(() => import('./pages/Cart'))
const Checkout = lazy(() => import('./pages/Checkout'))
const OrderConfirmed = lazy(() => import('./pages/Order/Confirmed'))
const OrderTrack = lazy(() => import('./pages/Order/Track'))
const Quote = lazy(() => import('./pages/Quote'))
const Services = lazy(() => import('./pages/Services'))
const Work = lazy(() => import('./pages/Work'))
const Prints = lazy(() => import('./pages/Prints'))
const Proof = lazy(() => import('./pages/Proof'))
const Notes = lazy(() => import('./pages/Notes'))
const NotePost = lazy(() => import('./pages/Notes/Post'))
const About = lazy(() => import('./pages/About'))
const Contact = lazy(() => import('./pages/Contact'))
const Design = lazy(() => import('./pages/Design'))
const NotFound = lazy(() => import('./pages/NotFound'))

function PageFallback() {
  return (
    <Center minH="50vh" role="status" aria-live="polite">
      <Spinner color="ember.500" thickness="3px" speed="0.7s" size="lg" label="Loading" />
    </Center>
  )
}

function TrailingSlash({ children }) {
  const { pathname, search, hash } = useLocation()
  if (pathname.length > 1 && !pathname.endsWith('/') && !/\.[a-z0-9]{2,5}$/i.test(pathname)) {
    return <Navigate to={`${pathname}/${search}${hash}`} replace />
  }
  return children
}

export default function App() {
  return (
    <SettingsProvider>
      <AccentProvider>
      <ScrollToTop />
      <Box as="a" href="#main" position="absolute" left="-999px" _focus={{ left: 4, top: 4, zIndex: 2000, bg: 'ember.500', color: 'ink.900', px: 4, py: 2, borderRadius: 'base' }}>
        Skip to content
      </Box>
      <TrailingSlash>
        <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="shop/" element={<Shop />} />
              <Route path="shop/:categoryKey/" element={<Category />} />
              <Route path="product/:slug/" element={<Product />} />
              <Route path="cart/" element={<Cart />} />
              <Route path="checkout/" element={<Checkout />} />
              <Route path="order/confirmed/:orderNumber/" element={<OrderConfirmed />} />
              <Route path="order/track/" element={<OrderTrack />} />
              <Route path="quote/" element={<Quote />} />
              <Route path="services/" element={<Services />} />
              <Route path="work/" element={<Work />} />
              <Route path="prints/" element={<Prints />} />
              <Route path="proof/:token/" element={<Proof />} />
              <Route path="notes/" element={<Notes />} />
              <Route path="notes/:slug/" element={<NotePost />} />
              <Route path="about/" element={<About />} />
              <Route path="contact/" element={<Contact />} />
              <Route path="design/" element={<Design />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Suspense>
      </TrailingSlash>
      </AccentProvider>
    </SettingsProvider>
  )
}
