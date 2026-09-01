import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { Client } from '@stomp/stompjs'
import type { IncidentEvent, UserReport } from '@/types/api'

// Since WebSocket runs on the same port as the main backend, default to current host via nginx proxy
const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
const SOCKET_URL = `${protocol}//${window.location.host}/ws`
const MAX_RECENT_EVENTS = 30

interface SocketContextValue {
  /** True once the STOMP handshake with the realtime server succeeds. */
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
  const clientRef = useRef<Client | null>(null)
  const [connected, setConnected] = useState(false)
  const [recentEvents, setRecentEvents] = useState<IncidentEvent[]>([])
  const [recentReports, setRecentReports] = useState<UserReport[]>([])
  const [unseenCount, setUnseenCount] = useState(0)

  useEffect(() => {
    const client = new Client({
      brokerURL: SOCKET_URL,
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        setConnected(true)

        client.subscribe('/topic/incidents', (message) => {
          if (message.body) {
            const payload = JSON.parse(message.body) as IncidentEvent
            setRecentEvents((prev) => [payload, ...prev].slice(0, MAX_RECENT_EVENTS))
            setUnseenCount((n) => n + 1)
          }
        })

        client.subscribe('/topic/reports', (message) => {
          if (message.body) {
            const payload = JSON.parse(message.body) as UserReport
            setRecentReports((prev) => [payload, ...prev].slice(0, MAX_RECENT_EVENTS))
          }
        })
      },
      onDisconnect: () => {
        setConnected(false)
      },
      onWebSocketError: () => {
        setConnected(false)
      }
    })

    clientRef.current = client
    client.activate()

    return () => {
      client.deactivate()
      clientRef.current = null
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
