import type { MetroLine, MetroStation } from '@/types/api'

/**
 * TransitController seeds MetroStationDto.line as a bare color keyword
 * ("red"/"green"/"purple") while MetroLineDto only carries the display name
 * ("Qırmızı Xətt") and a hex color — there's no shared id between the two.
 * Resolving the keyword to the same hex the line uses is what actually links
 * a station back to its line.
 */
const LINE_COLOR_BY_KEYWORD: Record<string, string> = {
  red: '#ef4444',
  green: '#10b981',
  purple: '#8b5cf6',
}

export function stationsForLine(stations: MetroStation[], line: MetroLine): MetroStation[] {
  return stations.filter((station) => LINE_COLOR_BY_KEYWORD[station.line] === line.color)
}
