import { useState } from 'react'
import { ArrowUpDown, Loader2, Route as RouteIcon, X, Leaf, ShieldCheck, Zap, ChevronDown, ChevronUp, Navigation, Info } from 'lucide-react'
import { useLocale } from '@/i18n/LocaleContext'
import { PlaceAutocomplete } from './PlaceAutocomplete'
import type { PlaceResult } from '@/components/layout/GlobalSearch'
import type { ForecastPoint, RouteResult } from '@/hooks/useRoutePlanner'
import type { RouteMode } from '@/types/api'
import { clamp, formatKm, formatMinutes } from '@/lib/format'

interface Props {
  visible: boolean
  onClose: () => void
  onReopen: () => void
  origin: PlaceResult | null
  setOrigin: (p: PlaceResult | null) => void
  destination: PlaceResult | null
  setDestination: (p: PlaceResult | null) => void
  mode: RouteMode
  setMode: (m: RouteMode) => void
  route: RouteResult | null
  loading: boolean
  error: string | null
  onSwap: () => void
  onClear: () => void
  onShowOnMap: () => void
  tripActive?: boolean
  isEcoIdentical?: boolean
  onStartTrip?: () => void
  onEndTrip?: () => void
  onCancelTrip?: () => void
  onPickOrigin?: () => void
  onPickDestination?: () => void
}

