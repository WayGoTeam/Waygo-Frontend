import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { io } from 'socket.io-client'
import type { Socket } from 'socket.io-client'
import type { IncidentEvent, UserReport } from '@/types/api'

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL ?? 'http://localhost:8081'
const MAX_RECENT_EVENTS = 30

interface SocketContextValue {
  /** True once the Socket.IO handshake with the Netty realtime server succeeds. */
  connected: boolean
  /** Newest-first feed of incident:created events received since the app loaded. */
  recentEvents: IncidentEvent[]
  /** Newest-first feed of report:pending events. */
  recentReports: UserReport[]
  /** Count of events received in this session that haven't been marked as seen (see markAllSeen). */
  unseenCount: number
  markAllSeen: () => void
}

const SocketContext = createContext<SocketContextValue | null>(null)

export function SocketProvider({ children }: { children: ReactNode }) {
  const socketRef = useRef<Socket | null>(null)
  const [connected, setConnected] = useState(false)
  const [recentEvents, setRecentEvents] = useState<IncidentEvent[]>([])
  const [recentReports, setRecentReports] = useState<UserReport[]>([])
  const [unseenCount, setUnseenCount] = useState(0)

  useEffect(() => {
    const socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnectionDelay: 1500,
      reconnectionDelayMax: 8000,
    })
    socketRef.current = socket

    const handleConnect = () => setConnected(true)
    const handleDisconnect = () => setConnected(false)
    const handleIncident = (payload: IncidentEvent) => {
      setRecentEvents((prev) => [payload, ...prev].slice(0, MAX_RECENT_EVENTS))
      setUnseenCount((n) => n + 1)
    }
    const handleReport = (payload: UserReport) => {
      setRecentReports((prev) => [payload, ...prev].slice(0, MAX_RECENT_EVENTS))
    }

    socket.on('connect', handleConnect)
    socket.on('disconnect', handleDisconnect)
    socket.on('incident:created', handleIncident)
    socket.on('report:pending', handleReport)

    return () => {
      socket.off('connect', handleConnect)
      socket.off('disconnect', handleDisconnect)
      socket.off('incident:created', handleIncident)
      socket.off('report:pending', handleReport)
      socket.disconnect()
      socketRef.current = null
    }
  }, [])

  const value = useMemo<SocketContextValue>(
    () => ({
      connected,
      recentEvents,
      recentReports,
      unseenCount,
      markAllSeen: () => setUnseenCount(0),
    }),
    [connected, recentEvents, recentReports, unseenCount],
  )

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
}

export function useSocket() {
  const ctx = useContext(SocketContext)
  if (!ctx) throw new Error('useSocket must be used within a SocketProvider')
  return ctx
}
