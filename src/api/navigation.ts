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
    mode,
  })

export const finishTrip = (
  tripId: string,
  destLat: number,
  destLng: number,
  currentLat: number,
  currentLng: number,
  distanceKm: number = 0,
  savedMinutes: number = 0,
  ecoMode: boolean = false,
  actualTravelTimeSeconds: number = 0,
  expectedTravelTimeSeconds: number = 0,
  rerouteCount: number = 0,
) =>
  api.post<{
    success: boolean
    ecoPointsEarned: number
    co2SavedKg: number
    distanceKm: number
    ecoMode: boolean
    message: string
  }>('/navigation/trip/finish', {
    tripId,
    destLat,
    destLng,
    currentLat,
    currentLng,
    distanceKm,
    savedMinutes,
    ecoMode,
    actualTravelTimeSeconds,
    expectedTravelTimeSeconds,
    rerouteCount,
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
