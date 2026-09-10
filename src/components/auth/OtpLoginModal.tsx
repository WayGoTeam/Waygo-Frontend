import { useState } from 'react'
import { X, Loader2, CheckCircle2 } from 'lucide-react'
import { sendOtp, verifyOtp, onboarding, checkUser, setPassword, oauthGoogle } from '@/api/auth'
import { GoogleLogin } from '@react-oauth/google'
import { useAuth } from '@/context/AuthContext'
import { useLocale } from '@/i18n/LocaleContext'
import type { VehicleType } from '@/types/api'

interface Props {
  onClose: () => void
}

type Step = 'PHONE' | 'PASSWORD' | 'OTP' | 'SET_PASSWORD' | 'ONBOARDING' | 'SUCCESS'

const VEHICLE_OPTIONS: VehicleType[] = ['EV', 'HYBRID', 'PETROL', 'DIESEL']

const INPUT_CLASS =
  'mt-1 block w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2.5 text-slate-900 dark:text-slate-50 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500'
const PRIMARY_BUTTON_CLASS =
  'flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 font-medium text-white transition-colors hover:bg-brand-700 disabled:opacity-70'

export function OtpLoginModal({ onClose }: Props) {
  const { s } = useLocale()
  const t = s.login
  const { login, refreshUser } = useAuth()
  const [step, setStep] = useState<Step>('PHONE')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [passwordInput, setPasswordInput] = useState('')
  const [vehicleType, setVehicleType] = useState<VehicleType>('PETROL')
  const [plate, setPlate] = useState('')
  const [fullName, setFullName] = useState('')
  const [isNewUser, setIsNewUser] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleCheckUser(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await checkUser(phone)
      if (res.exists && res.hasPassword) {
        setStep('PASSWORD')
      } else {
        setIsNewUser(!res.exists)
        await sendOtp(phone)
        setStep('OTP')
      }
    } catch (err: any) {
      setError(err?.message || t.errors.generic)
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
    } catch {
      setError(t.errors.wrongPassword)
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
      setStep(isNewUser ? 'SET_PASSWORD' : 'SUCCESS')
    } catch (err: any) {
      setError(err?.message || t.errors.otpInvalid)
    } finally {
      setLoading(false)
    }
  }

  async function handleSetPassword(e: React.FormEvent) {
    e.preventDefault()
    if (passwordInput.length < 6) {
      setError(t.errors.passwordTooShort)
      return
    }
    setLoading(true)
    setError(null)
    try {
      await setPassword(passwordInput)
      setStep('ONBOARDING')
    } catch {
      setError(t.errors.passwordSetFailed)
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
      setError(t.errors.onboardingFailed)
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogleLogin(credentialResponse: any) {
    if (!credentialResponse.credential) return
    setLoading(true)
    setError(null)
    try {
      const res = await oauthGoogle(credentialResponse.credential)
      await refreshUser()
      setStep(res.needsOnboarding ? 'ONBOARDING' : 'SUCCESS')
    } catch {
      setError(t.errors.googleFailed)
    } finally {
      setLoading(false)
    }
  }

  const titles: Record<Step, string> = {
    PHONE: t.titlePhone,
    PASSWORD: t.titlePassword,
    OTP: t.titleOtp,
    SET_PASSWORD: t.titleSetPassword,
    ONBOARDING: t.titleOnboarding,
    SUCCESS: t.titleSuccess,
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 backdrop-blur-sm">
      <div
        className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white dark:bg-slate-900 shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-modal-title"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label={s.common.close}
          className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-400 transition-colors"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>

        <div className="p-6 sm:p-8">
          <div className="mb-6">
            <h2 id="login-modal-title" className="font-display text-2xl font-bold text-slate-900 dark:text-slate-50">
              {titles[step]}
            </h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              {step === 'PHONE' && t.subtitlePhone}
              {step === 'PASSWORD' && t.subtitlePassword}
              {step === 'OTP' && (
                <>
                  {t.subtitleOtpPrefix}{' '}
                  <a href="https://t.me/waygo_login_bot" target="_blank" rel="noopener noreferrer" className="font-semibold text-brand-600 hover:underline">
                    @waygo_login_bot
                  </a>{' '}
                  {t.subtitleOtpSuffix}
                </>
              )}
              {step === 'SET_PASSWORD' && t.subtitleSetPassword}
              {step === 'ONBOARDING' && t.subtitleOnboarding}
              {step === 'SUCCESS' && t.subtitleSuccess}
            </p>
          </div>

          {error && (
            <div role="alert" className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {step === 'PHONE' && (
            <form onSubmit={handleCheckUser} className="space-y-4">
              <div>
                <label htmlFor="login-phone" className="block text-sm font-medium text-slate-700 dark:text-slate-300">{t.phoneLabel}</label>
                <input
                  id="login-phone"
                  type="tel"
                  required
                  autoComplete="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+994 50 123 45 67"
                  className={INPUT_CLASS}
                />
              </div>
              <button type="submit" disabled={loading || !phone} className={PRIMARY_BUTTON_CLASS}>
                {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
                {t.continueButton}
              </button>
              <div className="mt-4 flex items-center justify-center space-x-2">
                <span className="h-px bg-slate-200 dark:bg-slate-700 flex-1"></span>
                <span className="text-sm text-slate-500 dark:text-slate-400">{t.or}</span>
                <span className="h-px bg-slate-200 dark:bg-slate-700 flex-1"></span>
              </div>
              <div className="mt-4 flex justify-center">
                <GoogleLogin
                  onSuccess={handleGoogleLogin}
                  onError={() => setError(t.errors.googleError)}
                  text="continue_with"
                />
              </div>
            </form>
          )}

          {step === 'PASSWORD' && (
            <form onSubmit={handleLoginPassword} className="space-y-4">
              <div>
                <label htmlFor="login-password" className="block text-sm font-medium text-slate-700 dark:text-slate-300">{t.passwordLabel}</label>
                <input
                  id="login-password"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="******"
                  className={INPUT_CLASS}
                />
              </div>
              <button type="submit" disabled={loading || !passwordInput} className={PRIMARY_BUTTON_CLASS}>
                {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
                {t.loginButton}
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
                {t.forgotPassword}
              </button>
            </form>
          )}

          {step === 'OTP' && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <label htmlFor="login-otp" className="block text-sm font-medium text-slate-700 dark:text-slate-300">{t.otpLabel}</label>
                <input
                  id="login-otp"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="123456"
                  maxLength={6}
                  className={`${INPUT_CLASS} text-center text-2xl tracking-widest`}
                />
              </div>
              <a 
                href="https://t.me/waygo_login_bot" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-500 px-4 py-2.5 font-medium text-white transition-colors hover:bg-blue-600 mb-3"
              >
                {t.openTelegram}
              </a>
              <button type="submit" disabled={loading || !otp || otp.length < 6} className={PRIMARY_BUTTON_CLASS}>
                {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
                {t.verify}
              </button>
            </form>
          )}

          {step === 'SET_PASSWORD' && (
            <form onSubmit={handleSetPassword} className="space-y-4">
              <div>
                <label htmlFor="login-new-password" className="block text-sm font-medium text-slate-700 dark:text-slate-300">{t.newPasswordLabel}</label>
                <input
                  id="login-new-password"
                  type="password"
                  required
                  autoComplete="new-password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder={t.newPasswordPlaceholder}
                  minLength={6}
                  className={INPUT_CLASS}
                />
              </div>
              <button type="submit" disabled={loading || passwordInput.length < 6} className={PRIMARY_BUTTON_CLASS}>
                {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
                {t.verifyAndContinue}
              </button>
              <button
                type="button"
                onClick={() => setStep('ONBOARDING')}
                className="mt-2 w-full text-center text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:underline"
              >
                {t.skipPassword}
              </button>
            </form>
          )}

          {step === 'ONBOARDING' && (
            <form onSubmit={handleOnboarding} className="space-y-4">
              <div>
                <label htmlFor="login-fullname" className="block text-sm font-medium text-slate-700 dark:text-slate-300">{t.fullNameLabel}</label>
                <input
                  id="login-fullname"
                  type="text"
                  required
                  autoComplete="name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={t.fullNamePlaceholder}
                  className={INPUT_CLASS}
                />
              </div>
              <div>
                <label htmlFor="login-vehicle" className="block text-sm font-medium text-slate-700 dark:text-slate-300">{t.engineTypeLabel}</label>
                <select
                  id="login-vehicle"
                  value={vehicleType}
                  onChange={(e) => setVehicleType(e.target.value as VehicleType)}
                  className="mt-1 block w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2.5 text-slate-900 dark:text-slate-50 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                >
                  {VEHICLE_OPTIONS.map((v) => (
                    <option key={v} value={v}>{t.vehicle[v]}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="login-plate" className="block text-sm font-medium text-slate-700 dark:text-slate-300">{t.plateLabel}</label>
                <input
                  id="login-plate"
                  type="text"
                  required
                  value={plate}
                  onChange={(e) => setPlate(e.target.value)}
                  placeholder="99-XX-999"
                  className={INPUT_CLASS}
                />
              </div>
              <button type="submit" disabled={loading || !plate.trim()} className={PRIMARY_BUTTON_CLASS}>
                {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
                {t.complete}
              </button>
            </form>
          )}

          {step === 'SUCCESS' && (
            <div className="py-6 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
                <CheckCircle2 className="h-8 w-8" aria-hidden="true" />
              </div>
              <h3 className="mt-4 text-xl font-medium text-slate-900 dark:text-slate-50">{t.readyTitle}</h3>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{t.readyDesc}</p>
              <button
                type="button"
                onClick={onClose}
                className="mt-6 w-full rounded-xl bg-brand-600 px-4 py-2.5 font-medium text-white hover:bg-brand-700"
              >
                {t.goToMap}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
