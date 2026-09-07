// src/hooks/useOpenStatus.js
//
// 'Open now. Closes 5:00 PM' as a hook. Reads settings.store.hours, computes
// in the shop's time zone and re-checks once a minute so a page left open on
// a counter flips at the right moment.

import { useEffect, useState } from 'react'
import { openStatus } from '../lib/hours'
import { useSettings } from './useSettings'

export default function useOpenStatus() {
  const { settings } = useSettings()
  const hours = settings?.store?.hours
  const [status, setStatus] = useState(() => openStatus(hours))

  useEffect(() => {
    setStatus(openStatus(hours))
    const t = setInterval(() => setStatus(openStatus(hours)), 60 * 1000)
    return () => clearInterval(t)
  }, [hours])

  return status
}
