import { useState, useEffect } from 'react'
import type { ExamDeploymentDetailResult } from '@/mappers/examDeploymentDetail'

interface FillBlankProps {
  question: ExamDeploymentDetailResult['questions'][0]
  answer: string[] | null
  onAnswerChange: (questionId: number, answer: string[]) => void
}

const BLANK_LABELS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'] as const

export default function FillBlank({ question, answer, onAnswerChange }: FillBlankProps) {
  const blankCount = question.blankCount || 0
  const blankLabels = BLANK_LABELS.slice(0, blankCount)

  const [answers, setAnswers] = useState<string[]>(() =>
    answer || Array(blankCount).fill('')
  )

  useEffect(() => {
    if (answer) {
      setAnswers(answer)
    } else {
      setAnswers(Array(blankCount).fill(''))
    }
  }, [answer, blankCount])

  const handleInputChange = (index: number, value: string) => {
    const newAnswers = [...answers]
    newAnswers[index] = value
    setAnswers(newAnswers)
    onAnswerChange(question.questionId, newAnswers)
  }

  const renderPromptWithBlanks = () => {
    if (!question.prompt) return null

    const parts = question.prompt.split('__')
    const result: React.ReactNode[] = []

    parts.forEach((part, index) => {
      result.push(<span key={`text-${index}`}>{part}</span>)
      if (index < blankCount) {
        result.push(
          <span key={`blank-${index}`} className="font-bold">
            ({blankLabels[index]})_______
          </span>
        )
      }
    })

    return <div className="text-[16px] font-normal text-[#222222]">{result}</div>
  }

  return (
    <div className="mb-20">
      {/* 문제 헤더 */}
      <div className="quiz-header">
        <span className="quiz-header-title">
          {question.number}. {question.question}
        </span>
        <span className="quiz-header-badge">{question.point}점</span>
        <span className="quiz-header-badge">빈칸식</span>
      </div>

      {/* 지문 박스 */}
      {question.prompt && (
        <div className="w-[648px] min-h-[96px] bg-[#F2F3F5]/50 p-[20px] rounded-lg mb-[26px] ml-6">
          {renderPromptWithBlanks()}
        </div>
      )}

      {/* 답변 입력 영역 */}
      <div className="ml-6 space-y-3">
        {blankLabels.map((label, index) => (
          <div
            key={label}
            className="relative w-[308px] h-[48px] bg-[#F2F3F5] rounded-[4px] flex items-center px-4 py-2"
          >
            <span className="text-[16px] font-bold text-[#121212] mr-2">
              {label}.
            </span>
            <input
              type="text"
              value={answers[index] || ''}
              onChange={(e) => handleInputChange(index, e.target.value)}
              placeholder="정답을 입력해 주세요."
              className="flex-1 h-full bg-transparent border-none outline-none text-[16px] font-bold text-[#222222] placeholder:text-[16px] placeholder:text-[#BDBDBD] placeholder:font-normal"
            />
          </div>
        ))}
      </div>
    </div>
  )
}
