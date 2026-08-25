import { MapContainer, Polyline, CircleMarker, TileLayer, Tooltip } from 'react-leaflet'
import type { TransitNetwork } from '@/types/api'

const BAKU_CENTER: [number, number] = [40.4093, 49.8671]

export function TransitMiniMap({ network }: { network: TransitNetwork }) {
  return (
    <MapContainer center={BAKU_CENTER} zoom={12} className="h-full w-full" zoomControl={false}>
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
      />

      {network.buses.map((route) => (
        <Polyline
          key={`bus-${route.name}`}
          positions={route.coords}
          pathOptions={{ color: route.color, weight: 3, opacity: 0.55, dashArray: '1 7', lineCap: 'round' }}
        />
      ))}

      {network.metro.lines.map((line) => (
        <Polyline
          key={`metro-${line.name}`}
          positions={line.coords}
          pathOptions={{ color: line.color, weight: 5, opacity: 0.95, lineCap: 'round' }}
        />
      ))}

      {network.metro.stations.map((station) => (
        <CircleMarker
          key={station.name}
          center={[station.lat, station.lng]}
          radius={5}
          pathOptions={{ color: '#fff', weight: 2, fillColor: '#1447e6', fillOpacity: 1 }}
        >
          <Tooltip direction="top" offset={[0, -4]}>
            {station.name}
          </Tooltip>
        </CircleMarker>
      ))}
    </MapContainer>
  )
}
