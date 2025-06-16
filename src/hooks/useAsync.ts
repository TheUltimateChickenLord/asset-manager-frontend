/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react'

export default function useAsync<T>(
  callback: () => Promise<T>,
  defaultValue?: T,
): [T | undefined, any | undefined, boolean, () => void] {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<any | undefined>()
  const [value, setValue] = useState<T | undefined>(defaultValue)

  useEffect(() => {
    setLoading(true)
  }, [callback])

  useEffect(() => {
    if (loading)
      callback()
        .then(setValue)
        .catch(setError)
        .finally(() => setLoading(false))
  }, [callback, loading])

  const triggerReload = () => setLoading(true)

  return [value, error, loading, triggerReload]
}
