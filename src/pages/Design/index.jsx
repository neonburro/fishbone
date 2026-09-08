// src/pages/Design/index.jsx
//
// Share your vision. The door for the person who has an idea and no art.
// The shop has drawn its own art since 1985 and this is where that work
// gets asked for. Same paper form as Shop info, a different first line,
// and it lands in Pulse as a design request so the crew knows a pencil
// comes before a squeegee.

import { Box, Container, Grid, GridItem, Stack, Text } from '@chakra-ui/react'
import SEO from '../../components/common/SEO'
import ContactForm from '../../components/common/ContactForm'
import { FadeIn } from '../../components/common/Motion'
import { useSettings } from '../../hooks/useSettings'
import { MEASURE } from '../../theme/layout'

const STARTS = [
  ['A name and a date', 'A festival, a run, a season. We draw the mark that goes on everything.'],
  ['A napkin', 'Photograph it. Most of the good ones started there.'],
  ['An old shirt', 'The design you loved from years back. We redraw it clean and put it on new blanks.'],
  ['Nothing yet', 'Tell us what the thing is for and who wears it. That is enough to start.'],
]

export default function Design() {
  const { settings } = useSettings()
  const s = settings.store
  return (
    <>
      <SEO title="Share your vision" description="Have the idea and no art yet? Fishbone Graphics has drawn its own designs since 1985. Tell us what it is for and we draw it, then print it." path="/design/" />
      <Container size="page" pt={{ base: 6, md: 12 }} pb={{ base: 12, md: 20 }}>
        <Grid templateColumns={{ base: '1fr', lg: 'minmax(0, 5fr) minmax(0, 7fr)' }} gap={{ base: 10, lg: 16 }} alignItems="start">
          <GridItem>
            <FadeIn>
              <Text fontFamily="heading" fontWeight={500} fontSize={{ base: '1.75rem', md: '2.4rem' }} lineHeight={1.08} color="bone.100" maxW="20ch">
                You have the idea. <Box as="strong" fontWeight={700}>We have the pencils.</Box>
              </Text>
              <Text mt={5} color="bone.300" maxW={MEASURE}>
                Not every job walks in with a file. Some walk in with a story, a date and a strong opinion about green. The shop has drawn its own art for forty years, for the same festivals and crews you see on the wall. Tell us what the thing is for and who wears it. We draw, you say yes or not yet, and then it goes on the press.
              </Text>
              <Stack spacing={3} mt={8}>
                {STARTS.map(([k, v]) => (
                  <Box key={k} borderLeft="2px solid" borderColor="red.500" pl={4}>
                    <Text fontFamily="heading" fontWeight={600} textTransform="uppercase" letterSpacing="0.04em" color="bone.100">{k}</Text>
                    <Text fontSize="sm" color="bone.300">{v}</Text>
                  </Box>
                ))}
              </Stack>
            </FadeIn>
          </GridItem>
          <GridItem>
            <FadeIn delay={0.08}>
              <ContactForm kicker="Share your vision" title="Tell us what it is for." lead="Who wears it, when it is needed, and anything you already have in your head. Photos, sketches and old shirts all welcome. No art required, that is the point." source="/design/" requestType="design" kind="design" notePlaceholder="A shirt for the fall trail crew. Something with the mountain, in two colors, ready by October." phone={s.phone || '(970) 626-4350'} />
            </FadeIn>
          </GridItem>
        </Grid>
      </Container>
    </>
  )
}
