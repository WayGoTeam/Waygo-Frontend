import { useState, useEffect, useRef } from 'react'
import {
  Gauge, Activity, Car, AlertTriangle, Wifi, CloudRain, Sparkles,
  TrendingUp, TrendingDown, Minus, Wind, Droplets, Thermometer,
  MapPin, Zap, Clock, RefreshCw, Radio, History, BarChart3,
} from 'lucide-react'
import {
  AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, YAxis,
  CartesianGrid,
} from 'recharts'
import { useLocale } from '@/i18n/LocaleContext'
import { useDistrictsWeather } from '@/hooks/useDistrictsWeather'
import { LoadingState, ErrorState } from '@/components/common/States'
import { AiPredictionPanel } from '@/components/traffic/AiPredictionPanel'
import {
  getCityStats, getAnomalies, getDistrictAnalytics, getTelemetryStatus, getDailyPrediction
} from '@/api/traffic'
import type { CityStats, TrafficAnomaly, DistrictAnalytics, TelemetryStatus } from '@/types/api'



// ─── Helpers ─────────────────────────────────────────────────────────────────
function congestionColor(pct: number) {
  if (pct >= 75) return { text: 'text-red-500',    bg: 'bg-red-500',    badge: 'bg-red-100 text-red-700',    label: 'Ağır Tıxac' }
  if (pct >= 50) return { text: 'text-orange-500', bg: 'bg-orange-500', badge: 'bg-orange-100 text-orange-700', label: 'Orta Tıxac' }
  if (pct >= 25) return { text: 'text-yellow-500', bg: 'bg-yellow-500', badge: 'bg-yellow-100 text-yellow-700', label: 'Axın Zəif' }
  return           { text: 'text-emerald-500', bg: 'bg-emerald-500', badge: 'bg-emerald-100 text-emerald-700', label: 'Axın Normal' }
}

function speedColor(kmh: number) {
  if (kmh >= 50) return 'text-emerald-500'
  if (kmh >= 30) return 'text-yellow-500'
  if (kmh >= 15) return 'text-orange-500'
  return 'text-red-500'
}

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

// ─── Subcomponents ────────────────────────────────────────────────────────────

