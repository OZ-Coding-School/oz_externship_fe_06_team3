import { useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import api from '@/api/api'
import { CommonInput, Dropdown } from '@/components/common'

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
      const response = await api.get('/api/v1/exams/deployments', {
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
      const response = await api.get(`/api/v1/exams/deplayments/${deploymentId}`)
      return response.data
    },
    enabled: false,
    retry: false,
  })

  const checkCodeMutation = useMutation({
    mutationFn: async () => {
      const response = await api.post(
        `/api/v1/exams/deployments/${deploymentId}/check-code`,
        code ? { code } : {}
      )
      return { status: response.status, data: response.data }
    },
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

  const isLoading =
    deploymentsQuery.isFetching || detailQuery.isFetching || checkCodeMutation.isPending

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
      </div>
      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleDeployments}
          className="rounded-md bg-[#6201E0] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#5210be]"
        >
          쪽지시험 목록
        </button>
        <button
          type="button"
          onClick={handleDetail}
          className="rounded-md bg-[#111111] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#2a2a2a]"
        >
          쪽지시험 문제
        </button>
        <button
          type="button"
          onClick={handleCheckCode}
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          쪽지시험 입장 코드
        </button>
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
