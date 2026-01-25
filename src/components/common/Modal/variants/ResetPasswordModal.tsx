import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Modal } from '../Modal'
import { Button } from '../../Button'
import { PasswordField } from '../../PasswordField'
import {
  resetPasswordSchema,
  type ResetPasswordFormData,
} from '@/schemas/modalSchemas'

interface ResetPasswordModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: (data: ResetPasswordFormData) => void
}

export function ResetPasswordModal({
  isOpen,
  onClose,
  onSuccess,
}: ResetPasswordModalProps) {
  const [showToast, setShowToast] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const navigate = useNavigate()

  const methods = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    mode: 'onChange', // 입력할 때마다 실시간 validation
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
  })

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  // 모달이 닫힐 때 토스트도 함께 닫기
  useEffect(() => {
    if (!isOpen) {
      setShowToast(false)
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }, [isOpen])

  const onSubmit = async (data: ResetPasswordFormData) => {
    // 비밀번호 재설정 로직
    console.log('비밀번호 일치 확인 완료, 토스트 표시')
    
    // 상태 업데이트를 먼저 하고, 콜백은 useEffect에서 처리
    setShowToast(true)

    // onSuccess 콜백은 다음 렌더링 사이클에서 실행되도록 setTimeout 사용
    setTimeout(() => {
      onSuccess?.(data)
    }, 0)

    // 10초 후 토스트 숨기고 로그인 페이지로 이동
    timerRef.current = setTimeout(() => {
      setShowToast(false)
      onClose()
      navigate('/')
      timerRef.current = null
    }, 10000)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // 모든 필드 validation 확인
    const isValid = await methods.trigger()
    
    if (!isValid) {
      // validation 오류가 있으면 오류 메시지가 자동으로 표시됨
      return
    }

    // 비밀번호 일치 확인 (스키마에서도 체크하지만 명시적으로 한번 더)
    const data = methods.getValues()
    if (data.newPassword !== data.confirmPassword) {
      methods.setError('confirmPassword', {
        message: '비밀번호가 일치하지 않습니다.',
      })
      return
    }

    // 모든 validation을 통과한 경우에만 onSubmit 호출
    await onSubmit(data)
  }

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        useBackdropV2={showToast}
        toastPosition="center"
        toast={
          showToast ? (
            <div 
              className="reset-password-toast bg-white border border-gray-200 text-black px-5 py-4 shadow-lg flex flex-col items-center gap-3 rounded-[12px] overflow-hidden"
              style={{ 
                minWidth: '396px', 
                minHeight: '128px'
              }}
            >
              {/* 초록색 원형 체크마크 아이콘 */}
              <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11.6667 3.5L5.25 9.91667L2.33334 7"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="flex flex-col items-center gap-1">
                <p className="title-l-b text-center" style={{ color: '#121212' }}>
                  비밀번호 변경 완료!
                </p>
                <p className="subTitle-l text-center">
                  잠시 후 로그인 페이지로 이동합니다.
                </p>
              </div>
            </div>
          ) : undefined
        }
      >

      <Modal.Header>
        <div className="flex flex-col items-center gap-2">
          <img 
            src="/icons/FindPW.svg" 
            alt="비밀번호 재설정" 
            style={{ width: '35px', height: '35px' }}
          />
          <h2 className="title-l-b">비밀번호 재설정</h2>
          <p
            className="text-[14px] font-normal text-center"
            style={{ color: '#4D4D4D' }}
          >
            신규 비밀번호를 입력해주세요.
          </p>
        </div>
      </Modal.Header>

      <Modal.Body>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit} className="space-y-4">

            <Modal.InputRow
              label={
                <>
                  <span>
                    새 비밀번호<span className="text-red-500">*</span>
                  </span>
                  <span className="text-[#6201E0] font-semibold text-sm">
                    6~15자의 영문 대소문자, 숫자, 특수문자 포함
                  </span>
                </>
              }
            >
              <div className="flex flex-col gap-2">
                <PasswordField<ResetPasswordFormData>
                  name="newPassword"
                  placeholder="비밀번호를 입력해주세요"
                  helperVisibility="always"
                  width={348}
                />
                {/* 새 비밀번호 에러 메시지 */}
                {methods.formState.errors.newPassword && (
                  <p
                    className="text-[12px] font-normal text-left"
                    style={{ color: '#EC0037' }}
                  >
                    *{methods.formState.errors.newPassword.message}
                  </p>
                )}
              </div>
            </Modal.InputRow>

            <Modal.InputRow
              label={
                <>
                  비밀번호 확인<span className="text-red-500">*</span>
                </>
              }
            >
              <div className="flex flex-col gap-2">
                <PasswordField<ResetPasswordFormData>
                  name="confirmPassword"
                  placeholder="비밀번호를 다시 입력해주세요"
                  helperVisibility="always"
                  width={348}
                />
                {/* 비밀번호 확인 에러 메시지 */}
                {methods.formState.errors.confirmPassword && (
                  <p
                    className="text-[12px] font-normal text-left"
                    style={{ color: '#EC0037' }}
                  >
                    *{methods.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </Modal.InputRow>

            <div className="pt-4">
              <Button
                type="submit"
                variant="primary"
                size="xl"
                className="w-full min-w-[348px]"
              >
                확인
              </Button>
            </div>
          </form>
        </FormProvider>
      </Modal.Body>
    </Modal>
    </>
  )
}
