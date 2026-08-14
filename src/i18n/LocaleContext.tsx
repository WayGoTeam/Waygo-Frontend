import { createContext, useContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { az, en } from './strings'
import type { Strings } from './strings'

export type Locale = 'az' | 'en'

const dictionaries: Record<Locale, Strings> = { az, en }
const STORAGE_KEY = 'waygo.locale'

function readStoredLocale(): Locale {
  if (typeof window === 'undefined') return 'az'
  const stored = window.localStorage.getItem(STORAGE_KEY)
  return stored === 'en' ? 'en' : 'az'
}

interface LocaleContextValue {
  locale: Locale
  s: Strings
  setLocale: (locale: Locale) => void
}

const LocaleContext = createContext<LocaleContextValue | null>(null)

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(readStoredLocale)

  const setLocale = (next: Locale) => {
    setLocaleState(next)
    window.localStorage.setItem(STORAGE_KEY, next)
  }

  const value = useMemo<LocaleContextValue>(
    () => ({ locale, s: dictionaries[locale], setLocale }),
    [locale],
  )

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}

export function useLocale() {
  const ctx = useContext(LocaleContext)
  if (!ctx) throw new Error('useLocale must be used within a LocaleProvider')
  return ctx
}
