import { useState } from 'react'
import { predictTraffic } from '@/api/traffic'
import type { TrafficForecast, DayOfWeek } from '@/types/api'
import { Sparkles, Clock, Calendar, MapPin, Loader2, Info } from 'lucide-react'
import { useLocale } from '@/i18n/LocaleContext'

// Hardcoded segments matching SampleDataSeeder.java for demo
const SEGMENTS = [
  { id: '11111111-1111-1111-1111-111111111111', name: 'Neftchiler Prospect' },
  { id: '22222222-2222-2222-2222-222222222222', name: 'Koroglu Metro Corridor' },
  { id: '33333333-3333-3333-3333-333333333333', name: 'Ziya Bunyadov' },
  { id: '44444444-4444-4444-4444-444444444444', name: 'Nobel Prospect' },
  { id: '55555555-5555-5555-5555-555555555555', name: '28 May Corridor' },
]

const DAYS_OF_WEEK: DayOfWeek[] = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']

export function AiPredictionPanel() {
  const { s } = useLocale()
  const [segmentId, setSegmentId] = useState(SEGMENTS[0].id)
  const [dayOfWeek, setDayOfWeek] = useState<DayOfWeek>('MONDAY')
  const [hour, setHour] = useState(18) // Default to 6 PM peak
  const [loading, setLoading] = useState(false)
  const [forecast, setForecast] = useState<TrafficForecast | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handlePredict = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await predictTraffic(segmentId, dayOfWeek, hour)
      setForecast(data)
    } catch (err: any) {
      setError(err?.message || 'Proqnoz alınarkən xəta baş verdi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full h-full flex flex-col rounded-[2rem] bg-white/60 dark:bg-slate-900/60 p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white dark:border-slate-700/60 backdrop-blur-xl overflow-hidden relative transition-all hover:bg-white/80 dark:hover:bg-slate-900/80 duration-500">
      {/* Decorative gradient blob */}
      <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-brand-500/10 blur-3xl"></div>
      
      <div className="flex items-center gap-3 mb-6 relative z-10">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-100 text-brand-600">
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <h2 className="font-display text-lg font-bold text-slate-900 dark:text-slate-50">{s.aiAnalytics.predictionTitle}</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">{s.aiAnalytics.predictionSubtitle}</p>
        </div>
      </div>

      <div className="space-y-4 relative z-10">
        {/* Road Segment Select */}
        <div>
          <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-slate-700 dark:text-slate-300">
            <MapPin className="h-3.5 w-3.5 text-slate-400" /> {s.aiAnalytics.road}
          </label>
          <select
            value={segmentId}
            onChange={(e) => setSegmentId(e.target.value)}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 px-3 py-2.5 text-sm text-slate-900 dark:text-slate-50 focus:border-brand-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-brand-500"
          >
            {SEGMENTS.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>

        <div className="flex gap-4">
          {/* Day of Week */}
          <div className="flex-1">
            <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-slate-700 dark:text-slate-300">
              <Calendar className="h-3.5 w-3.5 text-slate-400" /> {s.aiAnalytics.day}
            </label>
            <select
              value={dayOfWeek}
              onChange={(e) => setDayOfWeek(e.target.value as DayOfWeek)}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 px-3 py-2.5 text-sm text-slate-900 dark:text-slate-50 focus:border-brand-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-brand-500"
            >
              {DAYS_OF_WEEK.map((d) => (
                <option key={d} value={d}>{s.aiAnalytics.days[d]}</option>
              ))}
            </select>
          </div>

          {/* Hour */}
          <div className="flex-1">
            <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-slate-700 dark:text-slate-300">
              <Clock className="h-3.5 w-3.5 text-slate-400" /> {s.aiAnalytics.hour}
            </label>
            <select
              value={hour}
              onChange={(e) => setHour(Number(e.target.value))}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 px-3 py-2.5 text-sm text-slate-900 dark:text-slate-50 focus:border-brand-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-brand-500"
            >
              {Array.from({ length: 24 }).map((_, i) => (
                <option key={i} value={i}>
                  {i.toString().padStart(2, '0')}:00
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={handlePredict}
          disabled={loading}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 dark:bg-slate-100 px-4 py-3 text-sm font-medium text-white dark:text-slate-900 transition-all hover:bg-slate-800 dark:hover:bg-slate-200 disabled:opacity-70"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4 text-brand-400" />}
          {s.aiAnalytics.calculate}
        </button>

        {error && (
          <div className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Forecast Result */}
        {forecast && !loading && (
          <div className="mt-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 p-4">
              
              <div className="flex justify-between items-end mb-4">
                <div>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">{s.aiAnalytics.predictedSpeed}</p>
                  <div className="flex items-baseline gap-1">
                    <span className={`text-3xl font-display font-bold ${
                      forecast.predictedSpeedKmh > 40 ? 'text-green-600' : 
                      forecast.predictedSpeedKmh > 20 ? 'text-amber-500' : 'text-red-500'
                    }`}>
                      {Math.round(forecast.predictedSpeedKmh)}
                    </span>
                    <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">km/s</span>
                  </div>
                </div>
                
                <div className="text-right">
                   <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">{s.aiAnalytics.predictedCongestion}</p>
                   <span className="text-xl font-bold text-slate-900 dark:text-slate-50">{forecast.predictedCongestionLevel}%</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden mb-4">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ${
                    forecast.predictedCongestionLevel > 70 ? 'bg-red-500' : 
                    forecast.predictedCongestionLevel > 40 ? 'bg-amber-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${forecast.predictedCongestionLevel}%` }}
                ></div>
              </div>

              {/* AI Explanation */}
              <div className="flex gap-2 rounded-xl bg-white dark:bg-slate-900 p-3 border border-slate-100 dark:border-slate-800">
                <Info className="h-4 w-4 text-brand-500 shrink-0 mt-0.5" />
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  <span className="font-medium text-slate-900 dark:text-slate-50 block mb-0.5">Modelin Şərhi:</span>
                  {forecast.explanation}
                </p>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  )
}
