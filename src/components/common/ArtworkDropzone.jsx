// src/components/common/ArtworkDropzone.jsx
//
// The file control. A row of square tiles. Each image you add shows as a
// square, other files show as a square with the name, and the last square
// is the empty one you tap to add the next. It caps at MAX_FILES so a
// single request cannot eat the storage tier, and every file goes straight
// to the private artwork bucket at uploads/<uuid>/<name>, the only path
// anon may write. Drop anywhere on the control.
//
// Colors come from the card it sits on. On paper the parent passes paper
// colors through `sx` on the tiles.
//
// No oxford commas, no em dashes.

import { useCallback, useEffect, useRef, useState } from 'react'
import { Box, HStack, IconButton, SimpleGrid, Text, VisuallyHidden } from '@chakra-ui/react'
import { FiPlus, FiX, FiFile, FiAlertTriangle } from 'react-icons/fi'
import { uploadArtwork, removeArtwork, validateArtwork, ARTWORK_ACCEPT_ATTR } from '../../lib/api/storage'
import { bytes } from '../../lib/format'

export const MAX_FILES = 5
const isImage = (f) => /^image\/(png|jpe?g|webp|gif)$/i.test(f?.type || '') || /\.(png|jpe?g|webp|gif)$/i.test(f?.name || '')

function Tile({ children, onClick, label, dashed = false, ...rest }) {
  return (
    <Box
      as={onClick ? 'button' : 'div'}
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      aria-label={label}
      position="relative"
      w="100%"
      pt="100%"
      borderRadius="sm"
      border={dashed ? '1px dashed' : '1px solid'}
      borderColor="ink.200"
      bg="ink.500"
      color="bone.100"
      overflow="hidden"
      cursor={onClick ? 'pointer' : 'default'}
      transition="border-color .15s"
      _hover={onClick ? { borderColor: 'bone.500' } : undefined}
      _focusVisible={{ boxShadow: 'outline', outline: 'none' }}
      {...rest}
    >
      <Box position="absolute" inset={0} display="flex" alignItems="center" justifyContent="center">{children}</Box>
    </Box>
  )
}

