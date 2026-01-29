import { useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { apiClient } from '@/api/client'
import { Button, CommonInput, Dropdown } from '@/components/common'

const getErrorPayload = (error: unknown) => {
  const maybeAxios = error as { response?: { data?: unknown }; message?: string }
  if (maybeAxios?.response?.data) {
    return maybeAxios.response.data
  }
  if (maybeAxios?.message) {
    return { message: maybeAxios.message }
  }
  return { message: 'Unknown error' }
}

const TestPageApiPanel = () => {
  const [page, setPage] = useState('1')
  const [status, setStatus] = useState('all')
  const [deploymentId, setDeploymentId] = useState('101')
  const [code, setCode] = useState('123456')
  const [submissionId, setSubmissionId] = useState('350')
  const [apiResponse, setApiResponse] = useState('')
  const [apiError, setApiError] = useState('')

  const statusOptions = [
    { label: 'all', value: 'all' },
    { label: 'done', value: 'done' },
    { label: 'pending', value: 'pending' },
  ]

  const deploymentsQuery = useQuery({
    queryKey: ['examDeployments', page, status],
    queryFn: async () => {
      const response = await apiClient.get('/api/v1/exams/deployments', {
        params: { page: Number(page) || 1, status },
      })
      return response.data
    },
    enabled: false,
    retry: false,
  })

  const detailQuery = useQuery({
    queryKey: ['examDeploymentDetail', deploymentId],
    queryFn: async () => {
      const response = await apiClient.get(`/api/v1/exams/deplayments/${deploymentId}`)
      return response.data
    },
    enabled: false,
    retry: false,
  })

  const checkCodeMutation = useMutation({
    mutationFn: async () => {
      const response = await apiClient.post(
        `/api/v1/exams/deployments/${deploymentId}/check-code`,
        code ? { code } : {}
      )
      return { status: response.status, data: response.data }
    },
    retry: false,
  })

  const submissionMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        deployment_id: Number(deploymentId),
        started_at: new Date().toISOString(),
        cheating_count: 0,
        answers: [
          { question_id: 5001, type: 'single_choice', submitted_answer: 'option' },
          { question_id: 5002, type: 'multiple_choice', submitted_answer: ['option1', 'option2'] },
          { question_id: 5003, type: 'ox', submitted_answer: 'O' },
          { question_id: 5004, type: 'short_answer', submitted_answer: 'answer' },
          { question_id: 5005, type: 'ordering', submitted_answer: ['1', '2', '3'] },
          { question_id: 5006, type: 'fill_blank', submitted_answer: ['A', 'B'] },
        ],
      }
      const response = await apiClient.post('/api/v1/exams/submissions', payload)
      return response.data
    },
    retry: false,
  })

  const submissionResultQuery = useQuery({
    queryKey: ['examSubmissionResult', submissionId],
    queryFn: async () => {
      const response = await apiClient.get(`/api/v1/exams/submissions/${submissionId}`)
      return response.data
    },
    enabled: false,
    retry: false,
  })

  const runQuery = async (fn: () => Promise<unknown>) => {
    setApiResponse('')
    setApiError('')
    try {
      const data = await fn()
      setApiResponse(JSON.stringify(data, null, 2))
    } catch (error) {
      setApiError(JSON.stringify(getErrorPayload(error), null, 2))
    }
  }

  const runQueryFromRefetch = async <T,>(refetch: () => Promise<{ data: T; error?: unknown }>) => {
    const result = await refetch()
    if (result.error) {
      throw result.error
    }
    return result.data
  }

  const handleDeployments = () => runQuery(() => runQueryFromRefetch(deploymentsQuery.refetch))
  const handleDetail = () => runQuery(() => runQueryFromRefetch(detailQuery.refetch))
  const handleCheckCode = () => runQuery(() => checkCodeMutation.mutateAsync())
  const handleSubmission = () => runQuery(() => submissionMutation.mutateAsync())
  const handleSubmissionResult = () =>
    runQuery(() => runQueryFromRefetch(submissionResultQuery.refetch))

  const isLoading =
    deploymentsQuery.isFetching ||
    detailQuery.isFetching ||
    checkCodeMutation.isPending ||
    submissionMutation.isPending ||
    submissionResultQuery.isFetching

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-black">MSW API Test</h2>
        {isLoading && <span className="text-sm text-gray-500">Loading...</span>}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-3">
          <label className="text-sm font-medium text-gray-700">page</label>
          <CommonInput value={page} onChange={setPage} placeholder="page" width={240} />
        </div>
        <div className="flex flex-col gap-3">
          <label className="text-sm font-medium text-gray-700">status</label>
          <Dropdown options={statusOptions} value={status} onChange={setStatus} />
        </div>
        <div className="flex flex-col gap-3">
          <label className="text-sm font-medium text-gray-700">deploymentId</label>
          <CommonInput value={deploymentId} onChange={setDeploymentId} placeholder="deploymentId" width={240} />
        </div>
        <div className="flex flex-col gap-3">
          <label className="text-sm font-medium text-gray-700">code</label>
          <CommonInput value={code} onChange={setCode} placeholder="123456" width={240} />
        </div>
        <div className="flex flex-col gap-3">
          <label className="text-sm font-medium text-gray-700">submissionId</label>
          <CommonInput value={submissionId} onChange={setSubmissionId} placeholder="350" width={240} />
        </div>
      </div>
      <div className="mt-5 flex flex-wrap gap-3">
        <Button type="button" onClick={handleDeployments} className="w-fit">
          쪽지시험 목록
        </Button>
        <Button type="button" onClick={handleDetail} className="w-fit bg-black text-white hover:bg-[#2a2a2a]">
          쪽지시험 문제
        </Button>
        <Button type="button" variant="secondary" onClick={handleCheckCode} className="w-fit">
          쪽지시험 입장 코드
        </Button>
        <Button
          type="button"
          onClick={handleSubmission}
          className="w-fit bg-[#0f766e] text-white hover:bg-[#115e59]"
        >
          쪽지시험 제출
        </Button>
        <Button type="button" variant="secondary" onClick={handleSubmissionResult} className="w-fit">
          결과 확인
        </Button>
      </div>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <div className="rounded-md bg-gray-50 p-4">
          <p className="mb-2 text-sm font-medium text-gray-700">response</p>
          <pre className="max-h-64 overflow-auto text-xs text-gray-800">{apiResponse || '-'}</pre>
        </div>
        <div className="rounded-md bg-red-50 p-4">
          <p className="mb-2 text-sm font-medium text-red-700">error</p>
          <pre className="max-h-64 overflow-auto text-xs text-red-800">{apiError || '-'}</pre>
        </div>
      </div>
    </div>
  )
}

export default TestPageApiPanel
