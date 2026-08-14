import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { useLocale } from '@/i18n/LocaleContext'
import { useIncidentsContext } from '@/context/IncidentsContext'
import { PageHeader } from '@/components/common/PageHeader'
import { EmptyState, ErrorState, LoadingState } from '@/components/common/States'
import { IncidentRow } from '@/components/incidents/IncidentRow'
import { ReportIncidentModal } from '@/components/incidents/ReportIncidentModal'

export default function IncidentsPage() {
  const { s } = useLocale()
  const navigate = useNavigate()
  const { incidents, loading, error, refetch } = useIncidentsContext()
  const [reportOpen, setReportOpen] = useState(false)

  return (
    <div className="scroll-thin h-full overflow-y-auto p-4 sm:p-6">
      <PageHeader
        title={s.incidentsPage.title}
        subtitle={s.incidentsPage.subtitle}
        action={
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold tracking-wide text-emerald-600">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
              </span>
              {s.incidentsPage.liveBadge}
            </span>
            <button
              onClick={() => setReportOpen(true)}
              className="flex items-center gap-1.5 rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700"
            >
              <Plus className="h-4 w-4" />
              {s.incidentsPage.reportButton}
            </button>
          </div>
        }
      />

      <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm sm:p-3">
        {loading && !incidents ? (
          <LoadingState />
        ) : error && !incidents ? (
          <ErrorState onRetry={refetch} />
        ) : !incidents || incidents.length === 0 ? (
          <EmptyState title={s.incidentsPage.empty} subtitle={s.incidentsPage.emptyHint} />
        ) : (
          <div className="divide-y divide-slate-100">
            {incidents.map((incident) => (
              <button
                key={incident.id}
                onClick={() =>
                  incident.latitude !== null && incident.longitude !== null
                    ? navigate('/', { state: { focus: { lat: incident.latitude, lng: incident.longitude } } })
                    : undefined
                }
                className="block w-full text-left transition hover:bg-slate-50"
              >
                <IncidentRow incident={incident} />
              </button>
            ))}
          </div>
        )}
      </div>

      {reportOpen && <ReportIncidentModal onClose={() => setReportOpen(false)} onSubmitted={refetch} />}
    </div>
  )
}
