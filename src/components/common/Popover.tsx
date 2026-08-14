import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'

export function Popover({
  trigger,
  children,
  align = 'right',
  onOpenChange,
}: {
  trigger: (state: { open: boolean; toggle: () => void }) => ReactNode
  children: ReactNode
  align?: 'left' | 'right'
  onOpenChange?: (open: boolean) => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const setOpenState = (next: boolean) => {
    setOpen(next)
    onOpenChange?.(next)
  }

  useEffect(() => {
    if (!open) return
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpenState(false)
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpenState(false)
    }
    document.addEventListener('mousedown', handleClick)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleEscape)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  return (
    <div ref={ref} className="relative">
      {trigger({ open, toggle: () => setOpenState(!open) })}
      {open && (
        <div
          className={`absolute top-[calc(100%+8px)] z-50 animate-fade-up ${align === 'right' ? 'right-0' : 'left-0'}`}
        >
          {children}
        </div>
      )}
    </div>
  )
}