export function RoutePlannerPanel({
  visible, onClose, onReopen,
  origin, setOrigin, destination, setDestination,
  mode, setMode, route, loading, error,
  onSwap, onClear, onShowOnMap,
  tripActive, isEcoIdentical, onStartTrip, onEndTrip, onCancelTrip, onPickOrigin, onPickDestination,
}: Props) {
  const { s } = useLocale()
  const [detailsOpen, setDetailsOpen] = useState(false)

  if (!visible) {
    return (
      <button
        onClick={onReopen}
        className="pointer-events-auto flex items-center gap-2 rounded-full border border-white/30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 shadow-lg transition hover:bg-white dark:hover:bg-slate-900 active:scale-95"
      >
        <RouteIcon className="h-4 w-4 text-brand-600" />
        {s.routePlanner.reopen}
      </button>
    )
  }

  const hasRoute = !!route && !loading && !error
  const distKm = route ? route.distanceMeters / 1000 : 0
  const estimatedEcoPoints = mode === 'eco' ? Math.round(distKm * 2) + 15 : 0

  if (tripActive) {
    return (
      <div className="pointer-events-auto fixed bottom-[calc(env(safe-area-inset-bottom)+4.5rem)] left-3 right-3 z-[1200] sm:static sm:bottom-auto sm:w-[340px]">
        <div className="rounded-2xl bg-slate-900/95 dark:bg-slate-950/95 backdrop-blur-md border border-white/10 shadow-2xl px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`h-2.5 w-2.5 rounded-full ${mode === 'eco' ? 'bg-emerald-400' : 'bg-brand-400'} animate-pulse`} />
            <div>
              <p className="text-xs font-bold text-white">{mode === 'eco' ? '🌿 Eco Marsrut' : 'Sürətli Marsrut'}</p>
              {route && (
                <p className="text-[10px] text-white/60">{formatKm(route.distanceMeters)} km · {formatMinutes(route.travelTimeSeconds / 60)} {s.common.minutes}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {onCancelTrip && (
              <button
                onClick={onCancelTrip}
                className="rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700/80 px-2.5 py-1.5 text-xs font-semibold text-slate-300 hover:text-white transition active:scale-95"
              >
                {s.routePlanner.cancelTrip ?? s.common.cancel}
              </button>
            )}
            <button
              onClick={onEndTrip}
              className="rounded-xl bg-red-500 hover:bg-red-600 px-3 py-1.5 text-xs font-bold text-white transition active:scale-95"
            >
              {s.routePlanner.endTrip ?? 'Bitdi'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* MOBILE PANEL */}
      <div className="pointer-events-auto fixed bottom-[calc(env(safe-area-inset-bottom)+5rem)] left-2 right-2 z-[1200] sm:hidden">
        {mode === 'eco' && hasRoute && (
          <div className="mx-1 mb-2 flex items-center justify-between rounded-2xl bg-emerald-600 px-4 py-2 shadow-lg animate-fade-up">
            <div className="flex items-center gap-2">
              <Leaf className="h-4 w-4 text-white" />
              <span className="text-sm font-bold text-white">Eco Marsrut aktiv</span>
            </div>
            <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-extrabold text-white">+{estimatedEcoPoints} XP</span>
          </div>
        )}
        <div className="rounded-3xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/80 dark:border-slate-700/80 shadow-2xl overflow-hidden">
          <div className="flex justify-center pt-3 pb-1">
            <div className="h-1 w-10 rounded-full bg-slate-300 dark:bg-slate-600" />
          </div>
          <div className="flex items-center justify-between px-4 pt-2 pb-3">
            <h2 className="font-display text-sm font-bold text-slate-900 dark:text-slate-50">{s.routePlanner.title}</h2>
            <button onClick={onClose} className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="px-4 space-y-2 pb-3">
            <PlaceAutocomplete value={origin} onChange={setOrigin} placeholder={s.routePlanner.originPlaceholder} dotColor="#22c55e" onPickOnMap={onPickOrigin} />
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <PlaceAutocomplete value={destination} onChange={setDestination} placeholder={s.routePlanner.destinationPlaceholder} dotColor="#ef4444" onPickOnMap={onPickDestination} />
              </div>
              <button onClick={onSwap} className="shrink-0 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-slate-500 shadow-sm transition hover:border-brand-300 hover:text-brand-600">
                <ArrowUpDown className="h-4 w-4" />
              </button>
            </div>
            {isEcoIdentical && (
              <div className="mt-2 flex items-start gap-2 rounded-xl bg-blue-50/90 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-800/60 p-2.5 text-xs text-blue-700 dark:text-blue-300">
                <Info className="h-4 w-4 shrink-0 mt-0.5 text-blue-500" />
                <p className="font-medium leading-relaxed">
                  {s.routePlanner.routesIdenticalMessage}
                </p>
              </div>
            )}
            <div className={`grid ${isEcoIdentical ? 'grid-cols-1' : 'grid-cols-2'} gap-2 pt-2`}>
              <button onClick={() => setMode('fastest')} className={`flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-semibold transition border ${mode === 'fastest' ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 border-slate-900 dark:border-slate-100 shadow-md' : 'bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-400'}`}>
                <Zap className="h-4 w-4" />{s.routePlanner.fastest}
              </button>
              {!isEcoIdentical && (
                <button onClick={() => setMode('eco')} className={`relative flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-semibold transition border ${mode === 'eco' ? 'bg-emerald-600 text-white border-emerald-600 shadow-md' : 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 hover:border-emerald-400'}`}>
                  <Leaf className="h-4 w-4" />{s.routePlanner.eco ?? 'Eco'}
                  {mode !== 'eco' && <span className="absolute -top-1.5 -right-1.5 rounded-full bg-emerald-500 px-1.5 py-0.5 text-[9px] font-bold text-white shadow-sm leading-none">+XP</span>}
                </button>
              )}
            </div>
          </div>
          {!origin || !destination ? (
            <p className="px-4 pb-5 text-center text-xs text-slate-400">{s.routePlanner.pickBoth}</p>
          ) : loading ? (
            <div className="flex items-center justify-center gap-2 pb-5 text-sm text-slate-400">
              <Loader2 className="h-5 w-5 animate-spin" />{s.routePlanner.calculating}
            </div>
          ) : error || !route ? (
            <p className="mx-4 mb-5 rounded-xl bg-red-50 dark:bg-red-900/20 px-3 py-2.5 text-center text-xs text-red-500">{s.routePlanner.error}</p>
          ) : (
            <>
              <div className="mx-4 mb-3 flex items-center justify-between rounded-2xl bg-slate-50 dark:bg-slate-800/80 px-4 py-3 shadow-inner">
                <div>
                  <p className="font-display text-2xl font-extrabold tabular-nums text-slate-900 dark:text-slate-50">
                    {formatMinutes(route.travelTimeSeconds / 60)}<span className="text-sm font-medium text-slate-400 ml-1">{s.common.minutes}</span>
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">{formatKm(route.distanceMeters)} {s.common.km}</p>
                </div>
                <button onClick={() => setDetailsOpen(v => !v)} className="flex items-center gap-1 rounded-lg bg-white dark:bg-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 shadow-sm transition active:scale-95">
                  {detailsOpen ? 'Bağla' : 'Ətraflı'}{detailsOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
              </div>
              {detailsOpen && (
                <div className="px-4 pb-3 animate-fade-up">
                  <RouteSummaryDetails route={route} mode={mode} />
                </div>
              )}
              <div className="grid grid-cols-2 gap-2 px-4 pb-4 mt-2">
                <button onClick={onShowOnMap} className="rounded-xl bg-slate-100 dark:bg-slate-800 py-3 text-sm font-semibold text-slate-700 dark:text-slate-300 shadow-sm transition hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95">
                  {s.routePlanner.showOnMap}
                </button>
                <button onClick={onStartTrip} className={`flex items-center justify-center gap-1.5 rounded-xl py-3 text-sm font-bold text-white shadow-md transition active:scale-95 ${mode === 'eco' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-brand-600 hover:bg-brand-700'}`}>
                  <Navigation className="h-4 w-4" />{s.routePlanner.startTrip ?? 'Başla'}
                </button>
              </div>
            </>
          )}
          {(origin || destination) && !tripActive && (
            <div className="px-4 pb-4">
              <button onClick={onClear} className="w-full rounded-xl py-2 text-xs font-semibold text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition">
                {s.routePlanner.clear}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* DESKTOP PANEL */}
      <div className="hidden sm:flex pointer-events-auto flex-col overflow-hidden bg-white dark:bg-slate-900 shadow-float text-sm static max-h-[85vh] w-[340px] max-w-full rounded-2xl border border-slate-200 dark:border-slate-800 z-[1200]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 px-4 py-3.5 relative">
          <h2 className="font-display text-sm font-bold text-slate-900 dark:text-slate-50">{s.routePlanner.title}</h2>
          <button onClick={onClose} className="rounded-full p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
            <X className="h-4 w-4" />
          </button>
        </div>
        
        {/* Inputs */}
        <div className="flex-none px-4 py-4 relative">
          <PlaceAutocomplete value={origin} onChange={setOrigin} placeholder={s.routePlanner.originPlaceholder} dotColor="#22c55e" onPickOnMap={onPickOrigin} />
          <div className="my-2 flex justify-end pr-2">
            <button onClick={onSwap} className="shrink-0 rounded-full border border-slate-200 dark:border-slate-700 p-1.5 text-slate-400 transition hover:border-brand-300 hover:text-brand-600">
              <ArrowUpDown className="h-3.5 w-3.5" />
            </button>
          </div>
          <PlaceAutocomplete value={destination} onChange={setDestination} placeholder={s.routePlanner.destinationPlaceholder} dotColor="#ef4444" onPickOnMap={onPickDestination} />
          
          {isEcoIdentical && (
            <div className="mt-3 flex items-start gap-2.5 rounded-xl bg-blue-50/90 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-800/60 p-3 text-xs text-blue-700 dark:text-blue-300 shadow-sm animate-fade-in">
              <Info className="h-4 w-4 shrink-0 mt-0.5 text-blue-500" />
              <p className="font-medium leading-relaxed">
                {s.routePlanner.routesIdenticalMessage}
              </p>
            </div>
          )}

          <div className={`mt-3 grid ${isEcoIdentical ? 'grid-cols-1' : 'grid-cols-2'} gap-2`}>
            <button onClick={() => setMode('fastest')} className={`flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-semibold transition border ${mode === 'fastest' ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 border-slate-900 dark:border-slate-100 shadow-sm' : 'bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-400'}`}>
              <Zap className="h-3.5 w-3.5" />{s.routePlanner.fastest}
            </button>
            {!isEcoIdentical && (
              <button onClick={() => setMode('eco')} className={`relative flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-semibold transition border ${mode === 'eco' ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm' : 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 hover:border-emerald-400'}`}>
                <Leaf className="h-3.5 w-3.5" />{s.routePlanner.eco ?? 'Eco'}
                {mode !== 'eco' && <span className="absolute -top-1.5 -right-1 rounded-full bg-emerald-500 px-1 py-0.5 text-[9px] font-bold text-white leading-none">+XP</span>}
              </button>
            )}
          </div>
        </div>

        {/* Content (Scrollable) */}
        <div className="scroll-thin flex-1 overflow-y-auto px-4 pb-4">
          {!origin || !destination ? (
            <div className="py-8 text-center text-slate-400">
              <RouteIcon className="mx-auto mb-2 h-8 w-8 opacity-20" />
              <p>{s.routePlanner.pickBoth}</p>
            </div>
          ) : loading ? (
            <div className="flex flex-col items-center justify-center py-8 text-slate-400">
              <Loader2 className="mb-2 h-6 w-6 animate-spin" />
              <p>{s.routePlanner.calculating}</p>
            </div>
          ) : error || !route ? (
            <div className="rounded-xl bg-red-50 dark:bg-red-900/20 p-4 text-center text-red-500">{s.routePlanner.error}</div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-xl bg-slate-50 dark:bg-slate-800/50 p-4">
                <div>
                  <p className="font-display text-3xl font-extrabold tabular-nums text-slate-900 dark:text-slate-50">
                    {formatMinutes(route.travelTimeSeconds / 60)}<span className="text-sm font-medium text-slate-500 ml-1">{s.common.minutes}</span>
                  </p>
                  <p className="text-sm text-slate-500 mt-1">{formatKm(route.distanceMeters)} {s.common.km}</p>
                </div>
                {mode === 'eco' && (
                  <div className="flex flex-col items-end gap-1">
                    <span className="rounded-full bg-emerald-100 dark:bg-emerald-900/40 px-2.5 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-400">+{estimatedEcoPoints} XP</span>
                    <Leaf className="h-5 w-5 text-emerald-500" />
                  </div>
                )}
              </div>
              <RouteSummaryDetails route={route} mode={mode} />
            </div>
          )}
        </div>

        {/* Footer */}
        {(origin || destination) && (
          <div className="space-y-2 border-t border-slate-100 dark:border-slate-800 px-4 py-3.5">
            {hasRoute && (
              <div className="grid grid-cols-2 gap-2">
                <button onClick={onShowOnMap} className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 transition hover:bg-slate-50 dark:hover:bg-slate-800">
                  {s.routePlanner.showOnMap}
                </button>
                <button onClick={onStartTrip} className={`flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-sm font-bold text-white shadow-sm transition active:scale-95 ${mode === 'eco' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-brand-600 hover:bg-brand-700'}`}>
                  <Navigation className="h-4 w-4" />{s.routePlanner.startTrip ?? 'Başla'}
                </button>
              </div>
            )}
            <button onClick={onClear} className="w-full py-2 text-xs font-semibold text-slate-400 hover:text-red-500 transition">
              {s.routePlanner.clear}
            </button>
          </div>
        )}
      </div>
    </>
  )
}

function trafficTone(route: RouteResult, s: ReturnType<typeof useLocale>['s']) {
  const ratio = route.trafficDelaySeconds / Math.max(1, route.travelTimeSeconds)
  if (ratio < 0.08) return { label: s.routePlanner.trafficLight, className: 'text-emerald-600' }
  if (ratio < 0.22) return { label: s.routePlanner.trafficModerate, className: 'text-amber-600' }
  return { label: s.routePlanner.trafficHeavy, className: 'text-red-600' }
}

function forecastTone(minutes: number, baseline: number): string {
  const ratio = minutes / Math.max(0.1, baseline)
  if (ratio <= 1.08) return 'text-emerald-600'
  if (ratio <= 1.25) return 'text-amber-600'
  return 'text-red-600'
}

function RouteSummaryDetails({ route, mode }: { route: RouteResult; mode: RouteMode }) {
  const { s } = useLocale()
  const tone = trafficTone(route, s)
  const efficiencyPct = route.freeFlowTravelTimeSeconds
    ? clamp((route.freeFlowTravelTimeSeconds / Math.max(1, route.travelTimeSeconds)) * 100, 8, 100)
    : 85
  const baseline = route.forecast?.[0]?.minutes ?? route.travelTimeSeconds / 60

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-500 dark:text-slate-400">{s.routePlanner.routeLabel?.[mode] ?? mode}</span>
        <span className={`font-semibold ${tone.className}`}>{tone.label}</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
        <div className={`h-full rounded-full transition-all duration-700 ${mode === 'eco' ? 'bg-emerald-500' : 'bg-brand-500'}`} style={{ width: `${efficiencyPct}%` }} />
      </div>
      {route.forecast && (
        <div>
          <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">{s.routePlanner.forecastTitle}</p>
          <div className="divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden rounded-xl border border-slate-100 dark:border-slate-800">
            {route.forecast.map((point) => (
              <ForecastRow key={point.offsetMinutes} point={point} baseline={baseline} />
            ))}
          </div>
        </div>
      )}
      {route.ecoPointsEarned != null && route.ecoPointsEarned > 0 && (
        <div className="rounded-xl border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 p-3">
          <div className="flex items-center gap-2">
            <Leaf className="h-4 w-4 text-green-600 dark:text-green-400" />
            <span className="text-sm font-semibold text-green-800 dark:text-green-300">+{route.ecoPointsEarned} Eco-Points</span>
          </div>
          {route.co2SavedKg != null && (
            <p className="mt-1 text-xs text-green-700 dark:text-green-400">{route.co2SavedKg.toFixed(2)} kq CO2 qənaəti</p>
          )}
          {route.verraHash && (
            <div className="mt-2 flex items-center gap-1.5 opacity-60">
              <ShieldCheck className="h-3 w-3 text-green-700 dark:text-green-400" />
              <p className="text-[10px] font-mono text-green-800 dark:text-green-400 truncate" title={route.verraHash}>Verra: {route.verraHash}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function ForecastRow({ point, baseline }: { point: ForecastPoint; baseline: number }) {
  const { s } = useLocale()
  const label = point.offsetMinutes === 0 ? s.routePlanner.now : `+${point.offsetMinutes} ${s.routePlanner.min}`
  return (
    <div className="flex items-center justify-between bg-white dark:bg-slate-900 px-3 py-2 text-sm">
      <span className="text-slate-500 dark:text-slate-400">{label}</span>
      <span className={`font-semibold tabular-nums ${forecastTone(point.minutes, baseline)}`}>
        {formatMinutes(point.minutes)} {s.routePlanner.minutesShort}
      </span>
    </div>
  )
}
