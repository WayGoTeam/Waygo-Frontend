import { useCallback } from 'react'
import { getTrafficMap } from '@/api/traffic'
import { usePolling } from './usePolling'

const POLL_MS = 45_000

export function useTrafficMap() {
  const fetcher = useCallback(() => getTrafficMap(), [])
  return usePolling(fetcher, POLL_MS)
}
