import { Link } from 'react-router'
import clsx from 'clsx'

// 스타일 선언명 정의
const titleStyle = clsx('text-black font-semibold text-2xl ')
const contentStyle = clsx('text-#4D4D4D font-normal text-xl ml-12')
const timerBoxStyle = clsx('rounded-[30px] bg-white px-4 py-5 border border-[#ECECEC]')
const timerTextStyle = clsx('text-[#6201E0] font-medium text-base font-bold-600')
const timerNumberStyle = clsx('text-[#6201E0] font-semibold text-base font-bold-600')
const warningLabelStyle = clsx('text-gray-700 font-semibold text-base px-1')
const warningIconBoxStyle = clsx('h-6 w-4 rounded border border-gray-300 bg-white flex items-center justify-center')
const warningIconTextStyle = clsx('text-gray-400 text-sm')

interface QuizHeaderProps {
  subjectName?: string
  message?: string
  timeRemaining?: string
  timeRemainingSuffix?: string
  cheatingCount?: number
}

function QuizHeader({
  subjectName = 'TypeScript 쪽지시험',
  message = '집중해서 천천히, 끝까지 응시해 주세요. 응원할게요 💪',
  timeRemaining = '29 : 17',
  timeRemainingSuffix = '뒤에 끝나요',
  cheatingCount: _cheatingCount = 0,
}: QuizHeaderProps) {
  const maxCheatingCount = 3

  return (
    <header className="flex items-start justify-between border-b border-gray-200 bg-[#FAFAFA] px-70 py-6">
      {/* 좌측 영역 */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <Link
            to="/mypage/quiz"
            className="flex items-center justify-center rounded-md p-1 text-black transition-colors hover:bg-gray-100 text-3xl"
            aria-label="뒤로가기"
          >
            ←
          </Link>
          <h1 className={titleStyle}>{subjectName}</h1>
        </div>
        <p className={contentStyle}>{message}</p>
      </div>

      {/* 우측 영역 */}
      <div className="flex items-center gap-4 mt-2">
        {/* 타이머 박스 */}
        <div className={timerBoxStyle}>
          <span className={timerNumberStyle}>{timeRemaining}</span>
          <span className={timerTextStyle}> {timeRemainingSuffix}</span>
        </div>
        {/* 부정행위 카운트 */}
        <div className="flex items-center gap-2 bg-white border border-[#ECECEC] rounded-[30px] p-5">
          <span className={warningLabelStyle}>부정행위</span>
          <div className="flex gap-1">
            {Array.from({ length: maxCheatingCount }).map((_, index) => (
              <div key={index} className={warningIconBoxStyle}>
                <span className={warningIconTextStyle}>!</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </header>
  )
}

export default QuizHeader
