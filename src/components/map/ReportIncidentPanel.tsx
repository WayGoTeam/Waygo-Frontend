import { useState } from 'react'
import { AlertTriangle, Check, X } from 'lucide-react'
import { useLocale } from '@/i18n/LocaleContext'
import type { ReportType } from '@/types/api'

interface ReportIncidentPanelProps {
  onCancel: () => void
  onSubmit: (type: ReportType, description: string) => void
  hasLocation: boolean
  onPickOnMap: () => void
}

const REPORT_TYPES: ReportType[] = [
  'ACCIDENT',
  'ROADWORKS',
  'POLICE',
  'HAZARD',
  'ROAD_CLOSED',
  'HEAVY_TRAFFIC',
  'OTHER',
]

export function ReportIncidentPanel({ onCancel, onSubmit, hasLocation, onPickOnMap }: ReportIncidentPanelProps) {
  const { s } = useLocale()
  const [type, setType] = useState<ReportType>('ACCIDENT')
  const [description, setDescription] = useState('')

  return (
    <div className="pointer-events-auto flex w-[320px] max-w-full flex-col gap-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 p-4 shadow-panel backdrop-blur-md">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-slate-200">
          <AlertTriangle className="h-4 w-4 text-brand-600" />
          {s.reportModal.title}
        </h3>
        <button onClick={onCancel} aria-label={s.common.close} className="rounded-full p-1 text-slate-400 transition hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-400">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{s.reportModal.type}</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value as ReportType)}
          className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 outline-none transition focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
        >
          {REPORT_TYPES.map((t) => (
            <option key={t} value={t}>
              {s.incidentTypes?.[t] ?? t}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{s.reportModal.description}</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={s.reportModal.descriptionPlaceholder}
          className="h-16 w-full resize-none rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 outline-none transition focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{s.reportModal.location || 'Məkan'}</label>
        <button
          onClick={onPickOnMap}
          className="flex items-center justify-between rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 transition hover:bg-slate-100 dark:hover:bg-slate-800 focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
        >
          {hasLocation ? 'Xəritədən seçildi (Dəyişdir)' : s.reportModal.useMapPin || 'Xəritədə klikləyərək məkanı seçin'}
        </button>
      </div>

      <button
        disabled={!hasLocation}
        onClick={() => onSubmit(type, description)}
        className="mt-1 flex w-full items-center justify-center gap-1.5 rounded-xl bg-brand-600 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Check className="h-4 w-4" />
        {s.reportModal.submit}
      </button>
    </div>
  )
}
