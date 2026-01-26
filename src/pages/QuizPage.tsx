import { Outlet } from 'react-router-dom'
import { Button } from '@/components/common/Button'
import QuizHeader from '@/components/QuizHeader'
import QuizWarningBox from '@/components/QuizWarningBox'

function QuizPage() {
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
        <QuizWarningBox />

        <div className="min-h-[500px] min-w-[1200px]">
          {/* 쪽지시험 유형별 컴포넌트가 들어갈 자리 */}
          <Outlet />
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
