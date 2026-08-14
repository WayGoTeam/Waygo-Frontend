import { api } from './client'
import type { ReportType, UserReport } from '@/types/api'

export interface SubmitReportInput {
  userId: string
  segmentId: string
  type: ReportType
  description: string
  createdAt: string
  latitude?: number
  longitude?: number
}

export const submitReport = (input: SubmitReportInput) => api.post<UserReport>('/report', input)
