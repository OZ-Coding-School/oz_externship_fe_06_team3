import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/common/Button'
import { StartQuizModal } from '@/components/common/Modal'
import type { ExamDeploymentsResult } from '@/mappers/examDeployments'

interface QuizCardProps {
  quiz: ExamDeploymentsResult['results'][0]
}

export default function QuizCard({ quiz }: QuizCardProps) {
  const navigate = useNavigate()
  const [imageError, setImageError] = useState(false)
  const [fallbackImageError, setFallbackImageError] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const isDone = quiz.isDone
  const imageUrl = quiz.exam.subject.thumbnailImgUrl || quiz.exam.thumbnailImgUrl
  const subjectName = quiz.exam.subject.title
  const fallbackImageUrl = `/icons/Course/${subjectName}.svg`
  const scoreText = isDone
    ? `${quiz.examInfo.score}점/${quiz.totalScore}점 ㆍ ${quiz.examInfo.correctAnswerCount}/${quiz.questionCount}개 정답`
    : '응시하고 점수를 확인해보세요!'
  const buttonText = isDone ? '상세보기' : '응시하기'

  const handleImageError = () => setImageError(true)
  const handleFallbackImageError = () => setFallbackImageError(true)

  const requestFullscreen = async () => {
    if (document.fullscreenElement) return
    const element = document.documentElement
    if (element.requestFullscreen) {
      try {
        await element.requestFullscreen()
      } catch {
        throw new Error('전체화면 모드로 전환하지 못했습니다. 전체화면 모드를 허용해 주세요.')
      }
    }
  }

  const handleButtonClick = async () => {
    await requestFullscreen()

    if (isDone && quiz.submissionId) {
      navigate(`/quiz/result/${quiz.submissionId}`)
    } else {
      setIsModalOpen(true)
    }
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
  }

  const handleModalSuccess = () => {
    navigate(`/quiz/${quiz.id}`)
  }

  // 스타일 클래스
  const cardClass = 'flex items-center gap-4 px-8 py-7 bg-[#FAFAFA] border border-[#ECECEC] rounded-lg'
  const iconContainerClass = 'flex-center w-12 h-12'
  const fallbackClass = 'w-full h-full bg-primary-100 flex items-center justify-center text-primary font-bold'
  const infoContainerClass = 'flex-1 min-w-0'
  const titleContainerClass = 'flex items-center gap-4 mb-1'
  const scoreClass = 'flex items-center gap-2 text-[14px] font-normal text-[#303030]'
  const statusDoneClass = 'px-1.5 py-1 rounded-[3px] text-xs font-normal text-[#085036] bg-[#CAF6E6]'
  const statusPendingClass = 'px-1.5 py-1 rounded-[3px] text-xs font-normal text-[#5E0016] bg-[#FFC1D0]'
  const buttonClass = 'w-[112px] h-[48px] border border-[#6201E0] rounded-[4px] bg-[#EFE6FC] text-[16px] font-semibold text-[#6201E0] hover:text-white'

  return (
    <div className={cardClass}>
      {/* 왼쪽: 과목 아이콘 */}
      <div className={iconContainerClass}>
        {imageUrl && !imageError ? (
          <img
            src={imageUrl}
            onError={handleImageError}
          />
        ) : !fallbackImageError ? (
          <img
            src={fallbackImageUrl}
            onError={handleFallbackImageError}
          />
        ) : (
          <div className={fallbackClass}>
            {subjectName.charAt(0)}
          </div>
        )}
      </div>

      {/* 중간: 쪽지시험 정보 */}
      <div className={infoContainerClass}>
        <div className={titleContainerClass}>
          <p className="title-m-b">{quiz.exam.title}</p>
          <p className={isDone ? statusDoneClass : statusPendingClass}>
            {isDone ? '응시완료' : '미응시'}
          </p>
        </div>
        <div className={scoreClass}>
          <p>{quiz.exam.subject.title}ㆍ{scoreText}</p>
        </div>
      </div>

      {/* 오른쪽: 버튼 */}
      <div>
        <Button onClick={handleButtonClick} className={buttonClass}>
          {buttonText}
        </Button>
      </div>

      {/* 응시코드 입력 모달 */}
      {!isDone && (
        <StartQuizModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onSuccess={handleModalSuccess}
          deploymentId={quiz.id}
          imageUrl={imageUrl || fallbackImageUrl}
          subjectName={quiz.exam.subject.title}
          quizName={quiz.exam.title}
          questionCount={quiz.questionCount}
          timeLimit={quiz.durationTime}
        />
      )}
    </div>
  )
}

