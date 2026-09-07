// src/pages/Notes/Post.jsx
//
// One note. Markdown body rendered through lib/markdown.js (sanitized), never
// raw HTML from the database. Missing slug or unpublished row lands on the
// empty state, not a crash.

import { Box, Heading, Image, Stack, Text, Button, HStack } from '@chakra-ui/react'
import { Link as RouterLink, useParams } from 'react-router-dom'
import SEO from '../../components/common/SEO'
import { Section } from '../../components/common/Section'
import Kicker from '../../components/common/Kicker'
import { BlockSkeleton, EmptyState, LoadError } from '../../components/common/States'
import useAsync from '../../hooks/useAsync'
import { getPost } from '../../lib/api/posts'
import { renderMarkdown, readingTime, markdownToText } from '../../lib/markdown'
import { formatDate } from '../../lib/format'

export default function NotePost() {
  const { slug } = useParams()
  const post = useAsync(() => getPost(slug), [slug])
  const p = post.data

  if (post.loading) {
    return <Section py={{ base: 12, md: 20 }}><Box maxW="760px"><BlockSkeleton lines={10} /></Box></Section>
  }
  if (post.error) {
    return <Section py={{ base: 12, md: 20 }}><LoadError error={post.error} onRetry={post.reload} /></Section>
  }
  if (!p) {
    return (
      <Section py={{ base: 12, md: 20 }}>
        <EmptyState title="That note isn’t here." message="It may have been unpublished or the link is off by a letter." ctaLabel="All notes" ctaTo="/notes/" />
      </Section>
    )
  }

  const html = renderMarkdown(p.body || '')
  const description = p.excerpt || markdownToText(p.body || '')

  return (
    <>
      <SEO title={p.title} description={description} path={`/notes/${p.slug}/`} image={p.cover} type="article" />
      <Section py={{ base: 10, md: 16 }}>
        <Box maxW="760px">
          <Stack spacing={4} mb={{ base: 8, md: 10 }}>
            <Kicker mark>{p.kicker || 'Note'}</Kicker>
            <Heading as="h1" size="2xl" lineHeight="0.95">{p.title}</Heading>
            <Text variant="mono" fontSize="xs" color="bone.500">
              {p.published_at ? formatDate(p.published_at) : ''}{p.author_name ? ` · ${p.author_name}` : ''} · {readingTime(p.body || '')}
            </Text>
          </Stack>
          {p.cover && <Image src={p.cover} alt={p.cover_alt || ''} w="100%" borderRadius="base" mb={{ base: 8, md: 10 }} />}
          <Box className="prose" color="bone.300" fontSize={{ base: 'md', md: 'lg' }} lineHeight="1.7"
            sx={{
              '& h2, & h3': { fontFamily: 'heading', textTransform: 'uppercase', color: 'bone.100', mt: 8, mb: 3, lineHeight: 1.05 },
              '& h2': { fontSize: '2xl' }, '& h3': { fontSize: 'xl' },
              '& p': { mb: 4 }, '& ul, & ol': { pl: 6, mb: 4 }, '& li': { mb: 1 },
              '& a': { color: 'ember.500', textDecoration: 'underline', textUnderlineOffset: '3px' },
              '& blockquote': { borderLeft: '2px solid', borderColor: 'ember.500', pl: 4, color: 'bone.400', my: 6 },
              '& code': { fontFamily: 'mono', fontSize: '0.9em', bg: 'ink.500', px: 1.5, py: 0.5, borderRadius: 'base' },
              '& hr': { borderColor: 'ink.300', my: 8 },
              '& img': { borderRadius: 'base', my: 6 },
            }}
            dangerouslySetInnerHTML={{ __html: html }}
          />
          <HStack mt={{ base: 10, md: 14 }} spacing={3} flexWrap="wrap">
            <Button as={RouterLink} to="/notes/" variant="outline">All notes</Button>
            <Button as={RouterLink} to="/quote/">Start a quote</Button>
          </HStack>
        </Box>
      </Section>
    </>
  )
}
