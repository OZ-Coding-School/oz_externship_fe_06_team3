import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Button,
  CheatingWarningModal,
  InvalidAccessModal,
  Loading,
  Modal,
  NotFound,
  QuizEndModal,
  QuizSubmitCompleteModal,
} from '@/components/common'
import QuizHeader from '@/components/quiz/QuizHeader'
import QuizWarningBox from '@/components/QuizWarningBox'
import {
  useExamDeploymentDetailQuery,
  useExamDeploymentStatusQuery,
} from '@/hooks/useQuiz'
import {
  useQuizAccessCheck,
  useCheatingDetection,
  useQuizSubmissionFlow,
  useQuizTimer,
  useAdminStatusPolling,
} from '@/hooks/quiz'
import {
  SingleChoice,
  MultipleChoice,
  OX,
  FillBlank,
  Ordering,
  ShortAnswer,
} from '@/components/quiz'
import {
  CHEATING_WARNING_LEVEL_MAX,
  CHEATING_WARNING_LEVEL_MIN,
  INVALID_ACCESS_AUTO_REDIRECT_MS,
  QUIZ_LIST_PATH,
  STATUS_END_AUTO_NAVIGATE_MS,
} from '@/constants/quiz'
import type { ExamDeploymentDetailResult } from '@/mappers/examDeploymentDetail'

type Question = ExamDeploymentDetailResult['questions'][0]

const DEFAULT_EXAM_NAME = '쪽지시험'

