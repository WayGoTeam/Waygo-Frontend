import { X } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

export function ProfileModal({ onClose }: { onClose: () => void }) {
  const { user, logout } = useAuth()
  if (!user) return null

  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center bg-slate-900/40 px-4 backdrop-blur-sm">
      <div className="relative w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="p-6">
          <h2 className="font-display text-xl font-bold text-slate-900 mb-6">Profilim</h2>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-slate-500">Ad Soyad</p>
              <p className="text-slate-900 font-medium">{user.fullName || 'Təyin edilməyib'}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-slate-500">Email</p>
              <div className="flex items-center justify-between">
                <p className="text-slate-900 font-medium">{user.email || 'Təyin edilməyib'}</p>
                {!user.email && (
                  <button onClick={() => alert('Tezliklə əlavə olunacaq!')} className="text-xs font-semibold text-brand-600 hover:underline">
                    Əlavə et
                  </button>
                )}
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-slate-500">Telefon</p>
              <div className="flex items-center justify-between">
                <p className="text-slate-900 font-medium">{user.phone || 'Təyin edilməyib'}</p>
                {!user.phone && (
                  <button onClick={() => alert('Tezliklə əlavə olunacaq!')} className="text-xs font-semibold text-brand-600 hover:underline">
                    Əlavə et
                  </button>
                )}
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-slate-500">Avtomobil / Texpasport</p>
              <p className="text-slate-900 font-medium">{user.vehicleType || 'PETROL'} • {user.plateNumber || 'Təyin edilməyib'}</p>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-100 flex gap-2">
            <button
              onClick={onClose}
              className="flex-1 rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200"
            >
              Bağla
            </button>
            <button
              onClick={() => {
                logout()
                onClose()
              }}
              className="flex-1 rounded-xl bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-100"
            >
              Hesabdan Çıx
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
