import { api, ApiError } from './client'
import type { UserMeResponse } from '@/types/api'

export interface LoginResponse {
  accessToken: string
  refreshToken: string
  tokenType: string
}

/**
 * Access + refresh tokens are also written as HttpOnly cookies by the backend
 * (AuthCookieWriter), so the app never needs to touch localStorage for them —
 * every subsequent request just needs `credentials: 'include'` (see client.ts).
 */
export const login = async (username: string, password: string) => {
  const res = await api.post<{ token?: string }>('/auth/login', { username, password })
  if (res.token) localStorage.setItem('waygo_token', res.token)
  return res
}

export const logout = async () => {
  localStorage.removeItem('waygo_token')
  return api.post('/auth/logout')
}

/** Returns null (rather than throwing) when there is no active session — a 401 here is expected, not an error. */
export async function getCurrentUser(): Promise<UserMeResponse | null> {
  try {
    return await api.get<UserMeResponse>('/auth/me')
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) return null
    throw err
  }
}

export const checkUser = (phone: string) =>
  api.post<{ exists: boolean; hasPassword: boolean; vehicleType?: string }>('/auth/check-user', { phoneNumber: phone })

export const setPassword = (newPassword: string) =>
  api.post<{ message: string }>('/auth/set-password', { newPassword })

export const sendOtp = (phone: string) =>
  api.post<{ message: string }>('/auth/send-otp', { phoneNumber: phone })

export const verifyOtp = async (phone: string, code: string) => {
  const res = await api.post<{ token?: string }>('/auth/verify-otp', { phoneNumber: phone, otp: code })
  if (res.token) localStorage.setItem('waygo_token', res.token)
  return res
}

export const onboarding = (vehicleType: string, plateNumber: string, fullName: string) =>
  api.post<UserMeResponse>('/auth/onboarding', { vehicleType, texpasportInfo: plateNumber, fullName })

export interface OAuthLoginResponse {
  token: string
  refreshToken: string
  tokenType: string
  userId: string
  isNewUser: boolean
  needsOnboarding: boolean
  fullName?: string
}

export const loginWithGoogle = async (idToken: string): Promise<OAuthLoginResponse> => {
  const res = await api.post<OAuthLoginResponse>('/auth/oauth/google', { idToken, provider: 'GOOGLE' })
  if (res.token) localStorage.setItem('waygo_token', res.token)
  return res
}

export const oauthGoogle = loginWithGoogle

export const updateProfile = (data: any) =>
  api.put('/auth/profile', data)
