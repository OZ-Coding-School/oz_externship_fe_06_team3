import { useNavigate, useParams } from 'react-router-dom'
import { Button, Loading } from '@/components/common'
import QuizHeader from '@/components/quiz/QuizHeader'
import QuizResultTop from '@/components/quiz/QuizResultTop'
import { useExamSubmissionResultQuery } from '@/hooks/useQuiz'
import {
  SingleChoice,
  MultipleChoice,
  OX,
  FillBlank,
  Ordering,
  ShortAnswer,
} from '@/components/quiz'

function QuizResultPage() {
  const navigate = useNavigate()
  const { submissionId } = useParams<{ submissionId: string }>()
  const submissionIdNumber = submissionId ? Number(submissionId) : 0

  const { data, isLoading } = useExamSubmissionResultQuery(
    submissionIdNumber,
    !!submissionId
  )

  const handleSubmit = () => {
    navigate('/mypage/quiz')
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen w-full">
        <Loading />
      </div>
    )
  }

  const renderQuestion = (
    question: NonNullable<typeof data>['questions'][0],
    index: number
  ) => {
    const mapped = {
      questionId: question.id,
      number: index + 1,
      type: question.type,
      question: question.question,
      point: question.point,
      prompt: question.prompt,
      blankCount: question.blankCount,
      options: question.options,
    }

    const submitted = question.submittedAnswer

    switch (question.type) {
      case 'single_choice':
        return (
          <SingleChoice
            question={mapped as any}
            answer={(submitted?.[0] ?? null) as string | null}
            onAnswerChange={() => { }}
            isResult
            correctAnswer={(question.answer?.[0] ?? null) as string | null}
            isCorrect={question.isCorrect}
            explanation={question.explanation}
          />
        )
      case 'multiple_choice':
        return (
          <MultipleChoice
            question={mapped as any}
            answer={(submitted ?? null) as string[] | null}
            onAnswerChange={() => { }}
          />
        )
      case 'short_answer':
        return (
          <ShortAnswer
            question={mapped as any}
            answer={(submitted?.[0] ?? '') as string}
            onAnswerChange={() => { }}
          />
        )
      case 'ox':
        return (
          <OX
            question={mapped as any}
            answer={(submitted?.[0] ?? null) as string | null}
            onAnswerChange={() => { }}
          />
        )
      case 'fill_blank':
        return (
          <FillBlank
            question={mapped as any}
            answer={(submitted ?? null) as string[] | null}
            onAnswerChange={() => { }}
          />
        )
      case 'ordering':
        return (
          <Ordering
            question={mapped as any}
            answer={(submitted ?? null) as string[] | null}
            onAnswerChange={() => { }}
          />
        )
      default:
        return null
    }
  }


  return (
    <div>
      <QuizHeader
        subjectName={data?.exam.title}
        message={`총 문항 수: ${data?.questions.length ?? 0} ㆍ 부정행위: ${data?.cheatingCount ?? 0} ㆍ 응시시간: ${data?.elapsedTime ?? 0}분 ㆍ 응시 결과 점수: ${data?.totalScore ?? 0}점/100점`}
      />

      <main>
        <QuizResultTop />
        <div className="flex justify-center">
          <div className="w-[1290px] py-10 space-y-6">
            {data?.questions?.map((question, index) => (
              <div key={question.id} className="space-y-4">
                {renderQuestion(question, index)}
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer>
        <div className="flex justify-center mb-10">
          <Button
            variant="primary"
            size="xs"
            rounded="default"
            onClick={handleSubmit}
          >
            완료
          </Button>
        </div>
      </footer>
    </div>
  )
}

export default QuizResultPage
