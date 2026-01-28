import { useNavigate, useParams } from 'react-router-dom'
import { Button, Loading } from '@/components/common'
import QuizHeader from "@/components/quiz/QuizHeader"
import QuizResultTop from '@/components/quiz/QuizResultTop'
import { useExamSubmissionResultQuery } from '@/hooks/useQuiz'

function QuizResultPage() {
  const navigate = useNavigate()
  const { submissionId } = useParams<{ submissionId: string }>()
  const submissionIdNumber = submissionId ? Number(submissionId) : 0

  const { data, isLoading } = useExamSubmissionResultQuery(
    submissionIdNumber,
    !!submissionId
  )

  const handleSubmit = () => {
    navigate('/mypage/quiz')
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen w-full">
        <Loading />
      </div>
    )
  }

  return (
    <div>
      <QuizHeader
        subjectName={data?.exam.title}
        message="총 문항수: 7ㆍ부정행위: 1회ㆍ응시시간: 30분ㆍ응시 결과 점수: 80점/100점"
      />

      <main>
        <QuizResultTop />
          <div className="w-[1290px] h-[500px]">

          </div>
      </main>


      <footer>
        <div className="flex justify-center mb-10">
          <Button 
            variant="primary" 
            size="xs" 
            rounded="default" 
            onClick={handleSubmit}
          >
            완료
          </Button>
        </div>
      </footer>
    </div>
  )
}

export default QuizResultPage
