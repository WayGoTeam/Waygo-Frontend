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
      // Batch requests 4 at a time to avoid rate limiting (Nginx: 30r/m)
      const BATCH_SIZE = 4
      const results: DistrictWeather[] = []
      for (let i = 0; i < DISTRICTS_COORDS.length; i += BATCH_SIZE) {
        const batch = DISTRICTS_COORDS.slice(i, i + BATCH_SIZE)
        const settled = await Promise.allSettled(
          batch.map(async (d) => {
            const snapshot = await getWeather(d.lat, d.lng)
            return { ...snapshot, districtId: d.id, districtName: d.name }
          })
        )
        for (const result of settled) {
          if (result.status === 'fulfilled') {
            results.push(result.value)
          }
          // silently ignore individual district fetch failures
        }
        // Small delay between batches to stay within rate limits
        if (i + BATCH_SIZE < DISTRICTS_COORDS.length) {
          await new Promise((r) => setTimeout(r, 300))
        }
      }
      if (results.length > 0) {
        setData(results)
        setError(null)
      } else {
        setError(new Error('Failed to fetch districts weather'))
      }
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
