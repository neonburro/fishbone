// src/hooks/useSettings.jsx
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { DEFAULT_SETTINGS, getPublicSettings } from '../lib/api/settings'
import { getDecorationOptions } from '../lib/api/catalog'

const SettingsContext = createContext({ settings: DEFAULT_SETTINGS, decorationOptions: [], loaded: false, error: null })

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS)
  const [decorationOptions, setDecorationOptions] = useState([])
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    let alive = true
    Promise.allSettled([getPublicSettings(), getDecorationOptions()]).then(([s, d]) => {
      if (!alive) return
      if (s.status === 'fulfilled') setSettings(s.value)
      else setError(s.reason)
      if (d.status === 'fulfilled') setDecorationOptions(d.value)
      setLoaded(true)
    })
    return () => {
      alive = false
    }
  }, [])

  const value = useMemo(() => ({ settings, decorationOptions, loaded, error }), [settings, decorationOptions, loaded, error])
  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSettings() {
  return useContext(SettingsContext)
}
