import QuizCard from './QuizCard'
import { Loading } from '@/components/common'
import type { ExamDeploymentsResult } from '@/mappers/examDeployments'

type TabKey = 'all' | 'done' | 'todo'

const EMPTY_MESSAGES: Record<TabKey, string> = {
  all: '표시할 쪽지시험이 없습니다.',
  done: '응시 완료한 쪽지시험이 없습니다.',
  todo: '응시할 쪽지시험이 없습니다.',
}

interface QuizContentProps {
  quizzes: ExamDeploymentsResult['results']
  isLoading: boolean
  isError: boolean
  currentTab: TabKey
}

export default function QuizContent({ quizzes, isLoading, isError, currentTab }: QuizContentProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loading />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center py-20">
        <p className="text-red-500">데이터를 불러오는 중 오류가 발생했습니다.</p>
      </div>
    )
  }

  if (quizzes.length === 0) {
    return (
      <div className="flex justify-center items-center py-20">
        <p className="text-gray-500">{EMPTY_MESSAGES[currentTab]}</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {quizzes.map((quiz) => (
        <QuizCard key={quiz.id} quiz={quiz} />
      ))}
    </div>
  )
}
