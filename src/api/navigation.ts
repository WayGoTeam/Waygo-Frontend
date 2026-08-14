import { api } from './client'
import type { AiRouteResponse, VehicleType, RouteMode } from '@/types/api'

export const getAiRoute = (
  fromLat: number,
  fromLng: number,
  toLat: number,
  toLng: number,
  mode: RouteMode,
  vehicleProfile?: VehicleType,
) =>
  api.post<AiRouteResponse>('/navigation/route', {
    originLat: fromLat,
    originLng: fromLng,
    destLat: toLat,
    destLng: toLng,
    currentLat: fromLat,
    currentLng: fromLng,
  })
