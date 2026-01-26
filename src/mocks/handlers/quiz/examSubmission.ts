import { http, HttpResponse } from 'msw'
import examDeployments from '@/mocks/data/examDeployments.json'

const mapSubmissionId = (deploymentId: number) => 300 + deploymentId

interface SubmissionRequestBody {
  deployment_id: number
  started_at: string
  cheating_count: number
  answers: Array<{
    question_id: number
    type: string
    submitted_answer: unknown
  }>
}

export const examSubmissionHandler = http.post('/api/v1/exams/submissions', async ({ request }) => {
  let body: SubmissionRequestBody | null = null

  try {
    body = (await request.json()) as SubmissionRequestBody
  } catch {
    body = null
  }

  if (!body || typeof body.deployment_id !== 'number') {
    return HttpResponse.json(
      { error_detail: '요청 형식이 올바르지 않습니다.' },
      { status: 400 }
    )
  }

  const deploymentExists = examDeployments.some((item) => item.id === body!.deployment_id)
  if (!deploymentExists) {
    return HttpResponse.json(
      { error_detail: '해당 시험 정보를 찾을 수 없습니다.' },
      { status: 404 }
    )
  }

  const answerCount = Array.isArray(body.answers) ? body.answers.length : 0
  const score = Math.min(100, answerCount * 5)
  const correctAnswerCount = Math.min(answerCount, Math.floor(score / 5))

  const submissionId = mapSubmissionId(body.deployment_id)
  return HttpResponse.json({
    submission_id: submissionId,
    score,
    correct_answer_count: correctAnswerCount,
    redirect_url: `/exam/result/${submissionId}`,
  })
})
