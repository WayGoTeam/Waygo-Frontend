import { useEffect, useRef } from 'react'
import { fetchTTS } from '@/api/chat'
import { useLocale } from '@/i18n/LocaleContext'
import { ArrowRight, CornerUpLeft, CornerUpRight, ArrowUpRight, ArrowUpLeft, RefreshCcw, CheckCircle2, ArrowUp } from 'lucide-react'
import type { Maneuver } from '@/hooks/useRoutePlanner'

interface Props {
  activeManeuver: Maneuver | null
  distanceToManeuverMeters: number | null
}

const getManeuverIcon = (instruction: string) => {
  const text = instruction.toLowerCase()
  if (text.includes('roundabout')) return <RefreshCcw className="h-6 w-6 text-slate-700 dark:text-slate-200" />
  if (text.includes('destination')) return <CheckCircle2 className="h-6 w-6 text-slate-700 dark:text-slate-200" />
  
  if (text.includes('slight left')) return <ArrowUpLeft className="h-6 w-6 text-slate-700 dark:text-slate-200" />
  if (text.includes('slight right')) return <ArrowUpRight className="h-6 w-6 text-slate-700 dark:text-slate-200" />
  
  if (text.includes('left')) return <CornerUpLeft className="h-6 w-6 text-slate-700 dark:text-slate-200" />
  if (text.includes('right')) return <CornerUpRight className="h-6 w-6 text-slate-700 dark:text-slate-200" />
  
  return <ArrowUp className="h-6 w-6 text-slate-700 dark:text-slate-200" />
}

const translateManeuverToAz = (instruction: string): string => {
  const text = instruction.toLowerCase()
  if (text.includes('roundabout')) return 'dairədən dönün'
  if (text.includes('destination')) return 'təyinat nöqtəsinə çatdınız'
  if (text.includes('slight left')) return 'yüngül sola dönün'
  if (text.includes('slight right')) return 'yüngül sağa dönün'
  if (text.includes('left')) return 'sola dönün'
  if (text.includes('right')) return 'sağa dönün'
  if (text.includes('continue')) return 'düz davam edin'
  return 'davam edin'
}

export function TurnByTurnPanel({ activeManeuver, distanceToManeuverMeters }: Props) {
  const lastSpokenManeuverRef = useRef<number | null>(null)
  const { locale } = useLocale()

  useEffect(() => {
    // 1. Play Voice Instruction if maneuver changes
    if (activeManeuver && activeManeuver.begin_shape_index !== lastSpokenManeuverRef.current) {
        
        let textToSpeak = ''
        
        if (locale === 'az') {
           const actionAz = translateManeuverToAz(activeManeuver.instruction)
           textToSpeak = actionAz
           if (distanceToManeuverMeters && distanceToManeuverMeters > 20 && !actionAz.includes('çatdınız')) {
             const dist = distanceToManeuverMeters >= 1000 
               ? `${(distanceToManeuverMeters / 1000).toFixed(1)} kilometrdən sonra` 
               : `${Math.round(distanceToManeuverMeters)} metrdən sonra`
             textToSpeak = `${dist}, ${actionAz}`
           }
        } else {
           textToSpeak = activeManeuver.instruction
           if (distanceToManeuverMeters && distanceToManeuverMeters > 20 && !textToSpeak.toLowerCase().includes('destination')) {
             const dist = distanceToManeuverMeters >= 1000 
               ? `${(distanceToManeuverMeters / 1000).toFixed(1)} kilometers` 
               : `${Math.round(distanceToManeuverMeters)} meters`
             textToSpeak = `In ${dist}, ${textToSpeak}`
           }
        }
        
        // Use Azure Neural TTS via Backend Gateway
        fetchTTS(textToSpeak, locale)
          .then(blob => {
              const url = URL.createObjectURL(blob)
              const audio = new Audio(url)
              audio.play().catch(e => console.warn('Azure TTS Play failed (autoplay blocked):', e))
          })
          .catch(e => console.error('Azure TTS fetch failed:', e))
          
        lastSpokenManeuverRef.current = activeManeuver.begin_shape_index
    }
  }, [activeManeuver, locale])

  if (!activeManeuver) return null

  // Format distance
  const isClose = distanceToManeuverMeters !== null && distanceToManeuverMeters < 100
  let distanceText = ''
  if (distanceToManeuverMeters !== null) {
    if (distanceToManeuverMeters >= 1000) {
      distanceText = (distanceToManeuverMeters / 1000).toFixed(1) + ' km'
    } else {
      distanceText = Math.round(distanceToManeuverMeters) + ' m'
    }
  }

  const uiInstruction = locale === 'az' 
    ? translateManeuverToAz(activeManeuver.instruction).replace(/^./, str => str.toUpperCase())
    : activeManeuver.instruction

  return (
    <div className="pointer-events-auto absolute top-6 left-1/2 flex w-[92%] max-w-[420px] -translate-x-1/2 transform items-center gap-4 rounded-3xl border border-slate-200/50 bg-white/80 p-3 shadow-glass backdrop-blur-xl dark:border-slate-800/50 dark:bg-slate-900/80 transition-all sm:w-[400px]">
      
      {/* Icon Area */}
      <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl transition-all duration-500 ${isClose ? 'bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400 shadow-[0_0_20px_-5px_rgba(245,158,11,0.5)] animate-pulse' : 'bg-brand-50 text-brand-600 dark:bg-brand-500/20 dark:text-brand-400'}`}>
        {getManeuverIcon(activeManeuver.instruction)}
      </div>

      {/* Instruction Text */}
      <div className="flex-1 min-w-0">
        <p className="text-2xl font-black tracking-tight text-slate-900 dark:text-slate-50">
          {distanceText}
        </p>
        <p className="mt-0.5 truncate text-sm font-semibold text-slate-500 dark:text-slate-400 leading-tight">
          {uiInstruction}
        </p>
      </div>
    </div>
  )
}
