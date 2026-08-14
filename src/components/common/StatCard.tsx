import type { LucideIcon } from 'lucide-react'

export function StatCard({
  icon: Icon,
  label,
  value,
  unit,
  tone = 'text-slate-900',
}: {
  icon: LucideIcon
  label: string
  value: string
  unit?: string
  tone?: string
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/50 bg-white/70 p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="relative flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600 shadow-inner ring-1 ring-brand-100/50 transition-transform duration-300 group-hover:scale-110">
          <Icon className="h-5 w-5" />
        </div>
        <span className="text-sm font-semibold tracking-wide text-slate-500">{label}</span>
      </div>
      <p className={`relative mt-4 font-display text-4xl font-extrabold tabular-nums tracking-tight ${tone}`}>
        {value}
        {unit && <span className="ml-1 text-base font-semibold text-slate-400">{unit}</span>}
      </p>
    </div>
  )
}
