// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react'
import { HelmetProvider } from 'react-helmet-async'
import theme from './theme'
import App from './App'
import ErrorBoundary from './components/common/ErrorBoundary'

// After a deploy the old tab still asks for the old chunk files, which are
// gone, and the first lazy route it opens fails. Vite raises this event for
// exactly that. Reload once onto the new build, and never loop.
window.addEventListener('vite:preloadError', (event) => {
  event.preventDefault()
  const key = 'fb-reloaded-for-deploy'
  if (sessionStorage.getItem(key) === location.href) return
  sessionStorage.setItem(key, location.href)
  window.location.reload()
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ColorModeScript initialColorMode="dark" />
    <ChakraProvider theme={theme} toastOptions={{ defaultOptions: { position: 'bottom-right', variant: 'ink', isClosable: true, duration: 3500 } }}>
      <HelmetProvider>
        <ErrorBoundary>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ErrorBoundary>
      </HelmetProvider>
    </ChakraProvider>
  </React.StrictMode>
)
