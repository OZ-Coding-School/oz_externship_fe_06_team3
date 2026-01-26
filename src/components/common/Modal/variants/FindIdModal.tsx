import { useState, useEffect } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Modal } from '../Modal'
import { Button } from '../../Button'
import { CommonInputField } from '../../CommonInputField'
import { VerificationButton } from '../../VerificationButton'
import { findIdSchema, type FindIdFormData } from '@/schemas/modalSchemas'
import { useModalTimer } from '@/hooks/useModalTimer'

interface FindIdModalProps {
  isOpen: boolean
  onClose: () => void
  onFindIdSuccess?: (email: string) => void
}

export function FindIdModal({
  isOpen,
  onClose,
  onFindIdSuccess,
}: FindIdModalProps) {
  const [isVerified, setIsVerified] = useState(false)
  const [verificationMessage, setVerificationMessage] = useState<string>('')
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [isSendingCode, setIsSendingCode] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { isExpired, isActive, startTimer, formatTime } = useModalTimer(5)

  const methods = useForm<FindIdFormData>({
    resolver: zodResolver(findIdSchema),
    defaultValues: {
      name: '',
      phone: '',
      verificationCode: '',
    },
  })

  useEffect(() => {
    if (!isOpen) {
      setIsVerified(false)
      setVerificationMessage('')
      setErrorMessage('')
      methods.reset()
    }
  }, [isOpen, methods])

  const handleSendCode = async () => {
    setIsSendingCode(true)
    setErrorMessage('')
    
    try {
      const isValid = await methods.trigger(['name', 'phone'])
      if (!isValid) {
        setErrorMessage('이름과 휴대전화번호를 모두 입력해주세요.')
        return
      }

      const { name, phone } = methods.getValues()

  
      // 인증번호 생성 (개발 환경용 Mock)
      const mockCode = '123456'
      
      // 개발 환경에서 콘솔에 인증번호 출력
      console.log('📱 인증번호 전송:', { 이름: name, 휴대전화: phone, 인증번호: mockCode })

      // 인증번호 전송 로직
      startTimer()
    } catch (error) {
      setErrorMessage('인증번호 전송 중 오류가 발생했습니다.')
    } finally {
      setIsSendingCode(false)
    }
  }

  const handleVerifyCode = async () => {
    setIsVerifying(true)
    setVerificationMessage('')
    setErrorMessage('')

    try {
      if (isExpired) {
        methods.setError('verificationCode', {
          message: '인증 시간이 만료되었습니다. 다시 전송해주세요.',
        })
        return
      }

      const isValid = await methods.trigger('verificationCode')
      if (!isValid) return

     
      // 인증번호 확인 로직 , 여기서는 성공으로 가정, 실제로는 API 호출
      setIsVerified(true)
      setVerificationMessage('인증번호가 확인되었습니다.')
      methods.clearErrors('verificationCode')
    } catch (error) {
      methods.setError('verificationCode', {
        message: '인증번호 확인 중 오류가 발생했습니다.',
      })
    } finally {
      setIsVerifying(false)
    }
  }

  const onSubmit = async (data: FindIdFormData) => {
    if (!isVerified) {
      methods.setError('verificationCode', {
        message: '인증번호를 먼저 확인해주세요.',
      })
      setErrorMessage('인증번호를 먼저 확인해주세요.')
      return
    }

    setIsSubmitting(true)
    setVerificationMessage('')
    setErrorMessage('')

    try {

      // 아이디 찾기 로직 , 여기서는 성공으로 가정, 실제로는 API 호출
      // 실패 시 NOT_FOUND 에러 반환, 목데이터는 test@example.com 반환
      const mockApiCall = async () => {
        const shouldShowError = data.name === 'error' || data.phone.startsWith('000')
        if (shouldShowError) {
          throw new Error('NOT_FOUND')
        }
        return { email: 'test@example.com' } // 아이디 찾기 성공 시 이메일 반환
      }

      const result = await mockApiCall()
      
      if (result?.email) {
        onFindIdSuccess?.(result.email)
        onClose()
      }
    } catch (error) {
      if (error instanceof Error && error.message === 'NOT_FOUND') {
        setErrorMessage('입력한 이름과 휴대폰 번호로 등록된\n이메일이 존재하지 않습니다.')
      } else {
        setErrorMessage('아이디 찾기 중 오류가 발생했습니다. 다시 시도해주세요.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Header>
        <div className="flex flex-col items-center gap-2">
          <img 
            src="/icons/FindId.svg" 
            alt="아이디 찾기" 
            style={{ width: '35px', height: '35px' }}
          />
          <h2 className="title-l-b">아이디 찾기</h2>
          {errorMessage && (
            <p className="text-[14px] text-red-500 mt-2 font-normal text-center whitespace-pre-line">
              {errorMessage}
            </p>
          )}
        </div>
      </Modal.Header>

      <Modal.Body>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
            <Modal.InputRow label="이름" required>
              <CommonInputField<FindIdFormData>
                name="name"
                placeholder="이름을 입력해주세요"
                helperVisibility="always"
                width={360}
              />
            </Modal.InputRow>

            <Modal.InputRow label="휴대전화" required>
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <CommonInputField<FindIdFormData>
                    name="phone"
                    placeholder="숫자만 입력해 주세요"
                    helperVisibility="always"
                    width={240}
                  />
                  <VerificationButton
                    onClick={handleSendCode}
                    disabled={isActive && !isExpired}
                    isLoading={isSendingCode}
                  >
                    인증번호전송
                  </VerificationButton>
                </div>

                <div className="flex gap-2">
                  <CommonInputField<FindIdFormData>
                    name="verificationCode"
                    placeholder="인증번호 6자리를 입력해주세요"
                    helperVisibility="always"
                    width={240}
                    rightSlot={
                      isActive && !isExpired ? (
                        <span className="text-red-500 text-sm font-medium whitespace-nowrap">
                          {formatTime}
                        </span>
                      ) : undefined
                    }
                  />
                  <VerificationButton
                    onClick={handleVerifyCode}
                    disabled={isExpired || isVerified}
                    isLoading={isVerifying}
                  >
                    인증번호확인
                  </VerificationButton>
                </div>

                {verificationMessage && (
                  <p className="text-sm text-green-600 font-medium mt-2">
                    {verificationMessage}
                  </p>
                )}
              </div>
            </Modal.InputRow>

            <div className="pt-4">
              <Button
                type="submit"
                variant="primary"
                size="xl"
                className="w-full max-w-[348px]"
                disabled={!isVerified || isSubmitting}
              >
                {isSubmitting ? '처리 중...' : '아이디 찾기'}
              </Button>
            </div>
          </form>
        </FormProvider>
      </Modal.Body>
    </Modal>
  )
}
