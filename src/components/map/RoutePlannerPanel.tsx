import { ArrowUpDown, Loader2, Route as RouteIcon, X, Leaf, ShieldCheck, Zap } from 'lucide-react'
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
  onStartTrip?: () => void
  onEndTrip?: () => void
  onPickOrigin?: () => void
  onPickDestination?: () => void
}

export function RoutePlannerPanel({
  visible,
  onClose,
  onReopen,
  origin,
  setOrigin,
  destination,
  setDestination,
  mode,
  setMode,
  route,
  loading,
  error,
  onSwap,
  onClear,
  onShowOnMap,
  tripActive,
  onStartTrip,
  onEndTrip,
  onPickOrigin,
  onPickDestination,
}: Props) {
  const { s } = useLocale()

  if (!visible) {
    return (
      <button
        onClick={onReopen}
        className="pointer-events-auto flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 shadow-float transition hover:border-brand-300 hover:text-brand-700"
      >
        <RouteIcon className="h-4 w-4 text-brand-600" />
        {s.routePlanner.reopen}
      </button>
    )
  }

  return (
    <div className="pointer-events-auto flex max-h-full w-[340px] max-w-full flex-col overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-float">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 px-4 py-3.5">
        <h2 className="font-display text-sm font-bold text-slate-900 dark:text-slate-50">{s.routePlanner.title}</h2>
        <button
          onClick={onClose}
          aria-label={s.common.close}
          className="rounded-full p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-400"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-shrink-0 px-4 py-3.5 z-10">
        <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">{s.routePlanner.origin}</label>
        <PlaceAutocomplete
          value={origin}
          onChange={setOrigin}
          placeholder={s.routePlanner.originPlaceholder}
          dotColor="#22c55e"
          onPickOnMap={onPickOrigin}
        />

        <div className="flex items-center justify-between pt-2.5">
          <label className="block text-xs font-medium text-slate-500 dark:text-slate-400">{s.routePlanner.destination}</label>
          <button
            onClick={onSwap}
            aria-label={s.routePlanner.swap}
            title={s.routePlanner.swap}
            className="rounded-full border border-slate-200 dark:border-slate-800 p-1.5 text-slate-400 transition hover:border-brand-300 hover:text-brand-600"
          >
            <ArrowUpDown className="h-3.5 w-3.5" />
          </button>
        </div>
        <div className="mt-1">
          <PlaceAutocomplete
            value={destination}
            onChange={setDestination}
            placeholder={s.routePlanner.destinationPlaceholder}
            dotColor="#ef4444"
            onPickOnMap={onPickDestination}
          />
        </div>

        <div className="mt-3.5 grid grid-cols-2 gap-2">
          {/* Fastest mode */}
          <button
            onClick={() => setMode('fastest')}
            className={`flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-semibold transition border ${
              mode === 'fastest'
                ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                : 'bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <Zap className="h-3.5 w-3.5" />
            {s.routePlanner.fastest}
          </button>

          {/* Eco mode */}
          <button
            onClick={() => setMode('eco')}
            className={`relative flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-semibold transition border ${
              mode === 'eco'
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:border-emerald-400'
            }`}
          >
            <Leaf className="h-3.5 w-3.5" />
            {s.routePlanner.eco ?? 'Eco'}
            {mode !== 'eco' && (
              <span className="absolute -top-1.5 -right-1 rounded-full bg-emerald-500 px-1 py-0.5 text-[9px] font-bold text-white leading-none">
                +XP
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="scroll-thin flex-1 overflow-y-auto px-4 pb-3.5">
        {!origin || !destination ? (
          <p className="rounded-xl bg-slate-50 dark:bg-slate-900/50 px-3 py-3 text-center text-xs text-slate-400">
            {s.routePlanner.pickBoth}
          </p>
        ) : loading ? (
          <div className="flex items-center justify-center gap-2 py-6 text-sm text-slate-400">
            <Loader2 className="h-4 w-4 animate-spin" />
            {s.routePlanner.calculating}
          </div>
        ) : error || !route ? (
          <p className="rounded-xl bg-red-50 px-3 py-3 text-center text-xs text-red-500">
            {s.routePlanner.error}
          </p>
        ) : (
          <RouteSummary route={route} mode={mode} />
        )}
      </div>

      <div className="space-y-2 border-t border-slate-100 dark:border-slate-800 px-4 py-3.5">
        {route && !tripActive && (
          <button
            onClick={onStartTrip}
            className="w-full rounded-xl bg-brand-600 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700"
          >
            {s.routePlanner.startTrip ?? 'Səfərə Başla'}
          </button>
        )}
        {route && tripActive && (
          <button
            onClick={onEndTrip}
            className="w-full rounded-xl bg-red-600 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 animate-pulse"
          >
            {s.routePlanner.endTrip ?? 'Səfəri Bitir'}
          </button>
        )}
        <button
          disabled={!route}
          onClick={onShowOnMap}
          className="w-full rounded-xl bg-slate-100 dark:bg-slate-800 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 shadow-sm transition hover:bg-slate-200 dark:hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {s.routePlanner.showOnMap}
        </button>
        <button
          onClick={onClear}
          disabled={!origin && !destination}
          className="w-full rounded-xl py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {s.routePlanner.clear}
        </button>
      </div>
    </div>
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

function RouteSummary({ route, mode }: { route: RouteResult; mode: RouteMode }) {
  const { s } = useLocale()
  const tone = trafficTone(route, s)
  const efficiencyPct = route.freeFlowTravelTimeSeconds
    ? clamp((route.freeFlowTravelTimeSeconds / Math.max(1, route.travelTimeSeconds)) * 100, 8, 100)
    : 85
  const baseline = route.forecast?.[0]?.minutes ?? route.travelTimeSeconds / 60
  const distKm = route.distanceMeters / 1000
  // Estimate eco points: ~2pts/km base for eco mode
  const estimatedEcoPoints = mode === 'eco' ? Math.round(distKm * 2) + 15 : 0

  return (
    <div className="mt-4 animate-fade-up">
      {/* Eco route banner */}
      {mode === 'eco' && (
        <div className="mb-3 rounded-xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-green-50 p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Leaf className="h-4 w-4 text-emerald-600" />
              <span className="text-sm font-bold text-emerald-800">Eco Marşrut</span>
            </div>
            <span className="rounded-full bg-emerald-600 px-2.5 py-0.5 text-xs font-bold text-white">
              ~+{estimatedEcoPoints} XP
            </span>
          </div>
          <p className="mt-1 text-xs text-emerald-700">
            Tıxacsız, qısa yol • CO₂ qənaəti • Xal qazanırsınız
          </p>
        </div>
      )}

      <div className="flex items-end justify-between">
        <div className="flex items-baseline gap-1.5">
          <span className="font-display text-3xl font-extrabold tabular-nums text-slate-900 dark:text-slate-50">
            {formatMinutes(route.travelTimeSeconds / 60)}
          </span>
          <span className="text-sm font-medium text-slate-400">{s.common.minutes}</span>
        </div>
        <span className={`text-xs font-semibold ${tone.className}`}>{tone.label}</span>
      </div>
      <p className="mt-0.5 text-xs text-slate-400">
        {formatKm(route.distanceMeters)} {s.common.km} {s.routePlanner.distance}
      </p>

      <p className="mt-2.5 text-[11px] font-medium text-slate-400">{s.routePlanner.routeLabel[mode] ?? mode}</p>
      <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
        <div
          className={`h-full rounded-full transition-all duration-700 ${mode === 'eco' ? 'bg-emerald-500' : 'bg-brand-500'}`}
          style={{ width: `${efficiencyPct}%` }}
        />
      </div>

      {route.forecast && (
        <div className="mt-4">
          <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">{s.routePlanner.forecastTitle}</p>
          <div className="mt-1.5 divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden rounded-xl border border-slate-100 dark:border-slate-800">
            {route.forecast.map((point) => (
              <ForecastRow key={point.offsetMinutes} point={point} baseline={baseline} />
            ))}
          </div>
        </div>
      )}

      {route.ecoPointsEarned != null && route.ecoPointsEarned > 0 && (
        <div className="mt-4 rounded-xl border border-green-200 bg-green-50 p-3">
          <div className="flex items-center gap-2">
            <Leaf className="h-4 w-4 text-green-600" />
            <span className="text-sm font-semibold text-green-800">
              +{route.ecoPointsEarned} Eco-Points
            </span>
          </div>
          {route.co2SavedKg != null && (
            <p className="mt-1 text-xs text-green-700">
              {route.co2SavedKg.toFixed(2)} kq CO₂ emissiyasına qənaət edildi.
            </p>
          )}
          {route.verraHash && (
            <div className="mt-2 flex items-center gap-1.5 opacity-60">
              <ShieldCheck className="h-3 w-3 text-green-700" />
              <p className="text-[10px] font-mono text-green-800 truncate" title={route.verraHash}>
                Verra Audit: {route.verraHash}
              </p>
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
