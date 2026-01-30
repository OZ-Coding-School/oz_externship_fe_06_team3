import { useState, useMemo } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { fetchExamDeployments } from '@/api/quiz'
import QuizTabs, { Tabs } from '@/components/quiz/QuizTabs'
import QuizContent from '@/components/quiz/QuizContent'

type TabKey = 'all' | 'done' | 'todo'

const INITIAL_TAB: TabKey = 'all'
const TITLE_CLASS = 'title-xl text-[#121212] min-w-[744px] mb-8'
const CONTAINER_CLASS = 'space-y-6'

const MyPageQuiz = () => {
  const [currentTab, setCurrentTab] = useState<TabKey>(INITIAL_TAB)
  const currentStatus = useMemo(
    () => Tabs.find((tab) => tab.key === currentTab)?.status || 'all',
    [currentTab]
  )

  // 무한 스크롤: 페이지 단위로 목록 조회, 스크롤 시 다음 페이지 자동 요청
  const deploymentsQuery = useInfiniteQuery({
    queryKey: ['examDeployments', 'infinite', currentStatus],
    queryFn: ({ pageParam }) =>
      fetchExamDeployments({ page: pageParam as number, status: currentStatus }),
    initialPageParam: 1,
    getNextPageParam: (last) => (last.hasNext ? last.page + 1 : undefined),
  })
  const quizzes = useMemo(
    () => deploymentsQuery.data?.pages.flatMap((p) => p.results) ?? [],
    [deploymentsQuery.data?.pages]
  )

  return (
    <div className={CONTAINER_CLASS}>
      <h1 className={TITLE_CLASS}>쪽지시험</h1>
      <QuizTabs currentTab={currentTab} onTabChange={setCurrentTab} />
      <QuizContent
        quizzes={quizzes}
        isLoading={deploymentsQuery.isLoading}
        isError={deploymentsQuery.isError}
        currentTab={currentTab}
        onLoadMore={deploymentsQuery.hasNextPage ? deploymentsQuery.fetchNextPage : undefined}
        isFetchingNextPage={deploymentsQuery.isFetchingNextPage}
      />
    </div>
  )
}

export default MyPageQuiz
