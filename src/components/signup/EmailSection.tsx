import { Check } from 'lucide-react'

import { Button } from '@/components/common/Button'
import { CommonInputField } from '@/components/common/CommonInputField'
import type { FieldState } from '@/components/common/CommonInput'
import type { SignupFormData } from '@/schemas/auth'

type Props = {
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
}: Props) {
  // 인증코드 전송 전에는 인증코드 입력칸 비활성화
  const isCodeInputEnabled = emailCodeSent && !emailVerified

  const emailCodeRightSlot =
    emailVerified ? (
      <Check className="h-5 w-5 text-green-600" />
    ) : emailCodeSent && emailTimer.isRunning ? (
      <span className="text-sm font-semibold text-red-500">
        {emailTimer.mmss}
      </span>
    ) : null

  return (
    <div className="flex flex-col gap-5">
      <label className="inline-flex items-start text-left text-[16px] leading-[22.24px] font-normal tracking-[-0.48px] text-[#121212]">
        이메일
        <span className="ml-0 text-[16px] leading-normal font-normal tracking-[-0.32px] text-[#EC0037]">
          *
        </span>
      </label>

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
            disabled={emailVerified}
            rightSlot={
              emailVerified ? (
                <Check className="h-5 w-5 text-green-600" />
              ) : null
            }
          />
        </div>

        <Button
          type="button"
          size="sm"
          variant={canSendEmail ? 'secondary' : 'disabled'}
          disabled={!canSendEmail}
          className="whitespace-nowrap"
          onClick={onSendEmailCode}
        >
          {emailSendLabel}
        </Button>
      </div>

      {/* 인증번호 입력 + 버튼 */}
      <div className="flex min-w-0 gap-3 overflow-hidden">
        <div className="min-w-0 flex-1 overflow-hidden">
          <CommonInputField<SignupFormData>
            name="emailVerificationCode"
            type="text"
            placeholder="인증번호를 입력해주세요"
            width="100%"
            placeholderVariant="a"
            state={emailCodeFieldState}
            helperVisibility="always"
            helperTextByState={{
              success: emailVerifyMsg,
              error: emailVerifyMsg,
            }}
            locked={!isCodeInputEnabled}
            disabled={!isCodeInputEnabled}
            rightSlot={emailCodeRightSlot}
          />
        </div>

        <Button
          type="button"
          size="sm"
          variant={canVerifyEmail ? 'secondary' : 'disabled'}
          disabled={!canVerifyEmail}
          className="whitespace-nowrap"
          onClick={onVerifyEmailCode}
        >
          확인
        </Button>
      </div>
    </div>
  )
}
