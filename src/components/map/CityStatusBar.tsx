import type { ReactNode } from 'react'
import { Gauge, RefreshCw, Radio, TriangleAlert } from 'lucide-react'
import { useLocale } from '@/i18n/LocaleContext'
import { useIncidentsContext } from '@/context/IncidentsContext'
import { RingGauge } from '@/components/common/RingGauge'
import { useEffect, useState } from 'react'
import { congestionColor } from '@/lib/congestion'
import { formatBakuClock } from '@/lib/format'
import type { CityStats } from '@/types/api'

export function CityStatusBar({
  cityStats,
  loading,
  onRefresh,
}: {
  cityStats: CityStats | null
  loading: boolean
  onRefresh: () => void
}) {
  const { s } = useLocale()
  const { incidents } = useIncidentsContext()
  const activeCount = incidents?.length ?? 0

  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="pointer-events-auto flex h-[74px] items-stretch gap-5 overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-5 shadow-float scroll-thin sm:gap-8 sm:px-6">
      <Group label={s.cityBar.citywideStatus}>
        <div className="flex items-center gap-2.5">
          <div className="relative flex items-center justify-center">
            <RingGauge percent={cityStats?.congestionPercent ?? 0} color={congestionColor(cityStats?.congestionPercent ?? 0)} />
            <span className="absolute font-display text-[11px] font-bold tabular-nums text-slate-700 dark:text-slate-300">
              {Math.round(cityStats?.congestionPercent ?? 0)}%
            </span>
          </div>
          <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{s.cityBar.avgCongestion}</span>
        </div>
      </Group>

      <Divider />

      <Group label={s.cityBar.avgSpeed}>
        <ValueRow icon={Gauge} value={`${Math.round(cityStats?.averageSpeedKmh ?? 0)} ${s.common.kmh}`} />
      </Group>

      <Divider />

      <Group label={s.cityBar.activeIncidents}>
        <ValueRow icon={TriangleAlert} value={String(activeCount)} tone="text-amber-600" />
      </Group>



      <Group label={s.cityBar.lastUpdated}>
        <button
          onClick={onRefresh}
          className="flex items-center gap-1.5 text-sm font-bold text-slate-800 dark:text-slate-200 transition hover:text-brand-600"
        >
          <RefreshCw className={`h-3.5 w-3.5 text-slate-400 ${loading ? 'animate-spin' : ''}`} />
          {formatBakuClock(now.toISOString())}
        </button>
      </Group>
    </div>
  )
}

function Group({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex shrink-0 flex-col justify-center gap-1 py-2.5">
      <span className="whitespace-nowrap text-[11px] font-medium text-slate-400">{label}</span>
      {children}
    </div>
  )
}

function Divider() {
  return <div className="my-2.5 w-px shrink-0 bg-slate-100 dark:bg-slate-800" />
}

function ValueRow({
  icon: Icon,
  value,
  tone = 'text-slate-800 dark:text-slate-200',
}: {
  icon: typeof Gauge
  value: string
  tone?: string
}) {
  return (
    <div className="flex items-center gap-1.5">
      <Icon className="h-3.5 w-3.5 text-slate-400" />
      <span className={`text-sm font-bold tabular-nums ${tone}`}>{value}</span>
    </div>
  )
}
