import { api } from './client'
import type {
  CityStats,
  DistrictAnalytics,
  MapConfig,
  RoadIncident,
  RoadSegment,
  SmartEtaResult,
  TelemetryStatus,
  TrafficAnomaly,
  TrafficForecast,
  TrafficMapView,
  DayOfWeek,
} from '@/types/api'

export const getTrafficMap = () => api.get<TrafficMapView>('/traffic-map')

export const predictTraffic = (segmentId: string, dayOfWeek: DayOfWeek, hourOfDay: number) =>
  api.get<TrafficForecast>('/predict', { segmentId, dayOfWeek, hourOfDay })

export const getDailyPrediction = (lat?: number, lon?: number) => 
  api.get<any[]>('/predict/daily', { lat, lon })

export const getAnomalies = () => api.get<TrafficAnomaly[]>('/anomalies')

export const getIncidents = () => api.get<RoadIncident[]>('/incidents')

export const getCityStats = () => api.get<CityStats>('/city-stats')

export const getDistrictAnalytics = () => api.get<DistrictAnalytics[]>('/traffic/analytics/districts')

export const getTelemetryStatus = () => api.get<TelemetryStatus>('/telemetry/status')

export const getMapConfig = () => api.get<MapConfig>('/map-config')

/**
 * The backend only accepts known RoadSegment objects (it reads their `id` field
 * server-side and looks each one up — see TrafficController#calculateSmartEta).
 * Callers should source segments from getTrafficMap() rather than construct ids.
 */
export const calculateSmartEta = (segments: RoadSegment[]) =>
  api.post<SmartEtaResult>('/smart-eta', segments)
