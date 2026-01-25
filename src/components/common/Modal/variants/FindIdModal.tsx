import { useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Modal } from '../Modal'
import { Button } from '../../Button'
import { CommonInputField } from '../../CommonInputField'
import { findIdSchema, type FindIdFormData } from '@/schemas/modalSchemas'
import { useModalTimer } from '@/hooks/useModalTimer'
import cn from '@/lib/cn'

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
  const { isExpired, isActive, startTimer, formatTime } = useModalTimer(5)

  const methods = useForm<FindIdFormData>({
    resolver: zodResolver(findIdSchema),
    defaultValues: {
      name: '',
      phone: '',
      verificationCode: '',
    },
  })

  const handleSendCode = () => {
    const name = methods.getValues('name')
    const phone = methods.getValues('phone')

    if (!name || !phone) {
      setErrorMessage('이름과 휴대전화번호를 모두 입력해주세요.')
      return
    }

    // 인증번호 생성 (개발 환경용 Mock)
    const mockCode = '123456' // 실제로는 API에서 받아옴

    // 개발 환경에서 콘솔에 인증번호 출력
    console.log('📱 인증번호 전송:', {
      이름: name,
      휴대전화: phone,
      인증번호: mockCode,
      메시지: '개발 환경: 인증번호를 콘솔에서 확인하세요.',
    })

    // 인증번호 전송 로직 (실제 API 호출)
    // await api.post('/api/auth/send-verification', { name, phone })
    startTimer()
    setErrorMessage('')
  }

  const handleVerifyCode = () => {
    if (isExpired) {
      setErrorMessage('인증 시간이 만료되었습니다. 다시 전송해주세요.')
      setVerificationMessage('')
      return
    }

    const verificationCode = methods.getValues('verificationCode')
    if (!verificationCode) {
      setErrorMessage('인증번호를 입력해주세요.')
      setVerificationMessage('')
      return
    }

    // 인증번호 확인 로직 (실제 API 호출)
    // 여기서는 성공으로 가정
    setIsVerified(true)
    setVerificationMessage('인증번호가 확인되었습니다.')
    setErrorMessage('')
  }

  const handleFindId = async () => {
    if (!isVerified) {
      setErrorMessage('인증번호를 먼저 확인해주세요.')
      return
    }

    // 인증번호 확인 메시지 제거
    setVerificationMessage('')

    const name = methods.getValues('name')
    const phone = methods.getValues('phone')

    try {
      // TODO: 실제 API 호출로 변경
      // const response = await api.post('/api/auth/find-id', { name, phone })
      // const { email } = response.data

      // Mock API 응답 시뮬레이션
      const mockApiCall = async () => {
        // 에러 메시지 테스트를 위해 특정 조건에서 실패하도록 설정
        // 예: 이름이 "error"이거나 휴대폰 번호가 "000"으로 시작하면 에러 표시
        const shouldShowError = name === 'error' || phone.startsWith('000')
        
        if (shouldShowError) {
          // API 응답: 입력된 정보가 없는 경우
          throw new Error('NOT_FOUND')
        }
        
        // 정상 응답
        return { email: 'test@example.com' }
      }

      const result = await mockApiCall()
      
      // 유효한 경우: 결과 모달로 이동
      if (result?.email) {
        onFindIdSuccess?.(result.email)
        onClose()
      }
    } catch (error) {
      // API 에러 처리
      if (error instanceof Error && error.message === 'NOT_FOUND') {
        // 입력된 정보가 없는 경우
        setErrorMessage(
          '입력한 이름과 휴대폰 번호로 등록된\n이메일이 존재하지 않습니다.'
        )
      } else {
        // 기타 에러
        setErrorMessage('아이디 찾기 중 오류가 발생했습니다. 다시 시도해주세요.')
      }
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
          {/* 에러 메시지 - 아이디 찾기 제목 아래에 표시 */}
          {errorMessage && (
            <p className="text-[14px] text-red-500 mt-2 font-normal text-center whitespace-pre-line">
              {errorMessage}
            </p>
          )}
        </div>
      </Modal.Header>

      <Modal.Body>
        <FormProvider {...methods}>
          <form className="space-y-4">
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
                {/* 첫 번째 줄: 휴대전화번호 입력창 + 인증번호전송 버튼 */}
                <div className="flex gap-2">
                  <CommonInputField<FindIdFormData>
                    name="phone"
                    placeholder="숫자만 입력해 주세요"
                    helperVisibility="always"
                    width={240}
                  />
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
                    인증번호전송
                  </button>
                </div>

                {/* 두 번째 줄: 인증번호 입력창 + 인증번호확인 버튼 */}
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
                    인증번호확인
                  </button>
                </div>

                {/* 인증번호 확인 메시지 */}
                {verificationMessage && (
                  <p className="text-sm text-green-600 font-medium mt-2">
                    {verificationMessage}
                  </p>
                )}
              </div>
            </Modal.InputRow>

            <div className="pt-4">
              <Button
                type="button"
                variant="primary"
                size="xl"
                className="w-full max-w-[348px]"
                onClick={handleFindId}
                disabled={!isVerified}
              >
                아이디 찾기
              </Button>
            </div>
          </form>
        </FormProvider>
      </Modal.Body>
    </Modal>
  )
}
