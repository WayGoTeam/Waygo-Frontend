import { TriangleAlert } from 'lucide-react'
import { useLocale } from '@/i18n/LocaleContext'
import { CONGESTION_COLORS, INCIDENT_COLOR } from '@/lib/congestion'

export function MapLegend() {
  const { s } = useLocale()
  const items: { color: string; label: string }[] = [
    { color: CONGESTION_COLORS.flow, label: s.legend.flowing },
    { color: CONGESTION_COLORS.slow, label: s.legend.slow },
    { color: CONGESTION_COLORS.heavy, label: s.legend.heavy },
    { color: CONGESTION_COLORS.jam, label: s.legend.jammed },
  ]

  return (
    <div className="pointer-events-auto flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5 rounded-full border border-slate-200 bg-white/95 px-5 py-2 shadow-float backdrop-blur">
      {items.map((item) => (
        <span key={item.label} className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
          {item.label}
        </span>
      ))}
      <span className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
        <TriangleAlert className="h-3 w-3" style={{ color: INCIDENT_COLOR }} />
        {s.legend.incident}
      </span>
    </div>
  )
}
