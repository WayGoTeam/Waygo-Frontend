import { Layers, MapIcon, Radio, Satellite, TriangleAlert } from 'lucide-react'
import { useLocale } from '@/i18n/LocaleContext'
import { useMapLayers } from '@/context/MapLayersContext'
import { Toggle } from '@/components/common/primitives'

export function LayerControlPanel() {
  const { s } = useLocale()
  const {
    basemap,
    setBasemap,
    showTraffic,
    setShowTraffic,
    showIncidents,
    setShowIncidents,
  } = useMapLayers()

  return (
    <div className="pointer-events-auto w-48 rounded-2xl border border-slate-200 bg-white p-2 shadow-float">
      <div className="mb-2 flex gap-1.5 border-b border-slate-100 pb-2">
        <button
          onClick={() => setBasemap('street')}
          className={`flex flex-1 flex-col items-center gap-1 rounded-xl py-1.5 text-[11px] font-medium transition ${
            basemap === 'street' ? 'bg-brand-50 text-brand-700' : 'text-slate-400 hover:bg-slate-50'
          }`}
        >
          <MapIcon className="h-4 w-4" />
          {s.layers.street}
        </button>
        <button
          onClick={() => setBasemap('satellite')}
          className={`flex flex-1 flex-col items-center gap-1 rounded-xl py-1.5 text-[11px] font-medium transition ${
            basemap === 'satellite' ? 'bg-brand-50 text-brand-700' : 'text-slate-400 hover:bg-slate-50'
          }`}
        >
          <Satellite className="h-4 w-4" />
          {s.layers.satellite}
        </button>
      </div>

      <div className="space-y-0.5">
        <LayerRow icon={Layers} label={s.layers.traffic} checked={showTraffic} onChange={setShowTraffic} />
        <LayerRow icon={TriangleAlert} label={s.layers.incidents} checked={showIncidents} onChange={setShowIncidents} />
      </div>
    </div>
  )
}

function LayerRow({
  icon: Icon,
  label,
  checked,
  onChange,
}: {
  icon: typeof Layers
  label: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between gap-2 rounded-xl px-1.5 py-1.5">
      <span className="flex min-w-0 items-center gap-2 text-xs font-medium text-slate-600">
        <Icon className="h-3.5 w-3.5 shrink-0 text-slate-400" />
        <span className="truncate">{label}</span>
      </span>
      <Toggle checked={checked} onChange={onChange} label={label} />
    </div>
  )
}
