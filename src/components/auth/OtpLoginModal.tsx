import { useState } from 'react'
import { X, Loader2, CheckCircle2 } from 'lucide-react'
import { sendOtp, verifyOtp, onboarding } from '@/api/auth'
import { useAuth } from '@/context/AuthContext'
import type { VehicleType } from '@/types/api'

interface Props {
  onClose: () => void
}

type Step = 'PHONE' | 'OTP' | 'ONBOARDING' | 'SUCCESS'

export function OtpLoginModal({ onClose }: Props) {
  const { refreshUser } = useAuth()
  const [step, setStep] = useState<Step>('PHONE')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [vehicleType, setVehicleType] = useState<VehicleType>('PETROL')
  const [plate, setPlate] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await sendOtp(phone)
      setStep('OTP')
    } catch (err: any) {
      if (err?.message) {
        setError(err.message)
      } else {
        setError('SMS göndərilərkən xəta baş verdi.')
      }
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
      // Ideally we would check if user already has a vehicle profile.
      // If yes -> setStep('SUCCESS'). If no -> setStep('ONBOARDING').
      // For now, we will just force onboarding for the demo if they just logged in.
      // Or let them optionally do it. We'll go to Onboarding step.
      setStep('ONBOARDING')
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

  async function handleOnboarding(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await onboarding(vehicleType, plate)
      await refreshUser()
      setStep('SUCCESS')
    } catch {
      setError('Məlumatlar yadda saxlanılmadı.')
    } finally {
      setLoading(false)
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
              {step === 'OTP' && 'Kodu Təsdiqləyin'}
              {step === 'ONBOARDING' && 'Avtomobil Profiliniz'}
              {step === 'SUCCESS' && 'Uğurlu!'}
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              {step === 'PHONE' && 'Davam etmək üçün mobil nömrənizi daxil edin.'}
              {step === 'OTP' && `Kodu ${phone} nömrəsinə göndərdik.`}
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
            <form onSubmit={handleSendOtp} className="space-y-4">
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
                Kod Göndər
              </button>
            </form>
          )}

          {step === 'OTP' && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">SMS Kod</label>
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
              <button
                type="submit"
                disabled={loading || !otp}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 font-medium text-white transition-colors hover:bg-brand-700 disabled:opacity-70"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                Təsdiqlə
              </button>
            </form>
          )}

          {step === 'ONBOARDING' && (
            <form onSubmit={handleOnboarding} className="space-y-4">
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
