import { useEffect, useRef } from 'react'
import { ArrowRight, CornerUpLeft, CornerUpRight, ArrowUpRight, ArrowUpLeft, RefreshCcw, CheckCircle2, ArrowUp } from 'lucide-react'
import type { Maneuver } from '@/hooks/useRoutePlanner'

interface Props {
  activeManeuver: Maneuver | null
  distanceToManeuverMeters: number | null
}

const getManeuverIcon = (type: number) => {
  // Valhalla maneuver types mapping to icons
  switch (type) {
    case 9: case 10: case 15: // Left turns
      return <CornerUpLeft className="h-8 w-8 text-white" />
    case 11: case 12: case 16: // Right turns
      return <CornerUpRight className="h-8 w-8 text-white" />
    case 13: // Slight left
      return <ArrowUpLeft className="h-8 w-8 text-white" />
    case 14: // Slight right
      return <ArrowUpRight className="h-8 w-8 text-white" />
    case 26: case 27: // Roundabout
      return <RefreshCcw className="h-8 w-8 text-white" />
    case 4: case 5: case 6: // Destination reached
      return <CheckCircle2 className="h-8 w-8 text-white" />
    default: // Straight or unknown
      return <ArrowUp className="h-8 w-8 text-white" />
  }
}

export function TurnByTurnPanel({ activeManeuver, distanceToManeuverMeters }: Props) {
  const lastSpokenManeuverRef = useRef<number | null>(null)

  useEffect(() => {
    // 1. Play Voice Instruction if maneuver changes
    if (activeManeuver && activeManeuver.begin_shape_index !== lastSpokenManeuverRef.current) {
      if ('speechSynthesis' in window) {
        // Cancel previous speech
        window.speechSynthesis.cancel()
        
        // Voice is only in English for Valhalla natively, but we can just say the instruction
        const utterance = new SpeechSynthesisUtterance(activeManeuver.instruction)
        utterance.rate = 1.0 // Normal speed
        utterance.volume = 1.0
        
        // Try to find a local voice or default
        const voices = window.speechSynthesis.getVoices()
        const azVoice = voices.find(v => v.lang.includes('az')) || voices.find(v => v.lang.includes('en'))
        if (azVoice) utterance.voice = azVoice

        window.speechSynthesis.speak(utterance)
        lastSpokenManeuverRef.current = activeManeuver.begin_shape_index
      }
    }
  }, [activeManeuver])

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

  return (
    <div className="pointer-events-auto absolute top-4 left-1/2 flex w-[90%] max-w-sm -translate-x-1/2 transform items-center gap-4 rounded-2xl bg-slate-900/90 p-4 shadow-2xl backdrop-blur-md transition-all sm:w-[400px]">
      
      {/* Icon Area */}
      <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-xl transition-colors ${isClose ? 'bg-amber-500 shadow-lg shadow-amber-500/40 animate-pulse' : 'bg-emerald-600 shadow-lg shadow-emerald-500/40'}`}>
        {getManeuverIcon(activeManeuver.type)}
      </div>

      {/* Instruction Text */}
      <div className="flex-1 min-w-0">
        <p className="text-xl font-bold tracking-tight text-white drop-shadow-md">
          {distanceText}
        </p>
        <p className="mt-0.5 truncate text-sm font-medium text-slate-300 leading-tight">
          {activeManeuver.instruction}
        </p>
      </div>
    </div>
  )
}
