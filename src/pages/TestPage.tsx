import { useState } from 'react'
import api from '@/api/api'
import { CommonInput, Dropdown, Error404, Loading, NotFound, Password } from '@/components/common'

const options = [
  { label: '옵션 1', value: 'option-1' },
  { label: '옵션 2', value: 'option-2' },
  { label: '옵션 3', value: 'option-3' },
  { label: '옵션 4', value: 'option-4' },
  { label: '옵션 5', value: 'option-5' },
  { label: '옵션 6', value: 'option-6' },
]

function TestPage() {
  const [value, setValue] = useState<string | undefined>()
  const [password, setPassword] = useState('')
  const [passwordState, setPasswordState] = useState<'default' | 'error' | 'success'>('default')
  const [inputValue, setInputValue] = useState('')
  const [showNotFound, setShowNotFound] = useState(false)
  const [page, setPage] = useState('1')
  const [status, setStatus] = useState('all')
  const [deploymentId, setDeploymentId] = useState('101')
  const [code, setCode] = useState('123456')
  const [apiLoading, setApiLoading] = useState(false)
  const [apiResponse, setApiResponse] = useState('')
  const [apiError, setApiError] = useState('')

  // 가짜 로그인용 올바른 비밀번호
  const correctPassword = 'Test123!'

  const handlePasswordChange = (newPassword: string) => {
    setPassword(newPassword)
    // 입력값이 변경되면 상태를 default로 초기화
    if (passwordState !== 'default') {
      setPasswordState('default')
    }
  }

  const handleLogin = () => {
    if (password === correctPassword) {
      setPasswordState('success')
    } else {
      setPasswordState('error')
    }
  }

  const runRequest = async (requestFn: () => Promise<unknown>) => {
    setApiLoading(true)
    setApiResponse('')
    setApiError('')
    try {
      const response = await requestFn()
      setApiResponse(JSON.stringify(response, null, 2))
    } catch (error) {
      const axiosError = error as { response?: { data?: unknown } }
      if (axiosError.response?.data) {
        setApiError(JSON.stringify(axiosError.response.data, null, 2))
      } else {
        setApiError(JSON.stringify(error, null, 2))
      }
    } finally {
      setApiLoading(false)
    }
  }

  const fetchExamDeployments = () => {
    return runRequest(async () => {
      const response = await api.get('/api/v1/exams/deployments', {
        params: { page: Number(page) || 1, status },
      })
      return response.data
    })
  }

  const fetchExamDeploymentDetail = () => {
    return runRequest(async () => {
      const response = await api.get(`/api/v1/exams/deplayments/${deploymentId}`)
      return response.data
    })
  }

  const checkExamCode = () => {
    return runRequest(async () => {
      const response = await api.post(
        `/api/v1/exams/deployments/${deploymentId}/check-code`,
        code ? { code } : {}
      )
      return response.data
    })
  }

  if (showNotFound) {
    return (
      <div className="min-h-screen bg-[#FAFAFB] p-10">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-black">404/NotFound/Loading</h1>
          <button
            type="button"
            onClick={() => setShowNotFound(false)}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            돌아가기
          </button>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          <div className="flex flex-col items-center gap-4 rounded-lg border border-gray-200 bg-white p-6">
            <p className="text-sm font-medium text-gray-700">Error404</p>
            <Error404 />
          </div>
          <div className="flex flex-col items-center gap-4 rounded-lg border border-gray-200 bg-white p-6">
            <p className="text-sm font-medium text-gray-700">NotFound</p>
            <NotFound />
          </div>
          <div className="flex flex-col items-center gap-4 rounded-lg border border-gray-200 bg-white p-6">
            <p className="text-sm font-medium text-gray-700">Loading</p>
            <Loading />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col gap-6 bg-[#FAFAFB] p-10">
      <h1 className="text-2xl font-semibold text-black">컴포넌트 테스트</h1>
      <button
        type="button"
        onClick={() => setShowNotFound(true)}
        className="w-fit rounded-md bg-[#111111] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#2a2a2a]"
      >
        404/NotFound/Loading 테스트
      </button>

      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-black">MSW API Test</h2>
          {apiLoading && <span className="text-sm text-gray-500">Loading...</span>}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium text-gray-700">page</label>
            <CommonInput value={page} onChange={setPage} placeholder="page" width={240} />
          </div>
          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium text-gray-700">status</label>
            <CommonInput value={status} onChange={setStatus} placeholder="all | done | pending" width={240} />
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
            onClick={fetchExamDeployments}
            className="rounded-md bg-[#111111] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#2a2a2a]"
          >
            쪽지시험 목록 조회
          </button>
          <button
            type="button"
            onClick={fetchExamDeploymentDetail}
            className="rounded-md bg-[#111111] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#2a2a2a]"
          >
            쪽지시험 문제 상세 조회
          </button>
          <button
            type="button"
            onClick={checkExamCode}
            className="rounded-md bg-[#111111] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#2a2a2a]"
          >
            쪽지시험 입장 코드 확인
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
      </div>      {/* Dropdown 테스트 */}
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-black">Dropdown 테스트</h2>
        <Dropdown options={options} value={value} onChange={setValue} />
        <Dropdown options={options} disabled />
      </div>

      {/* Password 테스트 */}
      <div className="mt-8 flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-black">Password 테스트</h2>
        <Password
          width={288}
          value={password}
          onChange={handlePasswordChange}
          placeholder="비밀번호를 입력해주세요"
          state={passwordState}
        />
        <button
          type="button"
          onClick={handleLogin}
          className="w-[288px] rounded-md bg-[#6201E0] px-4 py-2 text-white hover:bg-[#5210be] transition-colors"
        >
          로그인
        </button>
        <p className="text-xs text-gray-500">
          테스트용 올바른 비밀번호: <span className="font-mono font-semibold">{correctPassword}</span>
        </p>
      </div>

      {/* CommonInput 테스트 */}
      <div className="mt-8 flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-black">CommonInput 테스트</h2>
        <CommonInput
          value={inputValue}
          onChange={setInputValue}
          placeholder="입력해주세요"
          width={288}
        />
      </div>
    </div>
  )
}

export default TestPage
