import { api } from './client'
import type { TransitNetwork } from '@/types/api'

export const getTransitNetwork = () => api.get<TransitNetwork>('/transit/network')
