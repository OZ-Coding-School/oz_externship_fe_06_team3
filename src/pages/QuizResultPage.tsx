import { useNavigate, useParams } from 'react-router-dom'
import { Button, Loading } from '@/components/common'
import { QUIZ_LIST_PATH } from '@/constants/quiz'
import QuizHeader from '@/components/quiz/QuizHeader'
import QuizResultTop from '@/components/quiz/QuizResultTop'
import { useExamSubmissionResultQuery } from '@/hooks/useQuiz'
import { ResultQuestionItem } from '@/components/quiz'

// 분당 밀리초 수
const MS_PER_MINUTE = 60_000

// 응시시간
function getElapsedMinutes(
  startedAt: string | undefined,
  submittedAt: string | undefined,
  fallback: number
): number {
  if (!startedAt || !submittedAt) return fallback
  const started = new Date(startedAt).getTime()
  const submitted = new Date(submittedAt).getTime()
  return Math.max(0, Math.floor((submitted - started) / MS_PER_MINUTE))
}

// 결과 헤더 메시지
function buildResultHeaderMessage(
  questionCount: number,
  cheatingCount: number,
  elapsedMinutes: number,
  totalScore: number,
  maxScore: number
): string {
  return `총 문항 수: ${questionCount} ㆍ 부정행위: ${cheatingCount}회 ㆍ 응시시간: ${elapsedMinutes}분 ㆍ 응시 결과 점수: ${totalScore}점/${maxScore}점`
}


function QuizResultPage() {
  const navigate = useNavigate()
  const { submissionId } = useParams<{ submissionId: string }>()
  const submissionIdNumber = submissionId ? Number(submissionId) : 0

  const { data, isLoading } = useExamSubmissionResultQuery(
    submissionIdNumber,
    !!submissionId
  )

  const goToList = () => navigate(QUIZ_LIST_PATH)

  if (isLoading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center">
        <Loading />
      </div>
    )
  }

  const questionCount = data?.questions.length ?? 0
  const cheatingCount = data?.cheatingCount ?? 0
  const elapsedMinutes = getElapsedMinutes(
    data?.startedAt,
    data?.submittedAt,
    data?.elapsedTime ?? 0
  )
  const maxScore =
    data?.questions.reduce((sum, q) => sum + (q.point ?? 0), 0) ?? 0
  const totalScore = data?.totalScore ?? 0
  const headerMessage = buildResultHeaderMessage(
    questionCount,
    cheatingCount,
    elapsedMinutes,
    totalScore,
    maxScore
  )

  return (
    <div>
      <QuizHeader
        subjectName={data?.exam.title}
        message={headerMessage}
        showExamStatus={false}
      />

      <main>
        <QuizResultTop />
        <div className="flex justify-center">
          <div className="w-[1290px] space-y-6 py-10 pt-16">
            {data?.questions?.map((question, index) => (
              <div key={question.id} className="space-y-4">
                <ResultQuestionItem question={question} index={index} />
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer>
        <div className="mb-10 flex justify-center">
          <Button
            variant="primary"
            size="xs"
            rounded="default"
            onClick={goToList}
          >
            완료
          </Button>
        </div>
      </footer>
    </div>
  )
}

export default QuizResultPage
