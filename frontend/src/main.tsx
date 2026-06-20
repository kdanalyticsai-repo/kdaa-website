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
// (title + favicon) and load the app's fonts at runtime when serving the app.
if (isAppHost) {
  document.title = 'ProAICV'
  const favicon =
    document.querySelector<HTMLLinkElement>("link[rel='icon']") ??
    document.head.appendChild(Object.assign(document.createElement('link'), { rel: 'icon' }))
  favicon.type = 'image/png'
  favicon.href = '/proaicv-logo.png'

  // Lumina design system: Plus Jakarta Sans (all type) + Material Symbols
  // Outlined (line-art icons). Scoped to the app host so marketing is untouched.
  document.head.appendChild(Object.assign(document.createElement('link'), {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap',
  }))
  document.head.appendChild(Object.assign(document.createElement('link'), {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap',
  }))

  // PWA: installable web app (scoped to the app host, so marketing is untouched).
  document.head.appendChild(Object.assign(document.createElement('link'), {
    rel: 'manifest', href: '/proaicv.webmanifest',
  }))
  document.head.appendChild(Object.assign(document.createElement('meta'), {
    name: 'theme-color', content: '#3800c0',
  }))
  // iOS Safari uses apple-* tags (not the manifest) for the home-screen icon,
  // app title and standalone launch — so the iPhone install matches the app.
  document.head.appendChild(Object.assign(document.createElement('link'), {
    rel: 'apple-touch-icon', href: '/proaicv-app-icon.png',
  }))
  const appleMeta = (name: string, content: string) =>
    document.head.appendChild(Object.assign(document.createElement('meta'), { name, content }))
  appleMeta('apple-mobile-web-app-capable', 'yes')
  appleMeta('apple-mobile-web-app-status-bar-style', 'default')
  appleMeta('apple-mobile-web-app-title', 'ProAICV')
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').catch(() => {})
    })
  }
  // Capture the install prompt early so the Install button can fire it later.
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    ;(window as unknown as { __pwaPrompt?: Event }).__pwaPrompt = e
    window.dispatchEvent(new Event('pwa-installable'))
  })
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      {isAppHost ? <AppRoot /> : <App />}
    </BrowserRouter>
  </React.StrictMode>
)
