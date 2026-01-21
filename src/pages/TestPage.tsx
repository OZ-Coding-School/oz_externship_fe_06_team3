import { useState } from 'react'
import { Dropdown } from '../components'
import { Password } from '@/components/common/Password'
import { CommonInput } from '@/components/common/CommonInput'

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
  
  return (
    <div className="flex min-h-screen flex-col gap-6 bg-[#FAFAFB] p-10">
      <h1 className="text-2xl font-semibold text-black">컴포넌트 테스트</h1>
      {/* Dropdown 테스트 */}
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-black">Dropdown 테스트</h2>
        <Dropdown options={options} value={value} onChange={setValue} />
        <Dropdown options={options} disabled />
      </div>

      {/* Password 테스트 */}
      <div className="mt-8 flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-black">Password 테스트</h2>
        <Password
          width="sm"
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
