import { Ban, Car, Construction, Radar, ShieldAlert, TriangleAlert } from 'lucide-react'
import type { LucideProps } from 'lucide-react'

export function IncidentTypeIcon({ type, ...props }: { type: string } & LucideProps) {
  switch (type) {
    case 'ACCIDENT':
      return <Car {...props} />
    case 'ROADWORKS':
      return <Construction {...props} />
    case 'POLICE':
      return <ShieldAlert {...props} />
    case 'ROAD_CLOSED':
      return <Ban {...props} />
    case 'STATISTICAL_ANOMALY':
      return <Radar {...props} />
    case 'HAZARD':
    case 'HEAVY_TRAFFIC':
    case 'OTHER':
    default:
      return <TriangleAlert {...props} />
  }
}

export function incidentTone(type: string): { text: string; bg: string } {
  switch (type) {
    case 'ACCIDENT':
      return { text: 'text-red-600', bg: 'bg-red-50' }
    case 'ROAD_CLOSED':
      return { text: 'text-red-600', bg: 'bg-red-50' }
    case 'POLICE':
      return { text: 'text-blue-600', bg: 'bg-blue-50' }
    case 'ROADWORKS':
      return { text: 'text-amber-600', bg: 'bg-amber-50' }
    case 'STATISTICAL_ANOMALY':
      return { text: 'text-orange-600', bg: 'bg-orange-50' }
    default:
      return { text: 'text-amber-600', bg: 'bg-amber-50' }
  }
}

export function incidentHexColor(type: string): string {
  switch (type) {
    case 'ACCIDENT':
    case 'ROAD_CLOSED':
      return '#ef4444'
    case 'POLICE':
      return '#3b82f6'
    case 'STATISTICAL_ANOMALY':
      return '#ea580c'
    case 'ROADWORKS':
    case 'HAZARD':
    case 'HEAVY_TRAFFIC':
    case 'OTHER':
    default:
      return '#f59e0b'
  }
}
