import type { ExamDeploymentDetailResult } from '@/mappers/examDeploymentDetail'
import QuizResultExplanation from './QuizResultExplanation'

interface ShortAnswerProps {
  question: ExamDeploymentDetailResult['questions'][0]
  answer: string | null
  onAnswerChange: (questionId: number, answer: string) => void
  isResult?: boolean
  isCorrect?: boolean
  explanation?: string | null
}

export default function ShortAnswer({
  question,
  answer,
  onAnswerChange,
  isResult = false,
  isCorrect = false,
  explanation = null,
}: ShortAnswerProps) {
  const containerClass = isResult ? 'mb-[100px]' : 'mb-20'
  const answerColorClass = isResult
    ? isCorrect
      ? 'text-[#14C786]'
      : 'text-[#EC0037]'
    : 'text-[#222222]'

  return (
    <div className={containerClass}>
      {/* 문제 헤더 */}
      <div className="quiz-header">
        <span className="quiz-header-title">
          {question.number}. {question.question}
        </span>
        <span className="quiz-header-badge">{question.point}점</span>
        <span className="quiz-header-badge">단답형</span>
      </div>

      <div className="ml-8">
        <input
          type="text"
          value={answer ?? ''}
          onChange={(e) => onAnswerChange(question.questionId, e.target.value)}
          placeholder="20글자 이내로 입력해 주세요."
          className={`h-[48px] w-[648px] rounded-lg bg-[#F2F3F5] px-4 py-[10px] text-[16px] font-normal ${answerColorClass} placeholder:text-[#BDBDBD]`}
        />
      </div>
      {isResult && explanation && (
        <div className="mt-5 ml-8">
          <QuizResultExplanation explanation={explanation} isCorrect={isCorrect} />
        </div>
      )}
    </div>
  )
}
