import { useCallback } from 'react'
import { getDistrictAnalytics } from '@/api/traffic'
import { usePolling } from './usePolling'

const POLL_MS = 60_000

export function useDistrictAnalytics() {
  const fetcher = useCallback(() => getDistrictAnalytics(), [])
  return usePolling(fetcher, POLL_MS)
}
