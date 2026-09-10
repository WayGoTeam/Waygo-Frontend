import { useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft, MapPinOff } from 'lucide-react'
import { useLocale } from '@/i18n/LocaleContext'

/**
 * Catch-all route (audit L11). Unknown URLs previously rendered the layout
 * with an empty outlet; this gives users an explicit message and a way home.
 */
export default function NotFoundPage() {
  const { s } = useLocale()
  const navigate = useNavigate()
  const { pathname } = useLocation()

  useEffect(() => {
    const previous = document.title
    document.title = `404 · ${s.notFound.title} · WayGo`
    return () => {
      document.title = previous
    }
  }, [s.notFound.title])

  return (
    <main className="flex h-full min-h-[60vh] flex-col items-center justify-center px-6 py-16 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
        <MapPinOff className="h-9 w-9 text-slate-400" aria-hidden="true" />
      </div>
      <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-brand-600">404</p>
      <h1 className="mt-2 font-display text-2xl font-bold text-slate-900 dark:text-slate-50 sm:text-3xl">
        {s.notFound.title}
      </h1>
      <p className="mt-3 max-w-md text-sm text-slate-500 dark:text-slate-400">{s.notFound.description}</p>
      <code className="mt-3 max-w-full truncate rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-500 dark:bg-slate-800 dark:text-slate-400">
        {pathname}
      </code>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          to="/"
          className="inline-flex items-center justify-center rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
        >
          {s.notFound.goHome}
        </Link>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          {s.notFound.goBack}
        </button>
      </div>
    </main>
  )
}
