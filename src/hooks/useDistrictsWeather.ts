import { useState, useEffect } from 'react'
import { getWeather } from '@/api/weather'
import type { WeatherSnapshot } from '@/types/api'

export const DISTRICTS_COORDS = [
  { id: 'nesimi', name: 'Nəsimi', lat: 40.3920, lng: 49.8430 },
  { id: 'yasamal', name: 'Yasamal', lat: 40.3750, lng: 49.8150 },
  { id: 'nerimanov', name: 'Nərimanov', lat: 40.4050, lng: 49.8750 },
  { id: 'sebail', name: 'Səbail', lat: 40.3650, lng: 49.8480 },
  { id: 'xetai', name: 'Xətai', lat: 40.3728, lng: 49.8768 },
  { id: 'bineqedi', name: 'Binəqədi', lat: 40.4300, lng: 49.8200 },
  { id: 'suraxani', name: 'Suraxanı', lat: 40.4200, lng: 49.9800 },
  { id: 'sabuncu', name: 'Sabunçu', lat: 40.4500, lng: 49.9500 },
  { id: 'nizami', name: 'Nizami', lat: 40.4150, lng: 49.9200 },
  { id: 'xezer', name: 'Xəzər', lat: 40.4600, lng: 50.1000 }
];

export interface DistrictWeather extends WeatherSnapshot {
  districtId: string;
  districtName: string;
}

export function useDistrictsWeather() {
  const [data, setData] = useState<DistrictWeather[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchDistrictsWeather = async () => {
    try {
      setLoading(true)
      const results = await Promise.all(
        DISTRICTS_COORDS.map(async (d) => {
          const snapshot = await getWeather(d.lat, d.lng)
          return {
            ...snapshot,
            districtId: d.id,
            districtName: d.name
          }
        })
      )
      setData(results)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch districts weather'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDistrictsWeather()
    const intervalId = setInterval(fetchDistrictsWeather, 10 * 60_000) // Poll every 10 min
    return () => clearInterval(intervalId)
  }, [])

  return { data, loading, error, refetch: fetchDistrictsWeather }
}
