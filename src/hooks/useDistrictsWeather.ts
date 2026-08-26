import { useState, useEffect } from 'react'
import { getWeather } from '@/api/weather'
import type { WeatherSnapshot } from '@/types/api'

export const DISTRICTS_COORDS = [
  // Bakının əsas rayonları
  { id: 'nesimi', name: 'Nəsimi', lat: 40.3920, lng: 49.8430 },
  { id: 'yasamal', name: 'Yasamal', lat: 40.3750, lng: 49.8150 },
  { id: 'nerimanov', name: 'Nərimanov', lat: 40.4050, lng: 49.8750 },
  { id: 'sebail', name: 'Səbail', lat: 40.3650, lng: 49.8480 },
  { id: 'xetai', name: 'Xətai', lat: 40.3728, lng: 49.8768 },
  { id: 'bineqedi', name: 'Binəqədi', lat: 40.4300, lng: 49.8200 },
  { id: 'suraxani', name: 'Suraxanı', lat: 40.4200, lng: 49.9800 },
  { id: 'sabuncu', name: 'Sabunçu', lat: 40.4500, lng: 49.9500 },
  { id: 'nizami', name: 'Nizami', lat: 40.4150, lng: 49.9200 },
  { id: 'xezer', name: 'Xəzər', lat: 40.4600, lng: 50.1000 },
  { id: 'qaradag', name: 'Qaradağ', lat: 40.3333, lng: 49.4667 },
  { id: 'pirallahi', name: 'Pirallahı', lat: 40.4667, lng: 50.3333 },
  // Bakı ətrafı
  { id: 'sumqayit', name: 'Sumqayıt', lat: 40.5897, lng: 49.6686 },
  { id: 'xirdalan', name: 'Xırdalan', lat: 40.4481, lng: 49.7550 },
  { id: 'abseron', name: 'Abşeron', lat: 40.4566, lng: 49.7516 },
  { id: 'masazir', name: 'Masazır', lat: 40.4950, lng: 49.7611 },
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
      const results: DistrictWeather[] = []
      // Wait a moment to allow other mount-time API calls to finish and avoid 10 req/s rate limit
      await new Promise((resolve) => setTimeout(resolve, 800))
      
      for (const d of DISTRICTS_COORDS) {
        const snapshot = await getWeather(d.lat, d.lng)
        results.push({
          ...snapshot,
          districtId: d.id,
          districtName: d.name
        })
        // Add small delay between requests
        await new Promise((resolve) => setTimeout(resolve, 150))
      }
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
