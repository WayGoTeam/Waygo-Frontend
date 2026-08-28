import { useState } from 'react'
import { LogOut } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useLocale } from '@/i18n/LocaleContext'
import { LoginForm } from '@/components/admin/LoginForm'
import { PendingReportsTable } from '@/components/admin/PendingReportsTable'
import { ActiveIncidentsTable } from '@/components/admin/ActiveIncidentsTable'
import { AdminAnalytics } from '@/components/admin/AdminAnalytics'
import { AdminLiveMap } from '@/components/admin/AdminLiveMap'
import { PageHeader } from '@/components/common/PageHeader'
import { LoadingState } from '@/components/common/States'

type MainTab = 'analytics' | 'live' | 'incidents'
type IncidentTab = 'pending' | 'active'

export default function AdminPage() {
  const { s } = useLocale()
  const { user, isAdmin, loading, logout } = useAuth()
  const [mainTab, setMainTab] = useState<MainTab>('analytics')
  const [incidentTab, setIncidentTab] = useState<IncidentTab>('pending')

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <LoadingState />
      </div>
    )
  }

  if (!user || !isAdmin) return <LoginForm />

  return (
    <div className="scroll-thin h-full overflow-y-auto p-4 sm:p-6 bg-slate-50/50">
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
      <p className="mt-1 mb-6 text-xs text-slate-400">
        {s.adminPage.loggedInAs} <span className="font-semibold text-slate-600">{user.username}</span>
      </p>

      {/* Main Tabs */}
      <div className="mb-6 flex space-x-1 rounded-xl bg-slate-200/50 p-1">
        <button
          onClick={() => setMainTab('analytics')}
          className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition-all ${
            mainTab === 'analytics' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Analytics & Growth
        </button>
        <button
          onClick={() => setMainTab('live')}
          className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition-all ${
            mainTab === 'live' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Live Map
        </button>
        <button
          onClick={() => setMainTab('incidents')}
          className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition-all ${
            mainTab === 'incidents' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Incidents
        </button>
      </div>

      {/* Tab Content */}
      {mainTab === 'analytics' && <AdminAnalytics />}
      
      {mainTab === 'live' && <AdminLiveMap />}

      {mainTab === 'incidents' && (
        <>
          <div className="mb-4 flex border-b border-slate-200">
            <button
              onClick={() => setIncidentTab('pending')}
              className={`pb-3 text-sm font-semibold transition-colors ${
                incidentTab === 'pending'
                  ? 'border-b-2 border-brand-500 text-brand-600'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
              style={{ marginRight: '24px' }}
            >
              {s.adminPage.pendingTitle}
            </button>
            <button
              onClick={() => setIncidentTab('active')}
              className={`pb-3 text-sm font-semibold transition-colors ${
                incidentTab === 'active'
                  ? 'border-b-2 border-brand-500 text-brand-600'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {s.adminPage.activeTitle || 'Active Incidents'}
            </button>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            {incidentTab === 'pending' ? <PendingReportsTable /> : <ActiveIncidentsTable />}
          </div>
        </>
      )}
    </div>
  )
}
