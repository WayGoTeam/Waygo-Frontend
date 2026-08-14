import { API_BASE, api } from './client'
import type { RouteMode, TomTomRouteResponse, TomTomSearchResult } from '@/types/api'

export const searchPlaces = (query: string) => api.get<TomTomSearchResult>('/search', { q: query })

export const getRoute = (
  fromLat: number,
  fromLng: number,
  toLat: number,
  toLng: number,
  mode: RouteMode,
) =>
  api.get<TomTomRouteResponse>('/route', {
    fromLat,
    fromLng,
    toLat,
    toLng,
    // The backend only distinguishes fastest/shortest (TomTomMapsGateway#calculateDirections);
    // "alternative" asks for the same fastest route and we surface routes[1] from the response.
    mode: mode === 'shortest' ? 'shortest' : 'fastest',
  })

/** 1x1 transparent PNG — used as the Leaflet errorTileUrl so a missing TomTom key fails silently. */
export const TRANSPARENT_TILE =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='

export const trafficFlowTileUrl = () => `${API_BASE}/traffic/tiles/flow/{z}/{x}/{y}.png?_v=2`
export const trafficIncidentTileUrl = () => `${API_BASE}/traffic/tiles/incidents/{z}/{x}/{y}.png`
