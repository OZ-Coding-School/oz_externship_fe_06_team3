import { http, HttpResponse } from 'msw'
import examDeploymentDetail from '@/mocks/data/examDeploymentDetail.json'
import examDeployments from '@/mocks/data/examDeployments.json'

export const examDeploymentDetailHandler = http.get(
  '/api/v1/exams/deplayments/:deploymentId',
  ({ params }) => {
    const deploymentId = Number(params.deploymentId)
    const deployment = examDeployments.find((item) => item.id === deploymentId)

    if (!deployment) {
      return HttpResponse.json(
        { error_detail: '?? ?? ??? ?? ? ????.' },
        { status: 404 }
      )
    }

    return HttpResponse.json({
      ...examDeploymentDetail,
      exam_id: deployment.exam.id,
      exam_name: deployment.exam.title,
      duration_time: deployment.duration_time,
    })
  }
)
