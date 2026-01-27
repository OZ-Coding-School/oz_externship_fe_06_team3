import type { ExamDeploymentDetailResult } from '@/mappers/examDeploymentDetail'

interface SingleChoiceProps {
  question: ExamDeploymentDetailResult['questions'][0]
  answer: string | null
  onAnswerChange: (questionId: number, answer: string) => void
}

const RADIO_STYLES = {
  selected: {
    className: 'bg-[#6201E0] border-[#6201E0]',
    backgroundImage: 'radial-gradient(circle, white 40%, transparent 40%)',
  },
  unselected: {
    className: 'bg-white border-gray-300',
    backgroundImage: 'radial-gradient(circle, #ECECEC 40%, transparent 40%)',
  },
} as const

interface RadioOptionProps {
  option: string
  isSelected: boolean
  questionId: number
  onSelect: (option: string) => void
}

function RadioOption({ option, isSelected, questionId, onSelect }: RadioOptionProps) {
  const style = isSelected ? RADIO_STYLES.selected : RADIO_STYLES.unselected

  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <input
        type="radio"
        name={`question-${questionId}`}
        value={option}
        checked={isSelected}
        onChange={() => onSelect(option)}
        className={`w-5 h-5 rounded-full border-2 appearance-none cursor-pointer transition-colors ${style.className}`}
        style={{ backgroundImage: style.backgroundImage }}
      />
      <span className="text-[16px] font-normal text-[#222222]">{option}</span>
    </label>
  )
}

export default function SingleChoice({ question, answer, onAnswerChange }: SingleChoiceProps) {
  const handleOptionChange = (option: string) => {
    onAnswerChange(question.questionId, option)
  }

  const renderOptions = () => (
    <div className="space-y-[22px]">
      {question.options?.map((option, index) => (
        <RadioOption
          key={index}
          option={option}
          isSelected={answer === option}
          questionId={question.questionId}
          onSelect={handleOptionChange}
        />
      ))}
    </div>
  )

  return (
    <div className="mb-20">
      {/* 문제 헤더 */}
      <div className="quiz-header">
        <span className="quiz-header-title">
          {question.number}. {question.question}
        </span>
        <span className="quiz-header-badge">{question.point}점</span>
        <span className="quiz-header-badge">단일선택</span>
      </div>

      {/* 지문 및 옵션 */}
      {question.prompt ? (
        <div className="w-[648px] min-h-[96px] bg-[#F2F3F5]/50 p-4 rounded-lg ml-6">
          <p className="text-[16px] font-normal text-[#222222] mb-[26px]">
            {question.prompt}
          </p>
          {renderOptions()}
        </div>
      ) : (
        <div className="ml-6">{renderOptions()}</div>
      )}
    </div>
  )
}
