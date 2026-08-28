import { useEffect, useRef, useState, useCallback } from 'react'
import { useLocation } from 'react-router-dom'
import { finishTrip, sendGpsPing, getAiRoute } from '@/api/navigation'
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
import { Modal } from '@/components/common/Modal'
import { ReportIncidentPanel } from '@/components/map/ReportIncidentPanel'
import { TripSummaryModal } from '@/components/map/TripSummaryModal'
import { TurnByTurnPanel } from '@/components/map/TurnByTurnPanel'
import { SpeedometerWidget } from '@/components/map/SpeedometerWidget'
import { LeaderboardPanel } from '@/components/map/LeaderboardPanel'
import { AlertTriangle, Trophy } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useLocale } from '@/i18n/LocaleContext'
import { submitReport } from '@/api/reports'
import { haversineKm } from '@/lib/geo'
import type { ReportType } from '@/types/api'
import type { Maneuver } from '@/hooks/useRoutePlanner'

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
  const [activeManeuver, setActiveManeuver] = useState<Maneuver | null>(null)
  const [distanceToManeuver, setDistanceToManeuver] = useState<number | null>(null)
  const [currentSpeed, setCurrentSpeed] = useState(0)
  const [showLeaderboard, setShowLeaderboard] = useState(false)
  const watchIdRef = useRef<number | null>(null)
  const lastPingTimeRef = useRef<number>(0)
  const wakeLockRef = useRef<any>(null)
  const lastRerouteTimeRef = useRef<number>(0)

  const trafficMap = useTrafficMap()
  const cityStats = useCityStats()
  const { data: mapConfig } = useMapConfig()
  const segments = trafficMap.data?.segments ?? []
  const planner = useRoutePlanner(segments)

  const [tripSummary, setTripSummary] = useState<{ecoPoints: number, co2SavedKg: number, distanceKm: number, ecoMode: boolean} | null>(null)

  // ─── Wake Lock API: Prevent screen from turning off during navigation ───
  const requestWakeLock = useCallback(async () => {
    try {
      if ('wakeLock' in navigator) {
        wakeLockRef.current = await (navigator as any).wakeLock.request('screen')
        wakeLockRef.current.addEventListener('release', () => { wakeLockRef.current = null })
      }
    } catch {}
  }, [])

  const releaseWakeLock = useCallback(() => {
    if (wakeLockRef.current) {
      wakeLockRef.current.release().catch(() => {})
      wakeLockRef.current = null
    }
  }, [])

  // Re-acquire wake lock when page becomes visible again
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && planner.tripActive) {
        requestWakeLock()
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [planner.tripActive, requestWakeLock])

  // ─── Auto-Rerouting: Detect deviation from route and recalculate ───
  useEffect(() => {
    if (!planner.tripActive || !planner.route || !currentLocation || !planner.destination || !planner.origin) return

    const routePoints = planner.route.points
    if (routePoints.length === 0) return

    // Find closest point on route
    let minDist = Infinity
    for (const p of routePoints) {
      const dist = haversineKm(
        { latitude: p.latitude, longitude: p.longitude },
        { latitude: currentLocation.lat, longitude: currentLocation.lng }
      )
      if (dist < minDist) minDist = dist
    }

    const deviationMeters = minDist * 1000
    const now = Date.now()

    // If user is more than 80 meters off the route, auto-reroute (max once per 15 seconds)
    if (deviationMeters > 80 && (now - lastRerouteTimeRef.current > 15000)) {
      lastRerouteTimeRef.current = now
      
      // Update origin to current location and recalculate
      planner.setOrigin({
        label: 'Cari mövqe',
        subtitle: 'Yenidən hesablanır...',
        lat: currentLocation.lat,
        lng: currentLocation.lng,
      })

      // Play reroute sound
      try {
        if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel()
          const utterance = new SpeechSynthesisUtterance('Marşrut yenidən hesablanır')
          utterance.rate = 1.1
          utterance.volume = 0.8
          window.speechSynthesis.speak(utterance)
        }
      } catch {}
    }
  }, [currentLocation, planner.tripActive, planner.route])


  useEffect(() => {
    const state = location.state as FocusState | null
    if (state?.focus) {
      setFocus(state.focus)
      setPanelVisible(false)
    }
  }, [location.state])

  // Turn-by-Turn logic
  useEffect(() => {
    if (!planner.tripActive || !planner.route || !currentLocation || !planner.route.maneuvers) {
      setActiveManeuver(null)
      return
    }

    const { points, maneuvers } = planner.route
    if (points.length === 0 || maneuvers.length === 0) return

    let closestIndex = 0
    let minDistance = Infinity

    for (let i = 0; i < points.length; i++) {
      const p = points[i]
      const dist = haversineKm({ latitude: p.latitude, longitude: p.longitude }, { latitude: currentLocation.lat, longitude: currentLocation.lng })
      if (dist < minDistance) {
        minDistance = dist
        closestIndex = i
      }
    }

    const maneuverIndex = maneuvers.findIndex(m => closestIndex >= m.begin_shape_index && closestIndex <= m.end_shape_index)
    
    if (maneuverIndex !== -1) {
      const current = maneuvers[maneuverIndex]
      const nextManeuver = maneuvers[maneuverIndex + 1]
      
      if (nextManeuver) {
        setActiveManeuver(nextManeuver)
        const p2 = points[nextManeuver.begin_shape_index]
        if (p2) {
            const distKm = haversineKm({ latitude: p2.latitude, longitude: p2.longitude }, { latitude: currentLocation.lat, longitude: currentLocation.lng })
            setDistanceToManeuver(distKm * 1000) // to meters
        }
      } else {
        setActiveManeuver(current)
        setDistanceToManeuver(0)
      }
    }
  }, [currentLocation, planner.route, planner.tripActive])

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
    if (latLngs.length > 1) {
      mapInstance.fitBounds(latLngs, { padding: [72, 72] })
      setPanelVisible(false)
    }
  }

  function handleClosePanel() {
    planner.clear()
    setPanelVisible(false)
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

  const [dialogInfo, setDialogInfo] = useState<{ title: string; content: React.ReactNode; isConfirm?: boolean; onConfirm?: () => void } | null>(null)

  function handleStartTrip() {
    if (!navigator.geolocation) {
      setDialogInfo({ title: 'Diqqət', content: 'Brauzeriniz GPS dəstəkləmir.' })
      return
    }

    const startGps = () => {
      planner.setTripActive(true)
      requestWakeLock() // Prevent screen from sleeping
      const id = navigator.geolocation.watchPosition(
        (pos) => {
          const lat = pos.coords.latitude
          const lng = pos.coords.longitude
          const speedMs = pos.coords.speed || 0
          const speedKmh = speedMs * 3.6
          
          setCurrentLocation({ lat, lng })
          setCurrentSpeed(speedKmh)
          
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

    if (!user) {
      setDialogInfo({
        title: 'Qonaq Rejimi',
        content: 'Hesaba daxil olmadan səfərə başlayırsınız.\nSəfər sonu heç bir xal (Eco-Points) qazanmayacaqsınız. Yenə də davam etmək istəyirsiniz?',
        isConfirm: true,
        onConfirm: () => {
          setDialogInfo(null)
          startGps()
        }
      })
      return
    }

    if (planner.route?.inCooldown) {
      setDialogInfo({
        title: 'Cooldown Aktivdir',
        content: 'Siz artıq yaxın zamanda xal qazanmısınız.\nNövbəti 5 dəqiqə ərzində bitən səfərlər üçün xal verilməyəcək. Yenə də davam etmək istəyirsiniz?',
        isConfirm: true,
        onConfirm: () => {
          setDialogInfo(null)
          startGps()
        }
      })
      return
    }

    startGps()
  }


  function handleEndTripClick() {
    setDialogInfo({
      title: 'Səfəri bitir',
      content: 'Səfəri bitirmək istədiyinizə əminsiniz?',
      isConfirm: true,
      onConfirm: handleEndTrip
    })
  }

  async function handleEndTrip() {
    setDialogInfo(null)
    
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current)
      watchIdRef.current = null
    }
    releaseWakeLock() // Allow screen to sleep again
    planner.setTripActive(false)
    setCurrentSpeed(0)

    // Await fresh GPS location explicitly for testing/mocking
    let finalLocation = currentLocation
    try {
      finalLocation = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
          (err) => reject(err),
          { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        )
      })
      if (finalLocation) {
        setCurrentLocation(finalLocation)
      }
    } catch (e) {
      console.warn('GPS yenilənmədi, köhnə mövqe istifadə olunur.', e)
    }
    
    if (!planner.destination || !finalLocation) {
      setDialogInfo({ title: 'Xəta', content: 'Səfər məlumatları tam deyil (Trip data is incomplete).' })
      return
    }
    
    if (!user) {
      setDialogInfo({ title: 'Diqqət', content: 'Eco-Points qazanmaq üçün sistemə daxil olmalısınız!' })
      return
    }
    
    try {
      const distanceKm = planner.route?.distanceMeters ? planner.route.distanceMeters / 1000 : 0
      const savedMinutes = planner.route?.travelTimeSeconds ? (planner.route.travelTimeSeconds / 60) * 0.2 : 0
      
      const res = await finishTrip(
        planner.route?.tripId || 'anonymous-trip',
        planner.destination.lat,
        planner.destination.lng,
        finalLocation.lat,
        finalLocation.lng,
        distanceKm,
        savedMinutes,
        planner.mode === 'eco'
      )
      
      if (res.success) {
        setTripSummary({
          ecoPoints: res.ecoPointsEarned || 0,
          co2SavedKg: res.co2SavedKg || 0,
          distanceKm: res.distanceKm || distanceKm,
          ecoMode: res.ecoMode || planner.mode === 'eco'
        })
      }
    } catch (e: any) {
      const msg = e.message || 'Xəta baş verdi.'
      setDialogInfo({ title: 'Xəta', content: msg })
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

      {planner.tripActive && activeManeuver && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1100] w-full">
          <TurnByTurnPanel 
            activeManeuver={activeManeuver} 
            distanceToManeuverMeters={distanceToManeuver} 
          />
        </div>
      )}


      <div className="pointer-events-none absolute inset-0 z-[1000] flex flex-col gap-3 p-3 sm:p-4">
        <div className="flex min-h-0 flex-1 items-start justify-between gap-3">
          <div className="pointer-events-none flex h-full max-h-full min-h-0 min-w-0 max-w-[calc(100vw-1.5rem)] flex-col">
            <RoutePlannerPanel
              visible={panelVisible}
              onClose={handleClosePanel}
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
              onEndTrip={handleEndTripClick}
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
            {/* Speedometer during active trip */}
            {planner.tripActive && (
              <SpeedometerWidget currentSpeedKmh={currentSpeed} speedLimitKmh={60} />
            )}

            {!reportingMode && (
              <>
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
                <button
                  onClick={() => setShowLeaderboard(prev => !prev)}
                  className="pointer-events-auto flex items-center gap-2 rounded-full border border-transparent bg-amber-500 px-4 py-2 text-sm font-semibold text-white shadow-float transition hover:bg-amber-600 active:scale-95"
                >
                  <Trophy className="h-4 w-4" />
                  Top Sürücülər
                </button>
              </>
            )}
            <LayerControlPanel />
            {mapInstance && <MapZoomControls map={mapInstance} fullscreenTarget={wrapperRef.current} />}
          </div>
        </div>

        <div className="pointer-events-none flex flex-col items-center gap-3">
          <div className="hidden sm:block">
            <MapLegend />
          </div>
        </div>
      </div>

      {/* Speedometer for mobile (bottom-right) */}
      {planner.tripActive && (
        <div className="absolute bottom-24 right-4 z-[1100] sm:hidden">
          <SpeedometerWidget currentSpeedKmh={currentSpeed} speedLimitKmh={60} />
        </div>
      )}

      {/* Leaderboard Slide-over */}
      {showLeaderboard && (
        <div className="absolute right-4 top-20 z-[1100] w-80 max-h-[70vh] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl animate-fade-up">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-bold text-slate-800">🏆 Leaderboard</h3>
            <button onClick={() => setShowLeaderboard(false)} className="text-xs text-slate-400 hover:text-slate-600">✕</button>
          </div>
          <LeaderboardPanel />
        </div>
      )}

      {dialogInfo && (
        <Modal
          title={dialogInfo.title}
          onClose={() => setDialogInfo(null)}
        >
          <div className="text-sm text-slate-600 mb-6 whitespace-pre-line">
            {dialogInfo.content}
          </div>
          <div className="flex justify-end gap-3">
            {dialogInfo.isConfirm && (
              <button
                onClick={() => setDialogInfo(null)}
                className="rounded-full border border-slate-200 bg-white px-5 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                {s.common.cancel || 'Ləğv et'}
              </button>
            )}
            <button
              onClick={() => {
                if (dialogInfo.onConfirm) {
                  dialogInfo.onConfirm()
                } else {
                  setDialogInfo(null)
                }
              }}
              className="rounded-full bg-brand-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-brand-700"
            >
              OK
            </button>
          </div>
        </Modal>
      )}

      <TripSummaryModal
        visible={!!tripSummary}
        ecoPoints={tripSummary?.ecoPoints || 0}
        co2SavedKg={tripSummary?.co2SavedKg || 0}
        distanceKm={tripSummary?.distanceKm || 0}
        ecoMode={tripSummary?.ecoMode || false}
        onClose={() => setTripSummary(null)}
      />
    </div>
  )
}
