import { useState, useMemo } from 'react'
import { PasswordInput } from './common/PasswordInput'
import { Button } from './common'
import { changePassword } from '@/api/auth'
import { mapChangePasswordError } from '@/utils/error/authEndpointErrorMapper'
import {
  derivePasswordFieldState,
  derivePasswordConfirmState,
} from '@/utils/signupUtils'
import type { FieldState } from '@/components/common/CommonInput'

export default function PasswordChange() {
  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const [currentState, setCurrentState] = useState<FieldState>('default')
  const [currentHelper, setCurrentHelper] = useState<string | null>(null)
  const [newHelper, setNewHelper] = useState<string | null>(null)
  const [confirmHelper, setConfirmHelper] = useState<string | null>(null)

  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (key: keyof typeof form) => (value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    // clear field-specific helpers while typing
    if (key === 'currentPassword') {
      setCurrentHelper(null)
      setCurrentState('default')
    }
    if (key === 'newPassword') {
      setNewHelper(null)
      setConfirmHelper(null)
    }
    if (key === 'confirmPassword') {
      setConfirmHelper(null)
    }
  }

  const newState = useMemo(
    () => derivePasswordFieldState(form.newPassword),
    [form.newPassword]
  )
  const confirmState = useMemo(
    () => derivePasswordConfirmState(form.newPassword, form.confirmPassword),
    [form.newPassword, form.confirmPassword]
  )

  const handleSubmit = async () => {
    if (newState !== 'success') {
      setNewHelper('비밀번호가 정책에 맞지 않습니다.')
      return
    }

    if (confirmState !== 'success') {
      setConfirmHelper('비밀번호가 일치하지 않습니다.')
      return
    }

    setIsLoading(true)
    try {
      await changePassword({
        oldPassword: form.currentPassword,
        newPassword: form.newPassword,
      })

      setNewHelper('비밀번호가 유효합니다.')
      setConfirmHelper('비밀번호가 일치합니다.')
      setCurrentState('default')
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' })

      window.alert('비밀번호 변경 성공.')
    } catch (err) {
      const mapped = mapChangePasswordError(err)
      if (mapped.kind === 'field') {
        if (mapped.field === 'newPassword') {
          setNewHelper(mapped.message)
        } else if (mapped.field === 'currentPassword') {
          setCurrentHelper(mapped.message)
          setCurrentState('error')
        } else {
          setConfirmHelper(mapped.message)
        }
      } else if (mapped.kind === 'form' || mapped.kind === 'tokenInvalid') {
        setConfirmHelper(mapped.message)
      } else {
        setConfirmHelper('비밀번호 변경에 실패했습니다. 다시 시도해주세요.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <p className="title-xl mb-[20px]">비밀번호 변경</p>
      <div className="info-border mt-[20px] px-[44px] py-[52px]">
        <div className="flex flex-col gap-[20px]">
          {/* 기존 비밀번호 */}
          <div className="flex items-center justify-between">
            <p className="w-[105px]">기존 비밀번호</p>
            <PasswordInput
              placeholder={'새 비밀번호를 입력해주세요.'}
              value={form.currentPassword}
              width={533}
              state={currentState}
              helperTextByState={{ error: currentHelper ?? undefined }}
              helperVisibility={currentHelper ? 'always' : 'never'}
              onChange={handleChange('currentPassword')}
              autoComplete="off"
            />
          </div>

          {/* 새 비밀번호 */}
          <div className="flex items-center justify-between">
            <p className="w-[105px]">새 비밀번호</p>
            <PasswordInput
              placeholder={'새 비밀번호를 입력해주세요.'}
              value={form.newPassword}
              width={533}
              state={newState}
              helperTextByState={{
                error: newHelper ?? '비밀번호가 정책에 맞지 않습니다.',
                success: newHelper ?? '비밀번호가 유효합니다.',
              }}
              helperVisibility={'always'}
              onChange={handleChange('newPassword')}
              autoComplete="off"
            />
          </div>

          {/* 새 비밀번호 확인 */}
          <div className="flex items-center justify-between">
            <p className="w-[105px]">새 비밀번호 확인</p>
            <PasswordInput
              placeholder={'새 비밀번호를 한 번 더 입력해주세요.'}
              value={form.confirmPassword}
              width={533}
              state={confirmState}
              helperTextByState={{
                error: confirmHelper ?? '비밀번호가 일치하지 않습니다.',
                success: confirmHelper ?? '비밀번호가 일치합니다.',
              }}
              helperVisibility={'always'}
              onChange={handleChange('confirmPassword')}
              autoComplete="off"
            />
          </div>
        </div>

        <div className="mt-[40px] flex justify-end">
          <Button
            size="md"
            onClick={handleSubmit}
            variant={
              !form.currentPassword ||
              !form.newPassword ||
              !form.confirmPassword
                ? 'disabled'
                : 'primary'
            }
          >
            {isLoading ? '처리 중...' : '변경하기'}
          </Button>
        </div>
      </div>
    </>
  )
}
