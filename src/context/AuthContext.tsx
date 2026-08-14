import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react'
import type { ReactNode } from 'react'
import * as authApi from '@/api/auth'
import type { UserMeResponse } from '@/types/api'

interface AuthContextValue {
  user: UserMeResponse | null
  isAdmin: boolean
  loading: boolean
  login: (username: string, password: string) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserMeResponse | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    authApi
      .getCurrentUser()
      .then(setUser)
      .finally(() => setLoading(false))
  }, [])

  const login = useCallback(async (username: string, password: string) => {
    await authApi.login(username, password)
    const me = await authApi.getCurrentUser()
    setUser(me)
  }, [])

  const logout = useCallback(async () => {
    await authApi.logout()
    setUser(null)
  }, [])

  const refreshUser = useCallback(async () => {
    const me = await authApi.getCurrentUser()
    setUser(me)
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAdmin: Boolean(user?.roles?.some((r) => r.includes('ADMIN'))),
      loading,
      login,
      logout,
      refreshUser,
    }),
    [user, loading, login, logout, refreshUser],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
