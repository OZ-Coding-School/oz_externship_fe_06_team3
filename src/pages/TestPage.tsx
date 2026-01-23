import { useState } from 'react'
import { CommonInput, Dropdown, Error404, Loading, NotFound, Password } from '@/components/common'
import TestPageApiPanel from '@/components/TestPageApiPanel'

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

  if (showNotFound) {
    return (
      <div className="min-h-screen bg-[#FAFAFB] p-10">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h1 className="text-2xl font-semibold text-black">404/NotFound/Loading</h1>
            <button
              type="button"
              onClick={() => setShowNotFound(false)}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              돌아가기
            </button>
          </div>
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
    <div className="min-h-screen bg-[#FAFAFB] p-10">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <h1 className="text-2xl font-semibold text-black">컴포넌트 테스트</h1>
        <button
          type="button"
          onClick={() => setShowNotFound(true)}
          className="w-fit rounded-md bg-[#111111] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#2a2a2a]"
        >
          404/NotFound/Loading 테스트
        </button>

        <TestPageApiPanel />
        {/* Dropdown 테스트 */}
        <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-xl font-semibold text-black">Dropdown 테스트</h2>
          <Dropdown options={options} value={value} onChange={setValue} />
          <Dropdown options={options} disabled />
        </div>

        {/* Password 테스트 */}
        <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-6">
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
        <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-xl font-semibold text-black">CommonInput 테스트</h2>
          <CommonInput
            value={inputValue}
            onChange={setInputValue}
            placeholder="입력해주세요"
            width={288}
          />
        </div>
      </div>
    </div>
  )
}

export default TestPage
