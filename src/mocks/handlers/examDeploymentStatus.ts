import { http, HttpResponse } from 'msw'
import examDeployments from '@/mocks/data/examDeployments.json'

export const examDeploymentStatusHandler = http.get(
  '/api/v1/exams/deplayments/:deploymentId/status',
  ({ params }) => {
    const deploymentId = Number(params.deploymentId)
    const deployment = examDeployments.find((item) => item.id === deploymentId)

    if (!deployment) {
      return HttpResponse.json(
        { error_detail: '해당 시험 정보를 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    const isClosed = deployment.is_done

    return HttpResponse.json({
      exam_status: isClosed ? 'closed' : 'activated',
      force_submit: isClosed,
    })
  }
)
