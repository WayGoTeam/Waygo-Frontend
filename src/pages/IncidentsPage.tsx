import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Navigation, MapPin, AlertTriangle, ChevronRight } from 'lucide-react'
import { useLocale } from '@/i18n/LocaleContext'
import { useIncidentsContext } from '@/context/IncidentsContext'
import { EmptyState, ErrorState, LoadingState } from '@/components/common/States'
import { IncidentTypeIcon, incidentTone } from '@/components/incidents/incidentIcons'
import { formatRelativeTime } from '@/lib/format'

export default function IncidentsPage() {
  const { s } = useLocale()
  const navigate = useNavigate()
  const { incidents, loading, error, refetch } = useIncidentsContext()

  return (
    <div className="relative h-full overflow-hidden bg-slate-50 dark:bg-slate-950 flex flex-col">
      {/* Header */}
      <div className="shrink-0 bg-white dark:bg-slate-900 px-6 pt-12 pb-6 shadow-sm border-b border-slate-200 dark:border-slate-800">
        <div className="mx-auto max-w-4xl flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold text-slate-900 dark:text-slate-50 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400">
                <AlertTriangle className="h-5 w-5" />
              </div>
              {s.incidentsPage.title}
            </h1>
            <p className="mt-2 text-sm font-medium text-slate-500 dark:text-slate-400">
              {s.incidentsPage.subtitle}
            </p>
          </div>
          <span className="flex items-center gap-2 rounded-full bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1.5 border border-emerald-200 dark:border-emerald-500/20 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <span className="text-xs font-bold tracking-wide text-emerald-600 dark:text-emerald-400 uppercase">
              {s.incidentsPage.liveBadge}
            </span>
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto scroll-thin p-6 pb-28">
        <div className="mx-auto max-w-4xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">
              Cari Hadisələr 
              <span className="ml-2 rounded-full bg-slate-200 dark:bg-slate-800 px-2.5 py-0.5 text-xs font-semibold text-slate-600 dark:text-slate-400">
                {incidents?.length || 0}
              </span>
            </h2>
          </div>

          {loading && !incidents ? (
            <div className="mt-10"><LoadingState /></div>
          ) : error && !incidents ? (
            <div className="mt-10"><ErrorState onRetry={refetch} /></div>
          ) : !incidents || incidents.length === 0 ? (
            <div className="mt-10"><EmptyState title={s.incidentsPage.empty} subtitle={s.incidentsPage.emptyHint} /></div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {incidents.map((incident) => {
                const tone = incidentTone(incident.incidentType)
                const typeLabel = s.incidentTypes[incident.incidentType] ?? incident.incidentType
                
                return (
                  <button
                    key={incident.id}
                    onClick={() =>
                      incident.latitude !== null && incident.longitude !== null
                        ? navigate('/', { state: { focus: { lat: incident.latitude, lng: incident.longitude } } })
                        : undefined
                    }
                    className="group flex flex-col text-left overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700"
                  >
                    <div className="flex w-full items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${tone.bg} shadow-sm border border-white/50 dark:border-white/5`}>
                          <IncidentTypeIcon type={incident.incidentType} className={`h-6 w-6 ${tone.text}`} strokeWidth={2} />
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 dark:text-slate-50 text-base">{typeLabel}</h3>
                          <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                            {formatRelativeTime(incident.createdAt, s.common)}
                          </p>
                        </div>
                      </div>
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-50 dark:bg-slate-800 text-slate-400 opacity-0 scale-75 transition-all group-hover:opacity-100 group-hover:scale-100">
                        <ChevronRight className="h-4 w-4" />
                      </div>
                    </div>
                    
                    <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400 font-medium">
                      {incident.description}
                    </p>
                    
                    <div className="mt-5 flex items-center gap-2">
                      <span className="flex items-center gap-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 px-3 py-1.5 text-[11px] font-bold tracking-wide text-slate-600 dark:text-slate-300 uppercase transition-colors group-hover:bg-brand-50 dark:group-hover:bg-brand-900/30 group-hover:text-brand-700 dark:group-hover:text-brand-300">
                        <MapPin className="h-3.5 w-3.5" />
                        Xəritədə bax
                      </span>
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center pointer-events-none px-4">
        <button
          onClick={() => navigate('/', { state: { reportingMode: true } })}
          className="pointer-events-auto flex items-center gap-3 rounded-full bg-brand-600 hover:bg-brand-700 active:scale-95 px-6 py-4 shadow-[0_8px_30px_rgb(59,130,246,0.3)] dark:shadow-[0_8px_30px_rgb(59,130,246,0.2)] transition-all text-white border border-brand-500/20"
        >
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20">
            <Plus className="h-4 w-4 text-white" strokeWidth={3} />
          </div>
          <span className="font-bold tracking-wide text-white">
            {s.incidentsPage.reportButton}
          </span>
        </button>
      </div>
    </div>
  )
}
