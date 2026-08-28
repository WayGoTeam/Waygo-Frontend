import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Navigation, MapPin } from 'lucide-react'
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
    <div className="scroll-thin h-full overflow-y-auto bg-slate-50/50 pb-20">
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4 pb-12 pt-8 sm:px-6">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
        
        {/* Animated Glow Orbs */}
        <div className="absolute -top-20 left-0 h-40 w-40 animate-pulse rounded-full bg-brand-500/20 blur-3xl" />
        <div className="absolute -right-10 top-10 h-32 w-32 animate-pulse rounded-full bg-blue-500/20 blur-3xl" style={{ animationDelay: '1s' }} />

        <div className="relative flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">{s.incidentsPage.title}</h1>
            <p className="mt-1 text-sm font-medium text-slate-300">{s.incidentsPage.subtitle}</p>
          </div>
          
          <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1.5 border border-emerald-500/20 shadow-inner">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <span className="text-[11px] font-bold tracking-wider text-emerald-400 uppercase">
              {s.incidentsPage.liveBadge}
            </span>
          </span>
        </div>
      </div>

      <div className="px-4 sm:px-6 relative -mt-6">
        <button
          onClick={() => navigate('/', { state: { reportingMode: true } })}
          className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-brand-600 to-blue-600 px-4 py-4 text-sm font-bold text-white shadow-xl shadow-brand-500/25 transition-all hover:-translate-y-0.5 hover:shadow-brand-500/40"
        >
          <div className="absolute inset-0 bg-white/20 opacity-0 transition-opacity group-hover:opacity-100" />
          <Plus className="h-5 w-5 transition-transform group-hover:rotate-90" strokeWidth={2.5} />
          {s.incidentsPage.reportButton}
        </button>
      </div>

      <div className="mt-6 px-4 sm:px-6">
        {loading && !incidents ? (
          <div className="mt-10"><LoadingState /></div>
        ) : error && !incidents ? (
          <div className="mt-10"><ErrorState onRetry={refetch} /></div>
        ) : !incidents || incidents.length === 0 ? (
          <div className="mt-10"><EmptyState title={s.incidentsPage.empty} subtitle={s.incidentsPage.emptyHint} /></div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                  className="group relative flex flex-col items-start gap-4 overflow-hidden rounded-2xl border border-slate-200/60 bg-white p-4 text-left shadow-sm transition-all hover:-translate-y-1 hover:border-slate-300 hover:shadow-md"
                >
                  <div className="absolute top-0 left-0 w-1 h-full bg-slate-200 transition-colors group-hover:bg-brand-500" />
                  
                  <div className="flex w-full items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${tone.bg}`}>
                        <IncidentTypeIcon type={incident.incidentType} className={`h-5 w-5 ${tone.text}`} strokeWidth={2} />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-800">{typeLabel}</h3>
                        <p className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
                          {formatRelativeTime(incident.createdAt, s.common)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-50 text-slate-400 opacity-0 transition-opacity group-hover:opacity-100">
                      <Navigation className="h-4 w-4" />
                    </div>
                  </div>
                  
                  <div className="w-full pl-1">
                    <p className="line-clamp-2 text-sm leading-relaxed text-slate-600">
                      {incident.description}
                    </p>
                    
                    <div className="mt-3 flex items-center gap-2">
                      <span className="flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1 text-[10px] font-semibold tracking-wide text-slate-500 uppercase">
                        <MapPin className="h-3 w-3" />
                        Xəritədə bax
                      </span>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
