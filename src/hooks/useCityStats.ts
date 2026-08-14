import { useCallback } from 'react'
import { getCityStats } from '@/api/traffic'
import { usePolling } from './usePolling'

const POLL_MS = 30_000

export function useCityStats() {
  const fetcher = useCallback(() => getCityStats(), [])
  return usePolling(fetcher, POLL_MS)
}
