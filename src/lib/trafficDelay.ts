import type { Coordinate, TrafficMapEntry } from '@/types/api'
import { centroid, haversineKm } from './geo'

/** A segment is considered "on the route" if the path passes within this distance of it. */
const MATCH_RADIUS_KM = 0.35

/** How much of a segment's congestion (0–100 %) translates into extra travel time. */
const CONGESTION_TO_DELAY = 0.8

export interface TrafficDelayEstimate {
  /** Extra seconds on top of the free-flow (Valhalla) time. */
  delaySeconds: number
  /** Fraction of the route (0–1) that is covered by a segment with live data. */
  coverage: number
  /** Segments that contributed to the estimate. */
  matchedSegmentIds: string[]
  /** Mean congestion level (0–100) across matched segments. */
  averageCongestion: number
  /** ISO time of the traffic snapshot the estimate is based on. */
  generatedAt: string | null
}

/**
 * Estimates traffic delay for a route from the backend's live `traffic-map`
 * segments (audit L02). Previously `trafficDelaySeconds` was hard-coded to 0,
 * which rendered a confident green "Light traffic" label without any data.
 *
 * Returns `null` when there is *no* usable traffic information for the route
 * (no nearby segment, or all nearby segments report 0 km/h = no measurement),
 * so the UI can show "no traffic data" instead of a fabricated label.
 */
export function estimateTrafficDelay(
  routePoints: Coordinate[],
  segments: TrafficMapEntry[] | null | undefined,
  freeFlowSeconds: number,
  generatedAt: string | null = null,
): TrafficDelayEstimate | null {
  if (!segments || segments.length === 0 || routePoints.length < 2 || freeFlowSeconds <= 0) return null

  // Sample the route to keep the O(points × segments) scan cheap.
  const step = routePoints.length > 60 ? Math.ceil(routePoints.length / 60) : 1
  const sampled = routePoints.filter((_, i) => i % step === 0)

  const centroids = segments.map((seg) => ({ seg, mid: centroid(seg.coordinates) }))

  let coveredSamples = 0
  const matched = new Map<string, TrafficMapEntry>()

  for (const p of sampled) {
    let nearest: TrafficMapEntry | null = null
    let nearestKm = Infinity
    for (const { seg, mid } of centroids) {
      const d = haversineKm(p, mid)
      if (d < nearestKm) {
        nearestKm = d
        nearest = seg
      }
    }
    if (nearest && nearestKm <= MATCH_RADIUS_KM) {
      coveredSamples += 1
      matched.set(nearest.segmentId, nearest)
    }
  }

  if (matched.size === 0) return null

  // Segments with a 0 km/h reading carry no measurement (no GPS pings), not "gridlock".
  const measured = Array.from(matched.values()).filter((seg) => seg.currentSpeedKmh > 0)
  if (measured.length === 0) return null

  const averageCongestion =
    measured.reduce((sum, seg) => sum + clamp01(seg.currentCongestionLevel / 100) * 100, 0) / measured.length

  const coverage = coveredSamples / sampled.length
  const delaySeconds = Math.round(freeFlowSeconds * coverage * (averageCongestion / 100) * CONGESTION_TO_DELAY)

  return {
    delaySeconds,
    coverage,
    matchedSegmentIds: measured.map((seg) => seg.segmentId),
    averageCongestion,
    generatedAt,
  }
}

function clamp01(v: number): number {
  return Math.min(1, Math.max(0, v))
}
