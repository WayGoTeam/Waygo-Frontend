import { useLocale } from '@/i18n/LocaleContext'
import { formatRelativeTime } from '@/lib/format'
import { IncidentTypeIcon, incidentTone } from './incidentIcons'
import type { RoadIncident } from '@/types/api'

export function IncidentRow({ incident, dense = false }: { incident: RoadIncident; dense?: boolean }) {
  const { s } = useLocale()
  const tone = incidentTone(incident.incidentType)
  const typeLabel = s.incidentTypes[incident.incidentType] ?? incident.incidentType

  return (
    <div className={`flex items-start gap-3 rounded-xl px-2.5 ${dense ? 'py-2' : 'py-2.5'}`}>
      <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${tone.bg}`}>
        <IncidentTypeIcon type={incident.incidentType} className={`h-4 w-4 ${tone.text}`} strokeWidth={2} />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-sm font-semibold text-slate-800">{typeLabel}</p>
          <span className="shrink-0 text-[11px] text-slate-400">
            {formatRelativeTime(incident.createdAt, s.common)}
          </span>
        </div>
        <p className="mt-0.5 line-clamp-2 text-xs text-slate-500">{incident.description}</p>
      </div>
    </div>
  )
}
