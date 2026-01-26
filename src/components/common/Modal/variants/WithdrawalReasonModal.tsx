import { useState, useEffect, useRef } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Modal } from '../Modal'
import { Button } from '../../Button'
import Dropdown from '../../Dropdown'
import { CommonInputField } from '../../CommonInputField'
import {
  withdrawalReasonSchema,
  type WithdrawalReasonFormData,
} from '@/schemas/modalSchemas'

interface WithdrawalReasonModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: (data: WithdrawalReasonFormData) => void
}

const withdrawalReasons = [
  { label: '서비스 이용 불편', value: 'inconvenience' },
  { label: '콘텐츠 부족', value: 'lack_of_content' },
  { label: '다른 서비스 이용', value: 'other_service' },
  { label: '개인정보 보호 우려', value: 'privacy' },
  { label: '기타', value: 'other' },
]

export function WithdrawalReasonModal({
  isOpen,
  onClose,
  onSuccess,
}: WithdrawalReasonModalProps) {
  const [showToast, setShowToast] = useState(false)
  const toastTimerRef = useRef<NodeJS.Timeout | null>(null)

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

  const methods = useForm<WithdrawalReasonFormData>({
    resolver: zodResolver(withdrawalReasonSchema),
    defaultValues: {
      reason: '',
      otherReason: '',
      feedback: '',
    },
  })

  const reasonValue = methods.watch('reason')
  const isOtherSelected = reasonValue === 'other'
  const isFormValid = reasonValue && (!isOtherSelected || methods.watch('otherReason'))
  const isDropdownSelected = !!reasonValue

  const onSubmit = (data: WithdrawalReasonFormData) => {
    onSuccess?.(data)
    setShowToast(true)
    
    // 기존 타이머가 있으면 정리
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current)
    }
    toastTimerRef.current = setTimeout(() => {
      setShowToast(false)
      onClose()
      toastTimerRef.current = null
    }, 5000) // 5초 후 토스트 사라지고 모달 닫기
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-[646px] min-h-[537px]"
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
        <div className="flex flex-col items-center gap-2 w-full">
          <div className="flex flex-col items-start gap-2 w-full">
            <h2 className="title-l">오즈코딩스쿨을 탈퇴하시는 이유는 무엇인가요?</h2>
          </div>
        </div>
      </Modal.Header>

      <Modal.Body>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
            <p 
              className="mb-10"
              style={{
                fontSize: '16px',
                fontWeight: 'normal',
                color: '#BDBDBD'
              }}
            >
              계정을 삭제하시면 회원님의 모든 콘텐츠와 활동 기록, 수강 기간 / 포인트 / 쿠폰 내역이 사라지며 환불되지 않습니다. 삭제된 정보는 복구할 수 없습니다.
            </p>
              <Dropdown
                options={withdrawalReasons}
                value={reasonValue}
                onChange={(value) => {
                  methods.setValue('reason', value)
                  if (value !== 'other') {
                    methods.setValue('otherReason', '')
                  }
                }}
                placeholder="탈퇴 사유를 선택해주세요"
              />
              {methods.formState.errors.reason && (
                <p className="text-sm text-red-500 mt-1">
                  {methods.formState.errors.reason.message}
                </p>
              )}

            {isOtherSelected && (
              <Modal.InputRow label="기타 의견">
                <CommonInputField<WithdrawalReasonFormData>
                  name="otherReason"
                  placeholder="의견을 입력해주세요"
                  helperVisibility="always"
                  disabled={!isDropdownSelected}
                />
              </Modal.InputRow>
            )}

            {isDropdownSelected && (
              <>
                <p 
                  className="mt-6 mb-4"
                  style={{
                    fontSize: '16px',
                    fontWeight: '400',
                    color: '#121212',
                  }}
                >
                  서비스를 이용하시면서 불편했 점이나 보완할 수 있는 방안을 알려주시면, 서비스 개선에 적극적으로 반영하겠습니다. 감사합니다!
                </p>
                <div className="mb-4">
                  <textarea
                    {...methods.register('feedback')}
                    placeholder="소중한 의견을 반영해 더 좋은 서비스를 위해 노력하겠습니다."
                    className="px-4 py-3 rounded-lg resize-none focus:outline-none focus:ring-1 focus:ring-violet-600 focus:border-violet-600"
                    style={{
                      minWidth: '598px',
                      minHeight: '134px',
                      fontSize: '16px',
                      fontWeight: '400',
                      color: '#121212',
                      backgroundColor: '#FAFAFA',
                      borderColor: '#BDBDBD',
                      borderWidth: '1px',
                      borderStyle: 'solid',
                    }}
                  />
                </div>
                <div className="pt-4">
                  <Button
                    type="submit"
                    variant="primary"
                    size="xl"
                    className="w-full"
                    disabled={!isFormValid}
                  >
                    회원 탈퇴하기
                  </Button>
                </div>
              </>
            )}
          </form>
        </FormProvider>
      </Modal.Body>
    </Modal>
  )
}
