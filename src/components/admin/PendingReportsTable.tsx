import { useEffect, useState, useMemo } from 'react'
import { Check, Loader2, X } from 'lucide-react'
import { useLocale } from '@/i18n/LocaleContext'
import { useSocket } from '@/context/SocketContext'
import { approveReport, getPendingReports, rejectReport } from '@/api/admin'
import { EmptyState, ErrorState, LoadingState } from '@/components/common/States'
import { formatRelativeTime } from '@/lib/format'
import type { UserReport } from '@/types/api'

const POLL_MS = 20_000

export function PendingReportsTable() {
  const { s } = useLocale()
  const [reports, setReports] = useState<UserReport[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [removedIds, setRemovedIds] = useState<Set<string>>(new Set())
  const { recentReports } = useSocket()

  function load() {
    getPendingReports()
      .then((data) => {
        setReports(data)
        setError(false)
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
    const timer = setInterval(load, POLL_MS)
    return () => clearInterval(timer)
  }, [])

  async function handleDecision(id: string, decision: 'approve' | 'reject') {
    setBusyId(id)
    try {
      await (decision === 'approve' ? approveReport(id) : rejectReport(id))
      setReports((prev) => (prev ? prev.filter((r) => r.id !== id) : prev))
      setRemovedIds((prev) => new Set(prev).add(id))
    } catch {
      // leave the row in place — a transient failure shouldn't silently drop it
    } finally {
      setBusyId(null)
    }
  }

  const allReports = useMemo(() => {
    if (!reports) return recentReports.length > 0 ? recentReports.filter(r => !removedIds.has(r.id)) : null
    const combined = [...recentReports, ...reports]
    const seen = new Set<string>()
    return combined.filter(r => {
      if (removedIds.has(r.id)) return false
      if (seen.has(r.id)) return false
      seen.add(r.id)
      return true
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }, [reports, recentReports, removedIds])

  if (loading && !allReports) return <LoadingState />
  if (error && !allReports) return <ErrorState onRetry={load} />
  if (!allReports || allReports.length === 0) return <EmptyState title={s.adminPage.pendingEmpty} />

  return (
    <div className="flex flex-col gap-3 sm:block sm:divide-y divide-slate-100 dark:divide-slate-800">
      {allReports.map((report) => (
        <div key={report.id} className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 p-3.5 sm:p-0 sm:py-3 bg-slate-50 dark:bg-slate-800/50 sm:bg-transparent rounded-[16px] sm:rounded-none border border-slate-100 dark:border-slate-800 sm:border-0">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-white dark:bg-slate-800 sm:bg-slate-100 px-2 py-0.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 shadow-sm sm:shadow-none border border-slate-200 dark:border-slate-700 sm:border-transparent">
                {s.incidentTypes[report.type] ?? report.type}
              </span>
              <span className="text-[10px] sm:text-[11px] font-medium text-slate-400">{formatRelativeTime(report.createdAt, s.common)}</span>
            </div>
            <p className="mt-2 text-[13px] sm:text-sm font-medium text-slate-700 dark:text-slate-300 leading-relaxed">{report.description}</p>
          </div>
          <div className="flex shrink-0 gap-2 sm:gap-1.5 self-end sm:self-auto w-full sm:w-auto pt-2 sm:pt-0 border-t border-slate-200 dark:border-slate-700 sm:border-0">
            <button
              onClick={() => handleDecision(report.id, 'approve')}
              disabled={busyId === report.id}
              aria-label={s.adminPage.approve}
              title={s.adminPage.approve}
              className="flex h-9 w-full sm:h-8 sm:w-8 flex-1 sm:flex-none items-center justify-center rounded-xl sm:rounded-full bg-emerald-50 text-emerald-600 transition hover:bg-emerald-100 disabled:opacity-50 font-semibold text-xs sm:text-sm"
            >
              {busyId === report.id ? <Loader2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin" /> : <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
              <span className="ml-1.5 sm:hidden">{s.adminPage.approve}</span>
            </button>
            <button
              onClick={() => handleDecision(report.id, 'reject')}
              disabled={busyId === report.id}
              aria-label={s.adminPage.reject}
              title={s.adminPage.reject}
              className="flex h-9 w-full sm:h-8 sm:w-8 flex-1 sm:flex-none items-center justify-center rounded-xl sm:rounded-full bg-red-50 text-red-600 transition hover:bg-red-100 disabled:opacity-50 font-semibold text-xs sm:text-sm"
            >
              <X className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="ml-1.5 sm:hidden">{s.adminPage.reject}</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
