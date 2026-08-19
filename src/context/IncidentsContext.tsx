import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { getIncidents } from '@/api/traffic'
import { useSocket } from './SocketContext'
import type { RoadIncident } from '@/types/api'

const POLL_MS = 60_000

interface IncidentsContextValue {
  incidents: RoadIncident[] | null
  loading: boolean
  error: Error | null
  refetch: () => void
}

const IncidentsContext = createContext<IncidentsContextValue | null>(null)

export function IncidentsProvider({ children }: { children: ReactNode }) {
  const [polled, setPolled] = useState<RoadIncident[] | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [loading, setLoading] = useState(true)
  const requestId = useRef(0)
  const { recentEvents } = useSocket()

  const load = () => {
    const id = ++requestId.current
    getIncidents()
      .then((result) => {
        if (id !== requestId.current) return
        setPolled(result)
        setError(null)
      })
      .catch((err: Error) => {
        if (id !== requestId.current) return
        setError(err)
      })
      .finally(() => {
        if (id !== requestId.current) return
        setLoading(false)
      })
  }

  useEffect(() => {
    load()
    // Polling disabled as per request to prevent unnecessary backend queries
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const incidents = useMemo<RoadIncident[] | null>(() => {
    if (!polled) return recentEvents.length > 0 ? recentEvents : null
    const byId = new Map<string, RoadIncident>()
    for (const incident of polled) byId.set(incident.id, incident)
    for (const event of recentEvents) byId.set(event.id, event)
    return Array.from(byId.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
  }, [polled, recentEvents])

  const value = useMemo<IncidentsContextValue>(
    () => ({ incidents, loading, error, refetch: load }),
    [incidents, loading, error],
  )

  return <IncidentsContext.Provider value={value}>{children}</IncidentsContext.Provider>
}

export function useIncidentsContext() {
  const ctx = useContext(IncidentsContext)
  if (!ctx) throw new Error('useIncidentsContext must be used within an IncidentsProvider')
  return ctx
}
