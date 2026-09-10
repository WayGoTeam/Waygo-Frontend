import { useEffect, useMemo, useState } from 'react'
import { MapContainer, Marker, Polyline, Popup, TileLayer, useMap, useMapEvents } from 'react-leaflet'
import * as L from 'leaflet'
import { useMapLayers } from '@/context/MapLayersContext'
import { useIncidentsContext } from '@/context/IncidentsContext'
import { useLocale } from '@/i18n/LocaleContext'
import { renderToString } from 'react-dom/server'
import { AlertTriangle } from 'lucide-react'
import { dotIcon, dynamicIncidentIcon, pinIcon } from '@/lib/mapIcons'
import { trafficFlowTileUrl, tileUrlFor } from '@/api/maps'
import { IncidentTypeIcon, incidentHexColor } from '@/components/incidents/incidentIcons'
import type { MapConfig, TrafficMapEntry } from '@/types/api'
import type { PlaceResult } from '@/components/layout/GlobalSearch'
import type { RouteResult } from '@/hooks/useRoutePlanner'

const BAKU_CENTER: [number, number] = [40.4093, 49.8671]

function MapReadyBridge({ onReady }: { onReady: (map: L.Map) => void }) {
  const map = useMap()
  useEffect(() => {
    onReady(map)
  }, [map, onReady])
  return null
}

function MapEventHandler({ onClick }: { onClick?: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onClick?.(e.latlng.lat, e.latlng.lng)
    },
  })
  return null
}

function ZoomTracker({ onZoom }: { onZoom: (z: number) => void }) {
  const map = useMapEvents({
    zoomend() {
      onZoom(map.getZoom())
    }
  })
  return null
}

function FlyToFocus({ focus }: { focus: { lat: number; lng: number } | null }) {
  const map = useMap()
  useEffect(() => {
    if (focus) map.flyTo([focus.lat, focus.lng], 15, { duration: 1.1 })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focus])
  return null
}

function isRecent(iso: string, withinMs: number): boolean {
  return Date.now() - new Date(iso).getTime() < withinMs
}

