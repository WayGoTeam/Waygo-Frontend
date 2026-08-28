import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import { LocaleProvider } from '@/i18n/LocaleContext'
import { SocketProvider } from '@/context/SocketContext'
import { AuthProvider } from '@/context/AuthContext'
import { MapLayersProvider } from '@/context/MapLayersContext'
import { IncidentsProvider } from '@/context/IncidentsContext'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { ThemeProvider } from '@/context/ThemeContext'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <LocaleProvider>
        <SocketProvider>
          <AuthProvider>
            <MapLayersProvider>
              <IncidentsProvider>
                <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || 'dummy'}>
                  <App />
                </GoogleOAuthProvider>
              </IncidentsProvider>
            </MapLayersProvider>
          </AuthProvider>
        </SocketProvider>
        </LocaleProvider>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
)
