import type { ButtonHTMLAttributes, ReactNode } from 'react'

export function Badge({
  children,
  tone = 'brand',
  className = '',
}: {
  children: ReactNode
  tone?: 'brand' | 'red' | 'green' | 'slate' | 'amber'
  className?: string
}) {
  const tones: Record<string, string> = {
    brand: 'bg-brand-600 text-white',
    red: 'bg-red-500 text-white',
    green: 'bg-emerald-500 text-white',
    slate: 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300',
    amber: 'bg-amber-500 text-white',
  }
  return (
    <span
      className={`inline-flex min-w-[18px] items-center justify-center rounded-full px-1.5 py-0.5 text-[11px] font-semibold leading-none tabular-nums ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  )
}

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean
  label: string
}

export function IconButton({ active, label, className = '', children, ...rest }: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={`flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 shadow-float transition hover:text-brand-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 active:scale-95 ${
        active ? 'text-brand-600' : ''
      } ${className}`}
      {...rest}
    >
      {children}
    </button>
  )
}

export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean
  onChange: (next: boolean) => void
  label: string
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 ${
        checked ? 'bg-brand-600' : 'bg-slate-300'
      }`}
    >
      <span
        className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white dark:bg-slate-900 shadow transition-transform ${
          checked ? 'translate-x-4.5' : 'translate-x-1'
        }`}
        style={{ transform: checked ? 'translateX(18px)' : 'translateX(2px)' }}
      />
    </button>
  )
}
