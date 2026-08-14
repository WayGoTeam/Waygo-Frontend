import { api } from './client'
import type { UserReport } from '@/types/api'

export const getPendingReports = () => api.get<UserReport[]>('/admin/reports/pending')

export const approveReport = (reportId: string) => api.post<void>(`/admin/reports/${reportId}/approve`)

export const rejectReport = (reportId: string) => api.post<void>(`/admin/reports/${reportId}/reject`)
