import { useEffect, useRef } from 'react'
import QuizCard from './QuizCard'
import { Loading } from '@/components/common'
import type { ExamDeploymentsResult } from '@/mappers/examDeployments'

type TabKey = 'all' | 'done' | 'todo'

const EMPTY_MESSAGES: Record<TabKey, string> = {
  all: '표시할 쪽지시험이 없습니다.',
  done: '응시 완료한 쪽지시험이 없습니다.',
  todo: '응시할 쪽지시험이 없습니다.',
}

const CENTER_MESSAGE_CLASS = 'flex justify-center items-center py-20'
const INFINITE_SCROLL_ROOT_MARGIN = '100px'

interface QuizContentProps {
  quizzes: ExamDeploymentsResult['results']
  isLoading: boolean
  isError: boolean
  currentTab: TabKey
  // 무한 스크롤: 리스트 하단 도달 시 호출되는 다음 페이지 로드 콜백
  onLoadMore?: () => void
  // 무한 스크롤: 다음 페이지 로딩 중이면 true (중복 요청 방지)
  isFetchingNextPage?: boolean
}

export default function QuizContent({
  quizzes,
  isLoading,
  isError,
  currentTab,
  onLoadMore,
  isFetchingNextPage = false,
}: QuizContentProps) {
  // 무한 스크롤: 하단 센티넬이 화면에 보이면 onLoadMore 호출 (IntersectionObserver)
  const sentinelRef = useRef<HTMLDivElement>(null)
  const loadingRef = useRef(false)
  useEffect(() => {
    loadingRef.current = isFetchingNextPage
  }, [isFetchingNextPage])
  useEffect(() => {
    if (!onLoadMore) return
    const el = sentinelRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting || loadingRef.current) return
        loadingRef.current = true
        onLoadMore()
      },
      { rootMargin: INFINITE_SCROLL_ROOT_MARGIN, threshold: 0 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [onLoadMore, isFetchingNextPage])

  // 상태별 UI: 로딩 / 에러 / 빈 목록
  if (isLoading) {
    return (
      <div className={CENTER_MESSAGE_CLASS}>
        <Loading />
      </div>
    )
  }

  if (isError) {
    return (
      <div className={CENTER_MESSAGE_CLASS}>
        <p className="text-gray-200">데이터를 불러오는 중 오류가 발생했습니다.</p>
      </div>
    )
  }

  if (quizzes.length === 0) {
    return (
      <div className={CENTER_MESSAGE_CLASS}>
        <p className="text-gray-500">{EMPTY_MESSAGES[currentTab]}</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {quizzes.map((quiz) => (
        <QuizCard key={quiz.id} quiz={quiz} />
      ))}
      {/* 무한 스크롤: 이 요소가 보이면 다음 페이지 요청 (ref로 IntersectionObserver 감지) */}
      {onLoadMore && <div ref={sentinelRef} className="h-4" aria-hidden />}
      {/* 무한 스크롤: 다음 페이지 로딩 중일 때 하단에 로딩 표시 */}
      {isFetchingNextPage && (
        <div className="flex justify-center py-6">
          <Loading />
        </div>
      )}
    </div>
  )
}
