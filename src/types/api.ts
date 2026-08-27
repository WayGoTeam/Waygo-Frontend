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

export type RouteMode = 'fastest' | 'eco'

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
  email?: string
  vehicleType?: VehicleType
  plateNumber?: string
  fullName?: string
}

export interface OnboardingData {
  vehicleType: string
  texpasportInfo: string
  fullName?: string
}

// ---- Chat ---------------------------------------------------------------

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  text: string
  createdAt: number
}

// ---- WayGo Custom Search Format ----

export interface WaygoSearchResult {
  label: string
  subtitle?: string
  lat: number
  lng: number
}

// ---- Valhalla Route API Types ----

export interface ValhallaRouteSummary {
  time: number
  length: number // distance in km
  cost: number
}

export interface ValhallaRouteLeg {
  shape: string // Polyline6 encoded geometry
}

export interface ValhallaRouteTrip {
  summary: ValhallaRouteSummary
  legs: ValhallaRouteLeg[]
}

export interface ValhallaRouteResponse {
  trip: ValhallaRouteTrip
}

// ---- Eco Wallet & Navigation ---------------------------------------------

export interface WalletBalance {
  ecoPointsBalance: number
  totalCo2SavedKg: number
  totalDistanceKm?: number
  totalTripsCount?: number
  currentStreak?: number
}

export interface VoucherResponse {
  voucherCode: string
  pointsDeducted: number
  issuedAt: string
}

export interface AiRouteResponse {
  routeJson: string
  tripId?: string
  routeDetails?: string
  vehicleType?: string
  ecoPointsEarned?: number
  verraHash?: string
  verraAuditHash?: string
  co2SavedKg?: number
  ecoMode?: boolean
  inCooldown?: boolean
}

// ---- Gamification ----------------------------------------------------------

export interface LeaderboardEntry {
  rank: number
  displayName: string
  ecoPoints: number
  totalTrips: number
  co2Saved: number
  isCurrentUser: boolean
}

export interface EcoTransactionItem {
  id: string
  amount: number
  type: 'ROUTE' | 'REPORT' | 'VOUCHER_REDEEM' | 'STREAK_BONUS' | 'BADGE_BONUS'
  description: string
  createdAt: string
}

export interface BadgeItem {
  code: string
  earnedAt: string
}

export interface BadgesResponse {
  earned: string[]
  earnedAt: BadgeItem[]
}
