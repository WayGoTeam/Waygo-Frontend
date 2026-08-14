import { useCallback } from 'react'
import { getTransitNetwork } from '@/api/transit'
import { usePolling } from './usePolling'

export function useTransitNetwork() {
  const fetcher = useCallback(() => getTransitNetwork(), [])
  return usePolling(fetcher, null)
}
