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
