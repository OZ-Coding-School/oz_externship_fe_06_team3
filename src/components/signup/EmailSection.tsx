import { type ReactNode } from 'react'
import { Check } from 'lucide-react'

import { ActionRow } from '@/components/signup/ActionRow'
import { Button } from '@/components/common/Button'
import { CommonInputField } from '@/components/common/CommonInputField'
import type { FieldState } from '@/components/common/CommonInput'
import type { SignupFormData } from '@/schemas/auth'
import { type FlowMessage } from '@/utils/formMessage'
import cn from '@/lib/cn'

function getButtonProps(canAct: boolean) {
  return {
    variant: canAct ? 'secondary' : 'disabled',
    disabled: !canAct,
  } as const
}

function getCodeRightSlot(params: {
  verified: boolean
  timerVisible: boolean
  mmss: string
}): ReactNode {
  const { verified, timerVisible, mmss } = params
  if (verified) return <Check className="h-5 w-5 text-green-600" />
  if (timerVisible)
    return <span className="text-sm font-semibold text-red-500">{mmss}</span>
  return null
}

export type EmailSectionProps = {
  emailFieldState: FieldState
  emailVerificationCodeFieldState: FieldState

  flowMessage: FlowMessage

  emailVerified: boolean
  emailCodeSent: boolean

  emailTimer: { mmss: string; isRunning: boolean }

  emailSendLabel: string
  canSendEmail: boolean
  canVerifyEmail: boolean

  onSendEmailCode: () => void
  onVerifyEmailCode: () => void
}

export function EmailSection({
  emailFieldState,
  emailVerificationCodeFieldState,
  flowMessage,
  emailVerified,
  emailCodeSent,
  emailTimer,
  emailSendLabel,
  canSendEmail,
  canVerifyEmail,
  onSendEmailCode,
  onVerifyEmailCode,
}: EmailSectionProps) {
  const isCodePhase = emailCodeSent && !emailVerified
  const emailBtn = getButtonProps(canSendEmail)
  const codeBtn = getButtonProps(canVerifyEmail)

  const showSendMessage =
    flowMessage.scope === 'send' &&
    flowMessage.type !== 'idle' &&
    flowMessage.message
  const showVerifyMessage =
    (flowMessage.scope === 'verify' || flowMessage.scope === 'expired') &&
    flowMessage.type !== 'idle' &&
    flowMessage.message

  const firstRowBelow = showSendMessage ? (
    <p
      className={cn(
        'text-xs font-medium',
        flowMessage.type === 'success' && 'text-green-600',
        flowMessage.type === 'error' && 'text-red-500'
      )}
    >
      {flowMessage.message}
    </p>
  ) : null

  const secondRowBelow = showVerifyMessage ? (
    <p
      className={cn(
        'text-xs font-medium',
        flowMessage.type === 'success' && 'text-green-600',
        flowMessage.type === 'error' && 'text-red-500'
      )}
    >
      {flowMessage.message}
    </p>
  ) : null

  return (
    <div className="flex flex-col gap-5">
      <label className="inline-flex items-start text-left text-[16px] leading-[22.24px] font-normal tracking-[-0.48px] text-[#121212]">
        이메일
        <span className="ml-0 text-[16px] leading-normal font-normal tracking-[-0.32px] text-[#EC0037]">
          *
        </span>
      </label>

      <ActionRow
        left={
          <CommonInputField<SignupFormData>
            name="email"
            type="email"
            placeholder="example@gmail.com"
            width="100%"
            placeholderVariant="a"
            state={emailFieldState}
            helperVisibility="always"
            locked={emailVerified}
            disabled={emailVerified}
            rightSlot={
              emailVerified ? (
                <Check className="h-5 w-5 text-green-600" />
              ) : undefined
            }
          />
        }
        right={
          <Button
            type="button"
            size="sm"
            variant={emailBtn.variant}
            disabled={emailBtn.disabled}
            className="whitespace-nowrap"
            onClick={onSendEmailCode}
          >
            {emailSendLabel}
          </Button>
        }
        below={firstRowBelow}
      />

      <ActionRow
        left={
          <CommonInputField<SignupFormData>
            name="emailVerificationCode"
            type="text"
            placeholder="인증번호를 입력해주세요"
            width="100%"
            placeholderVariant="a"
            state={emailVerificationCodeFieldState}
            helperVisibility="always"
            locked={!isCodePhase}
            disabled={!isCodePhase}
            rightSlot={getCodeRightSlot({
              verified: emailVerified,
              timerVisible: isCodePhase,
              mmss: emailTimer.mmss,
            })}
          />
        }
        right={
          <Button
            type="button"
            size="sm"
            variant={codeBtn.variant}
            disabled={codeBtn.disabled}
            className="whitespace-nowrap"
            onClick={onVerifyEmailCode}
          >
            인증번호 확인
          </Button>
        }
        below={secondRowBelow}
      />
    </div>
  )
}
