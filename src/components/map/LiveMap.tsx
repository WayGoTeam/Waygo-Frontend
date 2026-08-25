import { useEffect, useMemo, useRef, useState } from 'react'
import Map, { Marker, Popup, Source, Layer, useMap } from 'react-map-gl'
import type { MapRef } from 'react-map-gl'
import type maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

import { useMapLayers } from '@/context/MapLayersContext'
import { useIncidentsContext } from '@/context/IncidentsContext'
import { useLocale } from '@/i18n/LocaleContext'
import { incidentIcon, dotIcon, pinIcon } from '@/lib/mapIcons'
import { IncidentTypeIcon } from '@/components/incidents/incidentIcons'
import type { MapConfig, TrafficMapEntry } from '@/types/api'
import type { PlaceResult } from '@/components/layout/GlobalSearch'
import type { RouteResult } from '@/hooks/useRoutePlanner'
import { mapStyle } from '@/lib/mapStyle'

const BAKU_CENTER: [number, number] = [49.8671, 40.4093] // [lng, lat] for MapLibre

function isRecent(iso: string, withinMs: number): boolean {
  return Date.now() - new Date(iso).getTime() < withinMs
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
  onMapReady: (map: maplibregl.Map) => void
  onMapClick?: (lat: number, lng: number) => void
  reportLocation?: { lat: number; lng: number } | null
  currentLocation?: { lat: number; lng: number } | null
}) {
  const { s } = useLocale()
  const { basemap, showTraffic, showIncidents, showLiveIncidents } = useMapLayers()
  const { incidents } = useIncidentsContext()
  const mapRef = useRef<MapRef>(null)

  const center: [number, number] = mapConfig ? [mapConfig.centerLng, mapConfig.centerLat] : BAKU_CENTER
  const [currentZoom, setCurrentZoom] = useState(mapConfig?.defaultZoom ?? 12)

  useEffect(() => {
    if (mapRef.current) {
      onMapReady(mapRef.current.getMap())
    }
  }, [onMapReady])

  useEffect(() => {
    if (focus && mapRef.current) {
      mapRef.current.flyTo({ center: [focus.lng, focus.lat], zoom: 15, duration: 1100 })
    }
  }, [focus])

  const routeGeoJSON = useMemo(() => {
    if (!route || route.points.length < 2) return null
    return {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: route.points.map((p) => [p.longitude, p.latitude])
      }
    }
  }, [route])

  const visibleIncidents = useMemo(() => {
    if (!incidents) return []
    if (currentZoom < 12) return [] // Hide incidents when zoomed out
    return incidents.filter((i) => {
      if (!i.active || i.latitude === null || i.longitude === null) return false
      return i.source === 'ANOMALY_DETECTION' ? showLiveIncidents : showIncidents
    })
  }, [incidents, showIncidents, showLiveIncidents, currentZoom])

  return (
    <Map
      ref={mapRef}
      initialViewState={{ longitude: center[0], latitude: center[1], zoom: mapConfig?.defaultZoom ?? 12 }}
      mapStyle={mapStyle}
      style={{ width: '100%', height: '100%' }}
      onClick={(e) => onMapClick?.(e.lngLat.lat, e.lngLat.lng)}
      onZoom={(e) => setCurrentZoom(e.viewState.zoom)}
      interactiveLayerIds={['roads-minor', 'roads-major', 'buildings', 'water', 'parks']}
    >
      {/* Route Line */}
      {routeGeoJSON && (
        <Source id="route-source" type="geojson" data={routeGeoJSON as any}>
          <Layer
            id="route-layer-bg"
            type="line"
            layout={{ 'line-join': 'round', 'line-cap': 'round' }}
            paint={{ 'line-color': '#1447e6', 'line-width': 9, 'line-opacity': 0.25 }}
          />
          <Layer
            id="route-layer-fg"
            type="line"
            layout={{ 'line-join': 'round', 'line-cap': 'round' }}
            paint={{ 'line-color': '#2358eb', 'line-width': 5, 'line-opacity': 0.95 }}
          />
        </Source>
      )}

      {/* Origin, Destination, Focus, Report Location, Current Location */}
      {/* We need custom markers. In maplibre-gl with React, we can use <Marker> to render HTML markers */}
      {origin && (
        <Marker longitude={origin.lng} latitude={origin.lat} anchor="bottom">
          <div className="w-4 h-4 rounded-full bg-green-500 border-2 border-white shadow-md" />
        </Marker>
      )}
      {destination && (
        <Marker longitude={destination.lng} latitude={destination.lat} anchor="bottom">
          <div className="w-5 h-5 bg-red-500 transform rotate-45 rounded-tl-full rounded-tr-full rounded-bl-full shadow-md" />
        </Marker>
      )}
      {focus && !origin && !destination && (
        <Marker longitude={focus.lng} latitude={focus.lat} anchor="bottom">
          <div className="w-5 h-5 bg-blue-600 transform rotate-45 rounded-tl-full rounded-tr-full rounded-bl-full shadow-md" />
          {focus.label && (
            <Popup longitude={focus.lng} latitude={focus.lat} anchor="top" closeButton={false}>
              {focus.label}
            </Popup>
          )}
        </Marker>
      )}
      {reportLocation && (
        <Marker longitude={reportLocation.lng} latitude={reportLocation.lat} anchor="bottom">
          <div className="w-6 h-6 bg-amber-500 transform rotate-45 rounded-tl-full rounded-tr-full rounded-bl-full shadow-md flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full" />
          </div>
        </Marker>
      )}
      {currentLocation && (
        <Marker longitude={currentLocation.lng} latitude={currentLocation.lat} anchor="center">
          <div className="w-4 h-4 rounded-full bg-blue-500 border-2 border-white shadow-[0_0_0_2px_rgba(59,130,246,0.5)]" />
        </Marker>
      )}

      {/* Incidents */}
      {visibleIncidents.map((incident) => (
        <Marker
          key={incident.id}
          longitude={incident.longitude as number}
          latitude={incident.latitude as number}
          anchor="bottom"
        >
          <div className="w-6 h-6 bg-amber-500 transform rotate-45 rounded-tl-full rounded-tr-full rounded-bl-full shadow-md flex items-center justify-center cursor-pointer group">
             <div className="transform -rotate-45 text-white">
                <IncidentTypeIcon type={incident.incidentType} className="h-3 w-3" />
             </div>
             
             {/* Simple hover popup */}
             <div className="absolute bottom-full mb-2 hidden group-hover:block w-48 p-2 bg-white rounded shadow-lg z-50 text-xs">
                <p className="font-bold flex items-center gap-1 text-slate-800">
                  <IncidentTypeIcon type={incident.incidentType} className="h-3 w-3 text-amber-500" />
                  {s.incidentTypes[incident.incidentType] ?? incident.incidentType}
                </p>
                <p className="text-slate-600 mt-1">{incident.description}</p>
             </div>
          </div>
        </Marker>
      ))}

    </Map>
  )
}
