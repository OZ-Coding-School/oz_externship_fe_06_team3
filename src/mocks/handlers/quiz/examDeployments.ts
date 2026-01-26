import { http, HttpResponse } from 'msw'
import examDeployments from '@/mocks/data/examDeployments.json'

const PAGE_SIZE = 10

export const examDeploymentsHandler = http.get('/api/v1/exams/deployments', ({ request }) => {
  const url = new URL(request.url)
  const pageParam = url.searchParams.get('page')
  const statusParam = url.searchParams.get('status') ?? 'all'
  const page = pageParam ? Number(pageParam) : 1

  const filtered = examDeployments.filter((item) => {
    if (statusParam === 'done') return item.exam_info.status === 'done'
    if (statusParam === 'pending') return item.exam_info.status === 'pending'
    return true
  })

  const startIndex = (page - 1) * PAGE_SIZE
  const endIndex = startIndex + PAGE_SIZE
  const results = filtered.slice(startIndex, endIndex)
  const hasNext = endIndex < filtered.length

  return HttpResponse.json({
    page,
    has_next: hasNext,
    results,
  })
})
