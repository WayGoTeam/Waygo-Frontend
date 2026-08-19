import { NavLink } from 'react-router-dom'
import { BarChart3, Bus, CloudSun, MapIcon, ShieldCheck, TriangleAlert, X, Wallet, LogOut } from 'lucide-react'
import { useLocale } from '@/i18n/LocaleContext'
import { useIncidentsContext } from '@/context/IncidentsContext'
import { LogoMark } from '@/components/common/LogoMark'
import { WeatherMiniCard } from '@/components/weather/WeatherMiniCard'

import { Badge } from '@/components/common/primitives'
import { useAuth } from '@/context/AuthContext'

export function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { s } = useLocale()
  const { incidents } = useIncidentsContext()
  const { user, isAdmin } = useAuth()
  const incidentCount = incidents?.length ?? 0

  const navItems = [
    { to: '/', label: s.nav.liveMap, icon: MapIcon },
    { to: '/analytics', label: s.nav.analytics, icon: BarChart3 },
    { to: '/incidents', label: s.nav.incidents, icon: TriangleAlert, badge: incidentCount },
    { to: '/wallet', label: 'Eko-Cüzdan', icon: Wallet },
  ]

  return (
    <>
      {open && (
        <button
          aria-label={s.common.close}
          onClick={onClose}
          className="fixed inset-0 z-30 bg-slate-900/30 backdrop-blur-[1px] lg:hidden"
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 shrink-0 -translate-x-full flex-col border-r border-slate-200 bg-white transition-transform duration-200 lg:static lg:z-0 lg:h-full lg:translate-x-0 ${
          open ? 'translate-x-0' : ''
        }`}
      >
        <div className="flex items-center justify-between gap-2.5 px-5 py-5">
          <div className="flex items-center gap-2.5">
            <LogoMark size={36} />
            <div>
              <p className="font-display text-lg font-extrabold leading-none text-slate-900">
                {s.brand.name}
              </p>
              <p className="mt-0.5 text-[11px] font-semibold text-brand-600">{s.brand.tagline}</p>
            </div>
          </div>
          <button
            aria-label={s.common.close}
            onClick={onClose}
            className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 lg:hidden"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        <nav className="scroll-thin flex-1 space-y-1 overflow-y-auto px-3">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              onClick={onClose}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon
                    className={`h-[18px] w-[18px] shrink-0 ${isActive ? 'text-brand-600' : 'text-slate-400 group-hover:text-slate-500'}`}
                    strokeWidth={2}
                  />
                  <span className="flex-1 truncate">{item.label}</span>
                  {!!item.badge && <Badge tone="red">{item.badge}</Badge>}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="space-y-3 px-3 pb-3 pt-3">
          <WeatherMiniCard />

        </div>

        {isAdmin && (
          <div className="border-t border-slate-100 px-3 py-3">
            <NavLink
              to="/admin"
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              <ShieldCheck className="h-[18px] w-[18px] shrink-0" strokeWidth={2} />
              {s.nav.adminPanel}
            </NavLink>
          </div>
        )}
      </aside>
    </>
  )
}
