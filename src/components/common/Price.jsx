// src/components/common/Price.jsx
//
// Every price on the storefront goes through here so a change in Pulse
// shows everywhere at once. It renders money, zero included, until the
// system is smarter. Pulse's show_prices switch, when off, renders a dash.

import { Text } from '@chakra-ui/react'
import { useSettings } from '../../hooks/useSettings'
import { money } from '../../lib/format'

export function usePricesShown() {
  const { settings } = useSettings()
  return settings?.pricing?.show_prices !== false
}

export default function Price({ value, short = false, prefix = '', suffix = '', ...rest }) {
  const shown = usePricesShown()
  const n = Number(value)
  if (!shown) return <Text as="span" fontFamily="mono" color="bone.300" {...rest}>{short ? '' : ''}—</Text>
  return <Text as="span" {...rest}>{prefix}{money(Number.isFinite(n) ? n : 0)}{suffix}</Text>
}
