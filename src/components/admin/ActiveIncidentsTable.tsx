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
    <div className="divide-y divide-slate-100">
      {allReports.map((report) => (
        <div key={report.id} className="flex items-start justify-between gap-3 py-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-red-50 px-2 py-0.5 text-[11px] font-semibold text-red-600">
                {s.incidentTypes[report.type] ?? report.type}
              </span>
              <span className="text-[11px] text-slate-400">{formatRelativeTime(report.createdAt, s.common)}</span>
            </div>
            <p className="mt-1 text-sm text-slate-700">{report.description}</p>
          </div>
          <div className="flex shrink-0">
            <button
              onClick={() => handleArchive(report.id)}
              disabled={busyId === report.id}
              aria-label={s.adminPage.archive || 'Archive'}
              title={s.adminPage.archive || 'Archive'}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200 disabled:opacity-50"
            >
              {busyId === report.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Archive className="h-3.5 w-3.5" />}
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
