// src/pages/Notes/index.jsx
//
// Notes. Short briefs the shop writes in Pulse: festival planning, deadlines,
// what prints well. Pinned post leads, the rest run newest first. Words stay
// short here, this is a bulletin board, not a blog.

import { Box, Heading, SimpleGrid, Stack, Text, Image, LinkBox, LinkOverlay } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import SEO from '../../components/common/SEO'
import PageHero from '../../components/layout/PageHero'
import { Section } from '../../components/common/Section'
import Kicker from '../../components/common/Kicker'
import { CardSkeleton, EmptyState, LoadError } from '../../components/common/States'
import { Reveal } from '../../components/common/Motion'
import useAsync from '../../hooks/useAsync'
import { getPosts } from '../../lib/api/posts'
import { formatDate } from '../../lib/format'

export function NoteCard({ post, index }) {
  return (
    <Reveal delay={Math.min(index, 8) * 0.04}>
      <LinkBox as="article" h="100%" display="flex" flexDirection="column" border="1px solid" borderColor="ink.300" bg="ink.500" borderRadius="base" overflow="hidden" transition="border-color 260ms cubic-bezier(0.16, 1, 0.3, 1)" _hover={{ borderColor: 'ember.500' }}>
        {post.cover && <Image src={post.cover} alt={post.cover_alt || ''} w="100%" h="180px" objectFit="cover" loading="lazy" />}
        <Stack spacing={3} p={{ base: 5, md: 6 }} flex="1">
          <Kicker mark={post.is_pinned}>{post.kicker || (post.is_pinned ? 'Pinned' : 'Note')}</Kicker>
          <Heading as="h3" size="md" lineHeight="1.05">
            <LinkOverlay as={RouterLink} to={`/notes/${post.slug}/`}>{post.title}</LinkOverlay>
          </Heading>
          {post.excerpt && <Text color="bone.400" fontSize="sm">{post.excerpt}</Text>}
          <Text mt="auto" pt={2} variant="mono" fontSize="xs" color="bone.500">
            {post.published_at ? formatDate(post.published_at) : 'Draft'}{post.author_name ? ` · ${post.author_name}` : ''}
          </Text>
        </Stack>
      </LinkBox>
    </Reveal>
  )
}

export default function Notes() {
  const posts = useAsync(() => getPosts(), [])
  const rows = posts.data || []

  return (
    <>
      <SEO title="Notes" description="Short notes from the Fishbone Graphics print shop in Ridgway, Colorado. Festival deadlines, what prints well and how to send art." path="/notes/" />
      <PageHero eyebrow="Notes" title="From the shop floor." lead="Deadlines, festival season, what makes a shirt print well. Short and current." />
      <Section py={{ base: 10, md: 16 }}>
        {posts.loading ? (
          <CardSkeleton count={6} columns={{ base: 1, md: 2, lg: 3 }} />
        ) : posts.error ? (
          <LoadError error={posts.error} onRetry={posts.reload} />
        ) : rows.length === 0 ? (
          <EmptyState title="Nothing posted yet." message="Festival season notes land here first." ctaLabel="Ask us directly" ctaTo="/contact/" />
        ) : (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={{ base: 4, md: 6 }}>
            {rows.map((p, i) => <NoteCard key={p.id} post={p} index={i} />)}
          </SimpleGrid>
        )}
        <Box mt={{ base: 10, md: 16 }} />
      </Section>
    </>
  )
}
