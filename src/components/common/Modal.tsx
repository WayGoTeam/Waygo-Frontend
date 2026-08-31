import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { X } from 'lucide-react'

export function Modal({
  title,
  subtitle,
  onClose,
  children,
}: {
  title: string
  subtitle?: string
  onClose: () => void
  children: ReactNode
}) {
  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <button
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]"
      />
      <div className="relative w-full max-w-md animate-fade-up rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-float">
        <div className="flex items-start justify-between gap-3 border-b border-slate-100 dark:border-slate-800 px-5 py-4">
          <div>
            <h2 className="font-display text-base font-bold text-slate-900 dark:text-slate-50">{title}</h2>
            {subtitle && <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-full p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-400"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="scroll-thin max-h-[70vh] overflow-y-auto px-5 py-4">{children}</div>
      </div>
    </div>
  )
}
