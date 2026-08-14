import { useEffect, useState } from 'react'
import L from 'leaflet'
import { Crosshair, Maximize, Minimize, Minus, Plus } from 'lucide-react'
import { useLocale } from '@/i18n/LocaleContext'
import { IconButton } from '@/components/common/primitives'

export function MapZoomControls({
  map,
  fullscreenTarget,
}: {
  map: L.Map
  fullscreenTarget: HTMLElement | null
}) {
  const { s } = useLocale()
  const [locating, setLocating] = useState(false)
  const [locateError, setLocateError] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [userMarker, setUserMarker] = useState<L.CircleMarker | null>(null)

  useEffect(() => {
    const handler = () => setIsFullscreen(Boolean(document.fullscreenElement))
    document.addEventListener('fullscreenchange', handler)
    return () => document.removeEventListener('fullscreenchange', handler)
  }, [])

  function handleLocate() {
    if (!navigator.geolocation) return
    setLocating(true)
    setLocateError(false)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const latlng: [number, number] = [pos.coords.latitude, pos.coords.longitude]
        map.flyTo(latlng, 15, { duration: 1 })
        
        if (userMarker) {
          userMarker.setLatLng(latlng)
        } else {
          const newMarker = L.circleMarker(latlng, {
            radius: 8,
            fillColor: '#3b82f6',
            color: '#ffffff',
            weight: 3,
            opacity: 1,
            fillOpacity: 1
          }).addTo(map)
          setUserMarker(newMarker)
        }
        
        setLocating(false)
      },
      () => {
        setLocating(false)
        setLocateError(true)
        setTimeout(() => setLocateError(false), 2500)
      },
      { enableHighAccuracy: true, timeout: 8000 },
    )
  }

  function handleFullscreen() {
    if (!fullscreenTarget) return
    if (document.fullscreenElement) {
      void document.exitFullscreen()
    } else {
      void fullscreenTarget.requestFullscreen()
    }
  }

  return (
    <div className="pointer-events-auto flex flex-col items-end gap-2">
      <div className="flex flex-col overflow-hidden rounded-full border border-slate-200 bg-white shadow-float">
        <button
          aria-label={s.mapControls.zoomIn}
          onClick={() => map.zoomIn()}
          className="flex h-9 w-9 items-center justify-center text-slate-600 transition hover:text-brand-600 active:scale-95"
        >
          <Plus className="h-4 w-4" />
        </button>
        <div className="h-px w-full bg-slate-100" />
        <button
          aria-label={s.mapControls.zoomOut}
          onClick={() => map.zoomOut()}
          className="flex h-9 w-9 items-center justify-center text-slate-600 transition hover:text-brand-600 active:scale-95"
        >
          <Minus className="h-4 w-4" />
        </button>
      </div>

      <div className="relative">
        <IconButton label={s.mapControls.locate} onClick={handleLocate} className={locating ? 'animate-pulse' : ''}>
          <Crosshair className="h-4 w-4" />
        </IconButton>
        {locateError && (
          <span className="absolute right-full top-1/2 mr-2 -translate-y-1/2 whitespace-nowrap rounded-lg bg-slate-900 px-2 py-1 text-[11px] font-medium text-white">
            {s.mapControls.locateError}
          </span>
        )}
      </div>

      <IconButton
        label={isFullscreen ? s.mapControls.exitFullscreen : s.mapControls.fullscreen}
        onClick={handleFullscreen}
      >
        {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
      </IconButton>
    </div>
  )
}
