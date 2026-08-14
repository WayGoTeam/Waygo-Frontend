import { useCallback, useEffect, useRef, useState } from 'react'

interface PollingState<T> {
  data: T | null
  error: Error | null
  loading: boolean
  refetch: () => void
}

/**
 * Fetches on mount, then again every `intervalMs`. A stale response (from a
 * request that was superseded by a newer one, e.g. after a fast refetch) is
 * discarded rather than applied out of order.
 */
export function usePolling<T>(fetcher: () => Promise<T>, intervalMs: number | null): PollingState<T> {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [loading, setLoading] = useState(true)
  const requestId = useRef(0)
  const fetcherRef = useRef(fetcher)
  fetcherRef.current = fetcher

  const load = useCallback(() => {
    const id = ++requestId.current
    fetcherRef.current()
      .then((result) => {
        if (id !== requestId.current) return
        setData(result)
        setError(null)
      })
      .catch((err: Error) => {
        if (id !== requestId.current) return
        setError(err)
      })
      .finally(() => {
        if (id !== requestId.current) return
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    load()
    if (intervalMs === null) return
    const timer = setInterval(load, intervalMs)
    return () => clearInterval(timer)
  }, [load, intervalMs])

  return { data, error, loading, refetch: load }
}
