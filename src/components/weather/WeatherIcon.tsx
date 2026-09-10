import {
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSnow,
  CloudSun,
  Cloud,
  Sun,
} from 'lucide-react'
import type { LucideProps } from 'lucide-react'

/**
 * Backend `WeatherSnapshot.condition` enum values. Both the Lucide icon and the
 * emoji glyph key off this enum — never off translated label text — so the icon
 * cannot drift from the label when the locale changes (audit L08).
 */
export type WeatherCondition =
  | 'clear'
  | 'partly-cloudy'
  | 'overcast'
  | 'fog'
  | 'drizzle'
  | 'rain'
  | 'showers'
  | 'snow'
  | 'thunderstorm'
  | 'fallback-weather'
  | 'unknown'

const WEATHER_EMOJI: Record<WeatherCondition, string> = {
  clear: '☀️',
  'partly-cloudy': '⛅',
  overcast: '☁️',
  fog: '🌫️',
  drizzle: '🌦️',
  rain: '🌧️',
  showers: '🌧️',
  snow: '❄️',
  thunderstorm: '⛈️',
  'fallback-weather': '🌤️',
  unknown: '🌤️',
}

/** Emoji for a backend weather condition code; unknown codes get a neutral glyph, not a sun. */
export function weatherEmoji(condition: string | null | undefined): string {
  const key = (condition ?? '').trim().toLowerCase() as WeatherCondition
  return WEATHER_EMOJI[key] ?? WEATHER_EMOJI.unknown
}

export function WeatherIcon({ condition, ...props }: { condition: string } & LucideProps) {
  switch (condition) {
    case 'clear':
      return <Sun {...props} />
    case 'partly-cloudy':
      return <CloudSun {...props} />
    case 'overcast':
      return <Cloud {...props} />
    case 'fog':
      return <CloudFog {...props} />
    case 'drizzle':
      return <CloudDrizzle {...props} />
    case 'rain':
    case 'showers':
      return <CloudRain {...props} />
    case 'snow':
      return <CloudSnow {...props} />
    case 'thunderstorm':
      return <CloudLightning {...props} />
    default:
      return <CloudSun {...props} />
  }
}
