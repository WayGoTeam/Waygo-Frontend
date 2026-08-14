import type { Strings } from '@/i18n/strings'

export type CongestionBand = 'flow' | 'slow' | 'heavy' | 'jam'

// Kept in sync with the --color-flow/slow/heavy/jam tokens in src/index.css.
export const CONGESTION_COLORS: Record<CongestionBand, string> = {
  flow: '#22c55e',
  slow: '#f5a623',
  heavy: '#f97316',
  jam: '#ef4444',
}

export const INCIDENT_COLOR = '#f59e0b'

/**
 * Bands a 0-100 congestion level into the same 4-tier scale shown in the map
 * legend. Thresholds are our own (the backend only exposes a 3-tier split for
 * district status — see TrafficController#getRealDistrictFlow) chosen to line
 * up visually with the reference design's 4-color legend.
 */
export function congestionBand(level: number): CongestionBand {
  if (level < 25) return 'flow'
  if (level < 50) return 'slow'
  if (level < 75) return 'heavy'
  return 'jam'
}

export function congestionColor(level: number): string {
  return CONGESTION_COLORS[congestionBand(level)]
}

export function congestionLabel(level: number, legend: Strings['legend']): string {
  switch (congestionBand(level)) {
    case 'flow':
      return legend.flowing
    case 'slow':
      return legend.slow
    case 'heavy':
      return legend.heavy
    case 'jam':
      return legend.jammed
  }
}
