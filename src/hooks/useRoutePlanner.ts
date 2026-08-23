import { useEffect, useRef, useState } from 'react'
import { getRoute } from '@/api/maps'
import { getAiRoute } from '@/api/navigation'
import { calculateSmartEta } from '@/api/traffic'
import { useAuth } from '@/context/AuthContext'
import { pickNearestSegments } from '@/lib/geo'
import type { PlaceResult } from '@/components/layout/GlobalSearch'
import type { Coordinate, RouteMode, TrafficMapEntry } from '@/types/api'

export interface ForecastPoint {
  offsetMinutes: number
  minutes: number
}

export interface RouteResult {
  points: Coordinate[]
  distanceMeters: number
  travelTimeSeconds: number
  trafficDelaySeconds: number
  freeFlowTravelTimeSeconds: number | null
  forecast: ForecastPoint[] | null
  ecoPointsEarned?: number
  verraHash?: string
  co2SavedKg?: number
  tripId?: string
}

export function useRoutePlanner(segments: TrafficMapEntry[] | null) {
  const [origin, setOrigin] = useState<PlaceResult | null>(null)
  const [destination, setDestination] = useState<PlaceResult | null>(null)
  const [mode, setMode] = useState<RouteMode>('fastest')
  const [route, setRoute] = useState<RouteResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [tripActive, setTripActive] = useState(false)
  const requestId = useRef(0)
  const { user } = useAuth()

  const fetchCurrentLocation = () => {
    if (navigator.geolocation) {
      const setPos = () => {
        navigator.geolocation.getCurrentPosition((pos) => {
          setOrigin((prev) => {
            if (prev) return prev
            return {
              label: 'Mənim konumum',
              subtitle: 'Cari Koordinat',
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
            }
          })
        })
      }

      if (navigator.permissions) {
        navigator.permissions.query({ name: 'geolocation' }).then((result) => {
          if (result.state === 'granted') {
            setPos()
          }
        }).catch(() => {})
      }
    }
  }

  useEffect(() => {
    fetchCurrentLocation()
  }, [])

  async function compute(o: PlaceResult, d: PlaceResult, m: RouteMode) {
    const id = ++requestId.current
    setLoading(true)
    setError(null)
    try {
      let routes: any[] = []
      let ecoPointsEarned: number | undefined
      let verraHash: string | undefined
      let co2SavedKg: number | undefined
      let tripId: string | undefined

      if (user) {
        const raw = await getAiRoute(o.lat, o.lng, d.lat, d.lng, m, user.vehicleType)
        if (id !== requestId.current) return // a newer request has since started — drop this one
        const tomTomData = raw.routeJson ? JSON.parse(raw.routeJson) : {}
        routes = tomTomData.routes ?? []
        ecoPointsEarned = raw.ecoPointsEarned
        verraHash = raw.verraHash
        co2SavedKg = raw.co2SavedKg
        tripId = raw.tripId
      } else {
        const raw = await getRoute(o.lat, o.lng, d.lat, d.lng, m)
        if (id !== requestId.current) return
        routes = raw.routes ?? []
      }
      const chosen = m === 'alternative' ? (routes[1] ?? routes[0]) : routes[0]
      if (!chosen) {
        setRoute(null)
        setError('no-route')
        return
      }
      const points = chosen.legs.flatMap((leg: any) =>
        leg.points.map((p: any) => ({ latitude: p.latitude, longitude: p.longitude })),
      )

      let forecast: ForecastPoint[] | null = null
      if (segments && segments.length > 0) {
        const nearest = pickNearestSegments(points, segments, 3)
        if (nearest.length > 0) {
          try {
            const smartEta = await calculateSmartEta(nearest)
            if (id !== requestId.current) return
            const baselineWindow = smartEta.windows[0]
            if (baselineWindow && baselineWindow.travelMinutes > 0.1) {
              const baselineMinutes = chosen.summary.travelTimeInSeconds / 60
              forecast = smartEta.windows.map((w) => ({
                offsetMinutes: w.departureOffsetMinutes,
                minutes: baselineMinutes * (w.travelMinutes / baselineWindow.travelMinutes),
              }))
            }
          } catch {
            forecast = null
          }
        }
      }

      if (id !== requestId.current) return
      setRoute({
        points,
        distanceMeters: chosen.summary.lengthInMeters,
        travelTimeSeconds: chosen.summary.travelTimeInSeconds,
        trafficDelaySeconds: chosen.summary.trafficDelayInSeconds ?? 0,
        freeFlowTravelTimeSeconds: chosen.summary.noTrafficTravelTimeInSeconds ?? null,
        forecast,
        ecoPointsEarned,
        verraHash,
        co2SavedKg,
        tripId,
      })
    } catch {
      if (id !== requestId.current) return
      setRoute(null)
      setError('failed')
    } finally {
      if (id === requestId.current) setLoading(false)
    }
  }

  useEffect(() => {
    if (origin && destination) void compute(origin, destination, mode)
    else requestId.current++ // invalidate any in-flight request now that a point was cleared
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [origin, destination, mode])

  function swap() {
    setOrigin(destination)
    setDestination(origin)
  }

  function clear() {
    requestId.current++
    setOrigin(null)
    setDestination(null)
    setRoute(null)
    setError(null)
    setTripActive(false)
    fetchCurrentLocation()
  }

  return {
    origin,
    setOrigin,
    destination,
    setDestination,
    mode,
    setMode,
    route,
    loading,
    error,
    swap,
    clear,
    tripActive,
    setTripActive,
  }
}
