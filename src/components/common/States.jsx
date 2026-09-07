// src/components/common/States.jsx
import { palette } from '../../theme'
import { Box, Button, Heading, Text, Stack, SimpleGrid, Skeleton, SkeletonText } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import RegMark from '../brand/RegMark'

export function LoadError({ title = 'Couldn’t reach the shop.', message, onRetry, error }) {
  const detail = message || 'The catalog didn’t load. Check your connection and try again or call us at (970) 626-4437 and we’ll sort it out the old way.'
  return (
    <Box role="alert" bg="ink.500" border="1px solid" borderColor="ink.300" borderLeft="3px solid" borderLeftColor="ember.500" p={{ base: 5, md: 7 }} borderRadius="base">
      <Stack direction={{ base: 'column', md: 'row' }} spacing={5} align={{ md: 'center' }}>
        <RegMark size="32px" color={palette.ember} />
        <Box flex={1}>
          <Heading size="md" mb={1}>{title}</Heading>
          <Text color="bone.300">{detail}</Text>
          {import.meta.env.DEV && error?.message && (
            <Text variant="mono" mt={2} fontSize="xs" color="bone.500">{error.message}</Text>
          )}
        </Box>
        {onRetry && <Button size="sm" variant="outline" onClick={onRetry}>Retry</Button>}
      </Stack>
    </Box>
  )
}

export function EmptyState({ title = 'Nothing here yet.', message, ctaLabel, ctaTo, children }) {
  return (
    <Box textAlign="center" py={{ base: 12, md: 20 }} px={4} border="1px dashed" borderColor="ink.300" borderRadius="base">
      <RegMark size="36px" color={palette.boneSubtle} mb={5} />
      <Heading size="lg" mb={2}>{title}</Heading>
      {message && <Text color="bone.300" maxW="480px" mx="auto" mb={6}>{message}</Text>}
      {ctaLabel && ctaTo && (
        <Button as={RouterLink} to={ctaTo}>{ctaLabel}</Button>
      )}
      {children}
    </Box>
  )
}

export function CardSkeleton({ count = 4, columns = { base: 2, md: 3, lg: 4 } }) {
  return (
    <SimpleGrid columns={columns} spacing={{ base: 4, md: 6 }}>
      {Array.from({ length: count }).map((_, i) => (
        <Box key={i} bg="ink.500" border="1px solid" borderColor="ink.300" borderRadius="base" overflow="hidden">
          <Skeleton pt="100%" />
          <Box p={4}>
            <SkeletonText noOfLines={2} spacing={2} skeletonHeight={3} />
            <Skeleton h={4} w="40%" mt={3} />
          </Box>
        </Box>
      ))}
    </SimpleGrid>
  )
}

export function BlockSkeleton({ lines = 6, h }) {
  return (
    <Box bg="ink.500" border="1px solid" borderColor="ink.300" borderRadius="base" p={6} h={h}>
      <SkeletonText noOfLines={lines} spacing={3} skeletonHeight={3} />
    </Box>
  )
}
