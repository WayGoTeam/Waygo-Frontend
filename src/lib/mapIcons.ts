import L from 'leaflet'

export function dotIcon(color: string, size = 16): L.DivIcon {
  return L.divIcon({
    className: '',
    html: `<span style="display:block;width:${size}px;height:${size}px;border-radius:9999px;background:${color};border:3px solid white;box-shadow:0 1px 4px rgba(15,23,42,0.35)"></span>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  })
}

export function pinIcon(color: string, size = 34): L.DivIcon {
  return L.divIcon({
    className: 'waygo-pulse-icon',
    html: `
      <svg width="${size}" height="${size}" viewBox="0 0 34 42" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M17 0C7.6 0 0 7.6 0 17c0 11.3 15 23.6 15.7 24.1a2 2 0 0 0 2.6 0C19 40.6 34 28.3 34 17 34 7.6 26.4 0 17 0Z" fill="${color}"/>
        <circle cx="17" cy="17" r="7" fill="white"/>
      </svg>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size],
  })
}

export function incidentIcon(color: string, pulse: boolean, size = 30): L.DivIcon {
  return L.divIcon({
    className: 'waygo-pulse-icon',
    html: `
      <span style="position:relative;display:flex;align-items:center;justify-content:center;width:${size}px;height:${size}px;">
        ${pulse ? `<span class="waygo-pulse-ring" style="position:absolute;inset:0;border-radius:9999px;background:${color};opacity:0.5;"></span>` : ''}
        <span style="position:relative;display:flex;align-items:center;justify-content:center;width:${size * 0.72}px;height:${size * 0.72}px;border-radius:9999px;background:${color};border:2.5px solid white;box-shadow:0 2px 6px rgba(15,23,42,0.35);">
          <svg width="${size * 0.4}" height="${size * 0.4}" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
            <line x1="12" x2="12" y1="9" y2="13"/>
            <line x1="12" x2="12.01" y1="17" y2="17"/>
          </svg>
        </span>
      </span>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  })
}
