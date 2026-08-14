import { useCallback } from 'react'
import { getMapConfig } from '@/api/traffic'
import { usePolling } from './usePolling'

export function useMapConfig() {
  const fetcher = useCallback(() => getMapConfig(), [])
  return usePolling(fetcher, null)
}
