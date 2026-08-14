import { LogOut } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useLocale } from '@/i18n/LocaleContext'
import { LoginForm } from '@/components/admin/LoginForm'
import { PendingReportsTable } from '@/components/admin/PendingReportsTable'
import { PageHeader } from '@/components/common/PageHeader'
import { LoadingState } from '@/components/common/States'

export default function AdminPage() {
  const { s } = useLocale()
  const { user, isAdmin, loading, logout } = useAuth()

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <LoadingState />
      </div>
    )
  }

  if (!user || !isAdmin) return <LoginForm />

  return (
    <div className="scroll-thin h-full overflow-y-auto p-4 sm:p-6">
      <PageHeader
        title={s.adminPage.title}
        subtitle={s.adminPage.subtitle}
        action={
          <button
            onClick={() => void logout()}
            className="flex items-center gap-1.5 rounded-full border border-slate-200 px-3.5 py-2 text-xs font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
          >
            <LogOut className="h-3.5 w-3.5" />
            {s.adminPage.signOut}
          </button>
        }
      />
      <p className="mt-1 text-xs text-slate-400">
        {s.adminPage.loggedInAs} <span className="font-semibold text-slate-600">{user.username}</span>
      </p>

      <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <p className="text-sm font-semibold text-slate-700">{s.adminPage.pendingTitle}</p>
        <div className="mt-2">
          <PendingReportsTable />
        </div>
      </div>
    </div>
  )
}
