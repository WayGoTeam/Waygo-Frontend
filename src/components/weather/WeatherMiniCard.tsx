import { Wind } from 'lucide-react'
import { useWeather } from '@/hooks/useWeather'
import { useLocale } from '@/i18n/LocaleContext'
import { WeatherIcon } from './WeatherIcon'
import { Badge } from '@/components/common/primitives'

const BAKU_LAT = 40.4093
const BAKU_LNG = 49.8671

export function WeatherMiniCard() {
  const { s } = useLocale()
  const { data, loading } = useWeather(BAKU_LAT, BAKU_LNG)

  if (loading && !data) {
    return (
      <div className="animate-pulse rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3.5">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800" />
          <div className="space-y-1.5">
            <div className="h-4 w-14 rounded bg-slate-100 dark:bg-slate-800" />
            <div className="h-3 w-16 rounded bg-slate-100 dark:bg-slate-800" />
          </div>
        </div>
      </div>
    )
  }

  if (!data) return null

  const conditionLabel = s.weather.conditions[data.condition] ?? data.condition

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3.5 shadow-sm">
      <div className="flex items-center gap-3">
        <WeatherIcon condition={data.condition} className="h-8 w-8 shrink-0 text-amber-400" strokeWidth={1.75} />
        <div className="min-w-0">
          <p className="font-display text-2xl font-bold leading-none text-slate-900 dark:text-slate-50 tabular-nums">
            {Math.round(data.temperatureC)}°C
          </p>
          <p className="mt-1 truncate text-xs text-slate-500 dark:text-slate-400">
            {conditionLabel} · {data.locationName}
          </p>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between gap-2 border-t border-slate-100 dark:border-slate-800 pt-2.5">
        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
          <Wind className="h-3.5 w-3.5" />
          <span className="tabular-nums">{Math.round(data.windSpeedKmh)} {s.common.kmh}</span>
        </div>
        {data.trafficImpactPercent >= 15 && (
          <Badge tone="amber">+{data.trafficImpactPercent}%</Badge>
        )}
      </div>
    </div>
  )
}