function PulseMetric({ icon: Icon, label, value, unit, sub, color, live }: {
  icon: React.ElementType; label: string; value: string | number; unit?: string;
  sub?: string; color: string; live?: boolean
}) {
  return (
    <div className={`relative flex flex-col gap-1 rounded-2xl border bg-white p-5 shadow-sm transition-all hover:shadow-md ${color === 'emerald' ? 'border-emerald-100' : color === 'red' ? 'border-red-100' : color === 'blue' ? 'border-blue-100' : color === 'amber' ? 'border-amber-100' : 'border-slate-100'}`}>
      {live && (
        <span className="absolute right-4 top-4 flex h-2 w-2">
          <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-60 ${color === 'emerald' ? 'bg-emerald-400' : color === 'red' ? 'bg-red-400' : 'bg-blue-400'}`} />
          <span className={`relative inline-flex h-2 w-2 rounded-full ${color === 'emerald' ? 'bg-emerald-500' : color === 'red' ? 'bg-red-500' : 'bg-blue-500'}`} />
        </span>
      )}
      <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${
        color === 'emerald' ? 'bg-emerald-100 text-emerald-600' :
        color === 'red'     ? 'bg-red-100 text-red-600' :
        color === 'blue'    ? 'bg-blue-100 text-blue-600' :
        color === 'amber'   ? 'bg-amber-100 text-amber-600' :
        color === 'purple'  ? 'bg-purple-100 text-purple-600' :
        'bg-slate-100 text-slate-600'
      }`}>
        <Icon className="h-4.5 w-4.5" strokeWidth={2} />
      </div>
      <p className="mt-1 text-xs font-medium text-slate-500">{label}</p>
      <div className="flex items-baseline gap-1">
        <span className={`font-display text-3xl font-bold ${
          color === 'emerald' ? 'text-emerald-600' :
          color === 'red'     ? 'text-red-600' :
          color === 'blue'    ? 'text-blue-600' :
          color === 'amber'   ? 'text-amber-600' :
          color === 'purple'  ? 'text-purple-600' :
          'text-slate-800'
        }`}>{value}</span>
        {unit && <span className="text-xs font-medium text-slate-400">{unit}</span>}
      </div>
      {sub && <p className="text-[11px] text-slate-400">{sub}</p>}
    </div>
  )
}

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

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function AnalyticsPage() {
  const { s } = useLocale()
  const weather = useDistrictsWeather()

  const [cityStats,  setCityStats]  = useState<CityStats | null>(null)
  const [anomalies,  setAnomalies]  = useState<TrafficAnomaly[]>([])
  const [districts,  setDistricts]  = useState<DistrictAnalytics[]>([])
  const [telemetry,  setTelemetry]  = useState<TelemetryStatus | null>(null)
  const [dailyData,  setDailyData]  = useState<any[]>([])
  const [loading,    setLoading]    = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  const [mounted,    setMounted]    = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  async function fetchAll() {
    try {
      const [cs, an, di, te, da] = await Promise.allSettled([
        getCityStats(), getAnomalies(), getDistrictAnalytics(), getTelemetryStatus(), getDailyPrediction()
      ])
      if (cs.status === 'fulfilled') setCityStats(cs.value)
      if (an.status === 'fulfilled') setAnomalies(an.value)
      if (di.status === 'fulfilled') setDistricts(di.value)
      if (te.status === 'fulfilled') setTelemetry(te.value)
      if (da.status === 'fulfilled') {
        const mappedData = da.value.map((d: any) => ({
          t: String(d.hour).padStart(2, '0'),
          congestion: Math.round(d.predicted_congestion_level),
          speed: Math.round(d.predicted_speed_kmh)
        }))
        setDailyData(mappedData)
      }
      setLastUpdate(new Date())
    } finally {
      setLoading(false)
      setMounted(true)
    }
  }

  useEffect(() => {
    fetchAll()
    setMounted(true)
    intervalRef.current = setInterval(fetchAll, 30_000)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [])

  const congestion = cityStats?.congestionPercent ?? 0
  const avgSpeed   = cityStats?.averageSpeedKmh   ?? 0
  const vehicles   = cityStats?.activeVehiclesCount ?? 0
  const anomCount  = telemetry?.activeAnomaliesCount ?? anomalies.filter(a => a.status === 'ACTIVE').length
  const sysOk      = telemetry?.status === 'HEALTHY' || telemetry?.status === 'UP'
  const congestC   = congestionColor(congestion)
  const currentHour = new Date().getHours()

  return (
    <div className="relative h-full overflow-y-auto scroll-thin bg-slate-50">
      {/* ── Ambient blobs ─────────────────────────────────────────────────── */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-brand-400/8 blur-3xl" />
        <div className="absolute -right-32 top-1/3 h-96 w-96 rounded-full bg-violet-400/6 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-emerald-400/5 blur-3xl" />
      </div>

      <div className="mx-auto max-w-[1600px] space-y-12 lg:space-y-16 p-6 sm:p-8 lg:p-10 pb-24">

        {/* ── Header ─────────────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold text-slate-900">Analitika</h1>
            <p className="mt-1 text-sm text-slate-500">
              Bakı şəhərinin canlı trafik göstəriciləri &amp; AI proqnozları
            </p>
          </div>
          <button
            onClick={fetchAll}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition-colors hover:bg-slate-50"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Yenilə</span>
            <span className="text-xs text-slate-400">{lastUpdate.toLocaleTimeString('az-AZ', { hour: '2-digit', minute: '2-digit' })}</span>
          </button>
        </div>

        {/* ══════════════════════════════════════════════════════════════════════
            BÖLMƏ 1 — LIVE CITY PULSE (5 metric)
        ══════════════════════════════════════════════════════════════════════ */}
        <section>
          <div className="mb-6 flex items-center gap-3">
            <Radio className="h-5 w-5 text-red-500 animate-pulse" />
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500">Canlı Şəhər Vəziyyəti</h2>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-36 animate-pulse rounded-2xl bg-slate-200" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              <PulseMetric
                icon={Gauge}
                label="Ortalama Sürət"
                value={Math.round(avgSpeed)}
                unit="km/s"
                sub={avgSpeed >= 40 ? '🟢 Yaxşı axın' : avgSpeed >= 20 ? '🟡 Zəif axın' : '🔴 Tıxac'}
                color={avgSpeed >= 40 ? 'emerald' : avgSpeed >= 20 ? 'amber' : 'red'}
                live
              />
              <PulseMetric
                icon={Activity}
                label="Tıxac Faizi"
                value={Math.round(congestion)}
                unit="%"
                sub={congestC.label}
                color={congestion >= 70 ? 'red' : congestion >= 40 ? 'amber' : 'emerald'}
                live
              />
              <PulseMetric
                icon={Car}
                label="Aktiv Nəqliyyat"
                value={vehicles.toLocaleString()}
                sub="bu an yolda"
                color="blue"
                live
              />
              <PulseMetric
                icon={AlertTriangle}
                label="Aktiv Anomaliya"
                value={anomCount}
                sub={anomCount > 0 ? 'yoxlanılır...' : 'Anomaliya yoxdur'}
                color={anomCount > 2 ? 'red' : anomCount > 0 ? 'amber' : 'emerald'}
              />
              <PulseMetric
                icon={Wifi}
                label="Sistem"
                value={sysOk ? 'Aktiv' : telemetry ? 'Xəta' : '—'}
                sub={telemetry?.engineVersion ?? 'yüklənir...'}
                color={sysOk ? 'emerald' : 'red'}
                live={sysOk}
              />
            </div>
          )}
        </section>

        {/* ══════════════════════════════════════════════════════════════════════
            BÖLMƏ 2 — AI PROQNOZu + ANOMALIYALAR
        ══════════════════════════════════════════════════════════════════════ */}
        <section className="grid grid-cols-1 gap-8 lg:grid-cols-12">

          {/* AI Prediction — 6 cols */}
          <div className="lg:col-span-6 flex flex-col">
            <div className="mb-6 flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-brand-500" />
              <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500">AI Proqnozu</h2>
            </div>
            <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm flex-1">
              <AiPredictionPanel />
            </div>
          </div>

          {/* Anomalies — 6 cols */}
          <div className="lg:col-span-6 flex flex-col">
            <div className="mb-6 flex items-center gap-3">
              <Zap className="h-5 w-5 text-amber-500" />
              <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500">
                Canlı Anomaliyalar
                {anomalies.length > 0 && (
                  <span className="ml-2 rounded-full bg-red-100 px-2 py-0.5 text-xs font-bold text-red-600">
                    {anomalies.filter(a => a.status === 'ACTIVE').length} aktiv
                  </span>
                )}
              </h2>
            </div>
            <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm flex-1">
              {loading ? (
                <div className="flex h-64 items-center justify-center">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-brand-500" />
                </div>
              ) : anomalies.length === 0 ? (
                <div className="flex h-64 flex-col items-center justify-center gap-3 text-center p-8">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100">
                    <Activity className="h-7 w-7 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">Anomaliya Aşkarlanmadı</p>
                    <p className="mt-1 text-sm text-slate-500">Trafik axını normal çərçivədə davam edir</p>
                  </div>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {anomalies.slice(0, 6).map((a) => (
                    <div key={a.segmentId + a.detectedAt} className="flex items-start gap-3 px-5 py-4 hover:bg-slate-50 transition-colors">
                      <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${
                        a.status === 'ACTIVE' ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-400'
                      }`}>
                        <AlertTriangle className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="truncate text-sm font-semibold text-slate-900">{a.segmentId}</p>
                          <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                            a.status === 'ACTIVE' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-500'
                          }`}>{a.status}</span>
                        </div>
                        <p className="mt-0.5 text-xs text-slate-500 line-clamp-1">{a.description}</p>
                        <p className="mt-1 text-[10px] text-slate-400 font-mono">
                          z-score: {a.zScore?.toFixed(2)} · {new Date(a.detectedAt).toLocaleTimeString('az-AZ', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))}
                  {anomalies.length > 6 && (
                    <p className="px-5 py-3 text-xs text-slate-400 text-center">
                      +{anomalies.length - 6} daha çox anomaliya
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════════
            BÖLMƏ 3 — RAYON ANALİTİKASI
        ══════════════════════════════════════════════════════════════════════ */}
        <section>
          <div className="mb-6 flex items-center gap-3">
            <CloudRain className="h-5 w-5 text-emerald-500" />
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500">Hava Şəraiti</h2>
          </div>

          {districts.length === 0 && !loading ? (
            <div className="rounded-3xl border border-slate-200/80 bg-white p-8 text-center text-slate-400 shadow-sm">
              Rayon məlumatları mövcud deyil
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
              {(loading ? Array.from({ length: 8 }) : districts).map((d: any, i) => {
                if (!d) return <div key={i} className="h-32 animate-pulse rounded-2xl bg-slate-200" />
                const c = congestionColor(d.congestionPct)
                return (
                  <div
                    key={d.id}
                    className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div className={`absolute right-0 top-0 h-16 w-16 -translate-y-4 translate-x-4 rounded-full opacity-10 ${c.bg}`} />
                    <p className="truncate text-xs font-bold text-slate-900">{d.name}</p>
                    <div className={`mt-2 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold ${c.badge}`}>
                      {c.label}
                    </div>
                    <div className="mt-3 space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400">Sürət</span>
                        <span className={`font-bold ${speedColor(d.avgSpeedKmh)}`}>{Math.round(d.avgSpeedKmh)} km/s</span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                        <div className={`h-full rounded-full transition-all ${c.bg}`} style={{ width: `${Math.min(100, d.congestionPct)}%` }} />
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-slate-400">
                        <span>Tıxac</span>
                        <span className="font-mono font-bold">{Math.round(d.congestionPct)}%</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </section>

        {/* ══════════════════════════════════════════════════════════════════════
            BÖLMƏ 4 — SAATLıQ TRAFİK + 24 SAAT TARİXİ
        ══════════════════════════════════════════════════════════════════════ */}
        <section className="grid grid-cols-1 gap-8 lg:grid-cols-12">

          {/* Hourly demand — 8 cols */}
          <div className="lg:col-span-8 flex flex-col">
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
                  <strong>İndiki saat ({currentHour}:00):</strong>{' '}
                  {(() => {
                    const cur = dailyData.find((h: any) => parseInt(h.t) === currentHour) ?? dailyData[currentHour] ?? dailyData[0]
                    if (!cur) return 'Məlumat yüklənir...'
                    return `Sürət ~${cur.speed} km/s · Tıxac ~${cur.congestion}%`
                  })()}
                </span>
              </div>
            </div>
          </div>

          {/* Stats column — 4 cols */}
          <div className="lg:col-span-4 flex flex-col">
            <div className="mb-6 flex items-center gap-3">
              <History className="h-5 w-5 text-slate-400" />
              <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500">24 Saat Tarixi</h2>
            </div>
            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm h-[calc(100%-2.5rem)]">
              {!cityStats?.last24Hours?.length ? (
                <div className="flex h-full flex-col items-center justify-center gap-2 text-slate-400">
                  <TrendingUp className="h-8 w-8 opacity-30" />
                  <p className="text-sm">Tarix məlumatı yüklənir...</p>
                </div>
              ) : (
                <>
                  {mounted && (
                    <ResponsiveContainer width="100%" height={180}>
                      <AreaChart
                        data={cityStats.last24Hours.map(h => ({
                          t: new Date(h.bucketStart).getHours() + ':00',
                          speed: Math.round(h.averageSpeedKmh),
                          cong: Math.round(h.averageCongestionLevel),
                        }))}
                        margin={{ top: 5, right: 0, left: -25, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient id="gradHist" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                            <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="t" tick={{ fontSize: 9, fill: '#94a3b8' }} tickLine={false} axisLine={false} interval={3} />
                        <YAxis tick={{ fontSize: 9, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
                        <Tooltip content={<ChartTooltip />} />
                        <Area type="monotone" dataKey="speed" name="Sürət" stroke="#3b82f6" strokeWidth={1.5} fill="url(#gradHist)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  )}
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    {[
                      { label: 'Min Sürət', val: Math.min(...cityStats.last24Hours.map(h => h.averageSpeedKmh)).toFixed(0) + ' km/s', icon: TrendingDown, color: 'text-red-500' },
                      { label: 'Max Sürət', val: Math.max(...cityStats.last24Hours.map(h => h.averageSpeedKmh)).toFixed(0) + ' km/s', icon: TrendingUp, color: 'text-emerald-500' },
                    ].map(m => (
                      <div key={m.label} className="rounded-xl bg-slate-50 p-3">
                        <p className="text-[10px] text-slate-400">{m.label}</p>
                        <p className={`mt-0.5 text-base font-bold ${m.color}`}>{m.val}</p>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════════
            BÖLMƏ 5 — HAVA VƏ TRAFİK TƏSİRİ
        ══════════════════════════════════════════════════════════════════════ */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CloudRain className="h-4 w-4 text-sky-500" />
              <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500">Rayon Hava Şəraiti</h2>
            </div>
            <span className="rounded-lg bg-sky-50 px-3 py-1 text-xs font-bold text-sky-600 border border-sky-200">
              Bakı · {new Date().toLocaleTimeString('az-AZ', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>

          <div className="rounded-3xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
            {weather.loading && !weather.data ? (
              <div className="flex h-48 items-center justify-center gap-3 text-slate-400">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-sky-500" />
                <span className="text-sm">Hava məlumatları yüklənir...</span>
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
                            <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Trafik Təsiri</span>
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
