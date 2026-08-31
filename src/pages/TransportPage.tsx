import { TrainFront, Bus } from 'lucide-react'
import { useLocale } from '@/i18n/LocaleContext'
import { useTransitNetwork } from '@/hooks/useTransitNetwork'
import { PageHeader } from '@/components/common/PageHeader'
import { ErrorState, LoadingState } from '@/components/common/States'
import { TransitMiniMap } from '@/components/transit/TransitMiniMap'
import { stationsForLine } from '@/lib/transit'

export default function TransportPage() {
  const { s } = useLocale()
  const { data, loading, error, refetch } = useTransitNetwork()

  return (
    <div className="scroll-thin h-full overflow-y-auto p-4 sm:p-6">
      <PageHeader title={s.transportPage.title} subtitle={s.transportPage.subtitle} />

      {loading && !data ? (
        <LoadingState />
      ) : error || !data ? (
        <ErrorState onRetry={refetch} />
      ) : (
        <>
          <div className="mt-5 h-72 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm sm:h-96">
            <TransitMiniMap network={data} />
          </div>

          <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm sm:p-5">
              <p className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                <TrainFront className="h-4 w-4 text-slate-400" />
                {s.transportPage.metro}
              </p>
              <div className="mt-3 space-y-3">
                {data.metro.lines.map((line) => {
                  const stations = stationsForLine(data.metro.stations, line)
                  return (
                    <div key={line.name} className="rounded-xl border border-slate-100 dark:border-slate-800 p-3">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: line.color }} />
                          {line.name}
                        </span>
                        <span className="text-xs text-slate-400">
                          {stations.length} {s.transportPage.stations}
                        </span>
                      </div>
                      <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">{stations.map((st) => st.name).join(' · ')}</p>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm sm:p-5">
              <p className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                <Bus className="h-4 w-4 text-slate-400" />
                {s.transportPage.buses}
              </p>
              <div className="mt-3 space-y-3">
                {data.buses.map((route) => (
                  <div key={route.name} className="rounded-xl border border-slate-100 dark:border-slate-800 p-3">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: route.color }} />
                        {route.name}
                      </span>
                      <span className="text-xs text-slate-400">
                        {route.stops.length} {s.transportPage.stops}
                      </span>
                    </div>
                    <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">{route.stops.join(' · ')}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
