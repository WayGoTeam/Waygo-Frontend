import { useState, useEffect } from 'react'
import { X, Loader2, CheckCircle2 } from 'lucide-react'
import { sendOtp, verifyOtp, onboarding, checkUser, setPassword, loginWithGoogle } from '@/api/auth'
import { useAuth } from '@/context/AuthContext'
import type { VehicleType } from '@/types/api'

interface Props {
  onClose: () => void
}

type Step = 'PHONE' | 'PASSWORD' | 'OTP' | 'SET_PASSWORD' | 'ONBOARDING' | 'SUCCESS'

export function OtpLoginModal({ onClose }: Props) {
  const { login, refreshUser } = useAuth()
  const [step, setStep] = useState<Step>('PHONE')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [passwordInput, setPasswordInput] = useState('')
  const [vehicleType, setVehicleType] = useState<VehicleType>('PETROL')
  const [plate, setPlate] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const [oauthLoading, setOauthLoading] = useState<'google' | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Load Google Identity Services SDK
  useEffect(() => {
    if (typeof window !== 'undefined' && !(window as any).google) {
      const script = document.createElement('script')
      script.src = 'https://accounts.google.com/gsi/client'
      script.async = true
      document.head.appendChild(script)
    }
  }, [])

  async function handleCheckUser(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await checkUser(phone)
      if (res.exists && res.hasPassword) {
        setStep('PASSWORD')
      } else {
        await sendOtp(phone)
        setStep('OTP')
      }
    } catch (err: any) {
      if (err?.message) {
        setError(err.message)
      } else {
        setError('Sistem xətası baş verdi.')
      }
    } finally {
      setLoading(false)
    }
  }

  async function handleLoginPassword(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await login(phone, passwordInput)
      setStep('SUCCESS')
    } catch (err: any) {
      setError('Parol yanlışdır.')
    } finally {
      setLoading(false)
    }
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await verifyOtp(phone, otp)
      await refreshUser()
      setStep('SET_PASSWORD')
    } catch (err: any) {
      if (err?.message) {
        setError(err.message)
      } else {
        setError('OTP yanlışdır və ya müddəti bitib.')
      }
    } finally {
      setLoading(false)
    }
  }

  async function handleSetPassword(e: React.FormEvent) {
    e.preventDefault()
    if (passwordInput.length < 6) {
      setError('Parol ən azı 6 simvol olmalıdır')
      return
    }
    setLoading(true)
    setError(null)
    try {
      await setPassword(passwordInput)
      setStep('ONBOARDING')
    } catch (err: any) {
      setError('Parol təyin edilərkən xəta baş verdi.')
    } finally {
      setLoading(false)
    }
  }

  async function handleOnboarding(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await onboarding(vehicleType, plate, fullName)
      await refreshUser()
      setStep('SUCCESS')
    } catch {
      setError('Məlumatlar yadda saxlanılmadı.')
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogleLogin() {
    setOauthLoading('google')
    setError(null)
    try {
      const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
      if (!googleClientId || googleClientId.startsWith('REPLACE')) {
        setError('Google login hələ aktiv edilməyib. Telegram ilə giriş edin.')
        return
      }
      await new Promise<void>((resolve, reject) => {
        ;(window as any).google.accounts.id.initialize({
          client_id: googleClientId,
          callback: async (response: { credential: string }) => {
            try {
              const res = await loginWithGoogle(response.credential)
              await refreshUser()
              if (res.fullName) {
                setFullName(res.fullName)
              }
              if (res.needsOnboarding) {
                setStep('ONBOARDING')
              } else {
                setStep('SUCCESS')
              }
              resolve()
            } catch (err: any) {
              reject(err)
            }
          },
        })
        ;(window as any).google.accounts.id.prompt()
      })
    } catch (err: any) {
      setError(err?.message || 'Google ilə giriş uğursuz oldu.')
    } finally {
      setOauthLoading(null)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="p-6 sm:p-8">
          <div className="mb-6">
            <h2 className="font-display text-2xl font-bold text-slate-900">
              {step === 'PHONE' && 'Giriş və ya Qeydiyyat'}
              {step === 'PASSWORD' && 'Şifrənizi daxil edin'}
              {step === 'OTP' && 'Kodu Təsdiqləyin'}
              {step === 'SET_PASSWORD' && 'Şifrə təyin edin'}
              {step === 'ONBOARDING' && 'Avtomobil Profiliniz'}
              {step === 'SUCCESS' && 'Uğurlu!'}
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              {step === 'PHONE' && 'Davam etmək üçün mobil nömrənizi daxil edin.'}
              {step === 'PASSWORD' && 'Hesabınıza daxil olmaq üçün parolunuzu yazın.'}
              {step === 'OTP' && (
                <>
                  Kodu almaq üçün Telegram-da{' '}
                  <a href="https://t.me/waygo_login_bot" target="_blank" rel="noopener noreferrer" className="font-semibold text-brand-600 hover:underline">
                    @waygo_login_bot
                  </a>{' '}
                  botuna keçid edin və nömrənizi paylaşın.
                </>
              )}
              {step === 'SET_PASSWORD' && 'Növbəti dəfə rahat giriş etmək üçün yeni şifrə təyin edin.'}
              {step === 'ONBOARDING' && 'Eko-Xal qazanmaq üçün avtomobilinizi qeyd edin.'}
              {step === 'SUCCESS' && 'Siz artıq sistemə daxil olmusunuz.'}
            </p>
          </div>

          {error && (
            <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {step === 'PHONE' && (
            <form onSubmit={handleCheckUser} className="space-y-4">
              {/* Social Login Buttons */}
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={!!oauthLoading}
                  className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:shadow-md disabled:opacity-60"
                >
                  {oauthLoading === 'google' ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                  )}
                  Google ilə Giriş
                </button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-white px-3 text-slate-400">və ya telefon nömrəsi ilə</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">Mobil Nömrə</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+994 50 123 45 67"
                  className="mt-1 block w-full rounded-xl border border-slate-200 px-4 py-2.5 text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>
              <button
                type="submit"
                disabled={loading || !phone}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 font-medium text-white transition-colors hover:bg-brand-700 disabled:opacity-70"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                Davam Et
              </button>
            </form>
          )}

          {step === 'PASSWORD' && (
            <form onSubmit={handleLoginPassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">Şifrə</label>
                <input
                  type="password"
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="******"
                  className="mt-1 block w-full rounded-xl border border-slate-200 px-4 py-2.5 text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>
              <button
                type="submit"
                disabled={loading || !passwordInput}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 font-medium text-white transition-colors hover:bg-brand-700 disabled:opacity-70"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                Giriş
              </button>
              <button
                type="button"
                onClick={async () => {
                  setLoading(true)
                  try {
                    await sendOtp(phone)
                    setStep('OTP')
                  } catch {} finally { setLoading(false) }
                }}
                className="mt-2 w-full text-center text-sm font-medium text-brand-600 hover:underline"
              >
                Şifrəni unutmusunuz? (Telegram ilə giriş)
              </button>
            </form>
          )}

          {step === 'OTP' && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">Telegram-dan gələn 6 rəqəmli Kod</label>
                <input
                  type="text"
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="123456"
                  maxLength={6}
                  className="mt-1 block w-full rounded-xl border border-slate-200 px-4 py-2.5 text-center text-2xl tracking-widest text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>
              <a 
                href="https://t.me/waygo_login_bot" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-500 px-4 py-2.5 font-medium text-white transition-colors hover:bg-blue-600 mb-3"
              >
                Telegram-ı Aç
              </a>
              <button
                type="submit"
                disabled={loading || !otp || otp.length < 6}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 font-medium text-white transition-colors hover:bg-brand-700 disabled:opacity-70"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                Təsdiqlə
              </button>
            </form>
          )}

          {step === 'SET_PASSWORD' && (
            <form onSubmit={handleSetPassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">Yeni Şifrə</label>
                <input
                  type="password"
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Ən azı 6 simvol"
                  minLength={6}
                  className="mt-1 block w-full rounded-xl border border-slate-200 px-4 py-2.5 text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>
              <button
                type="submit"
                disabled={loading || passwordInput.length < 6}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 font-medium text-white transition-colors hover:bg-brand-700 disabled:opacity-70"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                Təsdiqlə və Davam Et
              </button>
              <button
                type="button"
                onClick={() => setStep('ONBOARDING')}
                className="mt-2 w-full text-center text-sm font-medium text-slate-500 hover:text-slate-700 hover:underline"
              >
                Şifrə təyin etmədən davam et
              </button>
            </form>
          )}

          {step === 'ONBOARDING' && (
            <form onSubmit={handleOnboarding} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">Ad Soyad</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Məs: Cavid Əliyev"
                  className="mt-1 block w-full rounded-xl border border-slate-200 px-4 py-2.5 text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Mühərrik Tipi</label>
                <select
                  value={vehicleType}
                  onChange={(e) => setVehicleType(e.target.value as VehicleType)}
                  className="mt-1 block w-full rounded-xl border border-slate-200 px-4 py-2.5 text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                >
                  <option value="EV">Elektrik (EV)</option>
                  <option value="HYBRID">Hibrid (HYBRID)</option>
                  <option value="PETROL">Benzin (PETROL)</option>
                  <option value="DIESEL">Dizel (DIESEL)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Dövlət Nişanı (Texpasport Nömrəsi)</label>
                <input
                  type="text"
                  required
                  value={plate}
                  onChange={(e) => setPlate(e.target.value)}
                  placeholder="99-XX-999"
                  className="mt-1 block w-full rounded-xl border border-slate-200 px-4 py-2.5 text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>
              <button
                type="submit"
                disabled={loading || !plate.trim()}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 font-medium text-white transition-colors hover:bg-brand-700 disabled:opacity-70"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                Tamamla
              </button>
            </form>
          )}

          {step === 'SUCCESS' && (
            <div className="py-6 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h3 className="mt-4 text-xl font-medium text-slate-900">Hazırdır!</h3>
              <p className="mt-2 text-sm text-slate-500">Artıq eko-marşrutlardan istifadə edə bilərsiniz.</p>
              <button
                onClick={onClose}
                className="mt-6 w-full rounded-xl bg-brand-600 px-4 py-2.5 font-medium text-white hover:bg-brand-700"
              >
                Xəritəyə Keçid
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
