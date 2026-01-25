import { useState, useEffect, useRef } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Modal } from '../Modal'
import { Button } from '../../Button'
import { CommonInputField } from '../../CommonInputField'
import { findPasswordSchema, type FindPasswordFormData } from '@/schemas/modalSchemas'
import { useModalTimer } from '@/hooks/useModalTimer'
import cn from '@/lib/cn'

interface FindPasswordModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: (data: FindPasswordFormData) => void
}

export function FindPasswordModal({
  isOpen,
  onClose,
  onSuccess,
}: FindPasswordModalProps) {
  const [isVerified, setIsVerified] = useState(false)
  const [verificationMessage, setVerificationMessage] = useState<string>('')
  const [showToast, setShowToast] = useState(false)
  const [isCodeSent, setIsCodeSent] = useState(false)
  const [verificationError, setVerificationError] = useState<string>('')
  const [sentCode, setSentCode] = useState<string>('') // 전송된 인증코드 저장
  const toastTimerRef = useRef<NodeJS.Timeout | null>(null)
  const { isExpired, isActive, startTimer, formatTime } = useModalTimer(5)

  // 모달이 닫힐 때 타이머 정리
  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (!isOpen && toastTimerRef.current) {
      clearTimeout(toastTimerRef.current)
      toastTimerRef.current = null
    }
  }, [isOpen])

  const methods = useForm<FindPasswordFormData>({
    resolver: zodResolver(findPasswordSchema),
    defaultValues: {
      email: '',
      verificationCode: '',
    },
  })

  const handleSendCode = () => {
    const email = methods.getValues('email')

    if (!email) {
      methods.setError('email', { message: '이메일을 입력해주세요.' })
      return
    }

    // 인증번호 생성 (개발 환경용 Mock)
    const mockCode = '123456' // 실제로는 API에서 받아옴
    setSentCode(mockCode) // 전송된 인증코드 저장

    // 개발 환경에서 콘솔에 인증번호 출력
    console.log('📱 인증번호 전송:', {
      이메일: email,
      인증번호: mockCode,
      메시지: '개발 환경: 인증번호를 콘솔에서 확인하세요.',
    })

    // 인증번호 전송 로직
    startTimer()
    setShowToast(true)
    setIsCodeSent(true)
    setVerificationError('') // 에러 메시지 초기화
    setIsVerified(false) // 인증 상태 초기화
    setVerificationMessage('') // 인증 메시지 초기화
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current)
    }
    toastTimerRef.current = setTimeout(() => setShowToast(false), 5000) // 5초 후 사라짐
  }

  const handleVerifyCode = async () => {
    if (isExpired) {
      methods.setError('verificationCode', {
        message: '인증 시간이 만료되었습니다. 다시 전송해주세요.',
      })
      setVerificationMessage('')
      setVerificationError('')
      return
    }

    const verificationCode = methods.getValues('verificationCode')
    if (!verificationCode) {
      methods.setError('verificationCode', { message: '인증번호를 입력해주세요.' })
      setVerificationMessage('')
      setVerificationError('')
      return
    }

    // 인증번호 확인 로직 (목데이터 - 실제로는 API 호출)
    // TODO: API 연동 시 아래 코드를 실제 API 호출로 변경
    const isValid = verificationCode === sentCode

    if (!isValid) {
      // 인증코드가 일치하지 않는 경우
      setVerificationError('*인증코드가 일치하지 않습니다.')
      setVerificationMessage('')
      setIsVerified(false)
      methods.setError('verificationCode', {
        message: '인증코드가 일치하지 않습니다.',
      })
      return
    }

    // 인증코드가 일치하는 경우
    setIsVerified(true)
    setVerificationMessage('인증번호가 확인되었습니다.')
    setVerificationError('')
    methods.clearErrors('verificationCode')
  }

  const handleFindPassword = async () => {
    if (!isVerified) {
      methods.setError('verificationCode', {
        message: '인증번호를 먼저 확인해주세요.',
      })
      return
    }

    // 인증번호 확인 메시지 제거
    setVerificationMessage('')

    const data = methods.getValues()
    onSuccess?.(data)
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      toastPosition="top-far"
      toast={
        showToast ? (
          <div className="bg-white border border-gray-200 text-black px-5 py-4 gap-3 rounded-lg shadow-lg flex-center min-w-[270px] min-h-[60px]">
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
            <p className="text-[14px] font-normal" style={{ color: '#4D4D4D' }}>
              전송 완료! 이메일을 확인해주세요.
            </p>
          </div>
        ) : undefined
      }
    >
      <Modal.Header>
        <div className="flex flex-col items-center gap-2">
          <img 
            src="/icons/FindPW.svg" 
            alt="비밀번호 찾기" 
            style={{ width: '35px', height: '35px' }}
          />
          <h2 className="title-l-b">비밀번호 찾기</h2>
          {!isCodeSent && (
            <p className="text-[14px] text-[#4D4D4D] font-normal text-center">
              이메일로 비밀번호 재설정링크를 보내드려요.
            </p>
          )}
        </div>
      </Modal.Header>

      <Modal.Body>
        <FormProvider {...methods}>
          <form className="space-y-4">
            <Modal.InputRow label="이메일" required>
              <div className="flex flex-col gap-2">
                {/* 첫 번째 줄: 이메일 입력창 + 인증코드전송 버튼 */}
                <div className="flex gap-2">
                  <div className="find-password-input" style={{ minWidth: '250px' }}>
                    <CommonInputField<FindPasswordFormData>
                      name="email"
                      placeholder="이메일을 입력해주세요"
                      helperVisibility="always"
                      width={250}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleSendCode}
                    disabled={isActive && !isExpired}
                    className={cn(
                      'w-[112px] h-[48px] rounded-[4px] border text-black text-base',
                      'hover:bg-gray-200 transition-colors',
                      'disabled:opacity-50 disabled:cursor-not-allowed'
                    )}
                    style={{
                      backgroundColor: '#ececec',
                      borderColor: '#bdbdbd',
                      borderWidth: '1px',
                    }}
                  >
                    인증코드전송
                  </button>
                </div>

                {/* 두 번째 줄: 인증번호 입력창 + 인증코드확인 버튼 */}
                <div className="flex gap-2">
                  <div className="find-password-input" style={{ minWidth: '250px' }}>
                    <CommonInputField<FindPasswordFormData>
                      name="verificationCode"
                      placeholder="인증번호 6자리를 입력해주세요"
                      helperVisibility="always"
                      width={250}
                      rightSlot={
                        isActive && !isExpired ? (
                          <span className="text-red-500 text-sm font-medium">
                            {formatTime}
                          </span>
                        ) : undefined
                      }
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleVerifyCode}
                    disabled={isExpired || isVerified}
                    className={cn(
                      'w-[112px] h-[48px] rounded-[4px] border text-black text-base',
                      'hover:bg-gray-200 transition-colors',
                      'disabled:opacity-50 disabled:cursor-not-allowed'
                    )}
                    style={{
                      backgroundColor: '#ececec',
                      borderColor: '#bdbdbd',
                      borderWidth: '1px',
                    }}
                  >
                    인증코드확인
                  </button>
                </div>

                {/* 인증번호 확인 메시지 */}
                {verificationMessage && (
                  <p className="text-sm text-green-600 font-medium mt-2">
                    {verificationMessage}
                  </p>
                )}

                {/* 인증코드 에러 메시지 */}
                {verificationError && (
                  <p
                    className="text-[12px] font-normal mt-2 text-left"
                    style={{ color: '#EC0037' }}
                  >
                    {verificationError}
                  </p>
                )}
              </div>
            </Modal.InputRow>

            <div className="pt-4">
              <Button
                type="button"
                variant="primary"
                size="xl"
                className="w-full max-w-[370px]"
                onClick={handleFindPassword}
                disabled={!isVerified}
              >
                비밀번호 찾기
              </Button>
            </div>
          </form>
        </FormProvider>
      </Modal.Body>
    </Modal>
  )
}
