import { useState, useEffect } from 'react'
import { Leaf, Gift, ArrowRight, Loader2 } from 'lucide-react'
import { getWalletBalance, generateVoucher } from '@/api/wallet'
import type { WalletBalance, VoucherResponse } from '@/types/api'
import { useAuth } from '@/context/AuthContext'
import { Navigate } from 'react-router-dom'

export default function WalletPage() {
  const { user, loading: authLoading } = useAuth()
  const [balance, setBalance] = useState<WalletBalance | null>(null)
  const [vouchers, setVouchers] = useState<VoucherResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return
    getWalletBalance()
      .then(setBalance)
      .catch(() => setError('Balans yüklənərkən xəta baş verdi.'))
      .finally(() => setLoading(false))
  }, [user])

  async function handleGenerateVoucher() {
    if (!balance || balance.ecoPointsBalance < 1000) return
    setGenerating(true)
    try {
      const v = await generateVoucher()
      setVouchers([v, ...vouchers])
      setBalance({
        ...balance,
        ecoPointsBalance: balance.ecoPointsBalance - v.pointsDeducted,
      })
    } catch {
      setError('Vaoçer yaradılarkən xəta baş verdi.')
    } finally {
      setGenerating(false)
    }
  }

  if (authLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-slate-300" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/" replace />
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-slate-300" />
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col overflow-y-auto bg-slate-50">
      <div className="mx-auto w-full max-w-4xl p-6">
        <h1 className="font-display text-3xl font-bold text-slate-900">Eko-Cüzdan</h1>
        <p className="mt-2 text-slate-500">Təbiətə verdiyiniz töhfələr və qazandığınız SOCAR vaoçerləri.</p>

        {error && (
          <div className="mt-4 rounded-xl bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {/* Balance Card */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 to-brand-800 p-8 text-white shadow-xl">
            <div className="absolute right-0 top-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
            <div className="relative">
              <div className="flex items-center gap-3">
                <Leaf className="h-8 w-8 text-brand-200" />
                <h2 className="font-display text-xl font-medium">Eco-Points Balansı</h2>
              </div>
              <div className="mt-6 flex items-baseline gap-2">
                <span className="font-display text-6xl font-bold tracking-tight">
                  {balance?.ecoPointsBalance ?? 0}
                </span>
                <span className="text-xl font-medium text-brand-200">XP</span>
              </div>
              <div className="mt-8 pt-6 border-t border-white/20 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-brand-200">Ümumi CO₂ Qənaəti</p>
                  <p className="mt-1 font-display text-2xl font-bold">
                    {balance?.totalCo2SavedKg?.toFixed(2) ?? '0.00'} kq
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Monetization Card */}
          <div className="flex flex-col rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
                <Gift className="h-6 w-6" />
              </div>
              <div>
                <h2 className="font-display text-xl font-bold text-slate-900">SOCAR Vaoçeri</h2>
                <p className="text-sm text-slate-500">1000 XP = 10 AZN Yanacaq Vaoçeri</p>
              </div>
            </div>

            <div className="mt-auto pt-8">
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium text-slate-700">Tərəqqi</span>
                  <span className="text-slate-500">
                    {Math.min(balance?.ecoPointsBalance ?? 0, 1000)} / 1000 XP
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full bg-orange-500 transition-all duration-500"
                    style={{
                      width: `${Math.min(((balance?.ecoPointsBalance ?? 0) / 1000) * 100, 100)}%`,
                    }}
                  />
                </div>
              </div>

              <button
                onClick={handleGenerateVoucher}
                disabled={generating || (balance?.ecoPointsBalance ?? 0) < 1000}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3 font-medium text-white transition-colors hover:bg-slate-800 disabled:bg-slate-100 disabled:text-slate-400"
              >
                {generating ? <Loader2 className="h-5 w-5 animate-spin" /> : <ArrowRight className="h-5 w-5" />}
                Vaoçer Yarat
              </button>
            </div>
          </div>
        </div>

        {/* Vouchers List */}
        {vouchers.length > 0 && (
          <div className="mt-12">
            <h3 className="font-display text-xl font-bold text-slate-900 mb-6">Aktiv Vaoçerlərim</h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {vouchers.map((v, i) => (
                <div key={i} className="rounded-2xl border border-orange-200 bg-orange-50 p-6 relative overflow-hidden">
                  <div className="absolute right-0 top-0 opacity-10">
                    <Gift className="h-24 w-24 -mr-4 -mt-4 text-orange-600" />
                  </div>
                  <p className="text-sm font-medium text-orange-600 mb-1">SOCAR Yanacaq Kartı</p>
                  <p className="font-mono text-xl font-bold tracking-wider text-slate-900 mb-4">{v.voucherCode}</p>
                  <p className="text-xs text-slate-500">
                    Yaradıldı: {new Date(v.issuedAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
