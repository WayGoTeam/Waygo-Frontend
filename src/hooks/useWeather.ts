import { useCallback } from 'react'
import { getWeather } from '@/api/weather'
import { usePolling } from './usePolling'

const POLL_MS = 10 * 60_000

export function useWeather(latitude?: number, longitude?: number) {
  const fetcher = useCallback(() => getWeather(latitude, longitude), [latitude, longitude])
  return usePolling(fetcher, POLL_MS)
}
