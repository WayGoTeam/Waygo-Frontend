import { api } from './client'
import type { WeatherSnapshot } from '@/types/api'

export const getWeather = (latitude?: number, longitude?: number) =>
  api.get<WeatherSnapshot>('/weather', { latitude, longitude })
