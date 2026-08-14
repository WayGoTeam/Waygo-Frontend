import type { Strings } from '@/i18n/strings'

export function formatMinutes(minutes: number): string {
  const rounded = Math.max(0, Math.round(minutes))
  return `${rounded}`
}

export function formatKm(meters: number): string {
  return (meters / 1000).toFixed(1)
}

export function formatSpeed(kmh: number): string {
  return `${Math.round(kmh)}`
}

/** Clock time in Baku's own timezone, regardless of the viewer's locale — e.g. "08:49". */
export function formatBakuClock(iso: string | Date): string {
  const date = typeof iso === 'string' ? new Date(iso) : iso
  return new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Asia/Baku',
  }).format(date)
}

export function formatRelativeTime(iso: string | Date, common: Strings['common']): string {
  const date = typeof iso === 'string' ? new Date(iso) : iso
  const seconds = Math.max(0, Math.round((Date.now() - date.getTime()) / 1000))
  if (seconds < 45) return common.justNow
  const minutes = Math.round(seconds / 60)
  if (minutes < 60) return `${minutes} ${common.minutes} ${common.ago}`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `${hours} saat ${common.ago}`
  const days = Math.round(hours / 24)
  return `${days} gün ${common.ago}`
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}
