import type { ReactNode } from 'react'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { useLocale } from '@/i18n/LocaleContext'

/**
 * Wraps GoogleOAuthProvider so the GSI script (and therefore the "Sign in with Google"
 * button text) follows the UI locale instead of the browser default (audit L09).
 * The `key` forces a remount when the locale changes so the script is reloaded with the new `hl`.
 */
export function GoogleAuthProvider({ children }: { children: ReactNode }) {
  const { locale } = useLocale()
  return (
    <GoogleOAuthProvider
      key={locale}
      clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || 'dummy'}
      locale={locale}
    >
      {children}
    </GoogleOAuthProvider>
  )
}
