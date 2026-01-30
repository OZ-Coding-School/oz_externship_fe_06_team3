import type { ExamDeploymentDetailResult } from '@/mappers/examDeploymentDetail'
import QuizResultExplanation from './QuizResultExplanation'

interface MultipleChoiceProps {
  question: ExamDeploymentDetailResult['questions'][0]
  answer: string[] | null
  onAnswerChange: (questionId: number, answer: string[]) => void
  isResult?: boolean
  correctAnswer?: string[] | null
  isCorrect?: boolean
  explanation?: string | null
}

const isChecked = (answer: string[] | null, option: string) =>
  Array.isArray(answer) && answer.includes(option)

const toggleOption = (answer: string[] | null, option: string) => {
  if (!Array.isArray(answer)) return [option]
  return answer.includes(option)
    ? answer.filter((item) => item !== option)
    : [...answer, option]
}

export default function MultipleChoice({
  question,
  answer,
  onAnswerChange,
  isResult = false,
  correctAnswer = null,
  isCorrect = false,
  explanation = null,
}: MultipleChoiceProps) {
  const handleOptionChange = (option: string) => {
    const next = toggleOption(answer, option)
    onAnswerChange(question.questionId, next)
  }

  const containerClass = isResult ? 'mb-[100px]' : 'mb-20'

  return (
    <div className={containerClass}>
      <div className="quiz-header">
        <span className="quiz-header-title">
          {question.number}. {question.question}
        </span>
        <span className="quiz-header-badge">{question.point}점</span>
        <span className="quiz-header-badge">다중선택</span>
      </div>

      <div className="ml-8 space-y-4">
        {question.options?.map((option, index) => {
          const checked = isChecked(answer, option)
          const isCorrectOption = isResult && !!correctAnswer?.includes(option)
          const isWrongSelected =
            isResult && checked && !!correctAnswer && !correctAnswer.includes(option)
          const textColor = isResult
            ? isCorrectOption
              ? 'text-[#14C786]'
              : isWrongSelected
                ? 'text-[#EC0037]'
                : 'text-[#222222]'
            : 'text-[#222222]'
          return (
            <label key={index} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="hidden"
                checked={checked}
                onChange={() => handleOptionChange(option)}
              />
              <span
                className={`flex h-[18px] w-[18px] items-center justify-center rounded-[2px] border ${checked
                  ? 'border-[#6201E0] bg-[#6201E0]'
                  : 'border-[#BDBDBD] bg-transparent'
                  }`}
              >
                {checked && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="13"
                    height="11"
                    viewBox="0 0 13 11"
                    fill="none"
                  >
                    <path
                      d="M0.75 6.52957L3.00403 9.42757C3.08009 9.5264 3.17755 9.60673 3.28909 9.66255C3.40063 9.71828 3.52335 9.74809 3.64804 9.74957C3.77072 9.75106 3.89219 9.72505 4.00359 9.67369C4.11499 9.62226 4.21353 9.54663 4.29205 9.45234L11.4835 0.75"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </span>
              <span className={`text-[16px] font-normal ${textColor}`}>{option}</span>
            </label>
          )
        })}
        {isResult && explanation && (
          <div className="mt-5">
            <QuizResultExplanation explanation={explanation} isCorrect={isCorrect} />
          </div>
        )}
      </div>
    </div>
  )
}
