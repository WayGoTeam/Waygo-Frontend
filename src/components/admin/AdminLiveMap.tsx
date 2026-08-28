import { useEffect, useState, useRef } from 'react'
import L from 'leaflet'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { getActiveGps } from '@/api/admin'
import type { ActiveGpsData } from '@/api/admin'
import { Navigation, Loader2 } from 'lucide-react'

// Custom pulsing marker icon for live users
const pulseIcon = L.divIcon({
  className: 'waygo-live-user-icon',
  html: <div style="
    width: 24px;
    height: 24px;
    background-color: #3b82f6;
    border: 3px solid white;
    border-radius: 50%;
    box-shadow: 0 0 10px rgba(59, 130, 246, 0.8);
    animation: pulse-ring 2s infinite;
  "></div>,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
})

export function AdminLiveMap() {
  const [liveUsers, setLiveUsers] = useState<ActiveGpsData[]>([])
  const [loading, setLoading] = useState(true)
  const mapRef = useRef<L.Map>(null)

  useEffect(() => {
    // Inject the pulse animation into the document head if not present
    if (!document.getElementById('waygo-live-pulse-style')) {
      const style = document.createElement('style')
      style.id = 'waygo-live-pulse-style'
      style.innerHTML = 
        @keyframes pulse-ring {
          0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7); }
          70% { box-shadow: 0 0 0 15px rgba(59, 130, 246, 0); }
          100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
        }
      
      document.head.appendChild(style)
    }

    const fetchGps = () => {
      getActiveGps()
        .then(res => setLiveUsers(res.data))
        .catch(console.error)
        .finally(() => setLoading(false))
    }

    fetchGps()
    // Poll every 5 seconds
    const interval = setInterval(fetchGps, 5000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="flex h-[500px] w-full items-center justify-center rounded-2xl border border-slate-200 bg-slate-50">
        <div className="flex flex-col items-center text-slate-500">
          <Loader2 className="mb-2 h-8 w-8 animate-spin text-brand-500" />
          <p className="text-sm font-medium">Baku Live Telemetry yüklənir...</p>
        </div>
      </div>
    )
  }

  // Default to Baku center
  const center: [number, number] = [40.4093, 49.8671]

  return (
    <div className="relative h-[600px] w-full overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
      <div className="absolute left-4 top-4 z-[1000] rounded-xl bg-white/90 p-3 shadow-lg backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100">
            <Navigation className="h-4 w-4 text-brand-600" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase text-slate-500">Live Drivers</p>
            <p className="text-lg font-black text-slate-900">{liveUsers.length}</p>
          </div>
        </div>
      </div>

      <MapContainer
        center={center}
        zoom={12}
        className="h-full w-full"
        ref={mapRef}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        {liveUsers.map((user) => (
          <Marker 
            key={user.deviceId} 
            position={[user.lat, user.lng]} 
            icon={pulseIcon}
          >
            <Popup className="rounded-xl">
              <div className="p-1">
                <p className="mb-1 text-xs font-bold text-slate-500">Device ID</p>
                <p className="mb-2 text-sm font-semibold text-slate-900">{user.deviceId.substring(0, 8)}...</p>
                
                <div className="flex items-center gap-4 border-t border-slate-100 pt-2">
                  <div>
                    <p className="text-[10px] font-bold uppercase text-slate-400">Speed</p>
                    <p className="text-sm font-black text-brand-600">{Math.round(user.speed)} km/h</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase text-slate-400">Last Ping</p>
                    <p className="text-sm font-semibold text-slate-700">
                      {new Date(user.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}
