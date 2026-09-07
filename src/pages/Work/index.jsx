// src/pages/Work/index.jsx
import { palette } from '../../theme'
import { Box, Button, Heading, SimpleGrid, Stack, Text, Image, Badge, HStack } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import SEO from '../../components/common/SEO'
import PageHero from '../../components/layout/PageHero'
import { Section } from '../../components/common/Section'
import Placeholder from '../../components/common/Placeholder'
import { CardSkeleton } from '../../components/common/States'
import { Reveal } from '../../components/common/Motion'
import useAsync from '../../hooks/useAsync'
import { listSiteMedia } from '../../lib/api/storage'

const PLACEHOLDERS = [
  ['Festival tees', 'Bluegrass weekend · 6-color', 'F'], ['Brewery crew hoodies', 'Discharge on heather', 'B'], ['Ski patrol softshells', 'Embroidered', 'S'],
  ['Gig poster', '3-color, 18×24', 'G'], ['Trail crew work shirts', 'Left chest + back', 'T'], ['Film fest staff', 'Water-based, 2-color', 'C'],
  ['River outfitter caps', '3D puff embroidery', 'R'], ['Wedding weekend tees', 'Single color, soft hand', 'W'], ['School spirit wear', 'Youth to 3XL', 'K'],
  ['Band tour merch', 'Simulated process', 'M'], ['Hot springs towels', 'Embroidered', 'H'], ['Ranch quarter-zips', 'Tone-on-tone', 'Q'],
]

export default function Work() {
  const media = useAsync(() => listSiteMedia('work'), [])
  const photos = media.data || []

  return (
    <>
      <SEO title="Our work" description="Festival merch, band shirts, crew hoodies, gig posters and embroidered caps printed by Fishbone Graphics in Ridgway, Colorado." path="/work/" />
      <PageHero eyebrow="Work" title="Ink that’s been places." lead="Forty seasons of festival tables, taproom shelves and trail crews. Photos are being pulled off the shop wall and scanned. The tiles below fill in as they land." />
      <Section py={{ base: 10, md: 16 }}>
        {media.loading ? (
          <CardSkeleton count={8} columns={{ base: 2, md: 3, lg: 4 }} />
        ) : photos.length > 0 ? (
          <SimpleGrid columns={{ base: 2, md: 3, lg: 4 }} spacing={{ base: 3, md: 5 }}>
            {photos.map((p, i) => (
              <Reveal key={p.name} delay={Math.min(i, 8) * 0.03}>
                <Box position="relative" pt="100%" bg="ink.400" borderRadius="base" overflow="hidden" border="1px solid" borderColor="ink.300">
                  <Image src={p.url} alt={p.name.replace(/[-_]/g, ' ').replace(/\.\w+$/, '')} position="absolute" inset={0} w="100%" h="100%" objectFit="cover" loading="lazy" />
                </Box>
              </Reveal>
            ))}
          </SimpleGrid>
        ) : (
          <>
            <HStack mb={6} spacing={3}><Badge variant="hivis">Photos incoming</Badge><Text fontSize="sm" color="bone.500">{media.error ? 'Gallery didn’t load. Showing the placeholder wall.' : 'Placeholder wall until the shop photos are scanned.'}</Text></HStack>
            <SimpleGrid columns={{ base: 2, md: 3, lg: 4 }} spacing={{ base: 3, md: 5 }}>
              {PLACEHOLDERS.map(([title, sub, letter], i) => (
                <Reveal key={title} delay={Math.min(i, 8) * 0.03}>
                  <Box>
                    <Placeholder label={letter} tone={i % 3 === 0 ? 'ink.400' : i % 3 === 1 ? 'ink.500' : palette.inkRaised} caption={sub} />
                    <Text mt={2} fontFamily="heading" fontWeight={700} textTransform="uppercase" fontSize="sm" letterSpacing="0.04em" color="bone.300">{title}</Text>
                  </Box>
                </Reveal>
              ))}
            </SimpleGrid>
          </>
        )}
        <Stack direction={{ base: 'column', sm: 'row' }} spacing={3} mt={{ base: 10, md: 16 }} align="center" justify="center" textAlign="center">
          <Heading as="h2" size="lg" mr={{ sm: 6 }}>Want yours on this wall?</Heading>
          <Button as={RouterLink} to="/quote/">Start a quote</Button>
          <Button as={RouterLink} to="/shop/" variant="outline">Shop blanks</Button>
        </Stack>
      </Section>
    </>
  )
}
