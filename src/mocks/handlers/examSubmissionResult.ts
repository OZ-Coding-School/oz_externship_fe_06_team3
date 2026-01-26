import { http, HttpResponse } from 'msw'
import examSubmissionResult from '@/mocks/data/examSubmissionResult.json'

export const examSubmissionResultHandler = http.get(
  '/api/v1/exams/submissions/:submissionId',
  ({ params }) => {
    const submissionId = Number(params.submissionId)

    if (submissionId !== examSubmissionResult.id) {
      return HttpResponse.json(
        { error_detail: '해당 시험 정보를 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    return HttpResponse.json(examSubmissionResult)
  }
)
