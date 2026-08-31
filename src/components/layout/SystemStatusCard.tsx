import { AlertTriangle, CheckCircle2, Loader2 } from 'lucide-react'
import { useTelemetryStatus } from '@/hooks/useTelemetryStatus'
import { useLocale } from '@/i18n/LocaleContext'

export function SystemStatusCard() {
  const { s } = useLocale()
  const { data, error, loading } = useTelemetryStatus()

  const healthy = Boolean(data && data.status === 'UP' && !error)
  const isChecking = loading && !data && !error

  return (
    <div className="flex items-start gap-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3.5 shadow-sm">
      {isChecking ? (
        <Loader2 className="mt-0.5 h-4 w-4 shrink-0 animate-spin text-slate-300" />
      ) : healthy ? (
        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
      ) : (
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
      )}
      <div className="min-w-0">
        <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
          {isChecking ? s.systemStatus.checking : healthy ? s.systemStatus.healthy : s.systemStatus.degraded}
        </p>
        <p className="mt-0.5 text-[11px] text-slate-400">
          {isChecking ? '' : healthy ? s.systemStatus.healthySubtitle : s.systemStatus.degradedSubtitle}
        </p>
      </div>
    </div>
  )
}
