import { Outlet } from 'react-router'
import { Header } from '../common'

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col [--header-offset:100px]">
      <Header />
      {/* 헤더가 fixed이므로, 헤더의 높이만큼 padding-top을 주었습니다. */}
      {/* h-16(64px) + 알림바(약 36px) = 약 100px */}
      <main className="flex-1 pt-[var(--header-offset)]">
        <Outlet />
      </main>
    </div>
  )
}