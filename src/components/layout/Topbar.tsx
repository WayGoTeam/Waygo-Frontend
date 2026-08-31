import { Bell, Menu, SlidersHorizontal, LogOut, User } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLocale } from '@/i18n/LocaleContext'
import type { Locale } from '@/i18n/LocaleContext'
import { useIncidentsContext } from '@/context/IncidentsContext'
import { useSocket } from '@/context/SocketContext'
import { useMapLayers } from '@/context/MapLayersContext'
import { GlobalSearch } from './GlobalSearch'
import { Popover } from '@/components/common/Popover'
import { Badge, IconButton, Toggle } from '@/components/common/primitives'
import { IncidentRow } from '@/components/incidents/IncidentRow'
import { EmptyState } from '@/components/common/States'
import { Modal } from '@/components/common/Modal'
import { useAuth } from '@/context/AuthContext'
import { OtpLoginModal } from '@/components/auth/OtpLoginModal'

export function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const { s, locale, setLocale } = useLocale()
  const navigate = useNavigate()
  const { incidents } = useIncidentsContext()
  const { recentEvents, unseenCount, markAllSeen } = useSocket()
  const { showTraffic, setShowTraffic, showIncidents, setShowIncidents, showLiveIncidents, setShowLiveIncidents } =
    useMapLayers()
  const { user, logout } = useAuth()
  const [showLogin, setShowLogin] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  const activeIncidents = incidents ?? []

  return (
    <header className="relative z-[2000] flex h-16 shrink-0 items-center gap-3 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 sm:px-6">
      <button
        onClick={onMenuClick}
        aria-label={s.topbar.menu}
        className="rounded-full p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      <GlobalSearch />

      <Popover
        align="left"
        trigger={({ toggle, open }) => (
          <IconButton label={s.topbar.filters} active={open} onClick={toggle}>
            <SlidersHorizontal className="h-4 w-4" />
          </IconButton>
        )}
      >
        <div className="w-64 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 shadow-float">
          <p className="px-1 pb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
            {s.layers.title}
          </p>
          <div className="space-y-1">
            <FilterRow label={s.layers.traffic} checked={showTraffic} onChange={setShowTraffic} />
            <FilterRow label={s.layers.incidents} checked={showIncidents} onChange={setShowIncidents} />
            <FilterRow label={s.layers.liveIncidents} checked={showLiveIncidents} onChange={setShowLiveIncidents} />
          </div>
        </div>
      </Popover>

      <div className="ml-auto flex items-center gap-2">


        <Popover
          trigger={({ toggle, open }) => (
            <IconButton
              label={s.topbar.notifications}
              active={open}
              onClick={() => {
                toggle()
                markAllSeen()
              }}
              className="relative"
            >
              <Bell className="h-4 w-4" />
              {unseenCount > 0 && (
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
              )}
            </IconButton>
          )}
        >
          <div className="scroll-thin max-h-96 w-80 overflow-y-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2 shadow-float">
            <p className="px-2 py-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
              {s.topbar.notifications}
            </p>
            {recentEvents.length === 0 ? (
              <EmptyState title={s.topbar.noNotifications} />
            ) : (
              recentEvents.map((event, i) => <IncidentRow key={`${event.id}-${i}`} incident={event} dense />)
            )}
          </div>
        </Popover>

        <Popover
          trigger={({ toggle, open }) => (
            <button
              onClick={toggle}
              className={`flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-semibold uppercase transition ${
                open ? 'border-brand-300 bg-brand-50 text-brand-700' : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:border-slate-300'
              }`}
            >
              {locale}
            </button>
          )}
        >
          <div className="w-28 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-1 shadow-float">
            {(['az', 'en'] as Locale[]).map((code) => (
              <button
                key={code}
                onClick={() => setLocale(code)}
                className={`block w-full rounded-xl px-3 py-2 text-left text-sm font-medium uppercase ${
                  locale === code ? 'bg-brand-50 text-brand-700' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/50'
                }`}
              >
                {code}
              </button>
            ))}
          </div>
        </Popover>
      </div>

      <div className="ml-2 flex items-center gap-3 border-l border-slate-200 dark:border-slate-800 pl-4">
        {user ? (
          <div className="flex items-center gap-3">
            <div className="flex flex-col text-right">
              <span className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                {user.fullName || user.email || (user.username?.startsWith('google:') ? 'İstifadəçi' : user.username)}
              </span>
              {user.vehicleType && <span className="text-[10px] uppercase font-bold text-brand-600">{user.vehicleType}</span>}
            </div>
            <button
              onClick={() => setShowLogoutConfirm(true)}
              title="Çıxış"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowLogin(true)}
            className="flex items-center gap-2 rounded-full bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
          >
            <User className="h-4 w-4" />
            Giriş
          </button>
        )}
      </div>

      {showLogin && <OtpLoginModal onClose={() => setShowLogin(false)} />}

      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <button
            aria-label="Close"
            onClick={() => setShowLogoutConfirm(false)}
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity"
          />
          <div className="relative w-full max-w-[480px] animate-fade-up flex flex-col items-center justify-center rounded-[2rem] bg-white dark:bg-slate-900 p-8 shadow-2xl">
            <button
              onClick={() => setShowLogoutConfirm(false)}
              className="absolute right-6 top-6 rounded-full p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-400 transition"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
            
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-50 mb-6 border-8 border-brand-50/50">
              <LogOut className="h-8 w-8 text-brand-600 ml-1" />
            </div>
            
            <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-slate-50 text-center">
              Çıxış etmək istəyirsiniz?
            </h2>
            <p className="mt-3 text-center text-[15px] leading-relaxed text-slate-500 dark:text-slate-400 max-w-[320px]">
              Hesabınızdan çıxış edilir. Yenidən daxil olmaq üçün qeydiyyatdan keçdiyiniz nömrəni istifadə edə bilərsiniz.
            </p>
            
            <div className="mt-8 flex w-full flex-col-reverse gap-3 sm:flex-row sm:justify-center sm:gap-4">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="w-full rounded-2xl bg-slate-100 dark:bg-slate-800 px-6 py-3.5 text-[15px] font-bold text-slate-600 dark:text-slate-400 transition hover:bg-slate-200 dark:hover:bg-slate-700 sm:w-[160px]"
              >
                Ləğv et
              </button>
              <button
                onClick={() => {
                  setShowLogoutConfirm(false)
                  logout()
                }}
                className="w-full rounded-2xl bg-brand-600 px-6 py-3.5 text-[15px] font-bold text-white shadow-lg shadow-brand-500/30 transition hover:bg-brand-700 hover:shadow-brand-500/40 sm:w-[160px]"
              >
                Bəli, çıxış et
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

function FilterRow({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between rounded-xl px-2 py-1.5 text-sm text-slate-600 dark:text-slate-400">
      <span>{label}</span>
      <Toggle checked={checked} onChange={onChange} label={label} />
    </div>
  )
}
