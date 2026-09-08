// src/pages/About/index.jsx
//
// About, in the shop's own words. Their Facebook bio says it in one line: a
// small town local business producing t-shirts for big time festivals and
// small town business for over thirty years. This page says that and not
// much more. One statement, five short facts, the shop photo, one ask.
//
// No oxford commas, no em dashes.

import { Box, Button, Container, Grid, GridItem, Image, Stack, Text } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import { FiArrowRight } from 'react-icons/fi'
import SEO from '../../components/common/SEO'
import { FadeIn } from '../../components/common/Motion'
import { useSettings } from '../../hooks/useSettings'
import { BAND_Y, MEASURE } from '../../theme/layout'

const FACTS = [
  ['Since', '1985'],
  ['Where', 'Ridgway, Colorado. 250 S Lena St, at the foot of the San Juans.'],
  ['What', 'Screen printing and graphic design, with a specialty in music and festival merch.'],
  ['Who for', 'Festivals, bands, breweries, ski patrol, crews, schools, small businesses and beyond.'],
  ['How', 'A person looks at every job before a screen is burned. High quality, on time, no surprises.'],
]

export default function About() {
  const { settings } = useSettings()
  const s = settings?.store || {}
  return (
    <>
      <SEO title="About" description="A small town shop printing for big time festivals and small town business for over thirty years. Fishbone Graphics, Ridgway, Colorado, since 1985." path="/about/" />
      <Container size="page" pt={{ base: 6, md: 12 }} pb={BAND_Y}>
        <Grid templateColumns={{ base: '1fr', lg: '1.1fr 0.9fr' }} gap={{ base: 10, lg: 14 }} alignItems="start">
          <GridItem>
            <FadeIn>
              <Text as="h1" fontFamily="heading" fontWeight={500} fontSize={{ base: '1.75rem', md: '2.4rem', lg: '3rem' }} lineHeight={1.08} maxW="20ch">
                A small town shop printing for <Box as="strong" fontWeight={700}>festivals, schools, small businesses and beyond</Box> for forty years.
              </Text>
              <Text mt={6} color="bone.300" fontSize={{ base: 'md', md: 'lg' }} maxW={MEASURE}>
                Fishbone has printed the shirts on the merch table at Telluride Bluegrass, the staff tees at Ouray Brewery, the poster shirts for the Telluride Horror Show and the spirit wear for the schools up the valley. Same shop, same street, same owner pulling the squeegee. If you have been to a show in the San Juans you have probably worn our ink.
              </Text>
              <Text mt={4} color="bone.300" fontSize={{ base: 'md', md: 'lg' }} maxW={MEASURE}>
                The work on the wall is the pitch. Eight color art on garment dyed blanks, registration that holds, ink that lasts as long as the shirt. High quality is not a line we say, it is what the prints look like after a hundred washes.
              </Text>
              <Stack spacing={0} mt={{ base: 8, md: 10 }} maxW="640px">
                {FACTS.map(([k, v]) => (
                  <Grid key={k} templateColumns="96px 1fr" gap={4} py={3.5} borderBottom="1px solid" borderColor="ink.300" alignItems="baseline">
                    <Text variant="kicker">{k}</Text>
                    <Text color="bone.100">{v}</Text>
                  </Grid>
                ))}
              </Stack>
              <Stack direction={{ base: 'column', sm: 'row' }} spacing={3} mt={{ base: 8, md: 10 }}>
                <Button as={RouterLink} to="/work/" rightIcon={<FiArrowRight />}>See the work</Button>
                <Button as={RouterLink} to="/contact/" variant="outline">Shop info</Button>
              </Stack>
            </FadeIn>
          </GridItem>
          <GridItem>
            <FadeIn delay={0.08}>
              <Box borderRadius="lg" overflow="hidden" bg="ink.400">
                <Image src="/work/telluride-bluegrass-tent.webp" alt="Fishbone shirts stacked on the merch table at Telluride Bluegrass" w="100%" display="block" />
              </Box>
              <Text mt={3} fontFamily="mono" fontSize="11px" letterSpacing="0.12em" textTransform="uppercase" color="bone.500">Telluride Bluegrass · merch tent · {s.city || 'Ridgway'} to Telluride, one hour</Text>
            </FadeIn>
          </GridItem>
        </Grid>
      </Container>
    </>
  )
}
