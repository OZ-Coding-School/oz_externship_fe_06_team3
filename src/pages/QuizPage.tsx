import { useState } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/common/Button'
import clsx from 'clsx'
import QuizHeader from '@/components/QuizHeader'

// 스타일 선언
const warningTitleStyle = clsx('text-black font-semibold text-[18px] mb-3')
const warningContentStyle = clsx('text-black font-normal text-[14px]')

function QuizPage() {
  const [showWarning, setShowWarning] = useState(true)

  const handleCloseWarning = () => {
    setShowWarning(false)
  }

  const handleSubmit = () => {
    // 제출 로직은 추후 구현 예정
    alert('시험이 제출되었습니다.')
  }

  return (
    <div>
      <QuizHeader />

      {/* 메인 영역 */}
      <main className="flex flex-col items-center px-10 py-6">

        {/* 경고 박스 */}
        {showWarning && (
          <div className="min-w-[1200px] flex items-start gap-3 rounded-lg bg-[#EFE6FC] px-6 py-5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#EC0037]">
              <img
                src="/alertCircle.svg"
                alt="경고"
                className="h-5 w-5"
              />
            </div>
            <div className="flex-1">
              <h2 className={warningTitleStyle}>시험에만 집중해 주세요</h2>
              <p className={warningContentStyle}>
                탭이나 창을 이동하면 부정행위로 처리돼 시험이 중단될 수 있어요. 안정적인 환경에서 시험을 이어가 주세요.
              </p>
            </div>
            <button
              type="button"
              onClick={handleCloseWarning}
              aria-label="닫기"
            >
              <X className="h-5 w-5 text-[#0F172A]]" />
            </button>
          </div>
        )}

        <div className="min-h-[500px]">
          {/* 쪽지시험 유형별 컴포넌트가 들어갈 자리 */}
        </div>
      </main>

      <footer>
        <div className="flex justify-center">
          <Button variant="primary" size="md" rounded="default" onClick={handleSubmit}>
            제출하기
          </Button>
        </div>
      </footer>
    </div>
  )
}

export default QuizPage
