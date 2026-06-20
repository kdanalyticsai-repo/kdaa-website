import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import AppRoot from './app/AppRoot'
import './styles/globals.css'

// The ProAICV web app is served at the root of its own subdomain
// (proaicv.kdaanalytics.com). On the marketing domain (kdaanalytics.com) and on
// localhost we render the marketing site. For local app dev, run with
// VITE_APP_TARGET=app to force app mode at localhost:5173.
const host = window.location.hostname
const isAppHost =
  host.startsWith('proaicv.') ||
  import.meta.env.VITE_APP_TARGET === 'app'

// The app and marketing site share one index.html, so brand the browser tab
// (title + favicon) at runtime when we're serving the ProAICV app.
if (isAppHost) {
  document.title = 'ProAICV'
  const favicon =
    document.querySelector<HTMLLinkElement>("link[rel='icon']") ??
    document.head.appendChild(Object.assign(document.createElement('link'), { rel: 'icon' }))
  favicon.type = 'image/png'
  favicon.href = '/proaicv-logo.png'
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      {isAppHost ? <AppRoot /> : <App />}
    </BrowserRouter>
  </React.StrictMode>
)
