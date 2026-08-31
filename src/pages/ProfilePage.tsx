import { useState, useEffect } from 'react'
import { User, Mail, Phone, Plus, Car, Fuel, Zap, Leaf, MapPin, Star, LogOut, CheckCircle, ArrowRight, Loader2, ShieldCheck, X } from 'lucide-react'
import { GoogleLogin } from '@react-oauth/google'
import { useAuth } from '@/context/AuthContext'
import { useLocale } from '@/i18n/LocaleContext'
import { useTheme } from '@/context/ThemeContext'
import { getWalletBalance } from '@/api/wallet'
import { sendOtp, updateProfile } from '@/api/auth'
import type { WalletBalance } from '@/types/api'

const getVehicleConfig = (t: any) => ({
  PETROL: { label: t.profilePage.vehicleTypes.PETROL, icon: Fuel, multiplier: '1x', color: 'text-slate-500 dark:text-slate-400' },
  DIESEL: { label: t.profilePage.vehicleTypes.DIESEL, icon: Fuel, multiplier: '1.16x', color: 'text-slate-600 dark:text-slate-400' },
  HYBRID: { label: t.profilePage.vehicleTypes.HYBRID, icon: Zap, multiplier: '0.7x', color: 'text-blue-500' },
  ELECTRIC: { label: t.profilePage.vehicleTypes.ELECTRIC, icon: Leaf, multiplier: '0x', color: 'text-green-500' },
  NONE: { label: t.profilePage.vehicleTypes.NONE, icon: Car, multiplier: '1x', color: 'text-slate-400' },
})

// в”Ђв”Ђв”Ђ Add Phone Modal (with OTP verification) в”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђ

