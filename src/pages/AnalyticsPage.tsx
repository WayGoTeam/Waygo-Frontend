import { Activity, Car, Gauge } from 'lucide-react'
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'
import { useLocale } from '@/i18n/LocaleContext'
import { useCityStats } from '@/hooks/useCityStats'
import { useDistrictAnalytics } from '@/hooks/useDistrictAnalytics'
import { useTrafficMap } from '@/hooks/useTrafficMap'
import { useDistrictsWeather } from '@/hooks/useDistrictsWeather'
import { PageHeader } from '@/components/common/PageHeader'
import { StatCard } from '@/components/common/StatCard'
import { LoadingState, ErrorState } from '@/components/common/States'
import { congestionColor } from '@/lib/congestion'
import { formatBakuClock } from '@/lib/format'

export default function AnalyticsPage() {
  const { s } = useLocale()
  const cityStats = useCityStats()
  const districts = useDistrictAnalytics()
  const weather = useDistrictsWeather()

  const chartData = (cityStats.data?.last24Hours ?? []).map((point) => ({
    time: formatBakuClock(point.bucketStart),
    congestion: Math.round(point.averageCongestionLevel),
    speed: Math.round(point.averageSpeedKmh),
  }))

  return (
    <div className="relative h-full overflow-y-auto bg-slate-50/50 p-4 sm:p-6 scroll-thin">
      {/* Background ambient glow */}
      <div className="pointer-events-none absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}></div>
      </div>

      <PageHeader title={s.analyticsPage.title} subtitle={s.analyticsPage.subtitle} />

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatCard
          icon={Gauge}
          label={s.analyticsPage.avgSpeed}
          value={cityStats.data ? String(Math.round(cityStats.data.averageSpeedKmh)) : '—'}
          unit={s.common.kmh}
        />
        <StatCard
          icon={Activity}
          label={s.analyticsPage.avgCongestion}
          value={cityStats.data ? String(Math.round(cityStats.data.congestionPercent)) : '—'}
          unit="%"
        />
        <StatCard
          icon={Car}
          label={s.analyticsPage.activeVehicles}
          value={cityStats.data ? cityStats.data.activeVehiclesCount.toLocaleString('en-US') : '—'}
          unit={s.common.vehicles}
        />
      </div>

      <div className="mt-5 rounded-2xl border border-white/60 bg-white/60 p-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl sm:p-5 transition-all hover:bg-white/80 duration-500">
        <p className="text-sm font-bold tracking-wide text-slate-800">{s.analyticsPage.last24h}</p>
        {cityStats.loading && !cityStats.data ? (
          <LoadingState />
        ) : chartData.length === 0 ? (
          <p className="py-10 text-center text-sm text-slate-400">{s.common.loading}</p>
        ) : (
          <div className="mt-3 h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData} margin={{ left: -18, right: 8, top: 8 }}>
                <defs>
                  <linearGradient id="congestionFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2358eb" stopOpacity={0.28} />
                    <stop offset="100%" stopColor="#2358eb" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#eef2f6" vertical={false} />
                <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
                <YAxis yAxisId="left" tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} width={34} domain={[0, 100]} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} width={34} />
                <Tooltip
                  contentStyle={{ borderRadius: 16, border: '1px solid rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(12px)', fontSize: 13, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                  labelStyle={{ fontWeight: 700, color: '#1e293b', marginBottom: 4 }}
                  itemStyle={{ fontWeight: 500 }}
                />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="congestion"
                  name={`${s.analyticsPage.avgCongestion} (%)`}
                  stroke="#2358eb"
                  fill="url(#congestionFill)"
                  strokeWidth={2}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="speed"
                  name={`${s.analyticsPage.avgSpeed} (${s.common.kmh})`}
                  stroke="#f97316"
                  strokeWidth={2}
                  dot={false}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-5">
        <div className="flex flex-col h-[600px] rounded-2xl border border-white/60 bg-white/60 p-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl sm:p-5 lg:col-span-2 transition-all hover:bg-white/80 duration-500">
          <div>
            <p className="text-sm font-bold tracking-wide text-slate-800">{s.analyticsPage.districts}</p>
            <p className="mt-0.5 text-xs font-medium text-slate-500">{s.analyticsPage.districtsHint}</p>
          </div>
          {districts.loading && !districts.data ? (
            <LoadingState />
          ) : districts.error ? (
            <ErrorState onRetry={districts.refetch} />
          ) : (
            <div className="mt-4 flex-1 overflow-y-auto scroll-thin pr-2 space-y-2.5">
              {[...(districts.data ?? [])]
                .sort((a, b) => b.congestionPct - a.congestionPct)
                .map((d) => (
                  <div key={d.id} className="group cursor-default rounded-xl p-2 transition-colors hover:bg-slate-50">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-600">{d.name}</span>
                      <span className="tabular-nums text-slate-400">
                        {Math.round(d.avgSpeedKmh)} {s.common.kmh}
                      </span>
                    </div>
                    <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-100 shadow-inner">
                      <div
                        className="h-full rounded-full transition-all duration-1000 ease-out group-hover:brightness-110"
                        style={{
                          width: `${Math.min(100, d.congestionPct)}%`,
                          background: `linear-gradient(90deg, ${congestionColor(d.congestionPct)} 0%, ${congestionColor(Math.min(100, d.congestionPct + 15))} 100%)`,
                        }}
                      />
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

        <div className="flex flex-col h-[600px] rounded-2xl border border-white/60 bg-white/60 p-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl sm:p-5 lg:col-span-3 transition-all hover:bg-white/80 duration-500">
          <div>
            <p className="text-sm font-bold tracking-wide text-slate-800">{s.weather.pageTitle}</p>
            <p className="mt-0.5 text-xs font-medium text-slate-500">{s.weather.pageSubtitle}</p>
          </div>
          {weather.loading && !weather.data ? (
            <LoadingState />
          ) : weather.error ? (
            <ErrorState onRetry={weather.refetch} />
          ) : weather.data ? (
            <div className="mt-4 flex-1 overflow-y-auto scroll-thin pr-2">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {weather.data
                .sort((a, b) => b.trafficImpactPercent - a.trafficImpactPercent)
                .map((w, idx) => {
                  const conditionLabel = s.weather.conditions?.[w.condition] ?? w.condition
                  const isTop = idx === 0
                  
                  return (
                    <div key={w.districtId} className={`group relative overflow-hidden rounded-xl border p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md ${isTop ? 'border-rose-100 bg-gradient-to-br from-rose-50 to-pink-50/50' : 'border-slate-100 bg-white/70'}`}>
                      <div className="flex items-start justify-between">
                        <div>
                          <p className={`font-semibold ${isTop ? 'text-rose-900' : 'text-slate-800'}`}>{w.districtName}</p>
                          <p className={`mt-0.5 text-[11px] font-medium ${isTop ? 'text-rose-500/80' : 'text-slate-500'}`}>
                            {conditionLabel} • {Math.round(w.temperatureC)}°C
                          </p>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className={`font-display text-lg font-bold ${isTop ? 'text-rose-600' : 'text-slate-700'}`}>
                            +{w.trafficImpactPercent}%
                          </span>
                          <span className={`text-[10px] font-semibold uppercase tracking-wider ${isTop ? 'text-rose-400' : 'text-slate-400'}`}>
                            {s.weather.trafficImpact}
                          </span>
                        </div>
                      </div>
                      
                      <div className={`mt-3 h-1.5 w-full overflow-hidden rounded-full ${isTop ? 'bg-rose-200/50' : 'bg-slate-100'}`}>
                        <div 
                          className={`h-full rounded-full transition-all duration-1000 ease-out ${isTop ? 'bg-rose-500' : 'bg-slate-400 group-hover:bg-slate-500'}`}
                          style={{ width: `${Math.min(100, w.trafficImpactPercent * 2.5)}%` }}
                        />
                      </div>
                      
                      <div className="mt-3 flex gap-4 border-t border-black/5 pt-3">
                        <div className="flex items-center gap-1.5">
                          <span className={`text-[10px] font-semibold uppercase tracking-wider ${isTop ? 'text-rose-400' : 'text-slate-400'}`}>{s.weather.windSpeed}</span>
                          <span className={`text-xs font-medium ${isTop ? 'text-rose-700' : 'text-slate-600'}`}>{w.windSpeedKmh}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className={`text-[10px] font-semibold uppercase tracking-wider ${isTop ? 'text-rose-400' : 'text-slate-400'}`}>{s.weather.precipitation}</span>
                          <span className={`text-xs font-medium ${isTop ? 'text-rose-700' : 'text-slate-600'}`}>{w.precipitationMm}</span>
                        </div>
                      </div>
                    </div>
                  )
              })}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
