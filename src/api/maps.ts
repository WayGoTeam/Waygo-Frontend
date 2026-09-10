import { API_BASE, api } from './client'
import type { RouteMode, ValhallaRouteResponse, WaygoSearchResult } from '@/types/api'

export const searchPlaces = (query: string) => api.get<WaygoSearchResult[]>('/search', { q: query })

export const getRoute = (
  fromLat: number,
  fromLng: number,
  toLat: number,
  toLng: number,
  mode: RouteMode,
) =>
  api.get<ValhallaRouteResponse>('/route', {
    fromLat,
    fromLng,
    toLat,
    toLng,
    mode,
  })

/** 1x1 transparent PNG — used as the Leaflet errorTileUrl so a missing TomTom key fails silently. */
export const TRANSPARENT_TILE =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='

/**
 * Same-origin MVT endpoint. nginx proxies `/tiles/…` to the Martin tile server
 * (see nginx.conf) and the Vite dev server proxies it to localhost:3001, so the
 * browser never needs to know where Martin actually runs.
 */
export const DEFAULT_TRAFFIC_TILES_URL = '/tiles/mock_traffic/{z}/{x}/{y}'

/** Hosts that only make sense from the developer's own machine. */
const LOOPBACK_HOST = /^https?:\/\/(localhost|127\.0\.0\.1|0\.0\.0\.0|\[::1\])(:\d+)?(\/|$)/i

/**
 * Resolves the traffic tile template.
 *
 * `VITE_TRAFFIC_TILES_URL` may override it (absolute HTTPS host or a path), but a
 * loopback override is ignored in production builds: the browser's "localhost" is
 * the *user's* computer, not the server (audit finding L01).
 */
export const trafficFlowTileUrl = () => {
  const customUrl = (import.meta.env.VITE_TRAFFIC_TILES_URL as string | undefined)?.trim()
  if (customUrl) {
    if (import.meta.env.PROD && LOOPBACK_HOST.test(customUrl)) {
      console.warn(
        `[WayGo] Ignoring VITE_TRAFFIC_TILES_URL="${customUrl}" in production build (loopback host); using ${DEFAULT_TRAFFIC_TILES_URL}`,
      )
      return DEFAULT_TRAFFIC_TILES_URL
    }
    return customUrl.includes('{z}') ? customUrl : `${customUrl.replace(/\/+$/, '')}/{z}/{x}/{y}`
  }
  return DEFAULT_TRAFFIC_TILES_URL
}

/** Fills a `{z}/{x}/{y}` template for a concrete tile (used to probe availability). */
export const tileUrlFor = (template: string, z: number, x: number, y: number) =>
  template.replace('{z}', String(z)).replace('{x}', String(x)).replace('{y}', String(y))
export const trafficIncidentTileUrl = () => `${API_BASE}/traffic/tiles/incidents/{z}/{x}/{y}.png`
