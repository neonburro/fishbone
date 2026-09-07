// src/components/common/ErrorBoundary.jsx
import { palette } from '../../theme'
import { Component } from 'react'
import { Box, Button, Container, Heading, Text } from '@chakra-ui/react'
import RegMark from '../brand/RegMark'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    if (import.meta.env.DEV) console.error('[Fishbone] render error', error, info)
  }

  reset = () => {
    this.setState({ error: null })
    if (this.props.onReset) this.props.onReset()
  }

  render() {
    const { error } = this.state
    if (!error) return this.props.children
    if (this.props.fallback) return this.props.fallback({ error, reset: this.reset })
    return (
      <Box py={{ base: 16, md: 28 }} minH="60vh" display="flex" alignItems="center">
        <Container size="narrow" textAlign="center">
          <RegMark size="40px" color={palette.ember} mb={6} />
          <Heading size="xl" mb={3}>Misprint.</Heading>
          <Text color="bone.300" mb={6}>
            Something on this page came off the press wrong. Reload and we&rsquo;ll pull it again.
          </Text>
          <Box bg="ink.500" border="1px solid" borderColor="ink.300" p={4} mb={8} textAlign="left" borderRadius="base">
            <Text fontFamily="mono" fontSize="sm" color="ember.400" wordBreak="break-word">
              {error.message || String(error)}
            </Text>
          </Box>
          <Button onClick={this.reset} mr={3}>Try again</Button>
          <Button as="a" href="/" variant="outline">Back home</Button>
        </Container>
      </Box>
    )
  }
}
