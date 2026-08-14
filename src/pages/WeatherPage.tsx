import { CloudRainWind, Database, Gauge, Wind } from 'lucide-react'
import { useLocale } from '@/i18n/LocaleContext'
import { useWeather } from '@/hooks/useWeather'
import { PageHeader } from '@/components/common/PageHeader'
import { StatCard } from '@/components/common/StatCard'
import { ErrorState, LoadingState } from '@/components/common/States'
import { WeatherIcon } from '@/components/weather/WeatherIcon'

const BAKU_LAT = 40.4093
const BAKU_LNG = 49.8671

export default function WeatherPage() {
  const { s } = useLocale()
  const { data, loading, error, refetch } = useWeather(BAKU_LAT, BAKU_LNG)

  return (
    <div className="scroll-thin h-full overflow-y-auto p-4 sm:p-6">
      <PageHeader title={s.weather.pageTitle} subtitle={s.weather.pageSubtitle} />

      {loading && !data ? (
        <LoadingState />
      ) : error || !data ? (
        <ErrorState onRetry={refetch} />
      ) : (
        <>
          <div className="mt-5 flex flex-col items-start gap-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center">
            <WeatherIcon condition={data.condition} className="h-16 w-16 shrink-0 text-amber-400" strokeWidth={1.5} />
            <div>
              <p className="font-display text-5xl font-extrabold tabular-nums text-slate-900">
                {Math.round(data.temperatureC)}°C
              </p>
              <p className="mt-1 text-sm text-slate-500">
                {s.weather.conditions[data.condition] ?? data.condition} · {data.locationName}
              </p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <StatCard icon={Wind} label={s.weather.windSpeed} value={String(Math.round(data.windSpeedKmh))} unit={s.common.kmh} />
            <StatCard icon={CloudRainWind} label={s.weather.precipitation} value={data.precipitationMm.toFixed(1)} unit="mm" />
            <StatCard
              icon={Gauge}
              label={s.weather.trafficImpact}
              value={String(Math.round(data.trafficImpactPercent))}
              unit="%"
              tone={data.trafficImpactPercent >= 20 ? 'text-amber-600' : undefined}
            />
          </div>

          <div className="mt-4 flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <Gauge className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
            <p className="text-sm text-slate-500">{s.weather.trafficImpactHint}</p>
          </div>

          <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
            <Database className="h-3.5 w-3.5" />
            {s.weather.dataSource}: {data.source}
          </div>
        </>
      )}
    </div>
  )
}
