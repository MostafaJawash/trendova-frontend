/* oxlint-disable react(set-state-in-effect), react-hooks(exhaustive-deps) */
import { useCallback, useEffect, useState } from 'react'

export function useFetch(fetcher, dependencies = []) {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const [version, setVersion] = useState(0)
  const reload = useCallback(() => setVersion((value) => value + 1), [])

  useEffect(() => {
    let active = true
    setLoading(true)
    setError(null)
    Promise.resolve(fetcher())
      .then((value) => { if (active) setData(value) })
      .catch((reason) => { if (active) setError(reason) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [...dependencies, version])

  return { data, error, loading, reload }
}
