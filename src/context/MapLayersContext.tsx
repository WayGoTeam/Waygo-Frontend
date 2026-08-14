import { createContext, useContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'

export type Basemap = 'street' | 'satellite'

interface MapLayersContextValue {
  basemap: Basemap
  setBasemap: (b: Basemap) => void
  showTraffic: boolean
  setShowTraffic: (v: boolean) => void
  showIncidents: boolean
  setShowIncidents: (v: boolean) => void
  showLiveIncidents: boolean
  setShowLiveIncidents: (v: boolean) => void
}

const MapLayersContext = createContext<MapLayersContextValue | null>(null)

export function MapLayersProvider({ children }: { children: ReactNode }) {
  const [basemap, setBasemap] = useState<Basemap>('street')
  const [showTraffic, setShowTraffic] = useState(true)
  const [showIncidents, setShowIncidents] = useState(true)
  const [showLiveIncidents, setShowLiveIncidents] = useState(true)

  const value = useMemo<MapLayersContextValue>(
    () => ({
      basemap,
      setBasemap,
      showTraffic,
      setShowTraffic,
      showIncidents,
      setShowIncidents,
      showLiveIncidents,
      setShowLiveIncidents,
    }),
    [basemap, showTraffic, showIncidents, showLiveIncidents],
  )

  return <MapLayersContext.Provider value={value}>{children}</MapLayersContext.Provider>
}

export function useMapLayers() {
  const ctx = useContext(MapLayersContext)
  if (!ctx) throw new Error('useMapLayers must be used within a MapLayersProvider')
  return ctx
}
