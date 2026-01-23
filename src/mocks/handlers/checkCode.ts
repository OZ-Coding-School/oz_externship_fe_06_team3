import { http, HttpResponse } from 'msw'
import examDeployments from '@/mocks/data/examDeployments.json'

export const checkCodeHandler = http.post(
  '/api/v1/exams/deployments/:deploymentId/check-code',
  async ({ params, request }) => {
    const deploymentId = Number(params.deploymentId)
    const deploymentExists = examDeployments.some((item) => item.id === deploymentId)

    if (!deploymentExists) {
      return HttpResponse.json(
        { error_detail: '배포 정보를 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    let body: { code?: string } = {}
    try {
      body = (await request.json()) as { code?: string }
    } catch {
      body = {}
    }

    if (!body.code) {
      return HttpResponse.json(
        { error_detail: { code: '이 필드는 필수 항목입니다.' } },
        { status: 400 }
      )
    }

    if (body.code === 'UNAUTHORIZED') {
      return HttpResponse.json(
        { error_detail: '자격 인증 데이터가 제공되지 않았습니다.' },
        { status: 401 }
      )
    }

    if (body.code === 'FORBIDDEN') {
      return HttpResponse.json(
        { error_detail: '시험에 응시할 권한이 없습니다.' },
        { status: 403 }
      )
    }

    if (body.code === 'LOCKED') {
      return HttpResponse.json(
        { error_detail: '아직 응시할 수 없습니다.' },
        { status: 423 }
      )
    }

    if (body.code !== '1234') {
      return HttpResponse.json(
        { error_detail: '응시 코드가 일치하지 않습니다.' },
        { status: 400 }
      )
    }

    return HttpResponse.json({}, { status: 200 })
  }
)
