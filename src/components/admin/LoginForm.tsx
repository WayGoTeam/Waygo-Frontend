import { useState } from 'react'
import type { FormEvent } from 'react'
import { Loader2, Lock, User } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useLocale } from '@/i18n/LocaleContext'
import { LogoMark } from '@/components/common/LogoMark'

export function LoginForm() {
  const { s } = useLocale()
  const { login } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(false)
    try {
      await login(username, password)
    } catch {
      setError(true)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex h-full items-center justify-center p-4">
      <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col items-center gap-2 text-center">
          <LogoMark size={44} />
          <h1 className="mt-1 font-display text-lg font-bold text-slate-900">{s.adminPage.loginTitle}</h1>
          <p className="text-sm text-slate-500">{s.adminPage.loginSubtitle}</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-3">
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 focus-within:border-brand-300 focus-within:bg-white focus-within:ring-2 focus-within:ring-brand-100">
            <User className="h-4 w-4 shrink-0 text-slate-400" />
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={s.adminPage.username}
              autoComplete="username"
              required
              className="w-full bg-transparent text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 focus-within:border-brand-300 focus-within:bg-white focus-within:ring-2 focus-within:ring-brand-100">
            <Lock className="h-4 w-4 shrink-0 text-slate-400" />
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={s.adminPage.password}
              type="password"
              autoComplete="current-password"
              required
              className="w-full bg-transparent text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
            />
          </div>

          {error && <p className="rounded-xl bg-red-50 px-3 py-2 text-center text-xs text-red-600">{s.adminPage.invalidCredentials}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:opacity-60"
          >
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {submitting ? s.adminPage.signingIn : s.adminPage.signIn}
          </button>
        </form>
      </div>
    </div>
  )
}
