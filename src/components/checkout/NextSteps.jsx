import { Box, Heading, Stack, Text } from '@chakra-ui/react'

const STEPS = [
  { key: 'review', title: 'We review', copy: 'A printer looks at your garments, sizes and art. Usually same or next business day.', statuses: ['pending_review'] },
  { key: 'proof', title: 'You get a proof', copy: 'Mockup plus a firm price by email. Reply with changes or a thumbs up.', statuses: ['quoted'] },
  { key: 'pay', title: 'Invoice & payment', copy: 'Once you approve, we send the invoice. Card or check. Then it’s on the schedule.', statuses: ['awaiting_payment', 'paid'] },
  { key: 'production', title: 'Production', copy: 'Screens burned, ink mixed, shirts pulled and cured. Standard turnaround runs about two weeks.', statuses: ['in_production'] },
  { key: 'done', title: 'Pickup or ship', copy: 'We text when it’s boxed. Grab it at the shop or watch for the tracking number.', statuses: ['ready_for_pickup', 'shipped', 'completed'] },
]

export default function NextSteps({ status = 'pending_review', fulfillment = 'pickup' }) {
  const idx = Math.max(0, STEPS.findIndex((s) => s.statuses.includes(status)))
  const cancelled = status === 'cancelled'
  return (
    <Box>
      <Heading as="h2" size="lg" mb={6}>What happens next</Heading>
      {cancelled && <Text color="ember.400" mb={4}>This order was cancelled. Call the shop if that’s a surprise.</Text>}
      <Stack spacing={0} as="ol" listStyleType="none" m={0} p={0}>
        {STEPS.map((s, i) => {
          const done = !cancelled && i < idx
          const active = !cancelled && i === idx
          return (
            <Box as="li" key={s.key} position="relative" pl={10} pb={i === STEPS.length - 1 ? 0 : 6}>
              {i < STEPS.length - 1 && <Box position="absolute" left="9px" top="22px" bottom={0} w="2px" bg={done ? 'ember.500' : 'ink.300'} />}
              <Box position="absolute" left={0} top="2px" w="20px" h="20px" borderRadius="full" border="2px solid" borderColor={done || active ? 'ember.500' : 'ink.300'} bg={done ? 'ember.500' : active ? 'ink.900' : 'ink.500'} display="flex" alignItems="center" justifyContent="center">
                {active && <Box w="8px" h="8px" borderRadius="full" bg="hivis.500" />}
              </Box>
              <Text fontFamily="mono" fontSize="xs" color={active ? 'hivis.500' : 'bone.600'} mb={0.5}>{String(i + 1).padStart(2, '0')}{active ? ' · NOW' : done ? ' · DONE' : ''}</Text>
              <Text fontFamily="heading" fontWeight={700} textTransform="uppercase" fontSize="lg" color={active || done ? 'bone.100' : 'bone.500'} lineHeight={1.1}>
                {s.key === 'done' && fulfillment === 'ship' ? 'Shipped to you' : s.title}
              </Text>
              <Text fontSize="sm" color={active ? 'bone.300' : 'bone.500'} mt={1}>{s.copy}</Text>
            </Box>
          )
        })}
      </Stack>
    </Box>
  )
}
