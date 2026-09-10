import { useEffect, useRef, useState } from 'react'
import { getRoute } from '@/api/maps'
import { getAiRoute } from '@/api/navigation'
import { calculateSmartEta } from '@/api/traffic'
import { useAuth } from '@/context/AuthContext'
import { useLocale } from '@/i18n/LocaleContext'
import { pickNearestSegments, decodePolyline6 } from '@/lib/geo'
import { estimateTrafficDelay } from '@/lib/trafficDelay'
import type { PlaceResult } from '@/components/layout/GlobalSearch'
import type { Coordinate, RouteMode, TrafficMapEntry } from '@/types/api'

export interface ForecastPoint {
  offsetMinutes: number
  minutes: number
}

export interface Maneuver {
  type: number
  instruction: string
  length: number // in km
  time: number // in seconds
  begin_shape_index: number
  end_shape_index: number
}

export interface RouteResult {
  points: Coordinate[]
  distanceMeters: number
  /** ETA shown to the user: free-flow time plus the live delay when it is known. */
  travelTimeSeconds: number
  /**
   * Extra seconds caused by live traffic, derived from the segments the route
   * crosses. `null` = no live traffic measurement covers this route, in which
   * case `travelTimeSeconds` is a statistical (free-flow) estimate only.
   */
  trafficDelaySeconds: number | null
  freeFlowTravelTimeSeconds: number | null
  /** Fraction (0–1) of the route covered by segments with live data. */
  trafficCoverage: number
  /** When the underlying traffic snapshot was generated (ISO), if known. */
  trafficGeneratedAt: string | null
  forecast: ForecastPoint[] | null
  ecoPointsEarned?: number
  verraHash?: string
  co2SavedKg?: number
  tripId?: string
  ecoMode?: boolean
  inCooldown?: boolean
  maneuvers?: Maneuver[]
}

function areRoutesIdentical(fastestTrip: any, ecoTrip: any): boolean {
  if (!fastestTrip || !ecoTrip) return false

  const fShape = fastestTrip.legs?.[0]?.shape
  const eShape = ecoTrip.legs?.[0]?.shape
  if (fShape && eShape && fShape === eShape) {
    return true
  }

  const fLen = fastestTrip.summary?.length ?? 0
  const eLen = ecoTrip.summary?.length ?? 0
  const fTime = fastestTrip.summary?.time ?? 0
  const eTime = ecoTrip.summary?.time ?? 0

  // If distance difference is < 50 meters and travel time difference is < 5 seconds
  if (Math.abs(fLen - eLen) < 0.05 && Math.abs(fTime - eTime) < 5) {
    return true
  }

  return false
}

export function useRoutePlanner(segments: TrafficMapEntry[] | null, segmentsGeneratedAt: string | null = null) {
  const [origin, setOrigin] = useState<PlaceResult | null>(null)
  const [destination, setDestination] = useState<PlaceResult | null>(null)
  const [mode, setMode] = useState<RouteMode>('fastest')
  const [route, setRoute] = useState<RouteResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [tripActive, setTripActive] = useState(false)
  const [isEcoIdentical, setIsEcoIdentical] = useState(false)
  const requestId = useRef(0)
  const { user } = useAuth()
  const { s } = useLocale()

  const fetchCurrentLocation = () => {
    if (navigator.geolocation) {
      const setPos = () => {
        navigator.geolocation.getCurrentPosition((pos) => {
          setOrigin((prev) => {
            if (prev) return prev
            return {
              label: s.routePlanner.myLocation,
              subtitle: s.routePlanner.currentCoordinate,
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
      let fastestTrip: any = null
      let ecoTrip: any = null
      let fastestRaw: any = null
      let ecoRaw: any = null

      if (user) {
        const [fRes, eRes] = await Promise.all([
          getAiRoute(o.lat, o.lng, d.lat, d.lng, 'fastest', user.vehicleType),
          getAiRoute(o.lat, o.lng, d.lat, d.lng, 'eco', user.vehicleType),
        ])
        if (id !== requestId.current) return
        fastestRaw = fRes
        ecoRaw = eRes

        const fValhalla = fRes.routeJson ? JSON.parse(fRes.routeJson) : {}
        const eValhalla = eRes.routeJson ? JSON.parse(eRes.routeJson) : {}

        fastestTrip = fValhalla.trip ?? fValhalla.alternates?.[0]?.trip
        ecoTrip = eValhalla.trip
        if (!ecoTrip && eValhalla.alternates?.length > 0) {
          ecoTrip = eValhalla.alternates[0]?.trip
        }
      } else {
        const [fRes, eRes] = await Promise.all([
          getRoute(o.lat, o.lng, d.lat, d.lng, 'fastest'),
          getRoute(o.lat, o.lng, d.lat, d.lng, 'eco'),
        ])
        if (id !== requestId.current) return
        fastestRaw = fRes
        ecoRaw = eRes
        fastestTrip = (fRes as any)?.trip
        ecoTrip = (eRes as any)?.trip
      }

      const identical = areRoutesIdentical(fastestTrip, ecoTrip)
      setIsEcoIdentical(identical)

      let effectiveMode = m
      if (identical) {
        effectiveMode = 'fastest'
        if (m === 'eco') {
          setMode('fastest')
        }
      }

      const selectedTrip = (effectiveMode === 'eco' && !identical) ? (ecoTrip ?? fastestTrip) : (fastestTrip ?? ecoTrip)
      const selectedRaw = (effectiveMode === 'eco' && !identical) ? ecoRaw : fastestRaw

      if (!selectedTrip) {
        setRoute(null)
        setError('no-route')
        return
      }

      const trip = selectedTrip
      const ecoPointsEarned = (effectiveMode === 'eco' && !identical) ? selectedRaw?.ecoPointsEarned : 0
      const verraHash = selectedRaw?.verraAuditHash ?? selectedRaw?.verraHash
      const co2SavedKg = (effectiveMode === 'eco' && !identical) ? selectedRaw?.co2SavedKg : 0
      const tripId = selectedRaw?.tripId
      const inCooldown = selectedRaw?.inCooldown
      
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

      // Valhalla returns a free-flow time. Derive the live delay from the traffic
      // segments this route actually crosses; if none carry a measurement we
      // report "no traffic data" rather than a fabricated green label (L02).
      const freeFlowSeconds: number = trip.summary.time
      const delay = estimateTrafficDelay(points, segments, freeFlowSeconds, segmentsGeneratedAt)

      setRoute({
        points,
        distanceMeters: trip.summary.length * 1000,
        travelTimeSeconds: freeFlowSeconds + (delay?.delaySeconds ?? 0),
        trafficDelaySeconds: delay ? delay.delaySeconds : null,
        freeFlowTravelTimeSeconds: freeFlowSeconds,
        trafficCoverage: delay?.coverage ?? 0,
        trafficGeneratedAt: delay?.generatedAt ?? null,
        forecast,
        ecoPointsEarned,
        verraHash,
        co2SavedKg,
        tripId,
        ecoMode: effectiveMode === 'eco' && !identical,
        inCooldown,
        maneuvers: trip.legs[0]?.maneuvers ?? [],
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
    if (origin && destination) {
      void compute(origin, destination, mode)
    } else {
      requestId.current++ // invalidate any in-flight request now that a point was cleared
      setLoading(false)
      setError(null)
    }
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
    setLoading(false)
    setTripActive(false)
    setIsEcoIdentical(false)
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
    isEcoIdentical,
  }
}
