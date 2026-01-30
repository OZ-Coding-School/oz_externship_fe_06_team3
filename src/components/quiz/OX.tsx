import type { ExamDeploymentDetailResult } from '@/mappers/examDeploymentDetail'
import QuizResultExplanation from './QuizResultExplanation'

interface OXProps {
  question: ExamDeploymentDetailResult['questions'][0]
  answer: string | null
  onAnswerChange: (questionId: number, answer: string) => void
  isResult?: boolean
  correctAnswer?: string | null
  isCorrect?: boolean
  explanation?: string | null
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
  isResult?: boolean
  isCorrectOption?: boolean
  isWrongSelected?: boolean
}

function OXOption({ option, isSelected, questionId, onSelect, isResult, isCorrectOption, isWrongSelected }: OXOptionProps) {
  const isO = option === 'O' || option === '맞아요'
  const displayText = option === 'O' ? OPTION_LABELS.O : option === 'X' ? OPTION_LABELS.X : option

  const resultSelectedCorrect = isResult && isSelected && isCorrectOption
  const resultSelectedWrong = isResult && isSelected && isWrongSelected

  const cardClass = `w-[308px] h-[48px] rounded-[4px] flex items-center justify-between px-4 cursor-pointer transition-colors ${resultSelectedCorrect
    ? 'bg-[rgba(161,233,207,0.30)]'
    : resultSelectedWrong
      ? 'bg-[rgba(247,153,175,0.30)]'
      : isSelected
        ? COLORS.selected.card
        : COLORS.unselected.card
    }`

  const iconClass = 'w-6 h-6 flex items-center justify-center flex-shrink-0'

  let oStrokeColor: string = '#B4B4B4'

  switch (true) {
    case resultSelectedCorrect:
      oStrokeColor = '#14C786'
      break
    case resultSelectedWrong:
      oStrokeColor = '#EC0037'
      break
    case isSelected:
      oStrokeColor = '#14C786'
      break
    default:
      oStrokeColor = '#B4B4B4'
  }

  let xStrokeColor: string = '#B4B4B4'

  switch (true) {
    case resultSelectedWrong:
      xStrokeColor = '#EC0037'
      break
    case isSelected:
      xStrokeColor = '#EC0037'
      break
    default:
      xStrokeColor = '#B4B4B4'
  }

  let checkmarkColor: string = COLORS.unselected.checkmark

  switch (true) {
    case resultSelectedCorrect:
      checkmarkColor = 'text-[#14C786]'
      break
    case resultSelectedWrong:
      checkmarkColor = 'text-[#EC0037]'
      break
    case isSelected:
      checkmarkColor = COLORS.selected.checkmark
      break
    default:
      checkmarkColor = COLORS.unselected.checkmark
  }

  const checkmarkClass = `text-2xl font-normal ${checkmarkColor}`

  return (
    <label className={cardClass}>
      <div className="flex items-center gap-3">
        {isO ? (
          <div className={iconClass}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
            >
              <path
                d="M9 17C13.4183 17 17 13.4183 17 9C17 4.58172 13.4183 1 9 1C4.58172 1 1 4.58172 1 9C1 13.4183 4.58172 17 9 17Z"
                stroke={oStrokeColor}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        ) : (
          <div className={iconClass}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
            >
              <path
                d="M13 1L1 13"
                stroke={xStrokeColor}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M1 1L13 13"
                stroke={xStrokeColor}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
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

export default function OX({
  question,
  answer,
  onAnswerChange,
  isResult = false,
  correctAnswer = null,
  isCorrect = false,
  explanation = null,
}: OXProps) {
  const handleOptionChange = (option: string) => {
    onAnswerChange(question.questionId, option)
  }
  const containerClass = isResult ? 'mb-[100px]' : 'mb-20'

  return (
    <div className={containerClass}>
      {/* 문제 헤더 */}
      <div className="quiz-header">
        <span className="quiz-header-title">
          {question.number}. {question.question}
        </span>
        <span className="quiz-header-badge">{question.point}점</span>
        <span className="quiz-header-badge">OX선택</span>
      </div>

      {/* 옵션 */}
      <div className="flex flex-col gap-[18px] ml-8">
        {question.options?.map((option, index) => (
          <OXOption
            key={index}
            option={option}
            isSelected={answer === option}
            questionId={question.questionId}
            onSelect={handleOptionChange}
            isResult={isResult}
            isCorrectOption={isResult && correctAnswer === option}
            isWrongSelected={isResult && !!correctAnswer && correctAnswer !== option}
          />
        ))}
      </div>
      {isResult && explanation && (
        <div className="mt-5 ml-8">
          <QuizResultExplanation explanation={explanation} isCorrect={isCorrect} />
        </div>
      )}
    </div>
  )
}
