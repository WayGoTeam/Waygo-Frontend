import { NavLink } from 'react-router-dom'
import { BarChart3, CloudSun, MapIcon, TriangleAlert, UserCircle, Wallet } from 'lucide-react'
import { useLocale } from '@/i18n/LocaleContext'
import { useIncidentsContext } from '@/context/IncidentsContext'

export function BottomNav() {
  const { s } = useLocale()
  const { incidents } = useIncidentsContext()
  const incidentCount = incidents?.length ?? 0

  const navItems = [
    { to: '/', label: s.nav.liveMap, icon: MapIcon },
    { to: '/incidents', label: s.nav.incidents, icon: TriangleAlert, badge: incidentCount },
    { to: '/analytics', label: s.nav.analytics, icon: BarChart3 },
    { to: '/weather', label: s.nav.weather, icon: CloudSun },
    { to: '/wallet', label: s.nav.ecoWallet, icon: Wallet },
    { to: '/profile', label: s.nav.profile, icon: UserCircle },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[1500] flex items-center justify-evenly border-t border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 px-2 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] pt-2 backdrop-blur-md lg:hidden">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === '/'}
          className={({ isActive }) =>
            `relative flex flex-col items-center justify-center gap-1 rounded-xl py-1.5 flex-1 min-w-0 transition-colors ${
              isActive
                ? 'text-brand-600 dark:text-brand-500'
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-300'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <item.icon
                className={`h-5 w-5 ${isActive ? 'text-brand-600 dark:text-brand-500' : ''}`}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span className="text-[10px] font-medium leading-none tracking-tight truncate w-full text-center px-0.5">
                {item.label}
              </span>
              {!!item.badge && (
                <span className="absolute right-2 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white shadow-sm ring-2 ring-white dark:ring-slate-900">
                  {item.badge}
                </span>
              )}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
