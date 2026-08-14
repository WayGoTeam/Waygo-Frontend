import { AlertTriangle, Inbox, Loader2 } from 'lucide-react'
import type { ReactNode } from 'react'
import { useLocale } from '@/i18n/LocaleContext'

export function LoadingState({ label, compact = false }: { label?: string; compact?: boolean }) {
  const { s } = useLocale()
  return (
    <div
      className={`flex items-center justify-center gap-2 text-slate-400 ${compact ? 'py-4' : 'py-12'}`}
    >
      <Loader2 className="h-4 w-4 animate-spin" />
      <span className="text-sm">{label ?? s.common.loading}</span>
    </div>
  )
}

export function ErrorState({ message, onRetry }: { message?: string; onRetry?: () => void }) {
  const { s } = useLocale()
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-6 text-center">
      <AlertTriangle className="h-5 w-5 text-red-500" />
      <p className="text-sm font-medium text-red-700">{s.common.error}</p>
      {message && <p className="max-w-xs text-xs text-red-500">{message}</p>}
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-1 rounded-full bg-red-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-red-700"
        >
          {s.common.retry}
        </button>
      )}
    </div>
  )
}

export function EmptyState({
  title,
  subtitle,
  icon,
}: {
  title: string
  subtitle?: string
  icon?: ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 px-4 py-10 text-center text-slate-400">
      {icon ?? <Inbox className="h-6 w-6" />}
      <p className="text-sm font-medium text-slate-500">{title}</p>
      {subtitle && <p className="max-w-xs text-xs text-slate-400">{subtitle}</p>}
    </div>
  )
}
