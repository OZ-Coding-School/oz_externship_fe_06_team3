import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Button, Loading } from '@/components/common'
import QuizHeader from '@/components/QuizHeader'
import QuizWarningBox from '@/components/QuizWarningBox'
import { useExamDeploymentDetailQuery } from '@/hooks/useQuiz'
import {
  SingleChoice,
  OX,
  FillBlank,
  Ordering,
} from '@/components/quiz'
import type { ExamDeploymentDetailResult } from '@/mappers/examDeploymentDetail'

type Question = ExamDeploymentDetailResult['questions'][0]

function QuizPage() {
  const { deploymentId } = useParams<{ deploymentId: string }>()
  const deploymentIdNumber = deploymentId ? Number(deploymentId) : 0

  const { data, isLoading } = useExamDeploymentDetailQuery(
    deploymentIdNumber,
    !!deploymentId
  )

  // 답변 상태 관리
  const [answers, setAnswers] = useState<
    Record<number, string | string[] | null>
  >({})

  // 답변 변경 핸들러
  const handleAnswerChange = (
    questionId: number,
    answer: string | string[]
  ) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }))
  }

  // 문제 유형별 컴포넌트 렌더링
  // 남은 문제 유형 2가지 추가 예정 :  ⭐️ 다중선택(체크박스), 단답형(텍스트 입력) ⭐️
  const renderQuestion = (question: Question) => {
    const answer = answers[question.questionId] || null

    switch (question.type) {
      case 'single_choice': // 단일선택 (라디오 버튼)
        return (
          <SingleChoice
            question={question}
            answer={answer as string | null}
            onAnswerChange={handleAnswerChange}
          />
        )
      case 'ox': // O/X 선택
        return (
          <OX
            question={question}
            answer={answer as string | null}
            onAnswerChange={handleAnswerChange}
          />
        )
      case 'fill_blank':  // 빈칸 채우기
        return (
          <FillBlank
            question={question}
            answer={answer as string[] | null}
            onAnswerChange={handleAnswerChange}
          />
        )
      case 'ordering':  // 순서 맞추기
        return (
          <Ordering
            question={question}
            answer={answer as string[] | null}
            onAnswerChange={handleAnswerChange}
          />
        )
      default:
        return null
    }
  }

  const handleSubmit = () => {
    // 제출 로직은 추후 구현 예정
    console.log('제출된 답변:', answers)
    alert('시험이 제출되었습니다.')
  }

  if (isLoading) {
    return <Loading />
  }

  return (
    <div>
      <QuizHeader subjectName={data?.examName || '쪽지시험'} />

      <main className="flex flex-col items-center px-10 py-6">
        <QuizWarningBox />

        <div className="min-h-[500px] min-w-[1200px]">
          {data?.questions && data.questions.length > 0 ? (
            <div className="space-y-8">
              {data.questions
                .sort((a, b) => a.number - b.number)
                .map((question) => (
                  <div key={question.questionId}>
                    {renderQuestion(question)}
                  </div>
                ))}
            </div>
          ) : (
            <div className="flex justify-center items-center py-20">
              <p className="text-gray-500">표시할 문제가 없습니다.</p>
            </div>
          )}
        </div>
      </main>

      <footer>
        <div className="flex justify-center">
          <Button variant="primary" size="md" rounded="default" onClick={handleSubmit}>
            제출하기
          </Button>
        </div>
      </footer>
    </div>
  )
}

export default QuizPage
