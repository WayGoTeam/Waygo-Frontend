import { useState, useEffect } from 'react'
import { BrainCircuit, Navigation, Map, CloudRain, ShieldCheck, TrendingUp, AlertTriangle, Timer, Leaf, Lock } from 'lucide-react'
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
  ReferenceLine
} from 'recharts'
import { useLocale } from '@/i18n/LocaleContext'
import { useDistrictsWeather } from '@/hooks/useDistrictsWeather'
import { PageHeader } from '@/components/common/PageHeader'
import { LoadingState, ErrorState } from '@/components/common/States'
import { AiPredictionPanel } from '@/components/traffic/AiPredictionPanel'

// --- ML / AI API Seed Data based on new spec ---
const demandData = [
  { hour: '06:00', load: 15 }, { hour: '08:00', load: 95 }, // Peak
  { hour: '09:00', load: 90 }, // Peak
  { hour: '11:00', load: 45 }, { hour: '13:00', load: 60 },
  { hour: '15:00', load: 50 }, { hour: '17:00', load: 75 },
  { hour: '18:00', load: 100 }, // Peak
  { hour: '19:00', load: 92 }, // Peak
  { hour: '21:00', load: 40 }, { hour: '23:00', load: 20 },
]

const topStreets = [
  { id: 1, name: 'Ziya Bünyadov prospekti', level: 85, status: 'HEAVY' },
  { id: 2, name: 'Heydər Əliyev prospekti', level: 78, status: 'HEAVY' },
  { id: 3, name: 'Tbilisi prospekti', level: 72, status: 'HEAVY' },
  { id: 4, name: 'Qara Qarayev prospekti', level: 55, status: 'MODERATE' },
  { id: 5, name: 'Neftçilər prospekti', level: 48, status: 'MODERATE' },
  { id: 6, name: 'Koroğlu Rəhimov küçəsi', level: 25, status: 'LIGHT' },
]

