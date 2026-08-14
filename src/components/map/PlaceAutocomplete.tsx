import { useEffect, useRef, useState } from 'react'
import { Loader2, MapPin, X } from 'lucide-react'
import { searchPlaces } from '@/api/maps'
import { useDebounce } from '@/hooks/useDebounce'
import { useLocale } from '@/i18n/LocaleContext'
import type { PlaceResult } from '@/components/layout/GlobalSearch'
import type { TomTomSearchResult } from '@/types/api'

function toPlaceResults(raw: TomTomSearchResult): PlaceResult[] {
  return (raw.results ?? [])
    .filter((r) => r.position)
    .map((r) => ({
      label: r.poi?.name ?? r.address?.freeformAddress ?? 'Naməlum yer',
      subtitle: r.address?.municipality ?? r.address?.streetName ?? r.address?.countrySubdivision,
      lat: r.position.lat,
      lng: r.position.lon,
    }))
}

export function PlaceAutocomplete({
  value,
  onChange,
  placeholder,
  dotColor,
}: {
  value: PlaceResult | null
  onChange: (place: PlaceResult | null) => void
  placeholder: string
  dotColor: string
}) {
  const { s } = useLocale()
  const [query, setQuery] = useState(value?.label ?? '')
  const [results, setResults] = useState<PlaceResult[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const debouncedQuery = useDebounce(query, 350)
  const containerRef = useRef<HTMLDivElement>(null)

  // Keep the input text in sync when the value is changed programmatically (e.g. swap button).
  useEffect(() => {
    setQuery(value?.label ?? '')
  }, [value])

  useEffect(() => {
    if (value && debouncedQuery === value.label) return
    const trimmed = debouncedQuery.trim()
    if (trimmed.length < 2) {
      setResults(null)
      return
    }
    let cancelled = false
    setLoading(true)
    searchPlaces(trimmed)
      .then((raw) => {
        if (cancelled) return
        setResults(toPlaceResults(raw))
      })
      .catch(() => {
        if (!cancelled) setResults([])
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery])

  return (
    <div
      ref={containerRef}
      className="relative"
      onBlur={(e) => {
        if (!containerRef.current?.contains(e.relatedTarget as Node)) setOpen(false)
      }}
    >
      <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 focus-within:border-brand-300 focus-within:bg-white focus-within:ring-2 focus-within:ring-brand-100">
        <span
          className="h-2.5 w-2.5 shrink-0 rounded-full ring-2 ring-white"
          style={{ backgroundColor: dotColor, boxShadow: '0 0 0 1px rgb(0 0 0 / 0.06)' }}
        />
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            if (value) onChange(null)
          }}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          className="w-full min-w-0 bg-transparent text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
        />
        {loading && <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin text-slate-300" />}
        {!loading && query && (
          <button
            type="button"
            aria-label={s.common.close}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              setQuery('')
              setResults(null)
              onChange(null)
            }}
            className="shrink-0 rounded-full p-0.5 text-slate-400 hover:bg-slate-200 hover:text-slate-600"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {open && !value && (results !== null || loading) && (
        <div className="scroll-thin absolute left-0 right-0 top-[calc(100%+6px)] z-[1000] max-h-64 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-1.5 shadow-float animate-fade-up">
          {results === null && loading && (
            <div className="flex items-center justify-center gap-2 py-4 text-xs text-slate-400">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              {s.routePlanner.searching}
            </div>
          )}
          {results !== null && results.length === 0 && !loading && (
            <p className="px-3 py-4 text-center text-xs text-slate-400">{s.routePlanner.noResults}</p>
          )}
          {results?.map((place, i) => (
            <button
              key={`${place.lat}-${place.lng}-${i}`}
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                onChange(place)
                setOpen(false)
              }}
              className="flex w-full items-start gap-2.5 rounded-xl px-2.5 py-2 text-left text-sm transition hover:bg-brand-50"
            >
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />
              <span className="min-w-0">
                <span className="block truncate font-medium text-slate-800">{place.label}</span>
                {place.subtitle && (
                  <span className="block truncate text-xs text-slate-400">{place.subtitle}</span>
                )}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
