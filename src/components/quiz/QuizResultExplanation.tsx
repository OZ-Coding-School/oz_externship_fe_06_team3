interface QuizResultExplanationProps {
  explanation: string
  isCorrect: boolean
}

export default function QuizResultExplanation({
  explanation,
  isCorrect,
}: QuizResultExplanationProps) {
  const boxClass = isCorrect ? 'bg-[rgba(161,233,207,0.30)]' : 'bg-[#FCE5E8]'

  return (
    <div className={`rounded-lg ${boxClass} px-4 py-6`}>
      <div className="flex items-center gap-3">
        {isCorrect ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
          >
            <path
              d="M9 17C13.4183 17 17 13.4183 17 9C17 4.58172 13.4183 1 9 1C4.58172 1 1 4.58172 1 9C1 13.4183 4.58172 17 9 17Z"
              stroke="#14C786"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
          >
            <path
              d="M13 1L1 13"
              stroke="#EC0037"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M1 1L13 13"
              stroke="#EC0037"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
        <p className="text-[16px] font-normal leading-[140%] tracking-[-0.48px] text-[#303030]">
          {explanation}
        </p>
      </div>
    </div>
  )
}
