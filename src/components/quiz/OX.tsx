import type { ExamDeploymentDetailResult } from '@/mappers/examDeploymentDetail'

interface OXProps {
  question: ExamDeploymentDetailResult['questions'][0]
  answer: string | null
  onAnswerChange: (questionId: number, answer: string) => void
}

const OPTION_LABELS = {
  O: '맞아요',
  X: '아니에요',
} as const

const COLORS = {
  selected: {
    card: 'bg-[#EFE6FC]',
    checkmark: 'text-[#6201E0]',
  },
  unselected: {
    card: 'bg-[#F2F3F5]',
    checkmark: 'text-[#BDBDBD]',
  },
  icon: {
    oSelected: 'border-[#00c05c] bg-[#EFE6FC]',
    oUnselected: 'border-[#B4B4B4] bg-white',
    xSelected: 'text-[#ee1444]',
    xUnselected: 'text-[#B4B4B4]',
  },
} as const

interface OXOptionProps {
  option: string
  isSelected: boolean
  questionId: number
  onSelect: (option: string) => void
}

function OXOption({ option, isSelected, questionId, onSelect }: OXOptionProps) {
  const isO = option === 'O' || option === '맞아요'
  const displayText = option === 'O' ? OPTION_LABELS.O : option === 'X' ? OPTION_LABELS.X : option

  const cardClass = `w-[308px] h-[48px] rounded-[4px] flex items-center justify-between px-4 cursor-pointer transition-colors ${
    isSelected ? COLORS.selected.card : COLORS.unselected.card
  }`

  const iconClass = isO
    ? `w-6 h-6 rounded-full border-2 flex-shrink-0 ${
        isSelected ? COLORS.icon.oSelected : COLORS.icon.oUnselected
      }`
    : 'w-6 h-6 flex items-center justify-center flex-shrink-0'

  const xIconClass = `text-xl font-bold ${
    isSelected ? COLORS.icon.xSelected : COLORS.icon.xUnselected
  }`

  const checkmarkClass = `text-2xl font-normal ${
    isSelected ? COLORS.selected.checkmark : COLORS.unselected.checkmark
  }`

  return (
    <label className={cardClass}>
      <div className="flex items-center gap-3">
        {isO ? (
          <div className={iconClass} />
        ) : (
          <div className={iconClass}>
            <span className={xIconClass}>✕</span>
          </div>
        )}
        <span className="text-base font-medium text-[#121212]">{displayText}</span>
      </div>
      <span className={checkmarkClass}>✓</span>
      <input
        type="radio"
        name={`question-${questionId}`}
        value={option}
        checked={isSelected}
        onChange={() => onSelect(option)}
        className="hidden"
      />
    </label>
  )
}

export default function OX({ question, answer, onAnswerChange }: OXProps) {
  const handleOptionChange = (option: string) => {
    onAnswerChange(question.questionId, option)
  }

  return (
    <div className="mb-20">
      {/* 문제 헤더 */}
      <div className="mb-4 flex items-center gap-2">
        <span className="text-[20px] font-bold text-[#121212]">
          {question.number}. {question.question}
        </span>
        <span className="bg-[#ECECEC] rounded-[2px] text-[12px] font-normal text-[#121212] px-2 py-[2px]">
          {question.point}점
        </span>
        <span className="bg-[#ECECEC] rounded-[2px] text-[12px] font-normal text-[#121212] px-2 py-[2px]">
          OX선택
        </span>
      </div>

      {/* 지문 */}
      {question.prompt && (
        <div className="mb-[26px] flex flex-col ml-6">
          <p className="text-[16px] font-normal text-[#222222]">{question.prompt}</p>
        </div>
      )}

      {/* 옵션 */}
      <div className="flex flex-col gap-[18px] ml-6">
        {question.options?.map((option, index) => (
          <OXOption
            key={index}
            option={option}
            isSelected={answer === option}
            questionId={question.questionId}
            onSelect={handleOptionChange}
          />
        ))}
      </div>
    </div>
  )
}
