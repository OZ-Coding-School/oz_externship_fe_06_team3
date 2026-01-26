import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router'
import clsx from 'clsx'

import { Button } from '@/components/common/Button'

const TABS = [
  { id: 'exam', label: '쪽지시험', image: '/LandingPage_img/main_exam.png' },
  { id: 'qna', label: '질의응답', image: '/LandingPage_img/main_qna.png' },
  {
    id: 'community',
    label: '커뮤니티',
    image: '/LandingPage_img/main_community.png',
  },
] as const

type TabType = (typeof TABS)[number]['id']

function LandingPage() {
  const [activeTab, setActiveTab] = useState<TabType>('exam')
  const [displayTab, setDisplayTab] = useState<TabType>('exam')
  const [isFadingOut, setIsFadingOut] = useState(false)

  const timeoutRef = useRef<number | null>(null)
  const currentTab = useMemo(
    () => TABS.find((t) => t.id === displayTab) ?? TABS[0],
    [displayTab]
  )

  const handleTabClick = (next: TabType) => {
    if (next === activeTab) return

    setActiveTab(next)
    setIsFadingOut(true)

    if (timeoutRef.current) window.clearTimeout(timeoutRef.current)

    timeoutRef.current = window.setTimeout(() => {
      setDisplayTab(next)
      setIsFadingOut(false)
    }, 180)
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current)
    }
  }, [])

  return (
    <div className="min-h-screen bg-white">
      <section className="flex flex-col items-center">
        <div className="w-full bg-gray-50">
          <div
            className={clsx(
              'mx-auto w-full max-w-[1200px] px-5',
              'min-h-[calc(100dvh-var(--header-offset,100px))]',
              'flex flex-col justify-center',
              'py-8',
              'scroll-mt-[var(--header-offset,100px)]',
              'overflow-hidden'
            )}
          >
            <h1 className="text-center text-3xl leading-snug font-bold sm:text-4xl lg:text-5xl">
              쪽지 시험으로 <br />
              실력을 차곡차곡 쌓아보세요
            </h1>

            <div className="border-mono-200 mx-auto my-6 w-fit rounded-full border bg-white px-2 py-2 shadow-sm sm:my-10">
              <div className="flex flex-wrap justify-center gap-2">
                {TABS.map((tab) => {
                  const isActive = activeTab === tab.id
                  return (
                    <Button
                      key={tab.id}
                      type="button"
                      variant={isActive ? 'primary' : undefined}
                      size="auto"
                      rounded="full"
                      onClick={() => handleTabClick(tab.id)}
                      aria-pressed={isActive}
                      className={clsx(
                        'px-5 py-2 transition-all duration-200 sm:px-6',
                        'focus-visible:ring-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
                        isActive
                          ? 'shadow-md'
                          : 'text-mono-600 hover:bg-mono-200 border-transparent bg-white'
                      )}
                    >
                      {tab.label}
                    </Button>
                  )
                })}
              </div>
            </div>

            <div className="relative flex items-center justify-center">
              <div
                className={clsx(
                  'w-full transition-all duration-300 ease-out',
                  isFadingOut
                    ? 'translate-y-2 opacity-0'
                    : 'translate-y-0 opacity-100'
                )}
              >
                <img
                  src={currentTab.image}
                  alt={`${currentTab.label} 화면 미리보기`}
                  className="h-auto max-h-[45dvh] w-full object-contain sm:max-h-[52dvh] lg:max-h-[58dvh]"
                  draggable={false}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="w-full py-16 sm:py-24 lg:py-40">
          <div className="mx-auto w-full max-w-[1200px] px-5">
            <Link
              to="/qna"
              className="block overflow-hidden rounded-2xl shadow-sm transition-shadow hover:shadow-md"
            >
              <img
                src="/LandingPage_img/main_banner.png"
                alt="Q&A 페이지 바로가기"
                className="h-auto w-full"
              />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default LandingPage
