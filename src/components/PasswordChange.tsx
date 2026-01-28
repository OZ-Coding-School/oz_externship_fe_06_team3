import { useState } from 'react'
import { CommonInput, type FieldState } from './common/CommonInput'
import { Button } from './common'

export default function PasswordChange() {
  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const [error, setError] = useState('')
  const [confirmState, setConfirmState] = useState<FieldState>('default')

  const handleChange = (key: keyof typeof form) => (value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    setError('')
    setConfirmState('default')
  }

  const handleSubmit = () => {
    if (!form.currentPassword || !form.newPassword) {
      setError('모든 항목을 입력해주세요.')
      return
    }

    if (form.newPassword !== form.confirmPassword) {
      setError('새 비밀번호가 일치하지 않습니다.')
      setConfirmState('error')
      return
    }

    setConfirmState('success')
  }

  return (
    <>
      <p className="title-xl mb-[20px]">비밀번호 변경</p>
      <div className="infoborder mt-[20px] w-[74fpx] px-[44px] py-[52px]">
        <div className="flex flex-col gap-[20px]">
          {/* 기존 비밀번호 */}
          <div className="flex items-center justify-between">
            <p className="w-[105px]">기존 비밀번호</p>
            <CommonInput
              type="password"
              placeholder="새 비밀번호를 입력해주세요."
              value={form.currentPassword}
              width={533}
              onChange={handleChange('currentPassword')}
            />
          </div>
          {/* 새 비밀번호 */}
          <div className="flex items-center justify-between">
            <p className="w-[105px]">새 비밀번호</p>
            <CommonInput
              type="password"
              placeholder="새 비밀번호를 한 번 더 입력해주세요."
              value={form.newPassword}
              width={533}
              onChange={handleChange('newPassword')}
            />
          </div>
          {/* 새 비밀번호 확인 */}
          <div className="flex items-center justify-between">
            <p className="w-[105px]">새 비밀번호 확인</p>
            <CommonInput
              type="password"
              placeholder="새 비밀번호를 한 번 더 입력해주세요."
              value={form.confirmPassword}
              width={533}
              state={confirmState}
              helperText={error}
              helperVisibility={error ? 'always' : 'never'}
              onChange={handleChange('confirmPassword')}
            />
          </div>
        </div>
        <div className="mt-[40px] flex justify-end">
          <Button size="md" onClick={handleSubmit}>
            변경하기
          </Button>
        </div>
      </div>
    </>
  )
}
