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

export const trafficFlowTileUrl = () => `http://localhost:3001/mock_traffic/{z}/{x}/{y}`
export const trafficIncidentTileUrl = () => `${API_BASE}/traffic/tiles/incidents/{z}/{x}/{y}.png`
