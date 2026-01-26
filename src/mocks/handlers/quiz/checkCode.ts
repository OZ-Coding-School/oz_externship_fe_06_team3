import { http, HttpResponse } from 'msw'

export const checkCodeHandler = http.post(
  '/api/v1/exams/deployments/:deploymentId/check-code',
  async ({ request }) => {

    let body: { code?: string } = {}
    try {
      body = (await request.json()) as { code?: string }
    } catch {
      body = {}
    }

    if (!body.code) {
      return HttpResponse.json(
        { error_detail: "이 필드는 필수 항목입니다." },
        { status: 400 }
      )
    }

    if (body.code !== '123456') {
      return HttpResponse.json(
        { error_detail: '응시 코드가 일치하지 않습니다.' },
        { status: 400 }
      )
    }

    return HttpResponse.json({}, { status: 200 })
  }
)
