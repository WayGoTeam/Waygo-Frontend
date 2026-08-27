import { CloudRain, Thermometer, Wind, Droplets } from 'lucide-react'
import { useLocale } from '@/i18n/LocaleContext'
import { useDistrictsWeather } from '@/hooks/useDistrictsWeather'
import { LoadingState, ErrorState } from '@/components/common/States'

function weatherIcon(cond: string) {
  const c = cond?.toLowerCase() ?? ''
  if (c.includes('rain') || c.includes('yağ')) return '🌧️'
  if (c.includes('cloud') || c.includes('bulud')) return '⛅'
  if (c.includes('storm') || c.includes('fırt')) return '⛈️'
  if (c.includes('snow') || c.includes('qar')) return '❄️'
  if (c.includes('fog') || c.includes('duman')) return '🌫️'
  return '☀️'
}

function weatherGradient(cond: string, impact: number) {
  if (impact > 25) return 'from-violet-500/10 to-violet-600/5 border-violet-200'
  if (impact > 15) return 'from-orange-400/10 to-orange-500/5 border-orange-200'
  if (impact > 8)  return 'from-sky-400/10 to-sky-500/5 border-sky-200'
  return 'from-emerald-400/10 to-emerald-500/5 border-emerald-200'
}

export default function WeatherPage() {
  const { s } = useLocale()
  const weather = useDistrictsWeather()

  return (
    <div className="relative h-full overflow-y-auto scroll-thin bg-slate-50">
      {/* Ambient blobs */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-sky-400/10 blur-3xl" />
        <div className="absolute right-0 top-1/3 h-96 w-96 rounded-full bg-orange-400/10 blur-3xl" />
      </div>

      <div className="mx-auto max-w-[1200px] space-y-8 p-5 sm:p-7 pb-16">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold text-slate-900">{s.weather.pageTitle}</h1>
            <p className="mt-1 text-sm text-slate-500">
              {s.weather.pageSubtitle}
            </p>
          </div>
        </div>

        <div className="rounded-[32px] border border-slate-200/50 bg-white/50 backdrop-blur-sm shadow-xl shadow-slate-200/20 overflow-hidden min-h-[400px]">
          {weather.loading && !weather.data ? (
            <div className="flex h-64 flex-col items-center justify-center gap-3 text-slate-400">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-sky-500" />
              <span className="text-sm font-medium">{s.weather.pageSubtitle}...</span>
            </div>
          ) : weather.error ? (
            <div className="p-8">
              <ErrorState onRetry={weather.refetch} />
            </div>
          ) : weather.data ? (
            <div className="grid grid-cols-1 divide-y divide-slate-100 sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4 lg:divide-x">
              {weather.data
                .sort((a, b) => b.trafficImpactPercent - a.trafficImpactPercent)
                .map((w) => {
                  const grad = weatherGradient(w.condition, w.trafficImpactPercent)
                  const condLabel = s.weather.conditions?.[w.condition] ?? w.condition

                  return (
                    <div
                      key={w.districtId}
                      className={`group relative flex flex-col p-8 transition-all duration-300 hover:bg-slate-50 hover:shadow-2xl bg-gradient-to-br ${grad}`}
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/60 shadow-sm backdrop-blur-md transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                          <span className="text-3xl leading-none drop-shadow-sm">{weatherIcon(w.condition)}</span>
                        </div>
                        <div className="min-w-0 pt-1">
                          <p className="truncate font-display text-lg font-black text-slate-900">{w.districtName}</p>
                          <p className="truncate text-sm font-semibold text-slate-500">{condLabel}</p>
                        </div>
                      </div>

                      <div className="mt-8 grid grid-cols-3 gap-3 rounded-[24px] bg-white/60 p-4 backdrop-blur-md shadow-sm border border-white/80 transition-all group-hover:bg-white/80">
                        <div className="text-center">
                          <Thermometer className="mx-auto h-5 w-5 text-orange-500" />
                          <p className="mt-2 font-display text-base font-bold text-slate-900">{Math.round(w.temperatureC)}°</p>
                        </div>
                        <div className="text-center">
                          <Wind className="mx-auto h-5 w-5 text-blue-500" />
                          <p className="mt-2 font-display text-base font-bold text-slate-900">{Math.round(w.windSpeedKmh)}</p>
                        </div>
                        <div className="text-center">
                          <Droplets className="mx-auto h-5 w-5 text-sky-500" />
                          <p className="mt-2 font-display text-base font-bold text-slate-900">{w.precipitationMm.toFixed(1)}</p>
                        </div>
                      </div>

                      <div className="mt-5 rounded-[24px] bg-white/60 p-4 backdrop-blur-md shadow-sm border border-white/80 transition-all group-hover:bg-white/80">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-[11px] font-bold uppercase tracking-widest text-slate-500">{s.weather.trafficImpact}</span>
                          <span className={`text-base font-black ${w.trafficImpactPercent > 20 ? 'text-red-500' : w.trafficImpactPercent > 10 ? 'text-orange-500' : 'text-emerald-500'}`}>
                            +{w.trafficImpactPercent}%
                          </span>
                        </div>
                        <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200/50 shadow-inner">
                          <div
                            className={`h-full rounded-full transition-all duration-1000 ease-out ${
                              w.trafficImpactPercent > 20 ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.6)]' :
                              w.trafficImpactPercent > 10 ? 'bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.6)]' :
                              'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.6)]'
                            }`}
                            style={{ width: `${Math.min(100, w.trafficImpactPercent * 3)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  )
                })}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
