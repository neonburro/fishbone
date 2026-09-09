// src/components/common/InkPaperToggle.jsx
//
// The mode switch. Two words, Scale and Bone, on a pill. Scale is the dark
// side, bone is the light, and the two of them are the fish. The knob
// slides to whichever word is on. Sits in the footer. Chakra remembers the
// choice in localStorage. Nothing about the site says dark mode or light
// mode. In the code the light surfaces are still called paper, because the
// ordering cards are paper, that name stays.

import { Box, HStack, Text, useColorMode } from '@chakra-ui/react'
import { EASE } from '../../theme/layout'

export default function InkPaperToggle(props) {
  const { colorMode, setColorMode } = useColorMode()
  const paper = colorMode === 'light'
  return (
    <HStack
      as="button"
      type="button"
      role="switch"
      aria-checked={paper}
      aria-label={paper ? 'Bone is on. Switch to scale' : 'Scale is on. Switch to bone'}
      onClick={() => setColorMode(paper ? 'dark' : 'light')}
      spacing={0}
      position="relative"
      h="36px"
      p="3px"
      borderRadius="full"
      border="1px solid"
      borderColor="ink.200"
      bg="ink.500"
      transition={`border-color 260ms ${EASE}`}
      _hover={{ borderColor: 'bone.600' }}
      _focusVisible={{ boxShadow: 'outline', outline: 'none' }}
      {...props}
    >
      <Box
        aria-hidden="true"
        position="absolute"
        top="3px"
        bottom="3px"
        left={paper ? 'calc(50% + 0px)' : '3px'}
        w="calc(50% - 3px)"
        borderRadius="full"
        bg="bone.100"
        transition={`left 420ms ${EASE}`}
      />
      {[['Scale', !paper], ['Bone', paper]].map(([label, on]) => (
        <HStack key={label} spacing={2} position="relative" px={4} h="100%" align="center" justify="center" minW="72px">
          <Box w="7px" h="7px" borderRadius="full" bg={on ? 'red.500' : 'transparent'} border="1px solid" borderColor={on ? 'red.500' : 'bone.600'} transition={`background-color 260ms ${EASE}`} />
          <Text as="span" fontFamily="heading" fontSize="15px" fontWeight={700} letterSpacing="0.06em" textTransform="uppercase" lineHeight={1} color={on ? 'ink.900' : 'bone.300'} transition={`color 260ms ${EASE}`}>
            {label}
          </Text>
        </HStack>
      ))}
    </HStack>
  )
}
