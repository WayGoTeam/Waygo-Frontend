import type { StyleSpecification } from 'maplibre-gl'

// The URL for our tile server. 
// In dev, it's relative if proxy is used, or absolute localhost if bypassing.
// We'll use a relative path assuming we proxy /tiles to Martin in Vite & Nginx.
const TILE_BASE = '/tiles'

export const mapStyle: StyleSpecification = {
  version: 8,
  name: 'Waygo Light Mode',
  metadata: {},
  sources: {
    'planet_osm_polygon': {
      type: 'vector',
      tiles: [`${TILE_BASE}/planet_osm_polygon/{z}/{x}/{y}.pbf`],
      minzoom: 0,
      maxzoom: 14
    },
    'planet_osm_line': {
      type: 'vector',
      tiles: [`${TILE_BASE}/planet_osm_line/{z}/{x}/{y}.pbf`],
      minzoom: 0,
      maxzoom: 14
    },
    'planet_osm_roads': {
      type: 'vector',
      tiles: [`${TILE_BASE}/planet_osm_roads/{z}/{x}/{y}.pbf`],
      minzoom: 0,
      maxzoom: 14
    },
    'planet_osm_point': {
      type: 'vector',
      tiles: [`${TILE_BASE}/planet_osm_point/{z}/{x}/{y}.pbf`],
      minzoom: 0,
      maxzoom: 14
    }
  },
  glyphs: 'https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf',
  layers: [
    {
      id: 'background',
      type: 'background',
      paint: {
        'background-color': '#f8f9fa' // Light grayish background similar to Google Maps
      }
    },
    // Landuse & Natural Polygons
    {
      id: 'water',
      type: 'fill',
      source: 'planet_osm_polygon',
      'source-layer': 'planet_osm_polygon',
      filter: ['any', ['==', 'natural', 'water'], ['==', 'waterway', 'riverbank']],
      paint: {
        'fill-color': '#aadaff'
      }
    },
    {
      id: 'parks',
      type: 'fill',
      source: 'planet_osm_polygon',
      'source-layer': 'planet_osm_polygon',
      filter: ['any', ['==', 'leisure', 'park'], ['==', 'landuse', 'grass'], ['==', 'natural', 'wood']],
      paint: {
        'fill-color': '#c8facc'
      }
    },
    // Buildings
    {
      id: 'buildings',
      type: 'fill-extrusion',
      source: 'planet_osm_polygon',
      'source-layer': 'planet_osm_polygon',
      filter: ['has', 'building'],
      paint: {
        'fill-extrusion-color': '#e3e4e8',
        'fill-extrusion-height': 5,
        'fill-extrusion-base': 0,
        'fill-extrusion-opacity': 0.8
      }
    },
    // Roads (Lines)
    // Minor roads
    {
      id: 'roads-minor',
      type: 'line',
      source: 'planet_osm_line',
      'source-layer': 'planet_osm_line',
      filter: ['match', ['get', 'highway'], ['residential', 'service', 'unclassified', 'tertiary'], true, false],
      paint: {
        'line-color': '#ffffff',
        'line-width': ['interpolate', ['linear'], ['zoom'], 12, 1, 16, 6]
      }
    },
    // Major roads (secondary, primary, trunk, motorway)
    {
      id: 'roads-major',
      type: 'line',
      source: 'planet_osm_line',
      'source-layer': 'planet_osm_line',
      filter: ['match', ['get', 'highway'], ['primary', 'secondary', 'trunk', 'motorway'], true, false],
      paint: {
        'line-color': '#f9df9f', // Google-like yellow/orange for main roads
        'line-width': ['interpolate', ['linear'], ['zoom'], 10, 1, 16, 8]
      }
    },
    // Waterways (lines)
    {
      id: 'waterways-lines',
      type: 'line',
      source: 'planet_osm_line',
      'source-layer': 'planet_osm_line',
      filter: ['has', 'waterway'],
      paint: {
        'line-color': '#aadaff',
        'line-width': 2
      }
    },
    // Labels (Roads)
    {
      id: 'road-labels',
      type: 'symbol',
      source: 'planet_osm_line',
      'source-layer': 'planet_osm_line',
      filter: ['has', 'name'],
      layout: {
        'text-field': ['get', 'name'],
        'symbol-placement': 'line',
        'text-font': ['Open Sans Regular'],
        'text-size': 12
      },
      paint: {
        'text-color': '#494949',
        'text-halo-color': '#ffffff',
        'text-halo-width': 2
      }
    }
  ]
}
