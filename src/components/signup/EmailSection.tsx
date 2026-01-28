import { Check } from 'lucide-react'

import { Button } from '@/components/common/Button'
import { CommonInputField } from '@/components/common/CommonInputField'
import type { FieldState } from '@/components/common/CommonInput'
import type { SignupFormData } from '@/schemas/auth'

type EmailSectionProps = {
  emailFieldState: FieldState
  emailCodeFieldState: FieldState
  emailSendMsg: string | null
  emailVerifyMsg: string | null
  emailVerified: boolean
  emailCodeSent: boolean
  emailTimer: {
    mmss: string
    isRunning: boolean
  }
  emailSendLabel: string
  canSendEmail: boolean
  canVerifyEmail: boolean
  onSendEmailCode: () => void
  onVerifyEmailCode: () => void
}

export function EmailSection({
  emailFieldState,
  emailCodeFieldState,
  emailSendMsg,
  emailVerifyMsg,
  emailVerified,
  emailCodeSent,
  emailTimer,
  emailSendLabel,
  canSendEmail,
  canVerifyEmail,
  onSendEmailCode,
  onVerifyEmailCode,
}: EmailSectionProps) {
  const EmailCodeRightSlot = (
    <div className="flex items-center gap-2">
      {emailVerified ? (
        <Check className="h-5 w-5 text-green-600" />
      ) : emailCodeSent && emailTimer.isRunning ? (
        <span className="text-sm font-semibold text-red-500">
          {emailTimer.mmss}
        </span>
      ) : null}
    </div>
  )

  return (
    <div className="flex flex-col gap-5">
      <div className="inline-flex items-center gap-4">
        <label className="inline-flex items-start text-left text-[16px] leading-[22.24px] font-normal tracking-[-0.48px] text-[#121212]">
          이메일
          <span className="ml-0 text-[16px] leading-normal font-normal tracking-[-0.32px] text-[#EC0037]">
            *
          </span>
        </label>
        <p className="text-primary text-left text-[14px] leading-[19.6px] font-semibold tracking-[-0.42px]">
          로그인 시 아이디로 사용합니다.
        </p>
      </div>

      {/* 이메일 입력, 전송 버튼 */}
      <div className="flex min-w-0 gap-3 overflow-hidden">
        <div className="min-w-0 flex-1 overflow-hidden">
          <CommonInputField<SignupFormData>
            name="email"
            type="email"
            placeholder="example@gmail.com"
            width="100%"
            placeholderVariant="a"
            state={emailFieldState}
            helperVisibility="always"
            helperTextByState={{
              success: emailSendMsg,
              error: emailSendMsg,
            }}
            locked={emailVerified}
          />
        </div>

        <Button
          type="button"
          size="sm"
          variant={!canSendEmail ? 'disabled' : 'secondary'}
          className="whitespace-nowrap"
          onClick={onSendEmailCode}
        >
          {emailSendLabel}
        </Button>
      </div>

      {/* 이메일 인증 코드 + 확인 버튼 */}
      <div className="flex min-w-0 gap-3 overflow-hidden">
        <div className="min-w-0 flex-1 overflow-hidden">
          <CommonInputField<SignupFormData>
            name="emailVerificationCode"
            type="text"
            placeholder="전송된 코드를 입력해주세요."
            width="100%"
            placeholderVariant="a"
            state={emailCodeFieldState}
            helperVisibility="always"
            helperTextByState={{
              success: emailVerifyMsg,
              error: emailVerifyMsg,
            }}
            rightSlot={EmailCodeRightSlot}
            locked={emailVerified}
          />
        </div>

        <Button
          type="button"
          size="sm"
          variant={!canVerifyEmail ? 'disabled' : 'secondary'}
          className="whitespace-nowrap"
          onClick={onVerifyEmailCode}
        >
          {emailVerified ? '인증완료' : '인증번호 확인'}
        </Button>
      </div>
    </div>
  )
}
