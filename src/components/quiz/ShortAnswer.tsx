import type { ExamDeploymentDetailResult } from '@/mappers/examDeploymentDetail'

interface ShortAnswerProps {
  question: ExamDeploymentDetailResult['questions'][0]
  answer: string | null
  onAnswerChange: (questionId: number, answer: string) => void
}

export default function ShortAnswer({ question, answer, onAnswerChange }: ShortAnswerProps) {
  return (
    <div className="mb-20">
      {/* 문제 헤더 */}
      <div className="quiz-header">
        <span className="quiz-header-title">
          {question.number}. {question.question}
        </span>
        <span className="quiz-header-badge">{question.point}점</span>
        <span className="quiz-header-badge">단답형</span>
      </div>

      <div className="ml-6">
        <input
          type="text"
          value={answer ?? ''}
          onChange={(e) => onAnswerChange(question.questionId, e.target.value)}
          placeholder="20글자 이내로 입력해 주세요."
          className="h-[48px] w-[648px] rounded-lg bg-[#F2F3F5] px-4 py-[10px] text-[16px] font-normal text-[#222222] placeholder:text-[#BDBDBD]"
        />
      </div>
    </div>
  )
}
