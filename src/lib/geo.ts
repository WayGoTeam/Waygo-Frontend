import type { Coordinate, RoadSegment, TrafficMapEntry } from '@/types/api'

/** Great-circle distance in kilometers. */
export function haversineKm(a: Coordinate, b: Coordinate): number {
  const R = 6371
  const dLat = ((b.latitude - a.latitude) * Math.PI) / 180
  const dLon = ((b.longitude - a.longitude) * Math.PI) / 180
  const lat1 = (a.latitude * Math.PI) / 180
  const lat2 = (b.latitude * Math.PI) / 180
  const h =
    Math.sin(dLat / 2) ** 2 + Math.sin(dLon / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2)
  return 2 * R * Math.asin(Math.sqrt(h))
}

export function centroid(coords: Coordinate[]): Coordinate {
  const sum = coords.reduce(
    (acc, c) => ({ latitude: acc.latitude + c.latitude, longitude: acc.longitude + c.longitude }),
    { latitude: 0, longitude: 0 },
  )
  return { latitude: sum.latitude / coords.length, longitude: sum.longitude / coords.length }
}

/**
 * The /smart-eta endpoint only understands the backend's known road segments
 * (see CalculateSmartEtaUseCase — it 404s on unrecognised ids), so a route
 * drawn from an arbitrary TomTom search can't be forecast directly. Instead we
 * pick whichever known segments run closest to the route's own path, so the
 * "Trafik proqnozu" panel reflects real corridors the trip actually crosses.
 */
export function pickNearestSegments(
  routePoints: Coordinate[],
  segments: TrafficMapEntry[],
  count = 3,
): RoadSegment[] {
  if (routePoints.length === 0 || segments.length === 0) return []
  const sampled =
    routePoints.length > 40
      ? routePoints.filter((_, i) => i % Math.ceil(routePoints.length / 40) === 0)
      : routePoints

  const scored = segments.map((segment) => {
    const mid = centroid(segment.coordinates)
    const distance = Math.min(...sampled.map((p) => haversineKm(p, mid)))
    return { segment, distance }
  })

  scored.sort((a, b) => a.distance - b.distance)
  return scored.slice(0, count).map(({ segment }) => ({
    id: segment.segmentId,
    name: segment.segmentName,
    coordinates: segment.coordinates,
    zone: segment.zone,
  }))
}
