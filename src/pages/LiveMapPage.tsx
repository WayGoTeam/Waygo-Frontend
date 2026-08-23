import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { finishTrip, sendGpsPing } from '@/api/navigation'
import type L from 'leaflet'
import { useTrafficMap } from '@/hooks/useTrafficMap'
import { useCityStats } from '@/hooks/useCityStats'
import { useMapConfig } from '@/hooks/useMapConfig'
import { useRoutePlanner } from '@/hooks/useRoutePlanner'
import { LiveMap } from '@/components/map/LiveMap'
import { RoutePlannerPanel } from '@/components/map/RoutePlannerPanel'
import { LayerControlPanel } from '@/components/map/LayerControlPanel'
import { MapZoomControls } from '@/components/map/MapZoomControls'
import { MapLegend } from '@/components/map/MapLegend'
import { CityStatusBar } from '@/components/map/CityStatusBar'
import { ReportIncidentPanel } from '@/components/map/ReportIncidentPanel'
import { AlertTriangle } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useLocale } from '@/i18n/LocaleContext'
import { submitReport } from '@/api/reports'
import type { ReportType } from '@/types/api'

interface FocusState {
  focus?: { lat: number; lng: number; label?: string }
}

export default function LiveMapPage() {
  const location = useLocation()
  const { s } = useLocale()
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [mapInstance, setMapInstance] = useState<L.Map | null>(null)
  const [panelVisible, setPanelVisible] = useState(true)
  const [focus, setFocus] = useState<{ lat: number; lng: number; label?: string } | null>(null)
  const [routePickingMode, setRoutePickingMode] = useState<'origin' | 'destination' | null>(null)

  const [reportingMode, setReportingMode] = useState(false)
  const [reportPickingMode, setReportPickingMode] = useState(false)
  const [reportLocation, setReportLocation] = useState<{lat: number, lng: number} | null>(null)

  const { user } = useAuth()
  
  const [currentLocation, setCurrentLocation] = useState<{lat: number, lng: number} | null>(null)
  const watchIdRef = useRef<number | null>(null)
  const lastPingTimeRef = useRef<number>(0)

  const trafficMap = useTrafficMap()
  const cityStats = useCityStats()
  const { data: mapConfig } = useMapConfig()
  const segments = trafficMap.data?.segments ?? []
  const planner = useRoutePlanner(segments)

  useEffect(() => {
    const state = location.state as FocusState | null
    if (state?.focus) {
      setFocus(state.focus)
      setPanelVisible(false)
    }
  }, [location.state])

  useEffect(() => {
    if (planner.origin || planner.destination) setFocus(null)
  }, [planner.origin, planner.destination])

  useEffect(() => {
    if (planner.route && mapInstance) {
      const latLngs = planner.route.points.map((p) => [p.latitude, p.longitude]) as [number, number][]
      if (latLngs.length > 1) mapInstance.fitBounds(latLngs, { padding: [72, 72] })
      setPanelVisible(true)
    }
  }, [planner.route, mapInstance])

  function showOnMap() {
    if (!planner.route || !mapInstance) return
    const latLngs = planner.route.points.map((p) => [p.latitude, p.longitude]) as [number, number][]
    if (latLngs.length > 1) mapInstance.fitBounds(latLngs, { padding: [72, 72] })
  }

  function handleMapClick(lat: number, lng: number) {
    if (reportPickingMode) {
      setReportLocation({ lat, lng })
      setReportPickingMode(false)
      return
    }
    if (reportingMode) {
      setReportLocation({ lat, lng })
      return
    }
    if (routePickingMode === 'origin') {
      planner.setOrigin({ label: `${lat.toFixed(5)}, ${lng.toFixed(5)}`, lat, lng })
      setRoutePickingMode(null)
      setPanelVisible(true)
      return
    }
    if (routePickingMode === 'destination') {
      planner.setDestination({ label: `${lat.toFixed(5)}, ${lng.toFixed(5)}`, lat, lng })
      setRoutePickingMode(null)
      setPanelVisible(true)
      return
    }
  }

  async function handleSubmitReport(type: ReportType, description: string) {
    if (!reportLocation) return
    const finalDescription = description.trim() || `Reported: ${type}`
    try {
      await submitReport({
        userId: crypto.randomUUID(),
        type,
        description: finalDescription,
        latitude: reportLocation.lat,
        longitude: reportLocation.lng,
        segmentId: segments[0]?.segmentId || crypto.randomUUID(),
        createdAt: new Date().toISOString()
      })
      setReportingMode(false)
      setReportLocation(null)
    } catch (error) {
      console.error('Failed to submit report', error)
    }
  }

  const fetchCurrentLocationForReport = () => {
    if (navigator.geolocation && navigator.permissions) {
      navigator.permissions.query({ name: 'geolocation' }).then((result) => {
        if (result.state === 'granted') {
          navigator.geolocation.getCurrentPosition((pos) => {
            setReportLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude })
          })
        }
      }).catch(() => {})
    }
  }

  function handleStartTrip() {
    if (!navigator.geolocation) {
      alert('Brauzeriniz GPS dəstəkləmir.')
      return
    }
    planner.setTripActive(true)
    const id = navigator.geolocation.watchPosition(
      (pos) => {
        const lat = pos.coords.latitude
        const lng = pos.coords.longitude
        const speedMs = pos.coords.speed || 0
        const speedKmh = speedMs * 3.6
        
        setCurrentLocation({ lat, lng })
        
        // GpsPing telemetry: yalniz her 10 saniyeden bir gonder
        const now = Date.now()
        if (now - lastPingTimeRef.current > 10000) {
          lastPingTimeRef.current = now
          const deviceId = user?.username ?? 'anonymous-device'
          sendGpsPing(deviceId, lat, lng, new Date().toISOString(), speedKmh).catch(() => {})
        }
      },
      (err) => {
        console.error('GPS error:', err)
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
    )
    watchIdRef.current = id
  }

  async function handleEndTrip() {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current)
      watchIdRef.current = null
    }
    planner.setTripActive(false)
    
    if (!planner.route?.tripId || !planner.destination || !currentLocation) {
      alert('Səfər məlumatları tam deyil.')
      return
    }
    
    try {
      const distanceKm = planner.route.distanceMeters / 1000
      const savedMinutes = (planner.route.travelTimeSeconds / 60) * 0.2 // Mock 20% time savings for now
      
      const res = await finishTrip(
        planner.route.tripId,
        planner.destination.lat,
        planner.destination.lng,
        currentLocation.lat,
        currentLocation.lng,
        distanceKm,
        savedMinutes
      )
      
      if (res.success) {
        if (res.ecoPointsEarned > 0) {
          alert(res.message + `\n+${res.ecoPointsEarned} Eco-Points!`)
        } else {
          alert(res.message)
        }
      }
    } catch (e: any) {
      const msg = e.message || 'Xəta baş verdi.'
      alert(msg)
    }
  }

  return (
    <div ref={wrapperRef} className="relative h-full w-full bg-slate-200">
      <LiveMap
        mapConfig={mapConfig}
        segments={segments}
        origin={planner.origin}
        destination={planner.destination}
        route={planner.route}
        focus={focus}
        onMapReady={setMapInstance}
        onMapClick={handleMapClick}
        reportLocation={reportLocation}
        currentLocation={currentLocation}
      />

      {routePickingMode && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1100] animate-fade-up">
          <div className="flex items-center gap-3 rounded-full bg-slate-900/90 px-4 py-2.5 text-sm font-medium text-white shadow-float backdrop-blur">
            <span>{s.common.pickingOnMapHint}</span>
            <button
              onClick={() => {
                setRoutePickingMode(null)
                setPanelVisible(true)
              }}
              className="rounded-full bg-white/20 px-3 py-1 text-xs transition hover:bg-white/30"
            >
              {s.common.cancel}
            </button>
          </div>
        </div>
      )}

      {reportPickingMode && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1100] animate-fade-up">
          <div className="flex items-center gap-3 rounded-full bg-slate-900/90 px-4 py-2.5 text-sm font-medium text-white shadow-float backdrop-blur">
            <span>{s.common.pickingOnMapHint}</span>
            <button
              onClick={() => {
                setReportPickingMode(false)
              }}
              className="rounded-full bg-white/20 px-3 py-1 text-xs transition hover:bg-white/30"
            >
              {s.common.cancel}
            </button>
          </div>
        </div>
      )}

      <div className="pointer-events-none absolute inset-0 z-[1000] flex flex-col gap-3 p-3 sm:p-4">
        <div className="flex min-h-0 flex-1 items-start justify-between gap-3">
          <div className="pointer-events-none flex h-full max-h-full min-h-0 min-w-0 max-w-[calc(100vw-1.5rem)] flex-col">
            <RoutePlannerPanel
              visible={panelVisible}
              onClose={() => setPanelVisible(false)}
              onReopen={() => setPanelVisible(true)}
              origin={planner.origin}
              setOrigin={planner.setOrigin}
              destination={planner.destination}
              setDestination={planner.setDestination}
              mode={planner.mode}
              setMode={planner.setMode}
              route={planner.route}
              loading={planner.loading}
              error={planner.error}
              onSwap={planner.swap}
              onClear={planner.clear}
              onShowOnMap={showOnMap}
              tripActive={planner.tripActive}
              onStartTrip={handleStartTrip}
              onEndTrip={handleEndTrip}
              onPickOrigin={() => {
                setRoutePickingMode('origin')
                setPanelVisible(false)
              }}
              onPickDestination={() => {
                setRoutePickingMode('destination')
                setPanelVisible(false)
              }}
            />
            {reportingMode && !reportPickingMode && (
              <div className="mt-3">
                <ReportIncidentPanel
                  onCancel={() => {
                    setReportingMode(false)
                    setReportLocation(null)
                  }}
                  onSubmit={handleSubmitReport}
                  hasLocation={!!reportLocation}
                  onPickOnMap={() => setReportPickingMode(true)}
                />
              </div>
            )}
          </div>

          <div className="hidden flex-col items-end gap-3 sm:flex">
            {!reportingMode && (
              <button
                onClick={() => {
                  setReportingMode(true)
                  setPanelVisible(false)
                  setReportLocation(null)
                  fetchCurrentLocationForReport()
                }}
                className="pointer-events-auto flex items-center gap-2 rounded-full border border-transparent bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-float transition hover:bg-brand-700 active:scale-95"
              >
                <AlertTriangle className="h-4 w-4" />
                {s.incidentsPage.reportButton}
              </button>
            )}
            <LayerControlPanel />
            {mapInstance && <MapZoomControls map={mapInstance} fullscreenTarget={wrapperRef.current} />}
          </div>
        </div>

        <div className="pointer-events-none flex flex-col items-center gap-3">
          <div className="hidden sm:block">
            <MapLegend />
          </div>
          <CityStatusBar cityStats={cityStats.data} loading={cityStats.loading} onRefresh={() => {
            cityStats.refetch()
            trafficMap.refetch()
          }} />
        </div>
      </div>
    </div>
  )
}
