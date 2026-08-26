import { useState, useEffect } from 'react'
import {
  Leaf, Gift, ArrowRight, Loader2, Trophy, Flame, TrendingUp,
  Star, Zap, Shield, Map, Megaphone, ChevronRight, Plus, Minus,
} from 'lucide-react'
import { getWalletBalance, generateVoucher, getLeaderboard, getTransactions, getBadges } from '@/api/wallet'
import type { WalletBalance, VoucherResponse, LeaderboardEntry, EcoTransactionItem, BadgesResponse } from '@/types/api'
import { useAuth } from '@/context/AuthContext'
import { useLocale } from '@/i18n/LocaleContext'

// ─── Badge metadata ─────────────────────────────────────────────────────────
const BADGE_META: Record<string, { icon: React.ReactNode; title: string; desc: string; color: string }> = {
  FIRST_ROUTE:  { icon: <Map className="h-5 w-5" />,       title: 'Keşfiyyatçı',    desc: 'İlk marşrut',          color: 'from-blue-500 to-blue-600' },
  ECO_STARTER:  { icon: <Leaf className="h-5 w-5" />,      title: 'Eko Başlanğıc',  desc: '100 XP qazandı',       color: 'from-green-500 to-emerald-600' },
  GREEN_WEEK:   { icon: <Flame className="h-5 w-5" />,     title: 'Yaşıl Həftə',    desc: '7 gün ardıcıl',        color: 'from-orange-500 to-red-500' },
  CO2_FIGHTER:  { icon: <Shield className="h-5 w-5" />,    title: 'CO₂ Döyüşçüsü', desc: '10 kq CO₂ azaltdı',    color: 'from-teal-500 to-cyan-600' },
  CHAMPION:     { icon: <Trophy className="h-5 w-5" />,    title: 'Çempion',         desc: '5000 XP topladı',      color: 'from-yellow-500 to-amber-500' },
  REPORTER:     { icon: <Megaphone className="h-5 w-5" />, title: 'Xəbərçi',         desc: 'İlk hadisə bildirişi', color: 'from-purple-500 to-violet-600' },
}

const ALL_BADGES = Object.keys(BADGE_META)

// ─── Rank tiers ─────────────────────────────────────────────────────────────
function getRank(pts: number) {
  if (pts >= 5000) return { label: 'Legend',    color: '#f59e0b', next: Infinity, tier: 4 }
  if (pts >= 2000) return { label: 'Champion',  color: '#8b5cf6', next: 5000, tier: 3 }
  if (pts >= 800)  return { label: 'Guardian',  color: '#3b82f6', next: 2000, tier: 2 }
  if (pts >= 200)  return { label: 'Explorer',  color: '#10b981', next: 800,  tier: 1 }
  return              { label: 'Beginner',   color: '#6b7280', next: 200,  tier: 0 }
}

// ─── Tx type icon & color ────────────────────────────────────────────────────
function txMeta(type: string) {
  switch (type) {
    case 'ROUTE':          return { icon: <Map      className="h-3.5 w-3.5" />, color: 'text-brand-600',  bg: 'bg-brand-50' }
    case 'STREAK_BONUS':   return { icon: <Flame    className="h-3.5 w-3.5" />, color: 'text-orange-600', bg: 'bg-orange-50' }
    case 'BADGE_BONUS':    return { icon: <Star     className="h-3.5 w-3.5" />, color: 'text-yellow-600', bg: 'bg-yellow-50' }
    case 'REPORT':         return { icon: <Megaphone className="h-3.5 w-3.5" />, color: 'text-purple-600', bg: 'bg-purple-50' }
    case 'VOUCHER_REDEEM': return { icon: <Gift     className="h-3.5 w-3.5" />, color: 'text-red-600',    bg: 'bg-red-50' }
    default:               return { icon: <Zap      className="h-3.5 w-3.5" />, color: 'text-slate-600',  bg: 'bg-slate-50' }
  }
}