export default function AnalyticsPage() {
  const { s } = useLocale()
  const weather = useDistrictsWeather()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="relative h-full overflow-y-auto bg-slate-50/50 p-4 sm:p-6 lg:p-8 scroll-thin">
      {/* Soft Ambient Background Color Blobs */}
      <div className="pointer-events-none absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-indigo-200 to-emerald-100 opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
      </div>
      <div className="pointer-events-none absolute inset-x-0 top-[40rem] -z-10 transform-gpu overflow-hidden blur-3xl" aria-hidden="true">
        <div className="relative left-[calc(50%+11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[180deg] bg-gradient-to-tr from-rose-100 to-sky-200 opacity-30 sm:left-[calc(50%+30rem)] sm:w-[72.1875rem]"></div>
      </div>

      

      {/* Main Grid */}
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12 xl:gap-8">
        
        {/* HERO: AI Prediction (Spans 4 cols) */}
        <div className="lg:col-span-5 xl:col-span-4 flex flex-col h-[420px]">
          <div className="h-full w-full [&>div]:h-full [&>div]:shadow-sm [&>div]:border-slate-200/60 [&>div]:rounded-[1.5rem] [&>div]:bg-white/80 [&>div]:backdrop-blur-xl transition-all hover:shadow-md">
            <AiPredictionPanel />
          </div>
        </div>

        {/* Verra ESG Analytics (Spans 4 cols) */}
        <div className="lg:col-span-3 xl:col-span-4 flex flex-col h-[420px]">
          <div className="flex-1 rounded-[1.5rem] border border-slate-200/60 bg-white/80 backdrop-blur-xl p-6 shadow-sm flex flex-col relative overflow-hidden transition-all hover:shadow-md hover:bg-white/90">
            {/* Colorful Blob */}
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-emerald-400/10 blur-2xl"></div>

            <div className="flex items-center gap-3 mb-4 relative z-10">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 border border-emerald-200/50 text-emerald-600 shadow-inner">
                <Leaf className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">{s.aiAnalytics.esgTitle}</h3>
                <p className="text-xs text-slate-500">{s.aiAnalytics.esgSubtitle}</p>
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-center gap-6 relative z-10">
              <div>
                <span className="text-sm font-medium text-slate-500 block mb-1">{s.aiAnalytics.esgTotal}</span>
                <span className="block text-5xl font-light text-slate-900 tracking-tight">10,542</span>
                <span className="text-xs font-semibold text-emerald-500 mt-1 block">{s.aiAnalytics.esgSaved}</span>
              </div>
              
              <div className="rounded-xl bg-emerald-50/50 border border-emerald-100 p-4">
                 <div className="flex items-center gap-2 mb-1">
                   <Lock className="h-4 w-4 text-emerald-600" />
                   <span className="text-xs font-bold text-slate-900">{s.aiAnalytics.securityStatus}</span>
                 </div>
                 <span className="text-sm font-mono font-medium text-emerald-600">ACTIVE_SHA256</span>
                 <p className="text-[10px] text-slate-500 mt-1">{s.aiAnalytics.securityDesc}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Time Saved (Spans 4 cols) */}
        <div className="lg:col-span-4 xl:col-span-4 flex flex-col h-[420px]">
          <div className="flex-1 rounded-[1.5rem] border border-slate-200/60 bg-white/80 backdrop-blur-xl p-6 shadow-sm flex flex-col justify-center relative overflow-hidden transition-all hover:shadow-md hover:bg-white/90">
             <div className="absolute top-0 right-0 p-6 opacity-[0.03]">
               <Timer className="w-32 h-32 text-blue-900" />
             </div>
             {/* Colorful Blob */}
             <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-blue-400/10 blur-3xl"></div>

             <div className="flex items-center gap-3 mb-2 relative z-10">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 border border-blue-200/50 text-blue-600 shadow-inner">
                <Timer className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">{s.aiAnalytics.timeSavedTitle}</h3>
                <p className="text-xs text-slate-500">{s.aiAnalytics.timeSavedSubtitle}</p>
              </div>
            </div>
            <div className="relative z-10 mt-6 flex-1 flex flex-col justify-center">
              <div className="flex items-end gap-2">
                <span className="text-7xl font-light text-slate-900 tracking-tighter">18</span>
                <span className="text-sm font-medium text-blue-500 mb-2">{s.aiAnalytics.timeSavedUnit}</span>
              </div>
              <div className="mt-8 h-2 w-full bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
                <div className="h-full bg-blue-500 rounded-full w-[65%] animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                <div className="h-full bg-blue-200 rounded-full w-[35%]"></div>
              </div>
              <p className="text-sm text-slate-500 mt-4 font-medium">{s.aiAnalytics.timeSavedDesc}</p>
            </div>
          </div>
        </div>

        {/* BOTTOM LEFT: Demand Hours (Spans 7 cols) */}
        <div className="lg:col-span-7 rounded-[1.5rem] border border-slate-200/60 bg-white/80 backdrop-blur-xl p-6 shadow-sm h-[380px] flex flex-col relative overflow-hidden transition-all hover:shadow-md hover:bg-white/90">
          {/* Colorful Blob */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full bg-purple-400/5 blur-3xl pointer-events-none"></div>

          <div className="flex items-center gap-3 mb-6 relative z-10">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 border border-purple-200/50 text-purple-600 shadow-inner">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">{s.aiAnalytics.peakTitle}</h3>
              <p className="text-xs text-slate-500">{s.aiAnalytics.peakSubtitle}</p>
            </div>
          </div>
          
          <div className="flex-1 -ml-4 mt-2 relative z-10">
            {mounted && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={demandData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }} barSize={24}>
                  <defs>
                    <linearGradient id="colorPeak" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8b5cf6" stopOpacity={1}/>
                      <stop offset="100%" stopColor="#4f46e5" stopOpacity={0.8}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="hour" tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} axisLine={false} />
                  <Tooltip 
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)', background: 'rgba(255,255,255,0.9)' }}
                    itemStyle={{ color: '#0f172a', fontWeight: 600 }}
                  />
                  <Bar dataKey="load" name={s.aiAnalytics.peakLoad} radius={[4, 4, 0, 0]}>
                    {demandData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={['08:00', '09:00', '18:00', '19:00'].includes(entry.hour) ? 'url(#colorPeak)' : '#e2e8f0'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* BOTTOM RIGHT: Top Streets (Spans 5 cols) */}
        <div className="lg:col-span-5 rounded-[1.5rem] border border-slate-200/60 bg-white/80 backdrop-blur-xl p-6 shadow-sm h-[380px] flex flex-col relative overflow-hidden transition-all hover:shadow-md hover:bg-white/90">
          {/* Colorful Blob */}
          <div className="absolute -right-10 -bottom-10 h-40 w-40 rounded-full bg-amber-400/10 blur-3xl pointer-events-none"></div>

          <div className="flex items-center justify-between mb-6 relative z-10">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 border border-amber-200/50 text-amber-600 shadow-inner">
                <Navigation className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">{s.aiAnalytics.roadsTitle}</h3>
                <p className="text-xs text-slate-500">{s.aiAnalytics.roadsSubtitle}</p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-amber-600 bg-amber-50 border border-amber-200/50 px-2 py-1 rounded-md shadow-sm">{s.aiAnalytics.live}</span>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto scroll-thin pr-2 relative z-10">
            {topStreets.map((street, idx) => (
              <div key={street.id} className="p-3 rounded-xl border border-slate-100 bg-white hover:bg-slate-50 transition-colors shadow-sm">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-700">{street.name}</span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    street.status === 'HEAVY' ? 'bg-rose-100 text-rose-700 border border-rose-200/50' :
                    street.status === 'MODERATE' ? 'bg-amber-100 text-amber-700 border border-amber-200/50' : 'bg-emerald-100 text-emerald-700 border border-emerald-200/50'
                  }`}>
                    {street.status}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-1.5 flex-1 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                    <div 
                      className={`h-full rounded-full ${street.status === 'HEAVY' ? 'bg-rose-500' : street.status === 'MODERATE' ? 'bg-amber-500' : 'bg-emerald-500'}`}
                      style={{ width: `${street.level}%` }}
                    ></div>
                  </div>
                  <span className="text-xs font-bold text-slate-500 w-8">{street.level}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* WEATHER PANELS (Spans full 12 cols) */}
        <div className="lg:col-span-12 rounded-[1.5rem] border border-slate-200/60 bg-white/80 backdrop-blur-xl p-6 sm:p-8 shadow-sm transition-all hover:shadow-md hover:bg-white/90 relative overflow-hidden">
          {/* Colorful Blob */}
          <div className="absolute top-0 left-0 h-full w-1/2 rounded-full bg-sky-400/5 blur-3xl pointer-events-none"></div>

          <div className="flex items-center justify-between mb-8 relative z-10">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100 border border-sky-200/50 text-sky-600 shadow-inner">
                <CloudRain className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">{s.aiAnalytics.weatherTitle}</h3>
                <p className="text-xs text-slate-500">{s.aiAnalytics.weatherSubtitle}</p>
              </div>
            </div>
            <div className="text-right">
               <span className="text-xs font-mono font-bold text-sky-600 bg-sky-50 border border-sky-200/50 px-2 py-1 rounded-md shadow-sm">{s.aiAnalytics.weatherTime} {new Date().getHours()}:00</span>
            </div>
          </div>

          {weather.loading && !weather.data ? (
            <LoadingState />
          ) : weather.error ? (
            <ErrorState onRetry={weather.refetch} />
          ) : weather.data ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 relative z-10">
              {weather.data
                .sort((a, b) => b.trafficImpactPercent - a.trafficImpactPercent)
                .slice(0, 4)
                .map((w, idx) => {
                  const conditionLabel = s.weather.conditions?.[w.condition] ?? w.condition
                  const isTop = idx === 0
                  
                  return (
                    <div key={w.districtId} className={`relative overflow-hidden rounded-2xl border p-5 transition-all hover:shadow-md hover:-translate-y-0.5 ${isTop ? 'border-sky-200 bg-gradient-to-br from-white to-sky-50 shadow-sm' : 'border-slate-100 bg-white'}`}>
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <p className={`font-semibold ${isTop ? 'text-sky-900' : 'text-slate-700'}`}>{w.districtName}</p>
                          <p className={`mt-0.5 text-xs font-medium ${isTop ? 'text-sky-600' : 'text-slate-500'}`}>
                            {conditionLabel} • {Math.round(w.temperatureC)}°C
                          </p>
                        </div>
                        <div className={`flex h-8 w-8 items-center justify-center rounded-lg border shadow-inner ${isTop ? 'border-sky-200 bg-sky-100 text-sky-600' : 'border-slate-100 bg-slate-50 text-slate-400'}`}>
                          {w.trafficImpactPercent > 20 ? <AlertTriangle className="h-4 w-4" /> : <Map className="h-4 w-4" />}
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-end mb-2">
                          <span className={`text-[10px] font-bold uppercase tracking-wider ${isTop ? 'text-sky-500' : 'text-slate-400'}`}>
                            {s.weather.trafficImpact}
                          </span>
                          <span className={`text-lg font-bold ${isTop ? 'text-sky-700' : 'text-slate-600'}`}>
                            +{w.trafficImpactPercent}%
                          </span>
                        </div>
                        <div className={`h-1.5 w-full overflow-hidden rounded-full shadow-inner ${isTop ? 'bg-sky-100' : 'bg-slate-100'}`}>
                          <div 
                            className={`h-full rounded-full ${isTop ? 'bg-sky-500' : 'bg-slate-300'}`}
                            style={{ width: `${Math.min(100, w.trafficImpactPercent * 2.5)}%` }}
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
