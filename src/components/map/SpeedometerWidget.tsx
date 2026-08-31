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
      {/* Speed limit sign removed by user request */}

      {/* Current Speed */}
      <div className={`flex h-16 w-16 flex-col items-center justify-center rounded-full shadow-lg transition-all ${flashRed ? 'bg-red-500 shadow-red-500/50' : 'bg-slate-900 shadow-slate-900/50'}`}>
        <span className="text-2xl font-black leading-none text-white">{speed}</span>
        <span className="text-[8px] font-bold uppercase text-white/70">km/h</span>
      </div>
    </div>
  )
}
