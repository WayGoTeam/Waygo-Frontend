import { Leaf, Award, Map, X, Sparkles, CheckCircle2, Share2, Instagram } from 'lucide-react'
import { formatKm } from '@/lib/format'

interface Props {
  visible: boolean
  ecoPoints: number
  co2SavedKg: number
  distanceKm: number
  ecoMode: boolean
  onClose: () => void
}

export function TripSummaryModal({ visible, ecoPoints, co2SavedKg, distanceKm, ecoMode, onClose }: Props) {
  if (!visible) return null

  const handleShare = async () => {
    const text = `🌱 WayGo ilə mənzərəli səfər etdim və təbiətə ${co2SavedKg.toFixed(2)} kq CO₂ qənaət edərək ${ecoPoints} EcoPoints qazandım! 🌍\n\nSiz də mənə qoşulun və "Yaşıl Gələcəyə" addım atın!`
    const url = 'https://waygo.az'
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Mənim WayGo Eco-Səfərim',
          text: text,
          url: url
        })
      } catch (e) {
        console.error('Share failed', e)
      }
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank')
    }
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm transition-all duration-300">
      <div className="animate-fade-up relative w-full max-w-sm overflow-hidden rounded-[32px] bg-white dark:bg-slate-900 shadow-2xl duration-500">
        
        {/* Header Background */}
        <div className={`relative h-36 w-full ${ecoMode ? 'bg-gradient-to-br from-emerald-400 to-green-600' : 'bg-gradient-to-br from-brand-400 to-brand-600'}`}>
          {/* Confetti / Sparkles Overlay */}
          <div className="absolute inset-0 flex items-center justify-center overflow-hidden opacity-30">
            <Sparkles className="h-24 w-24 animate-pulse text-white" strokeWidth={1} />
          </div>
          
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 rounded-full bg-black/20 p-2 text-white backdrop-blur hover:bg-black/40 transition active:scale-90"
          >
            <X className="h-4 w-4" />
          </button>
          
          {/* Icon Badge */}
          <div className="absolute -bottom-8 left-1/2 flex -translate-x-1/2 items-center justify-center rounded-3xl bg-white dark:bg-slate-900 p-4 shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
            {ecoMode ? (
              <Leaf className="h-8 w-8 text-emerald-500" />
            ) : (
              <CheckCircle2 className="h-8 w-8 text-brand-500" />
            )}
          </div>
        </div>

        {/* Content */}
        <div className="px-6 pt-12 pb-6 text-center">
          <h2 className="font-display text-2xl font-extrabold text-slate-800 dark:text-slate-200">Səfər Tamamlandı!</h2>
          <p className="mt-1.5 text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
            {ecoMode ? 'Eco Marşrut ilə uğurla və təbiətə zərər vurmadan mənzilbaşına çatdınız.' : 'Təyinat nöqtəsinə uğurla çatdınız.'}
          </p>

          <div className="mt-8 grid grid-cols-2 gap-4">
            {/* Eco Points */}
            <div className="group relative flex flex-col items-center justify-center rounded-3xl border border-emerald-100 bg-emerald-50/50 p-5 transition hover:bg-emerald-100 hover:shadow-sm">
              <div className="absolute -top-3.5 flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-md transition-transform group-hover:scale-110 group-hover:animate-bounce">
                <Award className="h-4 w-4 text-white" />
              </div>
              <span className="font-display text-[32px] leading-none font-black text-emerald-600">
                +{ecoPoints}
              </span>
              <span className="mt-1 text-[10px] font-bold uppercase tracking-widest text-emerald-800/60">
                Eco-Points
              </span>
            </div>

            {/* CO2 Savings */}
            <div className="group relative flex flex-col items-center justify-center rounded-3xl border border-sky-100 bg-sky-50/50 p-5 transition hover:bg-sky-100 hover:shadow-sm">
              <div className="absolute -top-3.5 flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-sky-600 shadow-md transition-transform group-hover:scale-110 group-hover:animate-bounce">
                <Leaf className="h-4 w-4 text-white" />
              </div>
              <div className="flex items-baseline gap-1">
                <span className="font-display text-[32px] leading-none font-black text-sky-600">
                  {co2SavedKg.toFixed(2)}
                </span>
                <span className="text-sm font-bold text-sky-600/70">kq</span>
              </div>
              <span className="mt-1 text-[10px] font-bold uppercase tracking-widest text-sky-800/60">
                CO₂ Qənaəti
              </span>
            </div>
          </div>

          {/* Distance */}
          <div className="mt-6 flex items-center justify-between rounded-2xl bg-slate-50 dark:bg-slate-900/50 px-5 py-4 border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2.5 text-slate-600 dark:text-slate-400">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white dark:bg-slate-900 shadow-sm">
                <Map className="h-4 w-4 text-slate-400" />
              </div>
              <span className="text-sm font-semibold">Qət edilən məsafə</span>
            </div>
            <span className="text-base font-bold text-slate-800 dark:text-slate-200">{formatKm(distanceKm * 1000)} km</span>
          </div>

          <div className="mt-8 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 rounded-2xl bg-slate-100 py-3.5 text-sm font-bold text-slate-700 transition hover:bg-slate-200 active:scale-95 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              Davam Et
            </button>
            <button
              onClick={handleShare}
              className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/30 transition hover:from-emerald-600 hover:to-emerald-700 active:scale-95"
            >
              <Share2 className="h-4 w-4" />
              Paylaş
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
