import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import { BottomNav } from './BottomNav'

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-dvh w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col pb-[calc(env(safe-area-inset-bottom)+4.5rem)] lg:pb-0">
        <Topbar />
        <main className="min-h-0 flex-1 relative">
          <Outlet />
        </main>
      </div>
      <BottomNav />
    </div>
  )
}
