import { useEffect, useRef, useState } from 'react'
import { getRoute } from '@/api/maps'
import { getAiRoute } from '@/api/navigation'
import { calculateSmartEta } from '@/api/traffic'
import { useAuth } from '@/context/AuthContext'
import { pickNearestSegments, decodePolyline6 } from '@/lib/geo'
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
  ecoMode?: boolean
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
      let trip: any = null
      let ecoPointsEarned: number | undefined
      let verraHash: string | undefined
      let co2SavedKg: number | undefined
      let tripId: string | undefined

      if (user) {
        const raw = await getAiRoute(o.lat, o.lng, d.lat, d.lng, m, user.vehicleType)
        if (id !== requestId.current) return // a newer request has since started — drop this one
        const valhallaData = raw.routeJson ? JSON.parse(raw.routeJson) : {}
        // Always prefer the main Valhalla trip which properly respects avoid_polygons
        trip = valhallaData.trip ?? valhallaData.alternates?.[0]?.trip
        ecoPointsEarned = raw.ecoPointsEarned
        verraHash = raw.verraAuditHash ?? raw.verraHash
        co2SavedKg = raw.co2SavedKg
        tripId = raw.tripId
      } else {
        const raw = await getRoute(o.lat, o.lng, d.lat, d.lng, m)
        if (id !== requestId.current) return
        const valhallaData = raw as any
        trip = valhallaData.trip
      }
      
      if (!trip) {
        setRoute(null)
        setError('no-route')
        return
      }
      
      const points = decodePolyline6(trip.legs[0].shape)

      let forecast: ForecastPoint[] | null = null
      if (segments && segments.length > 0) {
        const nearest = pickNearestSegments(points, segments, 3)
        if (nearest.length > 0) {
          try {
            const smartEta = await calculateSmartEta(nearest)
            if (id !== requestId.current) return
            const baselineWindow = smartEta.windows[0]
            if (baselineWindow && baselineWindow.travelMinutes > 0.1) {
              const baselineMinutes = trip.summary.time / 60
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
        distanceMeters: trip.summary.length * 1000,
        travelTimeSeconds: trip.summary.time,
        trafficDelaySeconds: 0,
        freeFlowTravelTimeSeconds: trip.summary.time,
        forecast,
        ecoPointsEarned,
        verraHash,
        co2SavedKg,
        tripId,
        ecoMode: m === 'eco',
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
