import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, Loading, Modal, NotFound } from '@/components/common'
import { CheatingWarningModal } from '@/components/common/Modal/variants/CheatingWarningModal'
import QuizHeader from '@/components/quiz/QuizHeader'
import QuizWarningBox from '@/components/QuizWarningBox'
import { useExamDeploymentDetailQuery, useExamDeploymentStatusQuery } from '@/hooks/useQuiz'
import {
  SingleChoice,
  MultipleChoice,
  OX,
  FillBlank,
  Ordering,
  ShortAnswer,
} from '@/components/quiz'
import type { ExamDeploymentDetailResult } from '@/mappers/examDeploymentDetail'

type Question = ExamDeploymentDetailResult['questions'][0]

function QuizPage() {
  const navigate = useNavigate()
  const { deploymentId } = useParams<{ deploymentId: string }>()
  const deploymentIdNumber = deploymentId ? Number(deploymentId) : 0
  const [isEnded, setIsEnded] = useState(false)
  const [endReason, setEndReason] = useState<'time' | 'status' | 'cheating' | null>(null)
  const [remainingSeconds, setRemainingSeconds] = useState(30 * 60)
  const [cheatingCount, setCheatingCount] = useState(0)
  const [isCheatingModalOpen, setIsCheatingModalOpen] = useState(false)
  const [isFullscreenModalOpen, setIsFullscreenModalOpen] = useState(false)
  const lastCheatingAtRef = useRef(0)

  const { data, isLoading } = useExamDeploymentDetailQuery(
    deploymentIdNumber,
    !!deploymentId
  )
  const { data: statusData } = useExamDeploymentStatusQuery(
    deploymentIdNumber,
    !!deploymentId && !isEnded
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
      case 'multiple_choice': // 다중선택
        return (
          <MultipleChoice
            question={question}
            answer={answer as string[] | null}
            onAnswerChange={handleAnswerChange}
          />
        )
      case 'short_answer': // 단답형
        return (
          <ShortAnswer
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

  const handleAutoSubmit = () => {
    // 부정행위로 종료될 때 자동 제출 처리(나중에 API 연결 예정)
    console.log('부정행위 자동 제출:', { deploymentId: deploymentIdNumber, answers })
  }

  const handleCheatingDetected = useCallback(() => {
    if (isEnded) return
    const now = Date.now()
    if (now - lastCheatingAtRef.current < 800) return
    lastCheatingAtRef.current = now

    setCheatingCount((prev) => {
      const next = Math.min(prev + 1, 3)
      setIsCheatingModalOpen(true)
      return next
    })
  }, [answers, deploymentIdNumber, isEnded])

  const handleCheatingClose = () => {
    setIsCheatingModalOpen(false)
  }

  const handleCheatingTerminate = () => {
    setIsCheatingModalOpen(false)
    // TODO: 3회 부정행위 감지 시 자동 제출 및 결과 페이지 이동 처리 필요
    handleAutoSubmit();
  }

  const handleSubmit = () => {
    // 제출 로직은 추후 구현 예정
    console.log('제출된 답변:', answers)
    alert('시험이 제출되었습니다.')
  }

  useEffect(() => {
    if (isEnded) return
    const handleVisibilityChange = () => {
      if (document.hidden) {
        handleCheatingDetected()
      }
    }
    const handleWindowBlur = () => {
      handleCheatingDetected()
    }
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      handleCheatingDetected()
      event.preventDefault()
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('blur', handleWindowBlur)
    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('blur', handleWindowBlur)
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [handleCheatingDetected, isEnded])

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (cheatingCount >= 3) return
      if (!document.fullscreenElement) {
        setIsFullscreenModalOpen(true)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' || event.key === 'F11') {
        event.preventDefault()
        console.log('전체화면 해제 감지')
        handleCheatingDetected()
      }
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleCheatingDetected, cheatingCount])


  useEffect(() => {
    if (isEnded) return
    const timer = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          setIsEnded(true)
          setEndReason('time')
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isEnded])

  useEffect(() => {
    if (isEnded) return
    if (statusData?.examStatus === 'closed' || statusData?.forceSubmit) {
      setIsEnded(true)
      setEndReason('status')
    }
  }, [statusData, isEnded])

  const minutes = Math.floor(remainingSeconds / 60)
  const seconds = remainingSeconds % 60
  const paddedSeconds = seconds.toString().padStart(2, '0')
  const formattedRemaining = `${minutes} : ${paddedSeconds}`
  const showEndModal = isEnded && endReason !== 'cheating'

  const handleEndConfirm = () => {
    navigate('/mypage/quiz')
  }

  const handleTimeEndTest = () => {
    setRemainingSeconds(0)
    setIsEnded(true)
    setEndReason('time')
  }

  const handleStatusEndTest = () => {
    setIsEnded(true)
    setEndReason('status')
  }

  const handleFullscreenRetry = async () => {
    try {
      await document.documentElement.requestFullscreen()
      setIsFullscreenModalOpen(false)
    } catch {
      // ignore
    }
  }

  if (isLoading) {
    return <Loading />
  }

  return (
    <div>
      <QuizHeader
        subjectName={data?.examName || '쪽지시험'}
        timeRemaining={formattedRemaining}
        timeRemainingSuffix="남음"
        cheatingCount={cheatingCount}
      />

      <main className="flex flex-col items-center px-10 py-6">
        <QuizWarningBox />
        <div className="mb-6 flex items-center gap-3">
          <Button variant="secondary" size="sm" rounded="default" onClick={handleTimeEndTest}>
            타이머 종료 테스트
          </Button>
          <Button variant="secondary" size="sm" rounded="default" onClick={handleStatusEndTest}>
            상태 종료 테스트
          </Button>
        </div>

        <div className="min-h-[500px] min-w-[1200px]">
          {data?.questions && data.questions.length > 0 ? (
            <div className="space-y-8">
              {data.questions.map((question) => (
                <div key={question.questionId}>
                  {renderQuestion(question)}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex justify-center items-center py-20">
              <NotFound detail="표시할 문제가 없습니다.." />
            </div>
          )}
        </div>
      </main>

      <footer>
        <div className="flex justify-center mb-10">
          <Button variant="primary" size="md" rounded="default" onClick={handleSubmit}>
            제출하기
          </Button>
        </div>
      </footer>

      <CheatingWarningModal
        isOpen={isCheatingModalOpen}
        onClose={handleCheatingClose}
        warningLevel={Math.min(Math.max(cheatingCount, 1), 3) as 1 | 2 | 3}
        onConfirm={handleCheatingClose}
        onTerminate={handleCheatingTerminate}
      />

      <Modal isOpen={isFullscreenModalOpen} onClose={() => { }}>
        <Modal.Body>
          <div className="flex flex-col items-center gap-4 py-4 min-w-[250px]">
            <p className="text-center text-[16px] text-[#222222]">
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

      <Modal isOpen={showEndModal} onClose={handleEndConfirm}>
        <Modal.Body>
          <div className="flex flex-col items-center gap-6 py-4 min-w-[250px]">
            <img src='/icons/cloud_404.svg' alt="not-found" className="h-[58px] w-[74px]" />
            <p className="text-center text-[16px] text-[#222222]">
              {endReason === 'time'
                ? '시험 시간이 종료되었습니다.'
                : '쪽지시험 상태가 변경되어 종료되었습니다.'}
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" size="md" rounded="default" className="w-full" onClick={handleEndConfirm}>
            확인
          </Button>
        </Modal.Footer>
      </Modal>

    </div>
  )
}

export default QuizPage
