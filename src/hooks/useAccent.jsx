// src/hooks/useAccent.jsx
//
// Which ink is on. The visitor's own pick in this browser wins, then the
// shop's default from Settings > Design in Backstage, then Registration
// red. Applied to <html> as CSS variables, see theme/accents.js.

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { ACCENTS, DEFAULT_ACCENT, accentByKey, applyAccent, readStoredAccent, storeAccent } from '../theme/accents'
import { useSettings } from './useSettings'

const AccentContext = createContext({ accent: DEFAULT_ACCENT, setAccent: () => {}, accents: ACCENTS, switcher: true })

export function AccentProvider({ children }) {
  const { settings, loaded } = useSettings()
  const shopDefault = accentByKey(settings?.design?.accent).key
  const switcher = settings?.design?.switcher !== false
  const [picked, setPicked] = useState(() => readStoredAccent())
  const accent = switcher && picked ? accentByKey(picked).key : shopDefault

  useEffect(() => { applyAccent(accent) }, [accent, loaded])

  const setAccent = useCallback((key) => { const k = accentByKey(key).key; setPicked(k); storeAccent(k) }, [])
  const value = useMemo(() => ({ accent, setAccent, accents: ACCENTS, switcher }), [accent, setAccent, switcher])
  return <AccentContext.Provider value={value}>{children}</AccentContext.Provider>
}

export function useAccent() {
  return useContext(AccentContext)
}
