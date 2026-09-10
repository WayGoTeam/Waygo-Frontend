import { useState, useEffect, useRef } from 'react'
import {
  CloudRain, Sparkles, Wind, Droplets, Thermometer,
  Clock, RefreshCw, BarChart3, ChevronDown,
} from 'lucide-react'
import {
  AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, YAxis,
  CartesianGrid,
} from 'recharts'
import { useLocale } from '@/i18n/LocaleContext'
import { useDistrictsWeather } from '@/hooks/useDistrictsWeather'
import { ErrorState } from '@/components/common/States'
import { AiPredictionPanel } from '@/components/traffic/AiPredictionPanel'
import { getDailyPrediction } from '@/api/traffic'
import { weatherEmoji } from '@/components/weather/WeatherIcon'

// ─── Custom Tooltip ───────────────────────────────────────────────────────────
// Series are keyed by dataKey ("speed"/"congestion"), never by translated names,
// so the unit suffix cannot break when the locale changes (L07).
function ChartTooltip({ active, payload, label, speedUnitLabel }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 shadow-lg text-xs">
      <p className="font-bold text-slate-900 dark:text-slate-50 mb-2">{label}:00</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color }} className="font-medium">
          {p.name}: {p.value}{p.dataKey === 'speed' ? ` ${speedUnitLabel}` : '%'}
        </p>
      ))}
    </div>
  )
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function AnalyticsPage() {
  const { s, locale } = useLocale()
  const speedUnitLabel = s.common.kmh
  const weather = useDistrictsWeather()

  const [dailyData,  setDailyData]  = useState<any[]>([])
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  const [mounted,    setMounted]    = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [aiOpen, setAiOpen] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  async function fetchAll() {
    if (isRefreshing) return;
    setIsRefreshing(true)
    try {
      const da = await getDailyPrediction()
      if (da) {
        const mappedData = da.map((d: any) => ({
          t: String(d.hour).padStart(2, '0'),
          congestion: Math.round(d.predicted_congestion_level),
          speed: Math.round(d.predicted_speed_kmh)
        }))
        setDailyData(mappedData)
      }
      await weather.refetch()
      setLastUpdate(new Date())
    } catch(e) {
      console.error(e)
    } finally {
      setMounted(true)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    fetchAll()
    setMounted(true)
    intervalRef.current = setInterval(fetchAll, 30_000)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [])

  const currentHour = new Date().getHours()

  return (
    <div className="relative h-full overflow-y-auto scroll-thin bg-slate-50 dark:bg-slate-900">
      {/* Ambient blobs */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-brand-400/8 blur-3xl" />
        <div className="absolute -right-32 top-1/3 h-96 w-96 rounded-full bg-violet-400/6 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl space-y-6 px-4 py-5 pb-8 sm:px-6 sm:py-6">

        {/* ── Compact Header ── */}
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="font-display text-xl font-bold text-slate-900 dark:text-slate-50 sm:text-2xl">{s.analyticsPage.title}</h1>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400 sm:text-sm">{s.analyticsPage.subtitle}</p>
          </div>
          <button
            onClick={fetchAll}
            disabled={isRefreshing}
            aria-label={s.cityBar.refresh}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 shadow-sm transition hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 shrink-0"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`} aria-hidden="true" />
            <span className="hidden sm:inline">{s.cityBar.refresh}</span>
            <span className="text-slate-400">{lastUpdate.toLocaleTimeString(locale === 'en' ? 'en-US' : 'az-AZ', { hour: '2-digit', minute: '2-digit' })}</span>
          </button>
        </div>

        {/* ── Grid: Daily Peak (70%) & AI Prediction (30%) ── */}
        <div className="grid gap-6 lg:grid-cols-10">
          {/* ── Hourly Traffic Chart ── */}
          <section className="flex flex-col rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm lg:col-span-7">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-sky-500" />
                <h2 className="text-sm font-bold text-slate-700 dark:text-slate-200">{s.analyticsPage.dailyPeakTitle}</h2>
              </div>
              <div className="flex items-center gap-3 text-[11px] text-slate-400">
                <span className="flex items-center gap-1"><span className="h-1.5 w-4 rounded-full bg-brand-500 opacity-80 inline-block" />{s.analyticsPage.congestionColumn}%</span>
                <span className="flex items-center gap-1"><span className="h-1.5 w-4 rounded-full bg-emerald-500 opacity-80 inline-block" />{s.analyticsPage.speedColumn} {speedUnitLabel}</span>
              </div>
            </div>
            {mounted && (
              <div className="flex-1 min-h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={dailyData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="gradCong" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#6366f1" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="#6366f1" stopOpacity={0.02} />
                      </linearGradient>
                      <linearGradient id="gradSpeed" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="#10b981" stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="t" tick={{ fontSize: 9, fill: '#94a3b8' }} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}:00`} />
                    <YAxis tick={{ fontSize: 9, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
                    <Tooltip content={<ChartTooltip speedUnitLabel={speedUnitLabel} />} />
                    <Area type="monotone" dataKey="congestion" name={s.analyticsPage.congestionColumn} stroke="#6366f1" strokeWidth={2} fill="url(#gradCong)"
                      dot={(props: any) => {
                        const { cx, cy, payload } = props
                        if (parseInt(payload.t) !== currentHour) return <></>
                        return <circle key="now" cx={cx} cy={cy} r={4} fill="#6366f1" stroke="white" strokeWidth={2} />
                      }}
                    />
                    <Area type="monotone" dataKey="speed" name={s.analyticsPage.speedColumn} stroke="#10b981" strokeWidth={2} fill="url(#gradSpeed)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </section>

          {/* ── AI Prediction ── */}
          <section className="flex flex-col rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-4 lg:col-span-3">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-brand-500" />
                <h2 className="text-sm font-bold text-slate-700 dark:text-slate-200">{s.analyticsPage.aiPredictionTitle}</h2>
              </div>
            </div>
            <div className="flex-1 overflow-hidden rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <AiPredictionPanel />
            </div>
          </section>
        </div>

        {/* ── Weather Impact — 2-col compact grid ── */}
        <section>
          <div className="mb-3 flex items-center gap-2">
            <CloudRain className="h-4 w-4 text-sky-500" />
            <h2 className="text-sm font-bold text-slate-700 dark:text-slate-200">{s.analyticsPage.districtWeatherTitle}</h2>
          </div>
          {weather.loading && !weather.data ? (
            <div className="flex h-32 items-center justify-center gap-3 text-slate-400">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-200 dark:border-slate-800 border-t-sky-500" />
              <span className="text-sm">{s.analyticsPage.dataLoading}</span>
            </div>
          ) : weather.error ? (
            <ErrorState onRetry={weather.refetch} />
          ) : weather.data ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {weather.data
                .sort((a, b) => b.trafficImpactPercent - a.trafficImpactPercent)
                .slice(0, 5)
                .map((w) => {
                  const condLabel = s.weather.conditions?.[w.condition] ?? w.condition
                  const impact = w.trafficImpactPercent
                  const impactColor = impact > 20 ? 'text-red-600 dark:text-red-400' : impact > 10 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'
                  const barColor = impact > 20 ? 'bg-red-500' : impact > 10 ? 'bg-amber-500' : 'bg-emerald-500'

                  return (
                    <div key={w.districtId} className="flex flex-col rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3.5 shadow-sm gap-2">
                      <div className="flex items-start justify-between">
                        <div className="min-w-0">
                          <p className="truncate text-xs font-bold text-slate-900 dark:text-slate-50">{w.districtName}</p>
                          <p className="truncate text-[10px] text-slate-400">{condLabel}</p>
                        </div>
                        <span className="text-xl leading-none shrink-0 ml-1" aria-hidden="true">{weatherEmoji(w.condition)}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-1 text-center">
                        <div>
                          <p className="text-sm font-bold text-slate-900 dark:text-slate-50">{Math.round(w.temperatureC)}°</p>
                          <p className="text-[9px] text-slate-400">°C</p>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 dark:text-slate-50">{Math.round(w.windSpeedKmh)}</p>
                          <p className="text-[9px] text-slate-400">{speedUnitLabel}</p>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 dark:text-slate-50">{w.precipitationMm.toFixed(1)}</p>
                          <p className="text-[9px] text-slate-400">mm</p>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[9px] font-semibold uppercase tracking-wide text-slate-400">{s.weather.trafficImpact}</span>
                          <span className={`text-xs font-bold ${impactColor}`}>+{impact}%</span>
                        </div>
                        <div className="h-1 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                          <div className={`h-full rounded-full transition-all duration-700 ${barColor}`} style={{ width: `${Math.min(100, impact * 3)}%` }} />
                        </div>
                      </div>
                    </div>
                  )
                })}
            </div>
          ) : null}
        </section>

      </div>
    </div>
  )
}
