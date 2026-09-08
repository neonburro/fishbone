// src/components/common/ContactForm.jsx
//
// The one form. It sits on the home page and on Shop info and it is the same
// component in both places: name, email, phone, a line of text and a file
// drop. It writes a quote_requests row with request_type 'contact' (or
// whatever requestType the page passes, the design page passes 'design') so it
// lands in Pulse beside every other request, puts the files in the private
// artwork bucket, and then pings the shop through the notify-admin Netlify
// function so an email lands at the admin address with a link into Pulse.
// If the ping fails the row is still saved, the email is a courtesy.
//
// It is always on paper. Ordering and asking happen on paper.
//
// No oxford commas, no em dashes.

import { useState } from 'react'
import { Alert, AlertDescription, AlertIcon, Box, Button, FormControl, FormErrorMessage, FormLabel, Grid, Heading, HStack, Input, Stack, Text, Textarea } from '@chakra-ui/react'
import ArtworkDropzone from './ArtworkDropzone'
import { submitQuote } from '../../lib/api/quotes'
import { notifyAdmin } from '../../lib/api/notify'
import { MEASURE } from '../../theme/layout'

const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(v || '').trim())

// Fields on paper. White, an ink hairline, red when focused. The two CSS
// variables tell the autofill rule in the theme what surface to repaint.
export const paperField = {
  bg: '#FFFFFF',
  borderColor: 'paper.200',
  color: 'paper.900',
  borderRadius: 'sm',
  _placeholder: { color: 'paper.300' },
  _hover: { borderColor: 'paper.300' },
  _focusVisible: { borderColor: 'red.500', boxShadow: '0 0 0 1px var(--fb-red-500)' },
  sx: { '--fb-field-bg': '#FFFFFF', '--fb-field-fg': '#1B1B1E' },
}

const dropzoneOnPaper = {
  '& [role=button], & button[aria-label], & div[aria-label]': { bg: '#FFFFFF', borderColor: 'paper.200', color: 'paper.900' },
  '& button[aria-label]:hover': { borderColor: 'paper.300' },
}

export default function ContactForm({ kicker = 'Send us something', title = 'A file, a sketch, a question.', lead = 'Drop art if you have it. A napkin drawing counts. We will come back with a proof or a straight answer.', phone = '(970) 626-4350', source = 'contact', requestType = 'contact', kind = 'contact', notePlaceholder = 'Forty shirts for a show in June. Here is the art.', ...rest }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', description: '', artwork_files: [] })
  const [touched, setTouched] = useState(false)
  const [sending, setSending] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState(null)
  const errors = {
    name: form.name.trim().length < 2 ? 'Your name, please.' : null,
    email: !emailOk(form.email) ? 'A working email so we can reply.' : null,
    description: form.description.trim().length < 3 && form.artwork_files.length === 0 ? 'A sentence or a file. Either one.' : null,
  }
  const valid = !Object.values(errors).some(Boolean)
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault(); setTouched(true)
    if (!valid) return
    setSending(true); setError(null)
    try {
      await submitQuote({ ...form, request_type: requestType, product_interest: [requestType], source_page: source })
      notifyAdmin({ kind, ...form, files: form.artwork_files.map((f) => f.name) })
      setDone(true)
    } catch (err) { setError(err) } finally { setSending(false) }
  }

  return (
    <Box bg="paper.50" color="paper.900" borderRadius="lg" p={{ base: 5, md: 8 }} boxShadow="paper" {...rest}>
      {done ? (
        <Stack spacing={3}>
          <Text variant="kicker" color="red.500">Sent</Text>
          <Heading as="h2" size="xl" color="paper.900">Got it.</Heading>
          <Text color="paper.500" maxW={MEASURE}>We read everything that comes in here, usually the same day. If it is urgent, call {phone}.</Text>
        </Stack>
      ) : (
        <Box as="form" onSubmit={submit} noValidate>
          <Text variant="kicker" color="paper.500">{kicker}</Text>
          <Heading as="h2" size="xl" mt={3} mb={2} color="paper.900">{title}</Heading>
          <Text color="paper.500" fontSize="sm" mb={6} maxW={MEASURE}>{lead}</Text>
          <Stack spacing={5}>
            {error && <Alert status="error" colorScheme="red" bg="paper.100" color="paper.900" borderRadius="md"><AlertIcon /><AlertDescription fontSize="sm">{error.message}</AlertDescription></Alert>}
            <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={5}>
              <FormControl isRequired isInvalid={touched && !!errors.name}>
                <FormLabel htmlFor={`${source}-name`} color="paper.500">Name</FormLabel>
                <Input id={`${source}-name`} autoComplete="name" value={form.name} onChange={set('name')} {...paperField} />
                <FormErrorMessage>{errors.name}</FormErrorMessage>
              </FormControl>
              <FormControl>
                <FormLabel htmlFor={`${source}-phone`} color="paper.500">Phone</FormLabel>
                <Input id={`${source}-phone`} type="tel" autoComplete="tel" value={form.phone} onChange={set('phone')} {...paperField} />
              </FormControl>
            </Grid>
            <FormControl isRequired isInvalid={touched && !!errors.email}>
              <FormLabel htmlFor={`${source}-email`} color="paper.500">Email</FormLabel>
              <Input id={`${source}-email`} type="email" autoComplete="email" value={form.email} onChange={set('email')} {...paperField} />
              <FormErrorMessage>{errors.email}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={touched && !!errors.description}>
              <FormLabel htmlFor={`${source}-msg`} color="paper.500">What is it</FormLabel>
              <Textarea id={`${source}-msg`} rows={4} value={form.description} onChange={set('description')} placeholder={notePlaceholder} {...paperField} />
              <FormErrorMessage>{errors.description}</FormErrorMessage>
            </FormControl>
            <Box sx={dropzoneOnPaper}>
              <ArtworkDropzone id={`${source}-art`} value={form.artwork_files} onChange={(files) => setForm((f) => ({ ...f, artwork_files: files }))} label="Files" helper="PNG, JPG, PDF, AI, EPS, PSD or ZIP. Up to 50 MB each." />
            </Box>
            <HStack justify="flex-end" pt={1}>
              <Button type="submit" isLoading={sending} size="md">Send it</Button>
            </HStack>
          </Stack>
        </Box>
      )}
    </Box>
  )
}
