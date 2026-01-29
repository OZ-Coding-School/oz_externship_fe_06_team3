import { http, HttpResponse } from 'msw'
import examSubmissionResult from '@/mocks/data/examSubmissionResult.json'

export const examSubmissionResultHandler = http.get(
  '/api/v1/exams/submissions/:submissionId',
  () => {
    return HttpResponse.json(examSubmissionResult)
  }
)
