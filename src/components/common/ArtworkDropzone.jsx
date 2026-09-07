import { useCallback, useRef, useState } from 'react'
import { Box, Button, HStack, IconButton, Progress, Stack, Text, VisuallyHidden } from '@chakra-ui/react'
import { FiUploadCloud, FiX, FiFile, FiCheck, FiAlertTriangle } from 'react-icons/fi'
import { uploadArtwork, removeArtwork, validateArtwork, ARTWORK_ACCEPT_ATTR } from '../../lib/api/storage'
import { bytes } from '../../lib/format'

/**
 * ArtworkDropzone
 * value: [{path,name,size,type}] (uploaded files)
 * onChange(nextValue)
 * Uploads immediately on drop/select; shows progress per file; remove deletes (best-effort).
 */
export default function ArtworkDropzone({ value = [], onChange, id = 'artwork', label = 'Artwork', helper }) {
  const inputRef = useRef(null)
  const [pending, setPending] = useState([]) // {tempId, name, size, progress, error}
  const [drag, setDrag] = useState(false)

  const handleFiles = useCallback(
    async (fileList) => {
      const files = Array.from(fileList || [])
      if (!files.length) return
      const results = []
      for (const file of files) {
        const tempId = `${Date.now()}-${Math.random().toString(16).slice(2)}`
        const invalid = validateArtwork(file)
        if (invalid) {
          setPending((p) => [...p, { tempId, name: file.name, size: file.size, progress: 0, error: invalid }])
          continue
        }
        setPending((p) => [...p, { tempId, name: file.name, size: file.size, progress: 0 }])
        try {
          const meta = await uploadArtwork(file, (pct) => setPending((p) => p.map((x) => (x.tempId === tempId ? { ...x, progress: pct } : x))))
          results.push(meta)
          setPending((p) => p.filter((x) => x.tempId !== tempId))
        } catch (e) {
          setPending((p) => p.map((x) => (x.tempId === tempId ? { ...x, error: e.message || 'Upload failed.' } : x)))
        }
      }
      if (results.length) onChange?.([...(value || []), ...results])
    },
    [onChange, value]
  )

  const onDrop = (e) => {
    e.preventDefault()
    setDrag(false)
    handleFiles(e.dataTransfer?.files)
  }

  const remove = async (path) => {
    onChange?.((value || []).filter((f) => f.path !== path))
    removeArtwork(path)
  }

  const dismiss = (tempId) => setPending((p) => p.filter((x) => x.tempId !== tempId))

  return (
    <Stack spacing={3}>
      <Box
        role="button"
        tabIndex={0}
        aria-label={`${label}: drop files or press Enter to browse`}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); inputRef.current?.click() } }}
        onDragOver={(e) => { e.preventDefault(); setDrag(true) }}
        onDragLeave={() => setDrag(false)}
        onDrop={onDrop}
        border="2px dashed"
        borderColor={drag ? 'ember.500' : 'ink.300'}
        bg={drag ? 'rgba(255,106,19,0.06)' : 'ink.500'}
        borderRadius="base"
        p={{ base: 5, md: 7 }}
        textAlign="center"
        cursor="pointer"
        transition="border-color .15s, background .15s"
        _hover={{ borderColor: 'bone.600' }}
        _focusVisible={{ boxShadow: 'outline', outline: 'none' }}
      >
        <VisuallyHidden>
          <input ref={inputRef} id={id} type="file" multiple accept={ARTWORK_ACCEPT_ATTR} onChange={(e) => { handleFiles(e.target.files); e.target.value = '' }} />
        </VisuallyHidden>
        <Box color="ember.500" display="inline-block" mb={2}><FiUploadCloud size={28} /></Box>
        <Text fontFamily="heading" fontWeight={700} textTransform="uppercase" letterSpacing="0.06em">Drop art here or browse</Text>
        <Text fontSize="sm" color="bone.500" mt={1}>{helper || 'PNG, JPG, SVG, PDF, AI, EPS, PSD, TIFF or ZIP · up to 50 MB each. Vector or 300 dpi at print size is best.'}</Text>
      </Box>

      {(value?.length > 0 || pending.length > 0) && (
        <Stack spacing={2} as="ul" listStyleType="none" m={0} p={0}>
          {value.map((f) => (
            <HStack as="li" key={f.path} bg="ink.400" border="1px solid" borderColor="ink.300" borderRadius="base" px={3} py={2} spacing={3}>
              <Box color="river.500"><FiCheck /></Box>
              <Box flex={1} minW={0}>
                <Text fontSize="sm" noOfLines={1} color="bone.100">{f.name}</Text>
                <Text fontFamily="mono" fontSize="xs" color="bone.500">{bytes(f.size)} · uploaded</Text>
              </Box>
              <IconButton aria-label={`Remove ${f.name}`} icon={<FiX />} size="sm" variant="ghost" onClick={() => remove(f.path)} />
            </HStack>
          ))}
          {pending.map((p) => (
            <Box as="li" key={p.tempId} bg="ink.400" border="1px solid" borderColor={p.error ? 'ember.600' : 'ink.300'} borderRadius="base" px={3} py={2}>
              <HStack spacing={3}>
                <Box color={p.error ? 'ember.500' : 'bone.500'}>{p.error ? <FiAlertTriangle /> : <FiFile />}</Box>
                <Box flex={1} minW={0}>
                  <Text fontSize="sm" noOfLines={1}>{p.name}</Text>
                  <Text fontFamily="mono" fontSize="xs" color={p.error ? 'ember.400' : 'bone.500'}>{p.error || `${bytes(p.size)} · uploading ${p.progress}%`}</Text>
                </Box>
                {p.error && <IconButton aria-label="Dismiss" icon={<FiX />} size="sm" variant="ghost" onClick={() => dismiss(p.tempId)} />}
              </HStack>
              {!p.error && <Progress value={p.progress} size="xs" mt={2} borderRadius="full" aria-label={`Uploading ${p.name}`} />}
            </Box>
          ))}
        </Stack>
      )}
      {value?.length === 0 && pending.length === 0 && (
        <Button variant="link" size="sm" alignSelf="flex-start" onClick={() => inputRef.current?.click()}>No art yet? Skip it — we can help after you order.</Button>
      )}
    </Stack>
  )
}
