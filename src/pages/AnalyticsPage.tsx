import { useState, useEffect, useRef } from 'react'
import {
  CloudRain, Sparkles, Wind, Droplets, Thermometer,
  Clock, RefreshCw, BarChart3,
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




// ─── Custom Tooltip ───────────────────────────────────────────────────────────
function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-lg text-xs">
      <p className="font-bold text-slate-900 mb-2">{label}:00</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color }} className="font-medium">
          {p.name}: {p.value}{p.name === 'Sürət' ? ' km/s' : '%'}
        </p>
      ))}
    </div>
  )
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
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

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function AnalyticsPage() {
  const { s } = useLocale()
  const weather = useDistrictsWeather()

  const [dailyData,  setDailyData]  = useState<any[]>([])
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  const [mounted,    setMounted]    = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  async function fetchAll() {
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
      setLastUpdate(new Date())
    } catch(e) {
      console.error(e)
    } finally {
      setMounted(true)
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
    <div className="relative h-full overflow-y-auto scroll-thin bg-slate-50">
      {/* ── Ambient blobs ─────────────────────────────────────────────────�        {/* ── Header ─────────────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold text-slate-900">{s.analyticsPage.title}</h1>
            <p className="mt-1 text-sm text-slate-500">
              {s.analyticsPage.subtitle}
            </p>
          </div>
          <button
            onClick={fetchAll}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition-colors hover:bg-slate-50"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Yenilə</span>
            <span className="text-xs text-slate-400">{lastUpdate.toLocaleTimeString(s.brand.name === 'WayGo' ? 'en-US' : 'az-AZ', { hour: '2-digit', minute: '2-digit' })}</span>
          </button>
        </div>

        {/* ══════════════════════════════════════════════════════════════════════
            BÖLMƏ 1 — AI PROQNOZU & GÜNLÜK TRAFİK
        ══════════════════════════════════════════════════════════════════════ */}
        <section className="grid grid-cols-1 gap-8 xl:grid-cols-12">

          {/* AI Prediction — 5 cols */}
          <div className="xl:col-span-5 flex flex-col">
            <div className="mb-6 flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-brand-500" />
              <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500">{s.analyticsPage.aiPredictionTitle}</h2>
            </div>
            <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm flex-1">
              <AiPredictionPanel />
            </div>
          </div>

          {/* Hourly demand — 7 cols */}
          <div className="xl:col-span-7 flex flex-col">
            <div className="mb-6 flex items-center gap-3">
              <BarChart3 className="h-5 w-5 text-sky-500" />
              <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500">{s.analyticsPage.dailyPeakTitle}</h2>
            </div>
            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm flex-1">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-700">{s.analyticsPage.dailyPeakSubtitle}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{s.analyticsPage.dailyPeakHint}</p>
                </div>
                <div className="flex items-center gap-4 text-[11px]">
                  <span className="flex items-center gap-1.5"><span className="h-2 w-6 rounded-full bg-brand-500 opacity-80 inline-block" />{s.analyticsPage.congestionColumn} %</span>
                  <span className="flex items-center gap-1.5"><span className="h-2 w-6 rounded-full bg-emerald-500 opacity-80 inline-block" />{s.analyticsPage.speedColumn} km/s</span>
                </div>
              </div>sName="grid grid-cols-1 gap-8 lg:grid-cols-12">

          {/* Hourly demand — 12 cols */}
          <div className="lg:col-span-12 flex flex-col">
            <div className="mb-6 flex items-center gap-3">
              <BarChart3 className="h-5 w-5 text-sky-500" />
              <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500">Günlük Trafik Piki</h2>
            </div>
            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-700">Tıxac &amp; Sürət (24 saat)</p>
                  <p className="text-xs text-slate-400 mt-0.5">Tipik iş günü, Bakı mərkəzi</p>
                </div>
                <div className="flex items-center gap-4 text-[11px]">
                  <span className="flex items-center gap-1.5"><span className="h-2 w-6 rounded-full bg-brand-500 opacity-80 inline-block" />Tıxac %</span>
                  <span className="flex items-center gap-1.5"><span className="h-2 w-6 rounded-full bg-emerald-500 opacity-80 inline-block" />Sürət km/s</span>
                </div>
              </div>
              {mounted && (
                <ResponsiveContainer width="100%" height={240}>
                  <AreaChart data={dailyData} margin={{ top: 5, right: 5, left: -15, bottom: 0 }}>
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
                    <XAxis
                      dataKey="t"
                      tick={{ fontSize: 10, fill: '#94a3b8' }}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(v) => `${v}:00`}
                    />
                    <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
                    <Tooltip content={<ChartTooltip />} />
                    <Area
                      type="monotone" dataKey="congestion" name="Tıxac"
                      stroke="#6366f1" strokeWidth={2}
                      fill="url(#gradCong)"
                      dot={(props: any) => {
                        const { cx, cy, payload } = props
                        if (parseInt(payload.t) !== currentHour) return <></>
                        return <circle key="now" cx={cx} cy={cy} r={5} fill="#6366f1" stroke="white" strokeWidth={2} />
                      }}
                    />
                    <Area
                      type="monotone" dataKey="speed" name="Sürət"
                      stroke="#10b981" strokeWidth={2}
                      fill="url(#gradSpeed)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
              <div className="mt-4 flex items-center gap-2 rounded-xl bg-slate-50 px-4 py-2.5 text-xs text-slate-600">
                <Clock className="h-3.5 w-3.5 text-brand-500 shrink-0" />
                <span>
                  <strong>{s.analyticsPage.currentHour} ({currentHour}:00):</strong>{' '}
                  {(() => {
                    const cur = dailyData.find((h: any) => parseInt(h.t) === currentHour) ?? dailyData[currentHour] ?? dailyData[0]
                    if (!cur) return s.analyticsPage.dataLoading
                    return `${s.analyticsPage.speedColumn} ~${cur.speed} km/s · ${s.analyticsPage.congestionColumn} ~${cur.congestion}%`
                  })()}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════════
            BÖLMƏ 2 — HAVA VƏ TRAFİK TƏSİRİ
        ══════════════════════════════════════════════════════════════════════ */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CloudRain className="h-4 w-4 text-sky-500" />
              <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500">{s.analyticsPage.districtWeatherTitle}</h2>
            </div>
            <span className="rounded-lg bg-sky-50 px-3 py-1 text-xs font-bold text-sky-600 border border-sky-200">
              Bakı · {new Date().toLocaleTimeString(s.brand.name === 'WayGo' ? 'en-US' : 'az-AZ', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>

          <div className="rounded-3xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
            {weather.loading && !weather.data ? (
              <div className="flex h-48 items-center justify-center gap-3 text-slate-400">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-sky-500" />
                <span className="text-sm">{s.analyticsPage.dataLoading}</span>
              </div>
            ) : weather.error ? (
              <div className="p-6">
                <ErrorState onRetry={weather.refetch} />
              </div>
            ) : weather.data ? (
              <div className="grid grid-cols-2 divide-x divide-y divide-slate-100 sm:grid-cols-3 lg:grid-cols-5">
                {weather.data
                  .sort((a, b) => b.trafficImpactPercent - a.trafficImpactPercent)
                  .slice(0, 5)
                  .map((w) => {
                    const grad = weatherGradient(w.condition, w.trafficImpactPercent)
                    const condLabel = s.weather.conditions?.[w.condition] ?? w.condition

                    return (
                      <div
                        key={w.districtId}
                        className={`relative flex flex-col p-5 transition-colors hover:bg-slate-50 bg-gradient-to-br ${grad}`}
                      >
                        <div className="flex items-start gap-2">
                          <span className="text-2xl leading-none">{weatherIcon(w.condition)}</span>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-bold text-slate-900">{w.districtName}</p>
                            <p className="truncate text-xs text-slate-500">{condLabel}</p>
                          </div>
                        </div>

                        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                          <div>
                            <Thermometer className="mx-auto h-3 w-3 text-orange-400" />
                            <p className="mt-0.5 text-sm font-bold text-slate-900">{Math.round(w.temperatureC)}°</p>
                            <p className="text-[9px] text-slate-400">°C</p>
                          </div>
                          <div>
                            <Wind className="mx-auto h-3 w-3 text-blue-400" />
                            <p className="mt-0.5 text-sm font-bold text-slate-900">{Math.round(w.windSpeedKmh)}</p>
                            <p className="text-[9px] text-slate-400">km/s</p>
                          </div>
                          <div>
                            <Droplets className="mx-auto h-3 w-3 text-sky-400" />
                            <p className="mt-0.5 text-sm font-bold text-slate-900">{w.precipitationMm.toFixed(1)}</p>
                            <p className="text-[9px] text-slate-400">mm</p>
                          </div>
                        </div>

                        <div className="mt-4">
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">{s.weather.trafficImpact}</span>
                            <span className={`text-sm font-bold ${w.trafficImpactPercent > 20 ? 'text-red-600' : w.trafficImpactPercent > 10 ? 'text-orange-500' : 'text-emerald-600'}`}>
                              +{w.trafficImpactPercent}%
                            </span>
                          </div>
                          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                            <div
                              className={`h-full rounded-full transition-all duration-700 ${
                                w.trafficImpactPercent > 20 ? 'bg-red-500' :
                                w.trafficImpactPercent > 10 ? 'bg-orange-500' :
                                'bg-emerald-500'
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
        </section>

      </div>
    </div>
  )
}
