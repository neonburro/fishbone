// src/components/cart/CartLine.jsx
import { useState } from 'react'
import {
  Box, Button, HStack, IconButton, Stack, Text, Collapse, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper,
  NumberDecrementStepper, Textarea, FormControl, FormLabel, Badge, Wrap, WrapItem,
} from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import { FiTrash2, FiEdit2, FiChevronUp } from 'react-icons/fi'
import ProductImage from '../common/ProductImage'
import SizeGrid from '../product/SizeGrid'
import ArtworkDropzone from '../common/ArtworkDropzone'
import { money, locationLabel, methodLabel, sizeBreakdownText } from '../../lib/format'
import { priceLine } from '../../store/cartStore'
import { useSettings } from '../../hooks/useSettings'

export default function CartLine({ line, onUpdate, onRemove }) {
  const { decorationOptions } = useSettings()
  const [editing, setEditing] = useState(false)
  const { unit, total } = priceLine(line)
  const sizes = line.snapshot?.sizes || Object.keys(line.sizeBreakdown || {})
  const sizeTotal = Object.values(line.sizeBreakdown || {}).reduce((n, v) => n + (Number(v) || 0), 0)
  const mismatch = sizeTotal !== line.quantity

  const setQty = (n) => {
    const q = Math.max(line.minQuantity || 1, Number(n) || 0)
    onUpdate({ quantity: q })
  }

  return (
    <Box bg="ink.500" border="1px solid" borderColor={mismatch ? 'ember.600' : 'ink.300'} borderRadius="base" p={{ base: 4, md: 5 }}>
      <Stack direction={{ base: 'column', sm: 'row' }} spacing={5} align="flex-start">
        <Box w={{ base: '100%', sm: '110px' }} flexShrink={0}>
          <ProductImage src={line.image} alt={line.name} label={line.brand || line.name} caption={line.styleNumber} />
        </Box>
        <Box flex={1} minW={0}>
          <HStack justify="space-between" align="flex-start" spacing={4}>
            <Box minW={0}>
              <Text fontFamily="mono" fontSize="xs" color="bone.500" textTransform="uppercase" letterSpacing="0.06em">{[line.brand, line.styleNumber, line.sku].filter(Boolean).join(' · ')}</Text>
              <Text as={RouterLink} to={`/product/${line.slug}/`} fontFamily="heading" fontWeight={700} textTransform="uppercase" fontSize="xl" lineHeight={1.1} display="block" _hover={{ color: 'ember.500' }}>{line.name}</Text>
              <HStack mt={2} spacing={2} flexWrap="wrap" rowGap={1}>
                {line.variantLabel && (
                  <HStack spacing={1.5}>
                    <Box w="14px" h="14px" borderRadius="sm" bg={line.colorHex || '#888'} border="1px solid" borderColor="ink.100" />
                    <Text fontSize="sm" color="bone.300">{line.variantLabel}</Text>
                  </HStack>
                )}
                {line.decorationMethod && line.decorationMethod !== 'none' && <Badge variant="river">{methodLabel(line.decorationMethod, decorationOptions)}</Badge>}
                {(line.printLocations || []).map((l) => <Badge key={l} variant="outline">{locationLabel(l)}</Badge>)}
              </HStack>
            </Box>
            <Box textAlign="right" flexShrink={0}>
              <Text fontFamily="mono" fontSize="lg" color="bone.100">{money(total)}</Text>
              <Text fontFamily="mono" fontSize="xs" color="bone.500">{line.quantity} × {money(unit)}</Text>
            </Box>
          </HStack>

          <HStack mt={3} spacing={4} fontSize="sm" color="bone.300" flexWrap="wrap" rowGap={1}>
            <Text fontFamily="mono" fontSize="xs" color={mismatch ? 'ember.400' : 'bone.300'}>
              Sizes: {sizeBreakdownText(line.sizeBreakdown) || 'none'}{mismatch ? ` (${sizeTotal}/${line.quantity}, fix below)` : ''}
            </Text>
            {line.artworkFiles?.length > 0 && <Text fontSize="xs" color="bone.500">{line.artworkFiles.length} art file{line.artworkFiles.length > 1 ? 's' : ''}</Text>}
            {line.notes && <Text fontSize="xs" color="bone.500" noOfLines={1}>“{line.notes}”</Text>}
          </HStack>

          <HStack mt={4} spacing={2}>
            <Button size="sm" variant={editing ? 'ghost' : 'outline'} leftIcon={editing ? <FiChevronUp /> : <FiEdit2 />} onClick={() => setEditing((v) => !v)} aria-expanded={editing}>
              {editing ? 'Done' : 'Edit line'}
            </Button>
            <IconButton size="sm" variant="ghost" aria-label={`Remove ${line.name} from order`} icon={<FiTrash2 />} onClick={onRemove} color="bone.500" _hover={{ color: 'ember.500', bg: 'ink.400' }} />
          </HStack>
        </Box>
      </Stack>

      <Collapse in={editing} animateOpacity>
        <Stack spacing={5} mt={5} pt={5} borderTop="1px solid" borderColor="ink.300">
          <Stack direction={{ base: 'column', md: 'row' }} spacing={5}>
            <FormControl maxW="200px">
              <FormLabel htmlFor={`qty-${line.lineId}`}>Quantity (min {line.minQuantity || 1})</FormLabel>
              <NumberInput id={`qty-${line.lineId}`} value={line.quantity} min={line.minQuantity || 1} onChange={(_, n) => setQty(n)} clampValueOnBlur>
                <NumberInputField fontFamily="mono" />
                <NumberInputStepper><NumberIncrementStepper /><NumberDecrementStepper /></NumberInputStepper>
              </NumberInput>
            </FormControl>
            <Box flex={1}>
              <SizeGrid sizes={sizes} value={line.sizeBreakdown || {}} quantity={line.quantity} onChange={(sb) => onUpdate({ sizeBreakdown: sb })} />
            </Box>
          </Stack>
          <FormControl>
            <FormLabel>Artwork</FormLabel>
            <ArtworkDropzone id={`art-${line.lineId}`} value={line.artworkFiles || []} onChange={(files) => onUpdate({ artworkFiles: files })} />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor={`notes-${line.lineId}`}>Notes</FormLabel>
            <Textarea id={`notes-${line.lineId}`} value={line.notes || ''} onChange={(e) => onUpdate({ notes: e.target.value })} rows={2} />
          </FormControl>
          <Wrap>
            <WrapItem><Button as={RouterLink} to={`/product/${line.slug}/`} variant="link" size="sm">Change color or print options on the product page</Button></WrapItem>
          </Wrap>
        </Stack>
      </Collapse>
    </Box>
  )
}