// ─── Add Phone Modal (with OTP verification) ──────────────────────────────────
function AddPhoneModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  type Step = 'PHONE' | 'OTP' | 'SUCCESS'
  const [step, setStep] = useState<Step>('PHONE')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault()
    if (!phone.trim()) { setError('Telefon nömrəsini daxil edin'); return }
    if (!/^\+?[0-9]{10,15}$/.test(phone.trim())) { setError('Düzgün format daxil edin (məs: +994501234567)'); return }
    setError(null)
    setLoading(true)
    try {
      await sendOtp(phone.trim())
      setStep('OTP')
    } catch (err: any) {
      setError(err?.message || 'Xəta baş verdi')
    } finally {
      setLoading(false)
    }
  }

  async function handleVerifyAndSave(e: React.FormEvent) {
    e.preventDefault()
    if (otp.length !== 6) { setError('6 rəqəmli kodu daxil edin'); return }
    setError(null)
    setLoading(true)
    try {
      const res = await fetch('/api/v1/auth/verify-otp', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json', ...(localStorage.getItem('waygo_token') ? { Authorization: `Bearer ${localStorage.getItem('waygo_token')}` } : {}) },
        body: JSON.stringify({ phoneNumber: phone.trim(), otp }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body?.error || 'OTP kodu yanlışdır')
      }
      await updateProfile({ phoneNumber: phone.trim() })
      setStep('SUCCESS')
    } catch (err: any) {
      setError(err?.message || 'Kod yanlışdır')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center bg-slate-900/40 px-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white dark:bg-slate-900 shadow-xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-400 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="p-6 sm:p-8">
          <div className="mb-6">
            <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-slate-50">
              {step === 'PHONE' && 'Telefon əlavə et'}
              {step === 'OTP' && 'Kodu Təsdiqləyin'}
              {step === 'SUCCESS' && 'Uğurlu!'}
            </h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              {step === 'PHONE' && 'Hesabınıza nömrə bağlamaq üçün telefon nömrənizi daxil edin.'}
              {step === 'OTP' && (
                <>
                  Kodu almaq üçün Telegram-da{' '}
                  <a href="https://t.me/waygo_login_bot" target="_blank" rel="noopener noreferrer" className="font-semibold text-brand-600 hover:underline">
                    @waygo_login_bot
                  </a>{' '}
                  botuna keçid edin və nömrənizi paylaşın.
                </>
              )}
              {step === 'SUCCESS' && 'Telefon nömrəniz profilinizə uğurla əlavə edildi.'}
            </p>
          </div>

          {error && (
            <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {step === 'PHONE' && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Mobil Nömrə</label>
                <input
                  type="tel"
                  required
                  autoFocus
                  value={phone}
                  onChange={(e) => { setPhone(e.target.value); setError(null) }}
                  placeholder="+994 50 123 45 67"
                  className="mt-1 block w-full rounded-xl border border-slate-200 dark:border-slate-800 px-4 py-2.5 text-slate-900 dark:text-slate-50 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>
              <button
                type="submit"
                disabled={loading || !phone}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 font-medium text-white transition-colors hover:bg-brand-700 disabled:opacity-70"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                Kodu göndər
              </button>
            </form>
          )}

          {step === 'OTP' && (
            <form onSubmit={handleVerifyAndSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">6 rəqəmli kod</label>
                <input
                  type="text"
                  inputMode="numeric"
                  required
                  autoFocus
                  maxLength={6}
                  value={otp}
                  onChange={(e) => { setOtp(e.target.value.replace(/\D/g, '')); setError(null) }}
                  placeholder="------"
                  className="mt-1 block w-full rounded-xl border border-slate-200 dark:border-slate-800 px-4 py-2.5 text-center tracking-[0.5em] text-slate-900 dark:text-slate-50 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>
              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 font-medium text-white transition-colors hover:bg-brand-700 disabled:opacity-70"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                Təsdiqlə
              </button>
              <button
                type="button"
                onClick={() => { setStep('PHONE'); setOtp(''); setError(null) }}
                className="mt-2 w-full text-center text-sm font-medium text-brand-600 hover:underline"
              >
                Fərqli nömrə ilə cəhd et
              </button>
            </form>
          )}

          {step === 'SUCCESS' && (
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
              <button
                onClick={() => { onSuccess(); onClose() }}
                className="w-full rounded-xl bg-brand-600 px-4 py-2.5 font-medium text-white transition-colors hover:bg-brand-700"
              >
                Bağla
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Add Email Modal (Google OAuth verification) ──────────────────────────────
function AddEmailModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  type Step = 'CONNECT' | 'SUCCESS'
  const [step, setStep] = useState<Step>('CONNECT')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { refreshUser } = useAuth()

  async function handleGoogleSuccess(credentialResponse: any) {
    if (!credentialResponse.credential) { setError('Google ilə bağlantı uğursuz oldu'); return }
    setLoading(true)
    setError(null)
    try {
      // Decode email from the JWT credential safely to avoid atob padding errors
      const base64Url = credentialResponse.credential.split('.')[1]
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      }).join(''))
      const payload = JSON.parse(jsonPayload)
      const googleEmail = payload.email
      
      if (!googleEmail) throw new Error('E-poçt ünvanı alınamadı')
      
      // Save the email to user profile
      await updateProfile({ email: googleEmail })
      await refreshUser()
      setStep('SUCCESS')
    } catch (e: any) {
      setError(e?.message || 'Xəta baş verdi. Zəhmət olmasa daha sonra cəhd edin.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center bg-slate-900/40 px-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white dark:bg-slate-900 shadow-xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-400 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="p-6 sm:p-8">
          <div className="mb-6">
            <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-slate-50">
              {step === 'CONNECT' && 'Google ilə əlavə et'}
              {step === 'SUCCESS' && 'Uğurlu!'}
            </h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              {step === 'CONNECT' && 'Google hesabınıza bağlanaraq e-poçt ünvanınızı profilinizə əlavə edin.'}
              {step === 'SUCCESS' && 'E-poçt ünvanınız profilinizə uğurla əlavə edildi.'}
            </p>
          </div>

          {error && (
            <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {step === 'CONNECT' && (
            <div className="flex justify-center py-4">
              {loading ? (
                <div className="flex h-[40px] w-full items-center justify-center rounded-full bg-slate-50 dark:bg-slate-900/50">
                  <Loader2 className="h-5 w-5 animate-spin text-brand-500" />
                </div>
              ) : (
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => setError('Google giriş xətası')}
                  useOneTap={false}
                  shape="pill"
                  size="large"
                  text="continue_with"
                />
              )}
            </div>
          )}

          {step === 'SUCCESS' && (
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
              <button
                onClick={() => { onSuccess(); onClose() }}
                className="w-full rounded-xl bg-brand-600 px-4 py-2.5 font-medium text-white transition-colors hover:bg-brand-700"
              >
                Bağla
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ProfilePage() {
  const { user, isAdmin, logout, refreshUser } = useAuth()
  const { s: t } = useLocale()
  const { theme, toggleTheme } = useTheme()
  const [balance, setBalance] = useState<WalletBalance | null>(null)
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false)
  const [addPhoneOpen, setAddPhoneOpen] = useState(false)
  const [addEmailOpen, setAddEmailOpen] = useState(false)

  useEffect(() => {
    if (user) {
      getWalletBalance().then(setBalance).catch(console.error)
    }
  }, [user])

  if (!user) {
    return (
      <div className="flex h-full flex-col overflow-y-auto bg-slate-50 dark:bg-slate-900/50">
        <div className="mx-auto flex w-full max-w-4xl flex-col items-center justify-center min-h-[60vh] p-6 text-center">
          <User className="mb-6 h-16 w-16 text-blue-400" strokeWidth={1.5} />
          <h2 className="mb-3 font-display text-2xl font-bold text-slate-900 dark:text-slate-50">
            {t.profilePage.loggedOutTitle}
          </h2>
          <p className="max-w-md text-slate-500 dark:text-slate-400">
            {t.profilePage.loggedOutDesc}
          </p>
        </div>
      </div>
    )
  }

  const vType = user.vehicleType || 'PETROL'
  const config = getVehicleConfig(t)[vType as keyof ReturnType<typeof getVehicleConfig>] || getVehicleConfig(t)['PETROL']
  const VehicleIcon = config.icon

  return (
    <div className="flex h-full flex-col bg-slate-50/50 dark:bg-slate-950">
      <div className="flex-1 overflow-y-auto pb-12 pt-8 sm:pt-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Main Profile Card */}
          <div className="rounded-3xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl shadow-2xl shadow-slate-200/50 dark:shadow-none ring-1 ring-slate-100 dark:ring-slate-800 p-6 sm:p-8">

            {/* Avatar & Name */}
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 sm:gap-8 border-b border-slate-100 dark:border-slate-800/60 dark:border-slate-800 pb-8">
              <div className="relative h-32 w-32 shrink-0 rounded-[2rem] bg-white dark:bg-slate-900 dark:bg-slate-800 p-2 shadow-lg ring-1 ring-slate-100 dark:ring-slate-800 dark:ring-slate-700">
                <div className="flex h-full w-full items-center justify-center rounded-3xl bg-gradient-to-br from-brand-50 to-brand-100 text-brand-600">
                  <User className="h-12 w-12" />
                </div>
                <div className="absolute bottom-1 right-1 h-5 w-5 rounded-full border-4 border-white dark:border-slate-700 bg-green-500" />
              </div>

              <div className="flex flex-col items-center sm:items-start flex-1 text-center sm:text-left">
                <h1 className="font-display text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50 dark:text-white">{user.fullName || user.username}</h1>
                {!isAdmin && (
                  <div className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-emerald-700 dark:bg-emerald-900/30 dark:border-emerald-800 dark:text-emerald-400">
                    <Leaf className="h-4 w-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">{t.profilePage.ecoDriver}</span>
                  </div>
                )}
              </div>

              <div className="hidden sm:flex flex-col gap-2">
                <button
                  onClick={toggleTheme}
                  className="group flex items-center justify-center gap-2 rounded-xl bg-slate-100 dark:bg-slate-800 px-5 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-400 shadow-sm border border-slate-200 dark:border-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700"
                >
                  {theme === 'dark' ? '☀️ Gündüz rejimi' : '🌙 Gecə rejimi'}
                </button>
                <button
                  onClick={() => setIsLogoutModalOpen(true)}
                  className="group flex items-center justify-center gap-2 rounded-xl bg-white dark:bg-slate-900 px-5 py-2.5 text-sm font-bold text-brand-600 shadow-sm border border-brand-100 hover:bg-brand-50 hover:text-brand-700 hover:border-brand-200 hover:shadow transition-all dark:bg-slate-800 dark:border-brand-900/50 dark:hover:bg-slate-800/80"
                >
                  <LogOut className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
                  {t.profilePage.logout}
                </button>
              </div>
            </div>

            {/* Stats */}
            {!isAdmin && (
              <div className="mt-8 grid grid-cols-3 gap-5">
                <div className="group relative col-span-3 sm:col-span-1 overflow-hidden rounded-[32px] bg-gradient-to-br from-blue-500 to-blue-700 p-7 text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/30">
                  <div className="absolute right-0 top-0 -mr-4 -mt-4 h-32 w-32 rounded-full bg-white/10 dark:bg-slate-900/10 blur-2xl transition-transform duration-500 group-hover:scale-150" />
                  <div className="relative mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 dark:bg-slate-900/20 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
                    <MapPin className="h-5 w-5 text-blue-50" />
                  </div>
                  <div className="relative">
                    <p className="font-display text-4xl font-black tracking-tight text-white">{balance?.totalDistanceKm?.toLocaleString() ?? 0}</p>
                    <p className="mt-1 text-[11px] font-bold uppercase tracking-widest text-blue-100">{t.profilePage.totalKm}</p>
                  </div>
                </div>

                <div className="group relative col-span-3 sm:col-span-1 overflow-hidden rounded-[32px] bg-gradient-to-br from-emerald-400 to-teal-600 p-7 text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-500/30">
                  <div className="absolute right-0 top-0 -mr-4 -mt-4 h-32 w-32 rounded-full bg-white/10 dark:bg-slate-900/10 blur-2xl transition-transform duration-500 group-hover:scale-150" />
                  <div className="relative mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 dark:bg-slate-900/20 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
                    <Leaf className="h-5 w-5 text-emerald-50" />
                  </div>
                  <div className="relative">
                    <p className="font-display text-4xl font-black tracking-tight text-white">{balance?.totalCo2SavedKg?.toLocaleString(undefined, { maximumFractionDigits: 1 }) ?? 0} <span className="text-xl text-emerald-100/70 font-bold">kg</span></p>
                    <p className="mt-1 text-[11px] font-bold uppercase tracking-widest text-emerald-100">{t.profilePage.totalCo2}</p>
                  </div>
                </div>

                <div className="group relative col-span-3 sm:col-span-1 overflow-hidden rounded-[32px] bg-gradient-to-br from-brand-500 to-brand-700 p-7 text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-500/30">
                  <div className="absolute right-0 top-0 -mr-4 -mt-4 h-32 w-32 rounded-full bg-white/10 dark:bg-slate-900/10 blur-2xl transition-transform duration-700 group-hover:scale-150" />
                  <div className="relative mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 dark:bg-slate-900/20 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
                    <Star className="h-5 w-5 text-brand-50" fill="currentColor" />
                  </div>
                  <div className="relative">
                    <p className="font-display text-4xl font-black tracking-tight text-white">{balance?.ecoPointsBalance?.toLocaleString() ?? 0}</p>
                    <p className="mt-1 text-[11px] font-bold uppercase tracking-widest text-brand-100">{t.profilePage.ecoPoints}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Contact & Vehicle grid */}
            {!isAdmin && (
              <div className="mt-8 grid gap-8 sm:grid-cols-2">
                {/* Contact info */}
                <div className="space-y-4">
                  <h4 className="font-display text-lg font-bold text-slate-900 dark:text-slate-50 dark:text-white">{t.profilePage.contactInfo}</h4>
                  <div className="flex flex-col gap-3">

                    {/* Email row */}
                    <div className="group flex items-center justify-between rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 dark:bg-slate-800/50 p-4 hover:bg-white dark:hover:bg-slate-900 dark:hover:bg-slate-800 hover:shadow-md hover:border-slate-200 dark:hover:border-slate-800 transition-all">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white dark:bg-slate-900 dark:bg-slate-700 shadow-sm border border-slate-100 dark:border-slate-800 dark:border-slate-600 group-hover:scale-105 group-hover:shadow transition-all shrink-0">
                          <Mail className="h-5 w-5 text-slate-400 group-hover:text-brand-500 transition-colors" />
                        </div>
                        <div>
                          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-0.5">{t.profilePage.email}</p>
                          {user.email ? (
                            <p className="text-sm font-bold text-slate-900 dark:text-slate-50 dark:text-white break-all">{user.email}</p>
                          ) : (
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); setAddEmailOpen(true) }}
                              className="flex items-center gap-1 text-sm font-bold text-brand-600 dark:text-brand-400 hover:text-brand-700 transition-colors"
                            >
                              <Plus className="h-4 w-4" /> {t.profilePage.add}
                            </button>
                          )}
                        </div>
                      </div>
                      {user.email && (
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-green-50 dark:bg-green-900/30 shrink-0">
                          <CheckCircle className="h-4 w-4 text-green-500 dark:text-green-400" />
                        </div>
                      )}
                    </div>

                    {/* Phone row */}
                    <div className="group flex items-center justify-between rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 dark:bg-slate-800/50 p-4 hover:bg-white dark:hover:bg-slate-900 dark:hover:bg-slate-800 hover:shadow-md hover:border-slate-200 dark:hover:border-slate-800 transition-all">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white dark:bg-slate-900 dark:bg-slate-700 shadow-sm border border-slate-100 dark:border-slate-800 dark:border-slate-600 group-hover:scale-105 group-hover:shadow transition-all shrink-0">
                          <Phone className="h-5 w-5 text-slate-400 group-hover:text-brand-500 transition-colors" />
                        </div>
                        <div>
                          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-0.5">{t.profilePage.phone}</p>
                          {user.phone ? (
                            <p className="text-sm font-bold text-slate-900 dark:text-slate-50 dark:text-white">{user.phone}</p>
                          ) : (
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); setAddPhoneOpen(true) }}
                              className="flex items-center gap-1 text-sm font-bold text-brand-600 hover:text-brand-700 transition-colors"
                            >
                              <Plus className="h-4 w-4" /> {t.profilePage.add}
                            </button>
                          )}
                        </div>
                      </div>
                      {user.phone && (
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-green-50 shrink-0">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        </div>
                      )}
                    </div>

                  </div>
                </div>

                {/* Vehicle info */}
                <div className="space-y-4">
                  <h4 className="font-display text-lg font-bold text-slate-900 dark:text-slate-50">{t.profilePage.vehicleInfo}</h4>
                  <div className="group rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 p-6 hover:bg-white dark:hover:bg-slate-900 hover:shadow-md hover:border-slate-200 dark:hover:border-slate-800 transition-all relative overflow-hidden">
                    <div className="absolute top-0 right-0 opacity-[0.02] transform translate-x-1/4 -translate-y-1/4 group-hover:scale-110 group-hover:opacity-[0.04] transition-all duration-500">
                      <VehicleIcon className="w-48 h-48" />
                    </div>
                    <div className="relative flex items-center justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800 group-hover:scale-105 group-hover:shadow transition-all">
                          <VehicleIcon className={`h-7 w-7 ${config.color}`} />
                        </div>
                        <div>
                          <p className="text-base font-bold text-slate-900 dark:text-slate-50">{config.label}</p>
                          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{t.profilePage.engineType}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="rounded-full bg-brand-100 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-brand-700 shadow-sm">
                          {config.multiplier} {t.profilePage.multiplier}
                        </span>
                        <span className="mt-1.5 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">{t.profilePage.ecoPointGain}</span>
                      </div>
                    </div>
                    {user.plateNumber && (
                      <div className="relative mt-4 border-t border-slate-200 dark:border-slate-800 pt-5 flex justify-between items-center">
                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{t.profilePage.plateNumber}:</span>
                        <span className="font-mono text-sm font-bold bg-white dark:bg-slate-900 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">{user.plateNumber}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Mobile Logout */}
            <div className="mt-8 block sm:hidden">
              <button
                onClick={() => setIsLogoutModalOpen(true)}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-white dark:bg-slate-900 px-5 py-3 text-sm font-bold text-brand-600 shadow-sm border border-brand-100 hover:bg-brand-50 transition-all"
              >
                <LogOut className="h-4 w-4" />
                {t.profilePage.logout}
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Logout Modal */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4">
          <button aria-label="Close" onClick={() => setIsLogoutModalOpen(false)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
          <div className="relative w-full max-w-lg animate-fade-up rounded-[2rem] bg-white dark:bg-slate-900 shadow-2xl p-8 sm:p-10 overflow-hidden ring-1 ring-slate-100 dark:ring-slate-800">
            <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-brand-50/50 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-12 -left-12 h-48 w-48 rounded-full bg-slate-50/80 blur-2xl pointer-events-none" />
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-brand-50 text-brand-600 ring-8 ring-brand-50/50">
                <LogOut className="h-10 w-10 ml-1" />
              </div>
              <h2 className="font-display text-3xl font-extrabold text-slate-900 dark:text-slate-50 mb-2">{t.profilePage.logoutConfirmTitle}</h2>
              <p className="text-slate-500 dark:text-slate-400 text-lg mb-10 max-w-sm mx-auto">{t.profilePage.logoutConfirmDesc}</p>
              <div className="flex w-full flex-col sm:flex-row justify-center gap-4">
                <button onClick={() => setIsLogoutModalOpen(false)} className="flex-1 rounded-2xl px-6 py-4 text-base font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all">
                  {t.profilePage.logoutConfirmNo}
                </button>
                <button onClick={logout} className="flex-1 rounded-2xl px-6 py-4 text-base font-bold text-white bg-brand-600 hover:bg-brand-700 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                  {t.profilePage.logoutConfirmYes}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Phone Modal */}
      {addPhoneOpen && (
        <AddPhoneModal
          onClose={() => setAddPhoneOpen(false)}
          onSuccess={() => refreshUser()}
        />
      )}

      {/* Add Email Modal */}
      {addEmailOpen && (
        <AddEmailModal
          onClose={() => setAddEmailOpen(false)}
          onSuccess={() => refreshUser()}
        />
      )}
    </div>
  )
}
