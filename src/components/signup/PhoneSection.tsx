import { Check } from 'lucide-react'

import cn from '@/lib/cn'
import { Button } from '@/components/common/Button'
import { CommonInputField } from '@/components/common/CommonInputField'
import type { FieldState } from '@/components/common/CommonInput'
import type { SignupFormData } from '@/schemas/auth'

type TimerLike = {
  isRunning: boolean
  mmss: string
}

type Props = {
  phone1: string
  phoneDigitsState: FieldState
  smsCodeFieldState: FieldState

  phoneSendMsg: string | null
  phoneSendStatus: 'idle' | 'error' | 'success'
  smsVerifyMsg: string | null

  smsVerified: boolean
  smsCodeSent: boolean

  smsTimer: TimerLike
  smsSendLabel: string

  canSendSms: boolean
  canVerifySms: boolean

  formError: string | null

  onSendSmsCode: () => void
  onVerifySmsCode: () => void
}

export function PhoneSection({
  phone1,
  phoneDigitsState,
  smsCodeFieldState,
  phoneSendMsg,
  phoneSendStatus,
  smsVerifyMsg,
  smsVerified,
  smsCodeSent,
  smsTimer,
  smsSendLabel,
  canSendSms,
  canVerifySms,
  formError,
  onSendSmsCode,
  onVerifySmsCode,
}: Props) {
  const canTypeSmsCode = smsCodeSent && !smsVerified

  const SmsCodeRightSlot = (
    <div className="flex items-center gap-2">
      {smsVerified ? (
        <Check className="h-5 w-5 text-green-600" />
      ) : smsCodeSent && smsTimer.isRunning ? (
        <span className="text-sm font-semibold text-red-500">
          {smsTimer.mmss}
        </span>
      ) : null}
    </div>
  )

  return (
    <div className="flex min-w-0 flex-col gap-5">
      <label className="inline-flex items-start text-left text-[16px] leading-[22.24px] font-normal tracking-[-0.48px] text-[#121212]">
        휴대전화
        <span className="ml-0 text-[16px] leading-normal font-normal tracking-[-0.32px] text-[#EC0037]">
          *
        </span>
      </label>

      <div className="flex min-w-0 items-start gap-3 overflow-hidden">
        <div className="min-w-0 flex-1 overflow-hidden">
          <div className="grid w-full min-w-0 grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-1 overflow-hidden">
            <div className="min-w-0">
              <CommonInputField<SignupFormData>
                name="phone1"
                type="text"
                placeholder={phone1 || '010'}
                placeholderVariant="a"
                disabled
                width="100%"
              />
            </div>

            <span className="shrink-0 text-[14px] leading-normal tracking-[-0.42px] text-[#9D9D9D]">
              -
            </span>

            <div className="min-w-0">
              <CommonInputField<SignupFormData>
                name="phone2"
                type="text"
                placeholder="0000"
                placeholderVariant="a"
                locked={smsVerified}
                state={phoneDigitsState}
                width="100%"
              />
            </div>

            <span className="shrink-0 text-[14px] leading-normal tracking-[-0.42px] text-[#9D9D9D]">
              -
            </span>

            <div className="min-w-0">
              <CommonInputField<SignupFormData>
                name="phone3"
                type="text"
                placeholder="0000"
                placeholderVariant="a"
                locked={smsVerified}
                state={phoneDigitsState}
                width="100%"
              />
            </div>
          </div>

          {phoneSendMsg && (
            <p
              className={cn(
                'mt-2 px-1 text-xs font-medium',
                phoneSendStatus === 'success'
                  ? 'text-green-600'
                  : phoneSendStatus === 'error'
                    ? 'text-red-500'
                    : 'text-gray-400'
              )}
            >
              {phoneSendMsg}
            </p>
          )}
        </div>

        <Button
          type="button"
          size="sm"
          variant={!canSendSms ? 'disabled' : 'secondary'}
          className="whitespace-nowrap"
          onClick={onSendSmsCode}
        >
          {smsSendLabel}
        </Button>
      </div>

      {/* 인증번호 입력, 확인 버튼 */}
      <div className="flex min-w-0 gap-3 overflow-hidden">
        <div className="min-w-0 flex-1 overflow-hidden">
          <CommonInputField<SignupFormData>
            name="phoneVerificationCode"
            type="text"
            placeholder="인증번호 6자리를 입력해주세요"
            width="100%"
            placeholderVariant="a"
            state={smsCodeFieldState}
            helperVisibility="always"
            helperTextByState={{
              success: smsVerifyMsg,
              error: smsVerifyMsg,
            }}
            rightSlot={SmsCodeRightSlot}
            locked={smsVerified}
            disabled={!canTypeSmsCode}
          />
        </div>

        <Button
          type="button"
          size="sm"
          variant={!canVerifySms ? 'disabled' : 'secondary'}
          className="whitespace-nowrap"
          onClick={onVerifySmsCode}
        >
          {smsVerified ? '인증완료' : '인증번호 확인'}
        </Button>
      </div>

      {formError && (
        <p className="px-1 text-xs font-medium text-red-500">{formError}</p>
      )}
    </div>
  )
}
