import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { AppLayout } from '@/components/layout/AppLayout'
import { ChatWidget } from '@/components/chat/ChatWidget'
import LiveMapPage from '@/pages/LiveMapPage'

const AnalyticsPage = lazy(() => import('@/pages/AnalyticsPage'))
const IncidentsPage = lazy(() => import('@/pages/IncidentsPage'))
const AdminPage = lazy(() => import('@/pages/AdminPage'))
const WalletPage = lazy(() => import('@/pages/WalletPage'))
const ProfilePage = lazy(() => import('@/pages/ProfilePage'))
const WeatherPage = lazy(() => import('@/pages/WeatherPage'))

function PageFallback() {
  return (
    <div className="flex h-full items-center justify-center">
      <Loader2 className="h-5 w-5 animate-spin text-slate-300" />
    </div>
  )
}

export default function App() {
  return (
    <>
      <Routes>
        <Route element={<AppLayout />}>
          {/* Live Map stays eager — it's the default landing page. */}
          <Route index element={<LiveMapPage />} />
          <Route
            path="analytics"
            element={
              <Suspense fallback={<PageFallback />}>
                <AnalyticsPage />
              </Suspense>
            }
          />
          <Route
            path="incidents"
            element={
              <Suspense fallback={<PageFallback />}>
                <IncidentsPage />
              </Suspense>
            }
          />
          <Route
            path="admin"
            element={
              <Suspense fallback={<PageFallback />}>
                <AdminPage />
              </Suspense>
            }
          />
          <Route
            path="wallet"
            element={
              <Suspense fallback={<PageFallback />}>
                <WalletPage />
              </Suspense>
            }
          />
          <Route
            path="weather"
            element={
              <Suspense fallback={<PageFallback />}>
                <WeatherPage />
              </Suspense>
            }
          />
          <Route
            path="profile"
            element={
              <Suspense fallback={<PageFallback />}>
                <ProfilePage />
              </Suspense>
            }
          />
        </Route>
      </Routes>
      <ChatWidget />
    </>
  )
}
