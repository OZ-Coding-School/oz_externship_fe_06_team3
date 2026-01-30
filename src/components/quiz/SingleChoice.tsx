import type { ExamDeploymentDetailResult } from '@/mappers/examDeploymentDetail'
import QuizResultExplanation from './QuizResultExplanation'

interface SingleChoiceProps {
  question: ExamDeploymentDetailResult['questions'][0]
  answer: string | null
  onAnswerChange: (questionId: number, answer: string) => void
  isResult?: boolean
  correctAnswer?: string | null
  isCorrect?: boolean
  explanation?: string | null
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
  isResult?: boolean
  isCorrectOption?: boolean
  isWrongSelected?: boolean
}

function RadioOption({
  option,
  isSelected,
  questionId,
  onSelect,
  isResult,
  isCorrectOption,
  isWrongSelected,
}: RadioOptionProps) {
  const style = isSelected ? RADIO_STYLES.selected : RADIO_STYLES.unselected
  const textColor = isResult
    ? isCorrectOption
      ? 'text-[#14C786]'
      : isWrongSelected
        ? 'text-[#EC0037]'
        : 'text-[#222222]'
    : 'text-[#222222]'

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
      <span className={`text-[16px] font-normal ${textColor}`}>{option}</span>
    </label>
  )
}

export default function SingleChoice({
  question,
  answer,
  onAnswerChange,
  isResult = false,
  correctAnswer = null,
  isCorrect = false,
  explanation = null,
}: SingleChoiceProps) {
  const handleOptionChange = (option: string) => {
    onAnswerChange(question.questionId, option)
  }

  const renderOptions = () => (
    <div className="space-y-[22px]">
      {question.options?.map((option, index) => {
        const isSelected = answer === option
        const isCorrectOption = isResult && correctAnswer === option
        const isWrongSelected =
          isResult && isSelected && !!correctAnswer && correctAnswer !== option

        return (
          <RadioOption
            key={index}
            option={option}
            isSelected={isSelected}
            questionId={question.questionId}
            onSelect={handleOptionChange}
            isResult={isResult}
            isCorrectOption={isCorrectOption}
            isWrongSelected={isWrongSelected}
          />
        )
      })}
    </div>
  )

  const containerClass = isResult ? 'mb-[100px]' : 'mb-20'

  return (
    <div className={containerClass}>
      {/* 문제 헤더 */}
      <div className="quiz-header">
        <span className="quiz-header-title">
          {question.number}. {question.question}
        </span>
        <span className="quiz-header-badge">{question.point}점</span>
        <span className="quiz-header-badge">단일선택</span>
      </div>

      {/* 지문 및 옵션 */}
      <div className="min-h-[96px] rounded-lg ml-8">
        {question.prompt && (
          <p className="text-[16px] font-normal text-[#222222] mb-[26px]">
            {question.prompt}
          </p>
        )}
        {renderOptions()}
        {isResult && explanation && (
          <div className="mt-5">
            <QuizResultExplanation explanation={explanation} isCorrect={isCorrect} />
          </div>
        )}
      </div>
    </div>
  )
}
