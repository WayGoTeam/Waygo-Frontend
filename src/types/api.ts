/**
 * These interfaces mirror the Java records returned by WayGo-Backend 1:1
 * (see com.waygo.traffic.domain.entity / com.waygo.traffic.domain.valueobject).
 * Field names match the backend's JSON exactly — no remapping.
 */

export interface Coordinate {
  latitude: number
  longitude: number
}

// ---- Traffic map -----------------------------------------------------------

export interface TrafficMapEntry {
  segmentId: string
  segmentName: string
  zone: string
  coordinates: Coordinate[]
  currentSpeedKmh: number
  currentCongestionLevel: number
  predictedSpeedKmh: number
  predictedCongestionLevel: number
  anomalyDetected: boolean
  activeVehicles: number | null
}

export interface TrafficMapView {
  segments: TrafficMapEntry[]
  generatedAt: string
}

export type DayOfWeek =
  | 'MONDAY'
  | 'TUESDAY'
  | 'WEDNESDAY'
  | 'THURSDAY'
  | 'FRIDAY'
  | 'SATURDAY'
  | 'SUNDAY'

export interface TrafficForecast {
  segmentId: string
  segmentName: string
  dayOfWeek: DayOfWeek
  hour: number
  predictedSpeedKmh: number
  predictedCongestionLevel: number
  reliabilityScore: number
  explanation: string
}

export type AnomalyStatus = 'ACTIVE' | 'RESOLVED'

export interface TrafficAnomaly {
  segmentId: string
  detectedAt: string
  zScore: number
  status: AnomalyStatus
  description: string
}

export interface RoadIncident {
  id: string
  segmentId: string
  incidentType: string
  source: string
  description: string
  createdAt: string
  active: boolean
  latitude: number | null
  longitude: number | null
}

/** Payload broadcast over Socket.IO on the "incident:created" event. */
export interface IncidentEvent extends RoadIncident {
  eventType: string
}

// ---- City stats / analytics -------------------------------------------------

export interface CityHistoryPoint {
  bucketStart: string
  averageSpeedKmh: number
  averageCongestionLevel: number
}

export interface CityStats {
  averageSpeedKmh: number
  congestionPercent: number
  activeVehiclesCount: number
  last24Hours: CityHistoryPoint[]
  generatedAt: string
}

export interface DistrictAnalytics {
  id: string
  name: string
  congestionPct: number
  avgSpeedKmh: number
  activeVehiclesCount: number
  statusLevel: string
}

export interface TelemetryStatus {
  status: string
  engineVersion: string
  timestamp: string
  activeAnomaliesCount: number
  jvmMemoryUsage: string
  timezone: string
}

export interface MapConfig {
  centerLat: number
  centerLng: number
  defaultZoom: number
  streetTileUrl: string
  satelliteTileUrl: string
  availableLayers: string[]
}

// ---- Weather ------------------------------------------------------------

export interface WeatherSnapshot {
  locationName: string
  latitude: number
  longitude: number
  temperatureC: number
  windSpeedKmh: number
  precipitationMm: number
  condition: string
  trafficImpactPercent: number
  source: string
}

// ---- Routing / Smart ETA -------------------------------------------------

export interface RoadSegment {
  id: string
  name: string
  coordinates: Coordinate[]
  zone: string
}

export interface EtaWindow {
  departureOffsetMinutes: number
  departureAt: string
  travelMinutes: number
  arrivalAt: string
  segmentBreakdown: string[]
}

export interface SmartEtaResult {
  windows: EtaWindow[]
  baselineTravelMinutes: number
  routeSummary: string
}

export type RouteMode = 'fastest' | 'shortest' | 'alternative'

// ---- Transit ---------------------------------------------------------------

export interface MetroStation {
  name: string
  lat: number
  lng: number
  line: string
  desc: string
}

export interface MetroLine {
  name: string
  color: string
  coords: [number, number][]
}

export interface MetroNetwork {
  stations: MetroStation[]
  lines: MetroLine[]
}

export interface BusRoute {
  name: string
  color: string
  coords: [number, number][]
  stops: string[]
}

export interface TransitNetwork {
  metro: MetroNetwork
  buses: BusRoute[]
}

// ---- Reports / Admin ---------------------------------------------------

export type ReportType =
  | 'ACCIDENT'
  | 'ROADWORKS'
  | 'POLICE'
  | 'HAZARD'
  | 'ROAD_CLOSED'
  | 'HEAVY_TRAFFIC'
  | 'OTHER'

export type ReportStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

export interface UserReport {
  id: string
  userId: string
  segmentId: string
  type: ReportType
  description: string
  createdAt: string
  status: ReportStatus
  latitude: number | null
  longitude: number | null
}

// ---- Auth ---------------------------------------------------------------

export type VehicleType = 'EV' | 'HYBRID' | 'PETROL' | 'DIESEL'

export interface UserMeResponse {
  username: string
  roles: string[]
  phone?: string
  vehicleType?: VehicleType
  plateNumber?: string
}

// ---- Chat ---------------------------------------------------------------

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  text: string
  createdAt: number
}

// ---- TomTom pass-through shapes (subset of fields WayGo actually proxies) --

export interface TomTomSearchResult {
  results?: Array<{
    id: string
    type?: string
    address?: {
      freeformAddress?: string
      municipality?: string
      streetName?: string
      countrySubdivision?: string
    }
    poi?: { name?: string; categories?: string[] }
    position: { lat: number; lon: number }
  }>
}

export interface TomTomRouteSummary {
  lengthInMeters: number
  travelTimeInSeconds: number
  trafficDelayInSeconds?: number
  noTrafficTravelTimeInSeconds?: number
  departureTime?: string
  arrivalTime?: string
}

export interface TomTomRoutePoint {
  latitude: number
  longitude: number
}

export interface TomTomRouteResponse {
  routes?: Array<{
    summary: TomTomRouteSummary
    legs: Array<{ points: TomTomRoutePoint[] }>
  }>
}

// ---- Eco Wallet & Navigation ---------------------------------------------

export interface WalletBalance {
  ecoPointsBalance: number
  totalCo2SavedKg: number
}

export interface VoucherResponse {
  voucherCode: string
  pointsDeducted: number
  issuedAt: string
}

export interface AiRouteResponse {
  routeJson: string
  ecoPointsEarned?: number
  verraHash?: string
  co2SavedKg?: number
}