// ─── Main component ──────────────────────────────────────────────────────────
export default function WalletPage() {
  const { user, loading: authLoading } = useAuth()
  const { s: t } = useLocale()

  const [balance,     setBalance]     = useState<WalletBalance | null>(null)
  const [vouchers,    setVouchers]    = useState<VoucherResponse[]>([])
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [transactions,setTransactions]= useState<EcoTransactionItem[]>([])
  const [earnedBadges,setEarnedBadges]= useState<string[]>([])
  const [loading,     setLoading]     = useState(true)
  const [generating,  setGenerating]  = useState(false)
  const [error,       setError]       = useState<string | null>(null)

  useEffect(() => {
    if (!user) return
    Promise.all([
      getWalletBalance(),
      getLeaderboard(),
      getTransactions(),
      getBadges(),
    ])
      .then(([bal, lb, txs, bdg]) => {
        setBalance(bal)
        setLeaderboard(lb)
        setTransactions(txs)
        setEarnedBadges(bdg.earned ?? [])
      })
      .catch(() => setError(t.walletPage.errorLoad))
      .finally(() => setLoading(false))
  }, [user])

  async function handleGenerateVoucher() {
    if (!balance || balance.ecoPointsBalance < 1000) return
    setGenerating(true)
    try {
      const v = await generateVoucher()
      setVouchers([v, ...vouchers])
      setBalance({ ...balance, ecoPointsBalance: balance.ecoPointsBalance - v.pointsDeducted })
    } catch {
      setError(t.walletPage.errorVoucher)
    } finally {
      setGenerating(false)
    }
  }

  // ── Loading / auth states ──────────────────────────────────────────────────
  if (authLoading || (user && loading)) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-slate-300" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex h-full flex-col items-center justify-center bg-slate-50 p-6 text-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-brand-100">
          <Leaf className="h-10 w-10 text-brand-600" />
        </div>
        <h2 className="mb-3 font-display text-2xl font-bold text-slate-900">{t.walletPage.loggedOutTitle}</h2>
        <p className="max-w-sm text-slate-500">{t.walletPage.loggedOutDesc}</p>
      </div>
    )
  }

  const pts     = balance?.ecoPointsBalance ?? 0
  const streak  = balance?.currentStreak    ?? 0
  const co2     = balance?.totalCo2SavedKg  ?? 0
  const trips   = balance?.totalTripsCount  ?? 0
  const rank    = getRank(pts)
  const nextPts = rank.next === Infinity ? pts : rank.next
  const rankPct = rank.next === Infinity ? 100 : Math.round((pts / nextPts) * 100)

  return (
    <div className="flex h-full flex-col overflow-y-auto bg-slate-50">
      <div className="mx-auto w-full max-w-5xl space-y-8 p-6 pb-16">

        {/* ── Page Header ─────────────────────────────────────────────── */}
        <div>
          <h1 className="font-display text-3xl font-bold text-slate-900">{t.walletPage.title}</h1>
          <p className="mt-1 text-slate-500">{t.walletPage.subtitle}</p>
        </div>

        {error && (
          <div className="rounded-xl bg-red-50 p-4 text-sm text-red-600">{error}</div>
        )}

        {/* ── 1. HERO STATS (3 cards) ──────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-4">
          {/* XP Balance */}
          <div className="relative col-span-3 overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 to-brand-800 p-7 text-white shadow-xl sm:col-span-1">
            <div className="absolute -right-8 -top-8 h-36 w-36 rounded-full bg-white/10 blur-3xl" />
            <div className="relative">
              <div className="flex items-center gap-2 text-brand-200">
                <Leaf className="h-4 w-4" />
                <span className="text-xs font-semibold uppercase tracking-wider">Eco XP</span>
              </div>
              <p className="mt-3 font-display text-5xl font-bold tracking-tight">{pts.toLocaleString()}</p>
              <p className="mt-1 text-sm text-brand-200">xal</p>
            </div>
          </div>

          {/* Streak */}
          <div className="col-span-3 flex flex-col justify-between rounded-3xl bg-gradient-to-br from-orange-500 to-red-500 p-7 text-white shadow-md sm:col-span-1">
            <div className="flex items-center gap-2 text-orange-100">
              <Flame className="h-4 w-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">Ardıcıl Gün</span>
            </div>
            <p className="mt-3 font-display text-5xl font-bold">{streak}</p>
            <p className="text-sm text-orange-100">gün</p>
          </div>

          {/* CO₂ */}
          <div className="col-span-3 flex flex-col justify-between rounded-3xl bg-gradient-to-br from-teal-500 to-emerald-600 p-7 text-white shadow-md sm:col-span-1">
            <div className="flex items-center gap-2 text-teal-100">
              <Shield className="h-4 w-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">CO₂ Qənaəti</span>
            </div>
            <p className="mt-3 font-display text-5xl font-bold">{Number(co2).toFixed(1)}</p>
            <p className="text-sm text-teal-100">kq</p>
          </div>
        </div>

        {/* ── 2. RANK & PROGRESS ─────────────────────────────────────────── */}
        <div className="rounded-3xl bg-white p-7 shadow-sm ring-1 ring-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Cari Rütbə</p>
              <p className="mt-1 font-display text-3xl font-bold" style={{ color: rank.color }}>
                {rank.label}
              </p>
            </div>
            <div className="flex gap-2">
              {['Beginner','Explorer','Guardian','Champion','Legend'].map((r, i) => (
                <div
                  key={r}
                  title={r}
                  className={`h-2 w-8 rounded-full transition-all ${i <= rank.tier ? 'opacity-100' : 'opacity-20'}`}
                  style={{ backgroundColor: rank.color }}
                />
              ))}
            </div>
          </div>

          <div className="mt-6">
            <div className="mb-2 flex justify-between text-xs text-slate-500">
              <span>{pts.toLocaleString()} XP</span>
              <span>{rank.next === Infinity ? 'Maksimum Rütbə 🏆' : `${rank.next.toLocaleString()} XP`}</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${rankPct}%`, backgroundColor: rank.color }}
              />
            </div>
            {rank.next !== Infinity && (
              <p className="mt-2 text-xs text-slate-400">
                Növbəti rütbəyə {(rank.next - pts).toLocaleString()} XP qalır
              </p>
            )}
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 border-t border-slate-100 pt-5 sm:grid-cols-4">
            {[
              { label: 'Ümumi Marşrut', value: trips, unit: 'gediş' },
              { label: 'Ümumi Məsafə', value: `${Number(balance?.totalDistanceKm ?? 0).toFixed(0)}`, unit: 'km' },
              { label: 'Ən Uzun Seriya', value: streak, unit: 'gün' },
              { label: 'Badge Sayı', value: earnedBadges.length, unit: 'nailiyyət' },
            ].map(s => (
              <div key={s.label} className="text-center">
                <p className="font-display text-2xl font-bold text-slate-900">{s.value}</p>
                <p className="text-xs text-slate-400">{s.unit}</p>
                <p className="text-[10px] text-slate-300">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── 3. BADGES ───────────────────────────────────────────────────── */}
        <div className="rounded-3xl bg-white p-7 shadow-sm ring-1 ring-slate-200">
          <h2 className="font-display text-xl font-bold text-slate-900">Nailiyyətlər</h2>
          <p className="mt-1 text-sm text-slate-500">
            {earnedBadges.length}/{ALL_BADGES.length} badge qazanılmış
          </p>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {ALL_BADGES.map(code => {
              const meta    = BADGE_META[code]
              const earned  = earnedBadges.includes(code)
              return (
                <div
                  key={code}
                  title={`${meta.title} — ${meta.desc}`}
                  className={`group relative flex flex-col items-center rounded-2xl p-4 text-center transition-all ${
                    earned
                      ? 'ring-2 ring-green-400 ring-offset-1'
                      : 'opacity-40 grayscale'
                  }`}
                >
                  <div className={`flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br text-white ${meta.color}`}>
                    {meta.icon}
                  </div>
                  <p className="mt-2 text-xs font-semibold text-slate-700 leading-tight">{meta.title}</p>
                  <p className="mt-0.5 text-[10px] text-slate-400">{meta.desc}</p>
                  {earned && (
                    <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-green-500 text-[9px] text-white">✓</span>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* ── 4. LEADERBOARD ─────────────────────────────────────────────── */}
        {leaderboard.length > 0 && (
          <div className="rounded-3xl bg-white p-7 shadow-sm ring-1 ring-slate-200">
            <div className="flex items-center gap-3">
              <Trophy className="h-5 w-5 text-amber-500" />
              <h2 className="font-display text-xl font-bold text-slate-900">Reytinq Cədvəli</h2>
            </div>
            <div className="mt-5 space-y-2">
              {leaderboard.map(entry => (
                <div
                  key={entry.rank}
                  className={`flex items-center gap-4 rounded-2xl px-4 py-3 transition-colors ${
                    entry.isCurrentUser
                      ? 'bg-brand-50 ring-1 ring-brand-200'
                      : 'hover:bg-slate-50'
                  }`}
                >
                  <span className={`w-7 text-center font-display text-lg font-bold ${
                    entry.rank === 1 ? 'text-amber-500' :
                    entry.rank === 2 ? 'text-slate-400' :
                    entry.rank === 3 ? 'text-orange-600' : 'text-slate-300'
                  }`}>
                    {entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : entry.rank}
                  </span>
                  <span className="flex-1 truncate font-medium text-slate-800">
                    {entry.displayName}
                    {entry.isCurrentUser && <span className="ml-1.5 text-xs text-brand-500">(siz)</span>}
                  </span>
                  <span className="text-sm font-bold text-slate-900">{entry.ecoPoints.toLocaleString()} XP</span>
                  <span className="hidden text-xs text-slate-400 sm:block">{Number(entry.co2Saved).toFixed(1)} kq</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── 5. TRANSACTION HISTORY ─────────────────────────────────────── */}
        {transactions.length > 0 && (
          <div className="rounded-3xl bg-white p-7 shadow-sm ring-1 ring-slate-200">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-5 w-5 text-brand-600" />
              <h2 className="font-display text-xl font-bold text-slate-900">Son Əməliyyatlar</h2>
            </div>
            <div className="mt-5 space-y-2">
              {transactions.map(tx => {
                const m = txMeta(tx.type)
                return (
                  <div key={tx.id} className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-slate-50">
                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${m.bg} ${m.color}`}>
                      {m.icon}
                    </div>
                    <p className="flex-1 truncate text-sm text-slate-700">{tx.description}</p>
                    <span className={`shrink-0 text-sm font-bold ${tx.amount >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                      {tx.amount >= 0 ? '+' : ''}{tx.amount} XP
                    </span>
                    <span className="hidden shrink-0 text-xs text-slate-400 sm:block">
                      {new Date(tx.createdAt).toLocaleDateString('az-AZ')}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ── 6. SOCAR VOUCHER ─────────────────────────────────────────── */}
        <div className="rounded-3xl bg-white p-7 shadow-sm ring-1 ring-slate-200">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
              <Gift className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <h2 className="font-display text-xl font-bold text-slate-900">{t.walletPage.monetizationTitle}</h2>
              <p className="text-sm text-slate-500">{t.walletPage.monetizationDesc}</p>
            </div>
          </div>

          <div className="mt-6">
            <div className="mb-2 flex justify-between text-sm">
              <span className="font-medium text-slate-700">{t.walletPage.progress}</span>
              <span className="text-slate-500">{Math.min(pts, 1000).toLocaleString()} / 1000 XP</span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full bg-orange-500 transition-all duration-700"
                style={{ width: `${Math.min((pts / 1000) * 100, 100)}%` }}
              />
            </div>
          </div>

          <button
            onClick={handleGenerateVoucher}
            disabled={generating || pts < 1000}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-6 py-3.5 font-semibold text-white transition-colors hover:bg-slate-800 disabled:bg-slate-100 disabled:text-slate-400"
          >
            {generating ? <Loader2 className="h-5 w-5 animate-spin" /> : <ArrowRight className="h-5 w-5" />}
            {t.walletPage.generateVoucher}
          </button>

          {vouchers.length > 0 && (
            <div className="mt-8 space-y-3">
              <h3 className="font-display text-lg font-bold text-slate-900">{t.walletPage.myVouchers}</h3>
              {vouchers.map((v, i) => (
                <div key={i} className="flex items-center gap-4 rounded-2xl border border-orange-200 bg-orange-50 p-5">
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-orange-500">{t.walletPage.fuelCard}</p>
                    <p className="mt-0.5 font-mono text-base font-bold tracking-wider text-slate-900">{v.voucherCode}</p>
                  </div>
                  <p className="text-xs text-slate-400">{new Date(v.issuedAt).toLocaleDateString('az-AZ')}</p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
