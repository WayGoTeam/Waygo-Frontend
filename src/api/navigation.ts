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

export const finishTrip = (
  tripId: string,
  destLat: number,
  destLng: number,
  currentLat: number,
  currentLng: number,
  distanceKm: number = 0,
  savedMinutes: number = 0,
) =>
  api.post<{
    success: boolean
    ecoPointsEarned: number
    co2SavedKg: number
    message: string
  }>('/navigation/trip/finish', {
    tripId,
    destLat,
    destLng,
    currentLat,
    currentLng,
    distanceKm,
    savedMinutes,
  })

export const sendGpsPing = (
  deviceId: string,
  latitude: number,
  longitude: number,
  timestamp: string,
  speedKmh: number,
) =>
  api.post<any>('/gps-ping', {
    deviceId,
    latitude,
    longitude,
    timestamp,
    speedKmh,
  })
