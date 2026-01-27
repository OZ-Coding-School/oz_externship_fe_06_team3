import type { ExamDeploymentDetailResult } from '@/mappers/examDeploymentDetail'

interface ShortAnswerProps {
  question: ExamDeploymentDetailResult['questions'][0]
  answer: string | null
  onAnswerChange: (questionId: number, answer: string) => void
}

export default function ShortAnswer({ question, answer, onAnswerChange }: ShortAnswerProps) {
  return (
    <div className="mb-20">
      <div className="mb-4 flex items-center gap-2">
        <span className="text-[20px] font-bold text-[#121212]">
          {question.number}. {question.question}
        </span>
        <span className="rounded-[2px] bg-[#ECECEC] px-2 py-[2px] text-[12px] font-normal text-[#121212]">
          {question.point}점
        </span>
        <span className="rounded-[2px] bg-[#ECECEC] px-2 py-[2px] text-[12px] font-normal text-[#121212]">
          단답형
        </span>
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
