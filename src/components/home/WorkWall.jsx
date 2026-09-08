// src/components/home/WorkWall.jsx
//
// The wall. The first thing under the opener on the home page and the whole
// of /work/. A grid of the shop's prints with a one line mono caption that
// only shows on hover on a desktop and always shows on a phone. The first
// tile is the one landscape photo and it takes two columns. Reads
// showcase_items (placement home or work) and falls back to src/data/work.js
// while the table is empty. No lightbox yet, that comes with the showcase
// manager in Pulse. Tap a tile and it opens in the Lightbox, bigger, with
// zoom.
//
// No oxford commas, no em dashes.

import { useState } from 'react'
import { Box, Button, Image, SimpleGrid, Text } from '@chakra-ui/react'
import { Reveal } from '../common/Motion'
import Lightbox from '../common/Lightbox'
import useAsync from '../../hooks/useAsync'
import { getShowcase } from '../../lib/api/showcase'
import { workAsShowcase } from '../../data/work'
import { EASE, GUTTER } from '../../theme/layout'

const FALLBACK = workAsShowcase()

// `limit` is the first cut. With `more`, a View more button under the grid
// lets people keep opening the wall a dozen at a time, up to what was fetched.
export default function WorkWall({ placement = ['home', 'work'], limit, more = false, columns = { base: 2, md: 3, lg: 4, xl: 6 } }) {
  const fetchLimit = limit && more ? Math.max(limit, 36) : limit
  const live = useAsync(() => getShowcase({ placement, limit: fetchLimit }), [String(placement), fetchLimit])
  const rows = live.data?.length ? live.data : FALLBACK
  const [shown, setShown] = useState(limit || Infinity)
  const list = rows.slice(0, shown)
  const rest = rows.length - list.length
  const [open, setOpen] = useState(-1)

  return (
    <>
    <SimpleGrid columns={columns} spacing={GUTTER} role="list" aria-label="Recent work">
      {list.map((it, i) => {
        const wide = it.wide || (it.ratio && it.ratio > 1.15)
        return (
          <Reveal key={it.id} delay={Math.min(i, 8) * 0.03} role="listitem" gridColumn={wide ? { base: 'span 2', md: 'span 2' } : undefined}>
            <Box
              as="button"
              type="button"
              aria-label={`Open ${it.client_name || it.title || 'print'} larger`}
              onClick={() => setOpen(i)}
              display="block"
              w="100%"
              textAlign="left"
              position="relative"
              borderRadius="md"
              overflow="hidden"
              bg="ink.400"
              pt={wide ? '75%' : '133%'}
              role="group"
              cursor="zoom-in"
              _focusVisible={{ boxShadow: 'outline', outline: 'none' }}
            >
              <Image
                src={it.src}
                alt={it.alt || it.title || ''}
                position="absolute"
                inset={0}
                w="100%"
                h="100%"
                objectFit="cover"
                loading={i < 6 ? 'eager' : 'lazy'}
                transition={`transform 900ms ${EASE}`}
                _groupHover={{ transform: 'scale(1.04)' }}
              />
              <Box
                position="absolute"
                left={0}
                right={0}
                bottom={0}
                px={3}
                pt={8}
                pb={2.5}
                bgGradient="linear(to-t, rgba(22,22,24,0.85), transparent)"
                opacity={{ base: 1, md: 0 }}
                transition={`opacity 380ms ${EASE}`}
                _groupHover={{ opacity: 1 }}
              >
                <Text fontFamily="mono" fontSize="10px" letterSpacing="0.1em" textTransform="uppercase" color="bone.100" noOfLines={1}>
                  {it.client_name || it.title}
                  {it.year ? <Text as="span" color="bone.400"> · {it.year}</Text> : null}
                </Text>
              </Box>
            </Box>
          </Reveal>
        )
      })}
    </SimpleGrid>
    {more && rest > 0 && (
      <Box textAlign="center" mt={{ base: 5, md: 7 }}>
        <Button variant="outline" size="sm" onClick={() => setShown((n) => n + 12)}>View more</Button>
      </Box>
    )}
    <Lightbox items={list} index={open} onClose={() => setOpen(-1)} onIndex={setOpen} />
    </>
  )
}
