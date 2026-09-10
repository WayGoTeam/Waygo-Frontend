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

const DEVICE_ID_KEY = 'waygo_device_id'

/**
 * Stable per-browser device id for GPS pings. Guests previously all shared the literal
 * 'anonymous-device', so the backend's per-device throttle (1 ping / 5 s) rejected every
 * other guest's pings with 429.
 */
export function getDeviceId(username?: string | null): string {
  if (username) return username
  try {
    let id = localStorage.getItem(DEVICE_ID_KEY)
    if (!id) {
      id = typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? `guest-${crypto.randomUUID()}`
        : `guest-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
      localStorage.setItem(DEVICE_ID_KEY, id)
    }
    return id
  } catch {
    return `guest-${Date.now().toString(36)}`
  }
}

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
