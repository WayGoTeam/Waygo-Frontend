import { useEffect, useState, useMemo } from 'react'
import { Archive, Loader2 } from 'lucide-react'
import { useLocale } from '@/i18n/LocaleContext'
import { getActiveReports, archiveReport } from '@/api/admin'
import { EmptyState, ErrorState, LoadingState } from '@/components/common/States'
import { formatRelativeTime } from '@/lib/format'
import type { UserReport } from '@/types/api'

export function ActiveIncidentsTable() {
  const { s } = useLocale()
  const [reports, setReports] = useState<UserReport[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [busyId, setBusyId] = useState<string | null>(null)

  function load() {
    getActiveReports()
      .then((data) => {
        setReports(data)
        setError(false)
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
    const timer = setInterval(load, 20_000)
    return () => clearInterval(timer)
  }, [])

  async function handleArchive(id: string) {
    setBusyId(id)
    try {
      await archiveReport(id)
      setReports((prev) => (prev ? prev.filter((r) => r.id !== id) : prev))
    } catch (err) {
      console.error(err)
    } finally {
      setBusyId(null)
    }
  }

  const allReports = useMemo(() => {
    if (!reports) return null
    return [...reports].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }, [reports])

  if (loading && !allReports) return <LoadingState />
  if (error && !allReports) return <ErrorState onRetry={load} />
  if (!allReports || allReports.length === 0) return <EmptyState title={s.adminPage.activeEmpty || 'No active incidents'} />

  return (
    <div className="flex flex-col gap-3 sm:block sm:divide-y divide-slate-100 dark:divide-slate-800">
      {allReports.map((report) => (
        <div key={report.id} className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 p-3.5 sm:p-0 sm:py-3 bg-slate-50 dark:bg-slate-800/50 sm:bg-transparent rounded-[16px] sm:rounded-none border border-slate-100 dark:border-slate-800 sm:border-0">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-white dark:bg-slate-800 sm:bg-red-50 px-2 py-0.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-red-600 shadow-sm sm:shadow-none border border-red-100 dark:border-red-900/30 sm:border-transparent">
                {s.incidentTypes[report.type] ?? report.type}
              </span>
              <span className="text-[10px] sm:text-[11px] font-medium text-slate-400">{formatRelativeTime(report.createdAt, s.common)}</span>
            </div>
            <p className="mt-2 text-[13px] sm:text-sm font-medium text-slate-700 dark:text-slate-300 leading-relaxed">{report.description}</p>
          </div>
          <div className="flex shrink-0 self-end sm:self-auto w-full sm:w-auto pt-2 sm:pt-0 border-t border-slate-200 dark:border-slate-700 sm:border-0">
            <button
              onClick={() => handleArchive(report.id)}
              disabled={busyId === report.id}
              aria-label={s.adminPage.archive || 'Archive'}
              title={s.adminPage.archive || 'Archive'}
              className="flex h-9 w-full sm:h-8 sm:w-8 items-center justify-center rounded-xl sm:rounded-full bg-slate-200 dark:bg-slate-700 sm:bg-slate-100 sm:dark:bg-slate-800 text-slate-600 dark:text-slate-300 sm:text-slate-500 transition hover:bg-slate-300 dark:hover:bg-slate-600 disabled:opacity-50 font-semibold text-xs sm:text-sm"
            >
              {busyId === report.id ? <Loader2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin" /> : <Archive className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
              <span className="ml-1.5 sm:hidden">{s.adminPage.archive || 'Arxivlə'}</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
