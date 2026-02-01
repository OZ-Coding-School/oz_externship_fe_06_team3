import { StrictMode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createRoot } from 'react-dom/client'

import '@/index.css'
import App from '@/App'

import { apiClient } from '@/api/client'
import { setupAuthInterceptor } from '@/api/setupInterceptors'
import { useAuthStore } from '@/store/authStore'

const queryClient = new QueryClient()

async function enableMocking() {
  if (!import.meta.env.DEV || import.meta.env.VITE_USE_MSW !== 'true')
    return

  const { worker } = await import('./mocks/browser')
  await worker.start({
    serviceWorker: { url: '/mockServiceWorker.js' },
    onUnhandledRequest: 'warn',
  })
}

async function bootstrap() {
  setupAuthInterceptor(apiClient, () => useAuthStore.getState().accessToken)

  await enableMocking()

  const rootEl = document.getElementById('root')
  if (!rootEl) throw new Error('Root element (#root) not found')

  createRoot(rootEl).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </StrictMode>
  )
}

void bootstrap()