/** Web-Mercator tile indices for a lat/lng at zoom `z` (used only to probe one tile). */
function tileXY(lat: number, lng: number, z: number): { x: number; y: number } {
  const n = 2 ** z
  const x = Math.floor(((lng + 180) / 360) * n)
  const latRad = (lat * Math.PI) / 180
  const y = Math.floor(((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * n)
  return { x, y }
}

export type TrafficLayerStatus = 'idle' | 'loading' | 'ready' | 'error'

function VectorTrafficLayer({
  url,
  visible,
  onStatus,
}: {
  url: string
  visible: boolean
  onStatus?: (status: TrafficLayerStatus) => void
}) {
  const map = useMap()
  const { s } = useLocale()

  useEffect(() => {
    if (!visible) {
      onStatus?.('idle')
      return
    }
    let layer: any = null
    let isMounted = true
    let reportedError = false
    const abort = new AbortController()

    const fail = (reason: unknown) => {
      if (!isMounted || reportedError) return
      reportedError = true
      console.error('[WayGo] Traffic tiles unavailable:', reason)
      onStatus?.('error')
    }

    onStatus?.('loading')

    // Inject L to window for vectorgrid
    if (typeof window !== 'undefined') {
      ; (window as any).L = L
    }

    // 1) Probe a single tile at the current view first. This turns a dead tile
    //    host / proxy (404, 5xx, network error) into an explicit UI error state
    //    instead of dozens of silent "Failed to fetch" console messages (L01).
    const center = map.getCenter()
    const probeZoom = Math.max(10, Math.min(14, Math.round(map.getZoom())))
    const { x, y } = tileXY(center.lat, center.lng, probeZoom)
    const probeUrl = tileUrlFor(url, probeZoom, x, y)

    fetch(probeUrl, { signal: abort.signal, cache: 'no-store' })
      .then((res) => {
        if (!res.ok && res.status !== 204) throw new Error(`HTTP ${res.status} for ${probeUrl}`)
        // 2) Only load the (heavy) vectorgrid bundle once we know tiles are served.
        return import('leaflet.vectorgrid')
      })
      .then(() => {
        if (!isMounted) return

        // Create vector grid layer pointing to Martin MVT
        const L_global = (window as any).L
        layer = L_global.vectorGrid.protobuf(url, {
          vectorTileLayerStyles: {
            mock_traffic: (properties: any) => {
              const level = properties.congestion_level || 1
              let color = '#22c55e' // Green (Light)
              if (level === 3) color = '#f59e0b' // Orange (Moderate)
              if (level >= 4) color = '#ef4444' // Red (Heavy)

              return {
                weight: 5,
                color,
                opacity: 0.8,
                fill: false,
              }
            },
          },
          interactive: true,
          minZoom: 10,
        })

        // VectorGrid swallows non-OK responses and lets network errors reject an
        // un-awaited promise. Wrap its tile loader so failures reach the UI.
        const originalLoader = layer._getVectorTilePromise?.bind(layer)
        if (originalLoader) {
          layer._getVectorTilePromise = (...args: unknown[]) =>
            Promise.resolve()
              .then(() => originalLoader(...args))
              .catch((err: unknown) => {
                fail(err)
                return { layers: [] }
              })
        }

        layer.addTo(map)
        onStatus?.('ready')

        layer.on('click', (e: any) => {
          const p = e.layer.properties
          const road = p.name || 'N/A'
          const level = p.congestion_level ?? '—'
          L.popup()
            .setContent(
              `<strong>${s.trafficLayer.roadLabel}:</strong> ${road}<br/><strong>${s.trafficLayer.congestionLabel}:</strong> ${s.trafficLayer.levelLabel} ${level}`,
            )
            .setLatLng(e.latlng)
            .openOn(map)
        })
      })
      .catch((err) => {
        if (abort.signal.aborted) return
        fail(err)
      })

    return () => {
      isMounted = false
      abort.abort()
      if (layer && map) {
        map.removeLayer(layer)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, url, visible])

  return null
}

export function LiveMap({
  mapConfig,
  segments,
  origin,
  destination,
  route,
  focus,
  onMapReady,
  onMapClick,
  reportLocation,
  currentLocation,
}: {
  mapConfig: MapConfig | null
  segments: TrafficMapEntry[]
  origin: PlaceResult | null
  destination: PlaceResult | null
  route: RouteResult | null
  focus: { lat: number; lng: number; label?: string } | null
  onMapReady: (map: L.Map) => void
  onMapClick?: (lat: number, lng: number) => void
  reportLocation?: { lat: number; lng: number } | null
  currentLocation?: { lat: number; lng: number } | null
}) {
  const { s } = useLocale()
  const { basemap, showTraffic, showIncidents, showLiveIncidents } = useMapLayers()
  const { incidents } = useIncidentsContext()

  const center: [number, number] = mapConfig ? [mapConfig.centerLat, mapConfig.centerLng] : BAKU_CENTER
  const zoom = mapConfig?.defaultZoom ?? 12
  const [currentZoom, setCurrentZoom] = useState(zoom)
  const [trafficStatus, setTrafficStatus] = useState<TrafficLayerStatus>('idle')
  const trafficTileUrl = useMemo(() => trafficFlowTileUrl(), [])

  // Use OSM for standard map, Esri for satellite
  const basemapUrl =
    basemap === 'satellite'
      ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
      : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'

  const routeLatLngs = useMemo<[number, number][]>(
    () => (route ? route.points.map((p) => [p.latitude, p.longitude]) : []),
    [route],
  )

  const visibleIncidents = useMemo(() => {
    if (!incidents) return []
    // Two independent filters (L14):
    //   "Hadisələr"        -> user-reported incidents      (source USER_REPORT)
    //   "Canlı hadisələr"  -> system-detected anomalies    (source ANOMALY_DETECTION / anything else)
    return incidents.filter((i) => {
      if (!i.active || i.latitude === null || i.longitude === null) return false
      const isUserReport = i.source === 'USER_REPORT'
      return isUserReport ? showIncidents : showLiveIncidents
    })
  }, [incidents, showIncidents, showLiveIncidents])

  const incidentSize = currentZoom < 10 ? 12 : currentZoom < 12 ? 20 : currentZoom < 14 ? 26 : 30
  const pinSize = currentZoom < 10 ? 16 : currentZoom < 12 ? 24 : currentZoom < 14 ? 30 : 34
  const dotSize = currentZoom < 10 ? 8 : currentZoom < 12 ? 12 : currentZoom < 14 ? 14 : 16
  const showMarkers = currentZoom >= 9

  return (
    <>
    {showTraffic && trafficStatus === 'error' && (
      <div
        role="alert"
        className="pointer-events-none absolute left-1/2 top-4 z-[1150] -translate-x-1/2 sm:top-20"
      >
        <div className="flex items-center gap-2 rounded-full border border-amber-300/70 bg-amber-50/95 px-4 py-2 text-xs font-semibold text-amber-800 shadow-float backdrop-blur dark:border-amber-500/40 dark:bg-amber-950/90 dark:text-amber-200">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span>{s.trafficLayer.unavailable}</span>
        </div>
      </div>
    )}
    <MapContainer
      center={center}
      zoom={zoom}
      minZoom={3}
      maxBounds={[[-90, -180], [90, 180]]}
      maxBoundsViscosity={1.0}
      className="h-full w-full"
      zoomControl={false}
      attributionControl
    >
      <MapReadyBridge onReady={onMapReady} />
      <ZoomTracker onZoom={setCurrentZoom} />
      <MapEventHandler onClick={onMapClick} />
      <FlyToFocus focus={focus} />

      {basemapUrl && (
        <TileLayer
          key={basemap}
          url={basemapUrl}
          attribution={
            basemap === 'satellite'
              ? '&copy; Esri &mdash; World Imagery'
              : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          }
        />
      )}

      {/* Render traffic lines via Martin Vector Tiles (same-origin /tiles proxy) */}
      <VectorTrafficLayer url={trafficTileUrl} visible={showTraffic} onStatus={setTrafficStatus} />

      {showMarkers && visibleIncidents.map((incident) => {
        const hexColor = incidentHexColor(incident.incidentType);
        const pulse = isRecent(incident.createdAt, 2 * 60_000);
        const svgHtml = renderToString(<IncidentTypeIcon type={incident.incidentType} size={incidentSize * 0.4} color="white" strokeWidth={2.5} />);

        return (
          <Marker
            key={incident.id}
            position={[incident.latitude as number, incident.longitude as number]}
            icon={dynamicIncidentIcon(svgHtml, hexColor, pulse, incidentSize)}
          >
            <Popup autoPanPaddingTopLeft={[364, 84]} autoPanPaddingBottomRight={[224, 168]}>
              <p className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-200">
                <IncidentTypeIcon type={incident.incidentType} className={`h-3.5 w-3.5`} style={{ color: hexColor }} />
                {s.incidentTypes[incident.incidentType] ?? incident.incidentType}
              </p>
              <p className="mt-1 text-slate-500 dark:text-slate-400">
                {incident.description.startsWith('Reported: ') || incident.description.startsWith('Reported:')
                  ? `${s.reportModal.reportedPrefix} ${s.incidentTypes[incident.incidentType] ?? incident.incidentType}`
                  : incident.description}
              </p>
            </Popup>
          </Marker>
        );
      })}

      {route && routeLatLngs.length > 1 && (
        <>
          <Polyline positions={routeLatLngs} pathOptions={{ color: '#1447e6', weight: 9, opacity: 0.25, lineCap: 'round' }} />
          <Polyline positions={routeLatLngs} pathOptions={{ color: '#2358eb', weight: 5, opacity: 0.95, lineCap: 'round' }} />
        </>
      )}
      {showMarkers && origin && <Marker position={[origin.lat, origin.lng]} icon={dotIcon('#22c55e', dotSize)} />}
      {showMarkers && destination && <Marker position={[destination.lat, destination.lng]} icon={pinIcon('#ef4444', pinSize)} />}
      {showMarkers && focus && !origin && !destination && (
        <Marker position={[focus.lat, focus.lng]} icon={pinIcon('#2358eb', pinSize)}>
          {focus.label && <Popup>{focus.label}</Popup>}
        </Marker>
      )}
      {showMarkers && reportLocation && (
        <Marker position={[reportLocation.lat, reportLocation.lng]} icon={dynamicIncidentIcon(renderToString(<IncidentTypeIcon type="HAZARD" size={incidentSize * 0.4} color="white" strokeWidth={2.5} />), '#f59e0b', true, incidentSize)} />
      )}
      {showMarkers && currentLocation && (
        <Marker position={[currentLocation.lat, currentLocation.lng]} icon={dotIcon('#3b82f6', dotSize)} zIndexOffset={1000} />
      )}
    </MapContainer>
    </>
  )
}
