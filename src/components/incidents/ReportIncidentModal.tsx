import { useState } from 'react'
import type { FormEvent } from 'react'
import { CheckCircle2, Loader2 } from 'lucide-react'
import { Modal } from '@/components/common/Modal'
import { useLocale } from '@/i18n/LocaleContext'
import { useTrafficMap } from '@/hooks/useTrafficMap'
import { submitReport } from '@/api/reports'
import { centroid } from '@/lib/geo'
import type { ReportType } from '@/types/api'

const REPORT_TYPES: ReportType[] = ['ACCIDENT', 'ROADWORKS', 'POLICE', 'HAZARD', 'ROAD_CLOSED', 'HEAVY_TRAFFIC', 'OTHER']
const REPORTER_ID_KEY = 'waygo.reporterId'

/** Fallback for browsers without crypto.randomUUID — SubmitReportRequest.userId is a strict UUID server-side, so this must produce one too. */
function uuidV4Fallback(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

function getReporterId(): string {
  let id = localStorage.getItem(REPORTER_ID_KEY)
  if (!id) {
    id = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : uuidV4Fallback()
    localStorage.setItem(REPORTER_ID_KEY, id)
  }
  return id
}

export function ReportIncidentModal({ onClose, onSubmitted }: { onClose: () => void; onSubmitted: () => void }) {
  const { s } = useLocale()
  const { data: trafficMap } = useTrafficMap()
  const segments = trafficMap?.segments ?? []

  const [type, setType] = useState<ReportType>('HAZARD')
  const [segmentId, setSegmentId] = useState('')
  const [description, setDescription] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(false)
  const [success, setSuccess] = useState(false)

  const canSubmit = segmentId !== '' && description.trim().length > 0 && !submitting

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!canSubmit) return
    setSubmitting(true)
    setError(false)
    try {
      const segment = segments.find((s2) => s2.segmentId === segmentId)
      const point = segment ? centroid(segment.coordinates) : null
      await submitReport({
        userId: getReporterId(),
        segmentId,
        type,
        description: description.trim(),
        createdAt: new Date().toISOString(),
        latitude: point?.latitude,
        longitude: point?.longitude,
      })
      setSuccess(true)
      onSubmitted()
    } catch {
      setError(true)
    } finally {
      setSubmitting(false)
    }
  }

  if (success) {
    return (
      <Modal title={s.reportModal.title} onClose={onClose}>
        <div className="flex flex-col items-center gap-2 py-6 text-center">
          <CheckCircle2 className="h-8 w-8 text-emerald-500" />
          <p className="text-sm font-medium text-slate-700">{s.reportModal.success}</p>
          <button
            onClick={onClose}
            className="mt-2 rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800"
          >
            {s.common.close}
          </button>
        </div>
      </Modal>
    )
  }

  return (
    <Modal title={s.reportModal.title} subtitle={s.reportModal.subtitle} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-3.5">
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-500">{s.reportModal.type}</label>
          <div className="grid grid-cols-2 gap-1.5">
            {REPORT_TYPES.map((t) => (
              <button
                type="button"
                key={t}
                onClick={() => setType(t)}
                className={`rounded-xl border px-2.5 py-2 text-left text-xs font-medium transition ${
                  type === t ? 'border-brand-400 bg-brand-50 text-brand-700' : 'border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                {s.incidentTypes[t]}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-slate-500">{s.reportModal.segment}</label>
          <select
            value={segmentId}
            onChange={(e) => setSegmentId(e.target.value)}
            required
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 focus:border-brand-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-100"
          >
            <option value="" disabled>
              {s.reportModal.locationHint}
            </option>
            {segments.map((seg) => (
              <option key={seg.segmentId} value={seg.segmentId}>
                {seg.segmentName}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-slate-500">{s.reportModal.description}</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={s.reportModal.descriptionPlaceholder}
            rows={3}
            required
            className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-brand-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-100"
          />
        </div>

        {error && <p className="rounded-xl bg-red-50 px-3 py-2 text-xs text-red-600">{s.reportModal.error}</p>}

        <div className="flex gap-2 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
          >
            {s.reportModal.cancel}
          </button>
          <button
            type="submit"
            disabled={!canSubmit}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-brand-600 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {submitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            {submitting ? s.reportModal.submitting : s.reportModal.submit}
          </button>
        </div>
      </form>
    </Modal>
  )
}
