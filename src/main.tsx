import { StrictMode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { createRoot } from 'react-dom/client'

import '@/index.css'
import App from '@/App.tsx'

const queryClient = new QueryClient()

async function enableMocking() {
  if (process.env.NODE_ENV !== 'development') {
    // 개발 모드인 경우에는 워커 실행 X
    return
  }
  const { worker } = await import('@/mocks/browser.ts') // 이전에 설정한 브라우저 환경설정 import

  return worker.start({
    onUnhandledRequest: 'bypass', // 모킹되지 않은 요청은 실제 서버로 전달
  })
}

enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </StrictMode>
  )
})
