import { useEffect, useState } from 'react'
import { Gauge } from 'lucide-react'

interface Props {
  currentSpeedKmh: number
  speedLimitKmh: number | null
}

export function SpeedometerWidget({ currentSpeedKmh, speedLimitKmh }: Props) {
  const [isOverSpeed, setIsOverSpeed] = useState(false)
  const [flashRed, setFlashRed] = useState(false)

  useEffect(() => {
    const over = speedLimitKmh !== null && currentSpeedKmh > speedLimitKmh
    setIsOverSpeed(over)

    if (over && !isOverSpeed) {
      // Play warning beep
      try {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
        const oscillator = ctx.createOscillator()
        const gainNode = ctx.createGain()
        oscillator.connect(gainNode)
        gainNode.connect(ctx.destination)
        oscillator.frequency.value = 880
        oscillator.type = 'sine'
        gainNode.gain.value = 0.3
        oscillator.start()
        setTimeout(() => { oscillator.stop(); ctx.close() }, 300)
      } catch {}
    }
  }, [currentSpeedKmh, speedLimitKmh])

  useEffect(() => {
    if (!isOverSpeed) { setFlashRed(false); return }
    const interval = setInterval(() => setFlashRed(prev => !prev), 500)
    return () => clearInterval(interval)
  }, [isOverSpeed])

  const speed = Math.round(currentSpeedKmh)
  const limit = speedLimitKmh ? Math.round(speedLimitKmh) : null

  return (
    <div className="pointer-events-auto flex items-center gap-2">
      {/* Speed Limit Sign */}
      {limit && (
        <div className={lex h-14 w-14 flex-col items-center justify-center rounded-full border-[3px] transition-all }>
          <span className="text-[10px] font-bold text-slate-500 leading-none">LIMIT</span>
          <span className={	ext-lg font-black leading-none }>{limit}</span>
        </div>
      )}

      {/* Current Speed */}
      <div className={lex h-16 w-16 flex-col items-center justify-center rounded-full shadow-lg transition-all }>
        <span className="text-2xl font-black leading-none text-white">{speed}</span>
        <span className="text-[8px] font-bold uppercase text-white/70">km/h</span>
      </div>
    </div>
  )
}
