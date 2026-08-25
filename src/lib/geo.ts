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

/**
 * Decodes a Valhalla (or OSRM polyline6) encoded geometry string into an array of Coordinates.
 * The standard Google Polyline uses 1e5 precision, but Valhalla uses 1e6 (6 decimals).
 */
export function decodePolyline6(str: string, precision: number = 6): Coordinate[] {
  let index = 0
  let lat = 0
  let lng = 0
  const coordinates: Coordinate[] = []
  const factor = Math.pow(10, precision)

  while (index < str.length) {
    let byte
    let shift = 0
    let result = 0

    do {
      byte = str.charCodeAt(index++) - 63
      result |= (byte & 0x1f) << shift
      shift += 5
    } while (byte >= 0x20)

    const lat_change = result & 1 ? ~(result >> 1) : result >> 1
    lat += lat_change

    shift = 0
    result = 0

    do {
      byte = str.charCodeAt(index++) - 63
      result |= (byte & 0x1f) << shift
      shift += 5
    } while (byte >= 0x20)

    const lng_change = result & 1 ? ~(result >> 1) : result >> 1
    lng += lng_change

    coordinates.push({ latitude: lat / factor, longitude: lng / factor })
  }

  return coordinates
}
