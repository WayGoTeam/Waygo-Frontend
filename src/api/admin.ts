import { api } from './client'
import type { UserReport } from '@/types/api'

export const getPendingReports = () => api.get<UserReport[]>('/admin/reports/pending')
export const getActiveReports = () => api.get<UserReport[]>('/admin/reports/active')

export const approveReport = (reportId: string) => api.post<void>(`/admin/reports/${reportId}/approve`)
export const rejectReport = (reportId: string) => api.post<void>(`/admin/reports/${reportId}/reject`)
export const archiveReport = (reportId: string) => api.post<void>(`/admin/reports/${reportId}/archive`)

export interface AdminAnalyticsKpi {
  totalUsers: number;
  activeUsers: number;
  totalDistanceKm: number;
  totalEcoPoints: number;
  activeIncidents: number;
}

export interface TimeSeriesData {
  date: string;
  newUsers: number;
  ecoPointsEarned: number;
  ecoPointsSpent: number;
  co2Saved: number;
}

export interface DemographicsData {
  name: string;
  value: number;
}

export interface ActiveGpsData {
  deviceId: string;
  lat: number;
  lng: number;
  speed: number;
  timestamp: string;
}

export const getAdminKpi = () => api.get<AdminAnalyticsKpi>('/admin/analytics/kpi')
export const getAdminTimeSeries = (days: number = 30) => api.get<TimeSeriesData[]>(`/admin/analytics/time-series?days=${days}`)
export const getAdminDemographics = () => api.get<DemographicsData[]>('/admin/analytics/demographics')
export const getActiveGps = () => api.get<ActiveGpsData[]>('/admin/active-gps')
