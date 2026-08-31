import { useEffect, useState } from 'react'
import { Trophy, Medal, Award, TrendingUp, Leaf } from 'lucide-react'
import { getLeaderboard } from '@/api/wallet'
import type { LeaderboardEntry } from '@/types/api'

const RANK_STYLES: Record<number, { bg: string; icon: any; badge: string }> = {
  1: { bg: 'bg-gradient-to-r from-yellow-400/20 to-amber-500/20 border-amber-300', icon: Trophy, badge: '🥇' },
  2: { bg: 'bg-gradient-to-r from-slate-300/20 to-gray-400/20 border-slate-300', icon: Medal, badge: '🥈' },
  3: { bg: 'bg-gradient-to-r from-orange-400/20 to-amber-600/20 border-orange-300', icon: Award, badge: '🥉' },
}

export function LeaderboardPanel() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getLeaderboard()
      .then(res => setEntries(Array.isArray(res) ? res : (res as any).data || res || []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex h-48 items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-brand-500"></div>
      </div>
    )
  }

  if (entries.length === 0) {
    return (
      <div className="flex h-48 flex-col items-center justify-center text-slate-400">
        <Trophy className="mb-2 h-8 w-8" />
        <p className="text-sm font-medium">Hələ rəqabət yoxdur</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100">
          <Trophy className="h-5 w-5 text-amber-600" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Top Sürücülər</h3>
          <p className="text-xs text-slate-400">Bu ayın ən yaxşı eco sürücüləri</p>
        </div>
      </div>

      {entries.map((entry) => {
        const style = RANK_STYLES[entry.rank]
        const isTop3 = entry.rank <= 3

        return (
          <div
            key={entry.rank}
            className={`flex items-center gap-3 rounded-xl border p-3 transition hover:shadow-sm ${isTop3 ? style?.bg : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'}`}
          >
            <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-black ${isTop3 ? 'bg-white/50 text-slate-800' : 'bg-slate-100 dark:bg-slate-700 text-slate-500'}`}>
              {isTop3 ? style?.badge : entry.rank}
            </div>

            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-200">{entry.name}</p>
              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" /> {entry.totalDistanceKm} km
                </span>
                <span className="flex items-center gap-1">
                  <Leaf className="h-3 w-3" /> {entry.co2SavedKg} kq CO₂
                </span>
              </div>
            </div>

            <div className="text-right">
              <p className="text-sm font-black text-brand-600">{entry.ecoPoints.toLocaleString()}</p>
              <p className="text-[10px] font-bold uppercase text-slate-400">xal</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