export default function ArtworkDropzone({ value = [], onChange, id = 'artwork', label = 'Files', helper, max = MAX_FILES }) {
  const inputRef = useRef(null)
  const [pending, setPending] = useState([])
  const [drag, setDrag] = useState(false)
  const [previews, setPreviews] = useState({})

  const room = Math.max(0, max - (value?.length || 0) - pending.length)

  const handleFiles = useCallback(
    async (fileList) => {
      const files = Array.from(fileList || []).slice(0, room)
      if (!files.length) return
      const results = []
      for (const file of files) {
        const tempId = `${Date.now()}-${Math.random().toString(16).slice(2)}`
        const invalid = validateArtwork(file)
        if (invalid) {
          setPending((p) => [...p, { tempId, name: file.name, size: file.size, error: invalid }])
          continue
        }
        if (isImage(file)) {
          const url = URL.createObjectURL(file)
          setPreviews((pv) => ({ ...pv, [file.name + file.size]: url }))
        }
        setPending((p) => [...p, { tempId, name: file.name, size: file.size, progress: 0, key: file.name + file.size }])
        try {
          const meta = await uploadArtwork(file, (pct) => setPending((p) => p.map((x) => (x.tempId === tempId ? { ...x, progress: pct } : x))))
          results.push({ ...meta, key: file.name + file.size })
          setPending((p) => p.filter((x) => x.tempId !== tempId))
        } catch (e) {
          setPending((p) => p.map((x) => (x.tempId === tempId ? { ...x, error: e.message || 'Upload failed.' } : x)))
        }
      }
      if (results.length) onChange?.([...(value || []), ...results])
    },
    [onChange, value, room]
  )

  useEffect(() => () => { Object.values(previews).forEach((u) => URL.revokeObjectURL(u)) }, [previews])

  const remove = (path) => { onChange?.((value || []).filter((f) => f.path !== path)); removeArtwork(path) }
  const dismiss = (tempId) => setPending((p) => p.filter((x) => x.tempId !== tempId))
  const open = () => { if (room > 0) inputRef.current?.click() }

  return (
    <Box
      onDragOver={(e) => { e.preventDefault(); setDrag(true) }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => { e.preventDefault(); setDrag(false); handleFiles(e.dataTransfer?.files) }}
    >
      <VisuallyHidden>
        <input ref={inputRef} id={id} type="file" multiple accept={ARTWORK_ACCEPT_ATTR} onChange={(e) => { handleFiles(e.target.files); e.target.value = '' }} />
      </VisuallyHidden>
      <SimpleGrid columns={{ base: 3, sm: 5 }} spacing={2} maxW="460px">
        {(value || []).map((f) => (
          <Tile key={f.path} label={f.name}>
            {previews[f.key] || isImage(f) && f.url ? (
              <Box as="img" src={previews[f.key] || f.url} alt={f.name} w="100%" h="100%" objectFit="cover" />
            ) : (
              <Box textAlign="center" px={2}>
                <FiFile size={18} style={{ margin: '0 auto' }} />
                <Text fontFamily="mono" fontSize="9px" letterSpacing="0.06em" mt={1.5} noOfLines={2} wordBreak="break-all">{f.name}</Text>
              </Box>
            )}
            <IconButton aria-label={`Remove ${f.name}`} icon={<FiX size={12} />} size="xs" position="absolute" top={1} right={1} borderRadius="full" bg="rgba(22,22,24,0.7)" color="#EFEAE0" _hover={{ bg: 'red.500' }} onClick={() => remove(f.path)} />
          </Tile>
        ))}
        {pending.map((p) => (
          <Tile key={p.tempId} label={p.name} borderColor={p.error ? 'red.500' : 'ink.200'}>
            {previews[p.key] && !p.error ? <Box as="img" src={previews[p.key]} alt="" w="100%" h="100%" objectFit="cover" opacity={0.5} /> : null}
            <Box position="absolute" inset={0} display="flex" flexDir="column" alignItems="center" justifyContent="center" px={2} textAlign="center">
              {p.error ? <FiAlertTriangle size={16} color="var(--fb-red-500)" /> : <Text fontFamily="mono" fontSize="11px">{p.progress}%</Text>}
              {p.error && <Text fontFamily="mono" fontSize="8px" mt={1} noOfLines={3} color="red.500">{p.error}</Text>}
            </Box>
            {p.error && <IconButton aria-label="Dismiss" icon={<FiX size={12} />} size="xs" position="absolute" top={1} right={1} borderRadius="full" onClick={() => dismiss(p.tempId)} />}
          </Tile>
        ))}
        {room > 0 && (
          <Tile onClick={open} label={`${label}. Add a file`} dashed borderColor={drag ? 'red.500' : 'ink.200'}>
            <Box textAlign="center">
              <FiPlus size={18} style={{ margin: '0 auto' }} />
              <Text fontFamily="mono" fontSize="9px" letterSpacing="0.1em" textTransform="uppercase" mt={1}>Add</Text>
            </Box>
          </Tile>
        )}
      </SimpleGrid>
      <HStack mt={2} spacing={3}>
        <Text fontSize="xs" color="bone.500" lineHeight={1.4}>{helper || 'PNG, JPG, PDF, AI, EPS, PSD or ZIP. Up to 50 MB each.'}</Text>
        <Text fontFamily="mono" fontSize="10px" letterSpacing="0.1em" color="bone.600" flexShrink={0}>{(value?.length || 0) + pending.length}/{max}</Text>
      </HStack>
      {(value || []).some((f) => f.size) && <Text srOnly>{(value || []).map((f) => `${f.name} ${bytes(f.size)}`).join(', ')}</Text>}
    </Box>
  )
}
