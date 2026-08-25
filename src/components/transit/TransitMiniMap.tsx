import Map, { Source, Layer, Marker } from 'react-map-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import type { TransitNetwork } from '@/types/api'
import { mapStyle } from '@/lib/mapStyle'

const BAKU_CENTER: [number, number] = [49.8671, 40.4093] // [lng, lat]

export function TransitMiniMap({ network }: { network: TransitNetwork }) {
  return (
    <Map
      initialViewState={{ longitude: BAKU_CENTER[0], latitude: BAKU_CENTER[1], zoom: 12 }}
      mapStyle={mapStyle as any}
      style={{ width: '100%', height: '100%' }}
      interactive={false}
    >
      {/* Buses */}
      {network.buses.map((route) => {
        const routeData = {
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: route.coords.map(c => [c[1], c[0]]) // Leaflet is lat,lng -> Maplibre is lng,lat
          }
        }
        return (
          <Source key={`bus-${route.name}`} type="geojson" data={routeData as any}>
            <Layer 
              id={`layer-bus-${route.name}`}
              type="line"
              layout={{ 'line-join': 'round', 'line-cap': 'round' }}
              paint={{
                'line-color': route.color,
                'line-width': 3,
                'line-opacity': 0.55,
                'line-dasharray': [1, 7]
              }}
            />
          </Source>
        )
      })}

      {/* Metro Lines */}
      {network.metro.lines.map((line) => {
        const lineData = {
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: line.coords.map(c => [c[1], c[0]]) 
          }
        }
        return (
          <Source key={`metro-${line.name}`} type="geojson" data={lineData as any}>
            <Layer 
              id={`layer-metro-${line.name}`}
              type="line"
              layout={{ 'line-join': 'round', 'line-cap': 'round' }}
              paint={{
                'line-color': line.color,
                'line-width': 5,
                'line-opacity': 0.95
              }}
            />
          </Source>
        )
      })}

      {/* Metro Stations */}
      {network.metro.stations.map((station) => (
        <Marker 
          key={station.name} 
          longitude={station.lng} 
          latitude={station.lat}
          anchor="center"
        >
          <div className="group relative">
            <div className="w-3 h-3 bg-[#1447e6] border-2 border-white rounded-full shadow-md" />
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block whitespace-nowrap bg-slate-800 text-white text-xs px-2 py-1 rounded shadow-lg z-50">
              {station.name}
            </div>
          </div>
        </Marker>
      ))}
    </Map>
  )
}
