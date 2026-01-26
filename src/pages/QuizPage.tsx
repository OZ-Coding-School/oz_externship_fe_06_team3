import { useParams } from 'react-router-dom'
import { Button, Loading } from '@/components/common'
import QuizHeader from '@/components/QuizHeader'
import QuizWarningBox from '@/components/QuizWarningBox'
import { useExamDeploymentDetailQuery } from '@/hooks/useQuiz'

function QuizPage() {
  const { deploymentId } = useParams<{ deploymentId: string }>()
  const deploymentIdNumber = deploymentId ? Number(deploymentId) : 0

  const { data, isLoading } = useExamDeploymentDetailQuery(
    deploymentIdNumber,
    !!deploymentId
  )

  const handleSubmit = () => {
    // 제출 로직은 추후 구현 예정
    alert('시험이 제출되었습니다.')
  }

  if (isLoading) {
    return <Loading />
  }

  return (
    <div>
      <QuizHeader subjectName={data?.examName || '쪽지시험'} />

      {/* 메인 영역 */}
      <main className="flex flex-col items-center px-10 py-6">
        {/* 경고 박스 */}
        <QuizWarningBox />

        <div className="min-h-[500px] min-w-[1200px]">
          {data?.questions && data.questions.length > 0 ? (
            <div className="space-y-8">
              {data.questions
                .sort((a, b) => a.number - b.number)
                .map((question) => (
                  <div
                    key={question.questionId}
                    className="bg-white border border-gray-200 rounded-lg p-6"
                  >
                    <div className="mb-4">
                      <span className="text-lg font-semibold text-black">
                        {question.number}. {question.question}
                      </span>
                      <span className="ml-2 text-sm text-gray-500">
                        ({question.point}점)
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      유형: {question.type}
                      {question.options && (
                        <div className="mt-2">
                          <p className="font-medium">선택지:</p>
                          <ul className="list-disc list-inside ml-4">
                            {question.options.map((option, idx) => (
                              <li key={idx}>{option}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {question.prompt && (
                        <div className="mt-2">
                          <p className="font-medium">문제:</p>
                          <p>{question.prompt}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="flex justify-center items-center py-20">
              <p className="text-gray-500">표시할 문제가 없습니다.</p>
            </div>
          )}
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
