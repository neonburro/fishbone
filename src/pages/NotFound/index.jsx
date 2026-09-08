// src/pages/NotFound/index.jsx
import { palette } from '../../theme'
import { Box, Button, Container, Heading, Stack, Text } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import SEO from '../../components/common/SEO'
import RegMark from '../../components/brand/RegMark'

export default function NotFound({ title = 'Off the registration.' }) {
  return (
    <Box position="relative" overflow="hidden" minH="60vh" display="flex" alignItems="center">
      <SEO title="Page not found" noIndex path="/404" />
      <Container size="narrow" position="relative" textAlign="center" py={{ base: 16, md: 24 }}>
        <RegMark size="48px" color={palette.ember} mb={6} />
        <Text fontFamily="mono" color="bone.500" mb={2}>404</Text>
        <Heading as="h1" size="3xl" mb={4}>{title}</Heading>
        <Text color="bone.300" fontSize="lg" maxW="480px" mx="auto" mb={8}>
          That page isn’t on the press. Head back to the shop or ask us where it went.
        </Text>
        <Stack direction={{ base: 'column', sm: 'row' }} justify="center" spacing={3}>
          <Button as={RouterLink} to="/shop/">Shop blanks</Button>
          <Button as={RouterLink} to="/" variant="outline">Home</Button>
        </Stack>
      </Container>
    </Box>
  )
}
