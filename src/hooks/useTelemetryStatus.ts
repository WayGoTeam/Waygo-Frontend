import { useCallback } from 'react'
import { getTelemetryStatus } from '@/api/traffic'
import { usePolling } from './usePolling'

const POLL_MS = 30_000

export function useTelemetryStatus() {
  const fetcher = useCallback(() => getTelemetryStatus(), [])
  return usePolling(fetcher, POLL_MS)
}
