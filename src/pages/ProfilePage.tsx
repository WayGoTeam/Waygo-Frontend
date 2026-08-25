import { useEffect, useState } from 'react'
import { User, Settings, MapPin, Leaf, Star, CarFront, QrCode, Check, Fuel, Wrench, Zap, Battery } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { getWalletBalance } from '@/api/wallet'
import type { WalletBalance } from '@/types/api'

export default function ProfilePage() {
  const { user } = useAuth()
  const [balance, setBalance] = useState<WalletBalance | null>(null)
  
  useEffect(() => {
    getWalletBalance()
      .then(setBalance)
      .catch(console.error)
  }, [])

  // Provide fallback values if backend data is missing
  const username = user?.username || 'İstifadəçi'
  const phone = user?.phone || '+994 ••• ••• •••'
  const vehicleType = user?.vehicleType || 'Bilinmir'
  const fullName = user?.fullName || ''
  const plateNumber = user?.plateNumber || '10-AA-000'
  
  const ecoPoints = balance?.ecoPointsBalance || 0
  const co2Saved = balance?.totalCo2SavedKg || 0
  const totalKm = 0 // Mocked for now

  if (!user) {
    return (
      <div className="flex h-full flex-col overflow-y-auto bg-slate-50">
        <div className="mx-auto flex w-full max-w-4xl flex-col items-center justify-center min-h-[60vh] p-6 text-center">
          <User className="mb-6 h-16 w-16 text-brand-300" />
          <h2 className="mb-3 font-display text-2xl font-bold text-slate-900">
            Profilə baxmaq üçün giriş etməlisiniz
          </h2>
          <p className="max-w-md text-slate-500">
            Sürücü məlumatlarınızı görmək, maşın növünüzü idarə etmək və qazanılmış Eco-Points tarixçənizi izləmək üçün zəhmət olmasa sistemə daxil olun.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col overflow-y-auto bg-slate-50 text-slate-900">
      <div className="mx-auto w-full max-w-4xl p-6">
        <h1 className="font-display text-3xl font-bold text-slate-900 mb-2">Profil</h1>
        <p className="text-slate-500 mb-8">Sürücü məlumatlarınız, nəqliyyat vasitəniz və göstəriciləriniz.</p>
        
        <div className="space-y-6">
          {/* Header / User Info Card */}
        <div className="relative overflow-hidden rounded-3xl bg-white p-5 shadow-panel border border-slate-200">
          <div className="relative flex items-center gap-4">
            {/* Avatar */}
            <div className="relative">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-brand-100 text-brand-600 shadow-inner">
                <User className="h-10 w-10" strokeWidth={2.5} />
              </div>
              <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full border-2 border-white bg-green-500 flex items-center justify-center">
                <div className="h-1.5 w-1.5 rounded-full bg-white" />
              </div>
            </div>
            
            {/* Info */}
            <div className="flex-1">
              <h2 className="text-xl font-bold text-slate-900 tracking-wide">
                {fullName || (user?.username?.startsWith('google:') ? 'İstifadəçi' : username)}
              </h2>
              <p className="text-[15px] text-slate-500 font-medium mt-0.5">
                {user?.email || (user?.phone && !user.phone.startsWith('google:') ? user.phone : '')}
              </p>
              
              <div className="mt-2.5 flex items-center gap-2">
                <div className="flex items-center gap-1.5 rounded-full border border-green-200 bg-green-50 px-2.5 py-1">
                  <Leaf className="h-3.5 w-3.5 text-green-600" />
                  <span className="text-xs font-semibold text-green-700">Eko Sürücü</span>
                </div>
                {ecoPoints > 1000 && (
                  <div className="flex items-center gap-1.5 rounded-full border border-yellow-200 bg-yellow-50 px-2.5 py-1">
                    <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
                    <span className="text-xs font-semibold text-yellow-700">Gold</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Settings */}
            <button className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
              <Settings className="h-6 w-6" strokeWidth={1.5} />
            </button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-3 gap-3">
          <div className="flex flex-col items-center justify-center rounded-2xl bg-white p-4 border border-slate-200 shadow-panel">
            <MapPin className="h-6 w-6 text-brand-500 mb-2" strokeWidth={2} />
            <span className="text-lg font-bold text-slate-900">{totalKm.toLocaleString()}</span>
            <span className="text-xs font-medium text-slate-500 mt-0.5">Ümumi km</span>
          </div>
          <div className="flex flex-col items-center justify-center rounded-2xl bg-white p-4 border border-slate-200 shadow-panel">
            <Leaf className="h-6 w-6 text-green-500 mb-2" strokeWidth={2} />
            <span className="text-lg font-bold text-slate-900">{co2Saved.toFixed(1)} kg</span>
            <span className="text-xs font-medium text-slate-500 mt-0.5">CO₂ qənaəti</span>
          </div>
          <div className="flex flex-col items-center justify-center rounded-2xl bg-white p-4 border border-slate-200 shadow-panel">
            <Star className="h-6 w-6 text-yellow-400 fill-yellow-400 mb-2" strokeWidth={2} />
            <span className="text-lg font-bold text-slate-900">{ecoPoints.toLocaleString()}</span>
            <span className="text-xs font-medium text-slate-500 mt-0.5">EcoPoints</span>
          </div>
        </div>

        {/* Contact Details Section */}
        <div>
          <h3 className="text-[13px] font-bold text-slate-500 uppercase tracking-wider mb-3 px-1">Əlaqə Məlumatları</h3>
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between rounded-2xl bg-white p-4 border border-slate-200 shadow-panel">
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Email</span>
                <span className="text-[15px] font-bold text-slate-900 mt-1">{user?.email || 'Təyin edilməyib'}</span>
              </div>
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-white p-4 border border-slate-200 shadow-panel">
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Telefon</span>
                {user?.phone && !user.phone.startsWith('google:') ? (
                  <span className="text-[15px] font-bold text-slate-900 mt-1">{user.phone}</span>
                ) : (
                  <span className="text-[14px] font-medium text-rose-500 mt-1 flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-rose-500"></span>
                    Telefon təsdiq edilməyib (Tezliklə)
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Vehicle Section */}
        <div>
          <div className="flex items-center justify-between mb-3 px-1">
            <h3 className="text-[13px] font-bold text-slate-500 uppercase tracking-wider">Avtomobil</h3>
            <button className="flex items-center gap-1.5 rounded-lg border border-brand-200 bg-brand-50 px-2.5 py-1.5 text-xs font-semibold text-brand-700 transition-colors hover:bg-brand-100">
              <QrCode className="h-3.5 w-3.5" />
              VRD Skan
            </button>
          </div>
          <div className="flex items-center justify-between rounded-2xl bg-white p-4 border border-slate-200 shadow-panel">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 text-slate-600">
                <CarFront className="h-6 w-6" strokeWidth={1.5} />
              </div>
              <div>
                <h4 className="text-[15px] font-bold text-slate-900">{fullName ? `${fullName.split(' ')[0]}'s Avtomobili` : 'Şəxsi Avtomobil'}</h4>
                <p className="text-sm font-medium text-slate-500 mt-0.5">{plateNumber} • {vehicleType}</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 rounded-lg border border-green-200 bg-green-50 px-2.5 py-1.5">
              <Check className="h-3.5 w-3.5 text-green-600" strokeWidth={3} />
              <span className="text-xs font-bold text-green-700">Doğrulanıb</span>
            </div>
          </div>
        </div>

        {/* Engine Type Section */}
        <div>
          <h3 className="text-[13px] font-bold text-slate-500 uppercase tracking-wider mb-3 px-1">Mühərrik Növü</h3>
          <div className="grid grid-cols-4 gap-2 mb-3">
            <button className={`flex flex-col items-center justify-center gap-2 rounded-2xl p-3 border transition-colors ${vehicleType === 'PETROL' ? 'border-brand-500 bg-brand-50' : 'border-slate-200 bg-white hover:bg-slate-50'}`}>
              <Fuel className={`h-6 w-6 ${vehicleType === 'PETROL' ? 'text-brand-600' : 'text-rose-500'}`} strokeWidth={1.5} />
              <span className={`text-xs font-semibold ${vehicleType === 'PETROL' ? 'text-brand-700' : 'text-slate-600'}`}>Benzin</span>
            </button>
            <button className={`flex flex-col items-center justify-center gap-2 rounded-2xl p-3 border transition-colors ${vehicleType === 'DIESEL' ? 'border-brand-500 bg-brand-50' : 'border-slate-200 bg-white hover:bg-slate-50'}`}>
              <Wrench className={`h-6 w-6 ${vehicleType === 'DIESEL' ? 'text-brand-600' : 'text-slate-500'}`} strokeWidth={1.5} />
              <span className={`text-xs font-semibold ${vehicleType === 'DIESEL' ? 'text-brand-700' : 'text-slate-600'}`}>Dizel</span>
            </button>
            <button className={`flex flex-col items-center justify-center gap-2 rounded-2xl p-3 border transition-colors ${vehicleType === 'HYBRID' ? 'border-green-500 bg-green-50' : 'border-slate-200 bg-white hover:bg-slate-50'}`}>
              <Zap className={`h-6 w-6 ${vehicleType === 'HYBRID' ? 'text-green-600' : 'text-orange-500'}`} strokeWidth={1.5} />
              <span className={`text-xs font-semibold ${vehicleType === 'HYBRID' ? 'text-green-700' : 'text-slate-600'}`}>Hibrid</span>
            </button>
            <button className={`flex flex-col items-center justify-center gap-2 rounded-2xl p-3 border transition-colors ${vehicleType === 'EV' ? 'border-green-500 bg-green-50' : 'border-slate-200 bg-white hover:bg-slate-50'}`}>
              <Battery className={`h-6 w-6 ${vehicleType === 'EV' ? 'text-green-600' : 'text-green-400'}`} strokeWidth={1.5} />
              <span className={`text-xs font-semibold ${vehicleType === 'EV' ? 'text-green-700' : 'text-slate-600'}`}>EV</span>
            </button>
          </div>
          
          {/* Multiplier Banner */}
          <div className="flex flex-col justify-center rounded-xl bg-green-50 p-4 border border-green-200 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[15px] font-semibold text-green-800">Çarpan əmsalı</span>
              <span className="text-lg font-bold text-green-600">
                x{vehicleType === 'EV' ? '2.0' : vehicleType === 'HYBRID' ? '1.5' : vehicleType === 'PETROL' ? '1.0' : '0.5'}
              </span>
            </div>
            <span className="text-[11px] font-medium text-green-600/80 mt-1">
              * AI modelinə əsasən simvolik EcoPoints çarpanı
            </span>
          </div>
        </div>

      </div>
      </div>
    </div>
  )
}