function QuizPage() {
  const { deploymentId } = useParams<{ deploymentId: string }>()
  const deploymentIdNumber = deploymentId ? Number(deploymentId) : 0

  const [isEnded, setIsEnded] = useState(false)
  const [endReason, setEndReason] = useState<'time' | 'status' | 'cheating' | null>(null)
  const [openModal, setOpenModal] = useState<
    'cheating' | 'fullscreen' | 'submitComplete' | null
  >(null)
  const [answers, setAnswers] = useState<Record<number, string | string[] | null>>({})

  const { data, isLoading } = useExamDeploymentDetailQuery(deploymentIdNumber, !!deploymentId)
  const { data: statusData } = useExamDeploymentStatusQuery(
    deploymentIdNumber,
    !!deploymentId && !isEnded
  )

  const navigate = useNavigate()
  const { isAccessAllowed, showInvalidAccessModal } = useQuizAccessCheck(
    deploymentId,
    deploymentIdNumber
  )
  const { cheatingCount, handleCheatingClose } = useCheatingDetection(isEnded, setOpenModal)

  const submitAndEndByTimeRef = useRef<() => void>(() => {})
  const { setRemainingSeconds, formattedRemaining } = useQuizTimer(
    data,
    isEnded,
    submitAndEndByTimeRef
  )

  const {
    submissionMutation,
    submittedSubmissionId,
    submittedSubmissionIdRef,
    clearVerificationAndNavigate,
    handleSubmit,
    handleSubmitCompleteConfirm,
    handleEndConfirm,
    handleCheatingTerminate,
    submitAndEndByTime,
  } = useQuizSubmissionFlow({
    deploymentIdNumber,
    data,
    answers,
    cheatingCount,
    setOpenModal,
    setIsEnded,
    setEndReason,
    setRemainingSeconds,
  })

  submitAndEndByTimeRef.current = submitAndEndByTime
  useAdminStatusPolling(statusData, isEnded, setIsEnded, setEndReason)

  const handleAnswerChange = (questionId: number, value: string | string[]) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
  }

  const renderQuestion = (question: Question) => {
    const answer = answers[question.questionId] ?? null
    const commonProps = { question, onAnswerChange: handleAnswerChange }
    switch (question.type) {
      case 'single_choice':
        return <SingleChoice {...commonProps} answer={answer as string | null} />
      case 'multiple_choice':
        return (
          <MultipleChoice {...commonProps} answer={answer as string[] | null} />
        )
      case 'short_answer':
        return <ShortAnswer {...commonProps} answer={answer as string | null} />
      case 'ox':
        return <OX {...commonProps} answer={answer as string | null} />
      case 'fill_blank':
        return <FillBlank {...commonProps} answer={answer as string[] | null} />
      case 'ordering':
        return <Ordering {...commonProps} answer={answer as string[] | null} />
      default:
        return null
    }
  }

  const showTimeEndModal = isEnded && endReason === 'time'
  const showQuizEndModal = isEnded && endReason === 'status'
  const warningLevel = Math.min(
    Math.max(cheatingCount, CHEATING_WARNING_LEVEL_MIN),
    CHEATING_WARNING_LEVEL_MAX
  ) as 1 | 2 | 3

  const clearAndNavigateRef = useRef(clearVerificationAndNavigate)
  clearAndNavigateRef.current = clearVerificationAndNavigate
  useEffect(() => {
    if (!showQuizEndModal) return
    const timer = window.setTimeout(() => {
      clearAndNavigateRef.current(submittedSubmissionIdRef.current)
    }, STATUS_END_AUTO_NAVIGATE_MS)
    return () => window.clearTimeout(timer)
  }, [showQuizEndModal])

  const handleFullscreenRetry = async () => {
    try {
      await document.documentElement.requestFullscreen()
      setOpenModal(null)
    } catch {
      // 전체화면 전환 실패 시 무시
    }
  }

  const handleStatusEndTest = () => {
    setIsEnded(true)
    setEndReason('status')
  }

  if (showInvalidAccessModal) {
    return (
      <InvalidAccessModal
        isOpen
        onConfirm={() => navigate(QUIZ_LIST_PATH, { replace: true })}
        autoRedirectMs={INVALID_ACCESS_AUTO_REDIRECT_MS}
      />
    )
  }

  if (isAccessAllowed !== true || isLoading) {
    return <Loading />
  }

  return (
    <div>
      <QuizHeader
        subjectName={data?.examName ?? DEFAULT_EXAM_NAME}
        timeRemaining={formattedRemaining}
        timeRemainingSuffix="남음"
        cheatingCount={cheatingCount}
      />

      <main className="flex flex-col items-center px-10 py-6">
        <QuizWarningBox />
        <div className="mb-6 flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            rounded="default"
            onClick={submitAndEndByTime}
            aria-label="시험 완료 처리, 작성한 문항 제출·미작성 0점 제출 후 결과 페이지 이동·목록 응시완료"
          >
            타이머 종료 테스트
          </Button>
          <Button
            variant="secondary"
            size="sm"
            rounded="default"
            onClick={handleStatusEndTest}
          >
            상태 종료 테스트
          </Button>
        </div>

        <div className="min-h-[500px] min-w-[1200px]">
          {data?.questions && data.questions.length > 0 ? (
            <div className="space-y-8">
              {data.questions.map((question) => (
                <div key={question.questionId}>{renderQuestion(question)}</div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center py-20">
              <NotFound detail="표시할 문제가 없습니다." />
            </div>
          )}
        </div>
      </main>

      <footer>
        <div className="flex justify-center mb-10">
          <Button
            variant="primary"
            size="md"
            rounded="default"
            onClick={handleSubmit}
            disabled={submissionMutation.isPending}
            aria-label="문제풀이 답안 제출 후 채점 결과 확인 페이지로 이동"
          >
            {submissionMutation.isPending ? '제출 중...' : '제출하기'}
          </Button>
        </div>
      </footer>

      <CheatingWarningModal
        isOpen={openModal === 'cheating'}
        onClose={handleCheatingClose}
        warningLevel={warningLevel}
        onConfirm={handleCheatingClose}
        onTerminate={handleCheatingTerminate}
      />

      <Modal isOpen={openModal === 'fullscreen'} onClose={() => {}}>
        <Modal.Body>
          <div className="flex min-w-[250px] flex-col items-center gap-4 py-4">
            <p className="text-center text-[16px] text-foreground-secondary">
              전체화면이 해제되었습니다. <br />
              시험 진행을 위해 전체화면으로 돌아가 주세요.
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            size="md"
            rounded="default"
            className="w-full"
            onClick={handleFullscreenRetry}
          >
            전체화면으로 돌아가기
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal isOpen={showTimeEndModal} onClose={handleEndConfirm}>
        <Modal.Body>
          <div className="flex min-w-[250px] flex-col items-center gap-6 py-4">
            <img
              src="/icons/cloud_404.svg"
              alt="시험 종료"
              className="h-[58px] w-[74px]"
            />
            <p className="text-center text-[16px] text-foreground-secondary">
              시험 시간이 종료되었습니다.
              {submittedSubmissionId != null
                ? ' 답안이 제출되었습니다. (풀지 못한 문항은 0점 처리됩니다)'
                : ''}
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            size="md"
            rounded="default"
            className="w-full"
            onClick={handleEndConfirm}
            disabled={submissionMutation.isPending}
          >
            {submissionMutation.isPending ? '제출 중...' : '확인'}
          </Button>
        </Modal.Footer>
      </Modal>

      <QuizEndModal
        isOpen={showQuizEndModal}
        onClose={handleEndConfirm}
        onConfirm={handleEndConfirm}
      />

      <QuizSubmitCompleteModal
        isOpen={openModal === 'submitComplete'}
        onClose={() => setOpenModal(null)}
        onConfirm={handleSubmitCompleteConfirm}
      />
    </div>
  )
}

export default QuizPage
