import { useState, useMemo } from 'react'
import { useExamDeploymentsQuery } from '@/hooks/useQuiz'
import QuizTabs, { Tabs } from '@/components/quiz/QuizTabs'
import QuizContent from '@/components/quiz/QuizContent'

type TabKey = 'all' | 'done' | 'todo'

const INITIAL_TAB: TabKey = 'all'
const INITIAL_PAGE = 1
const TITLE_CLASS = 'title-xl text-[#121212] min-w-[744px] mb-8'
const CONTAINER_CLASS = 'space-y-6'

const MyPageQuiz = () => {
  const [currentTab, setCurrentTab] = useState<TabKey>(INITIAL_TAB)

  // 현재 탭에 맞는 API status 값 계산
  const currentStatus = useMemo(
    () => Tabs.find((tab) => tab.key === currentTab)?.status || 'all',
    [currentTab]
  )

  // 쪽지시험 목록 조회 : 탭(전체/응시완료/미응시)에 따라 status 바꿔서 조회
  const { data, isLoading, isError } = useExamDeploymentsQuery(
    {
      page: INITIAL_PAGE,
      status: currentStatus, // 'all' | 'done' | 'pending'
    },
    true
  )

  // QuizContent에 전달해서 카드 목록 렌더링 하기 위해 데이터 추출
  const quizzes = useMemo(() => data?.results || [], [data?.results])

  return (
    <div className={CONTAINER_CLASS}>
      <h1 className={TITLE_CLASS}>쪽지시험</h1>

      <QuizTabs currentTab={currentTab} onTabChange={setCurrentTab} />

      <QuizContent
        quizzes={quizzes}
        isLoading={isLoading}
        isError={isError}
        currentTab={currentTab}
      />
    </div>
  )
}

export default MyPageQuiz
