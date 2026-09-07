import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * useAsync(fn, deps) -> { data, error, loading, reload }
 * Runs fn on mount / deps change; ignores stale results.
 */
export default function useAsync(fn, deps = [], { immediate = true, initial = null } = {}) {
  const [state, setState] = useState({ data: initial, error: null, loading: immediate })
  const seq = useRef(0)
  const fnRef = useRef(fn)
  fnRef.current = fn

  const run = useCallback(async () => {
    const id = ++seq.current
    setState((s) => ({ ...s, loading: true, error: null }))
    try {
      const data = await fnRef.current()
      if (id === seq.current) setState({ data, error: null, loading: false })
    } catch (error) {
      if (id === seq.current) setState((s) => ({ data: s.data, error, loading: false }))
    }
  }, [])

  useEffect(() => {
    if (immediate) run()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return { ...state, reload: run }
}
