import { Check } from 'lucide-react'

import { ActionRow } from '@/components/signup/ActionRow'
import { Button } from '@/components/common/Button'
import cn from '@/lib/cn'
import { CommonInputField } from '@/components/common/CommonInputField'
import type { FieldState } from '@/components/common/CommonInput'
import type { SignupFormData } from '@/schemas/auth'
import type { FlowMessage } from '@/utils/formMessage'

type TimerLike = {
  isRunning: boolean
  mmss: string
}

function getButtonProps(canAct: boolean) {
  return {
    variant: canAct ? 'secondary' : 'disabled',
    disabled: !canAct,
  } as const
}

function getSmsCodeRightSlot(params: {
  verified: boolean
  showTimer: boolean
  mmss: string
}) {
  const { verified, showTimer, mmss } = params
  return (
    <div className="flex items-center gap-2">
      {verified ? (
        <Check className="h-5 w-5 text-green-600" />
      ) : showTimer ? (
        <span className="text-sm font-semibold text-red-500">{mmss}</span>
      ) : null}
    </div>
  )
}

function renderFlowMessage(msg: FlowMessage) {
  if (msg.type === 'idle' || !msg.message) return null
  return (
    <p
      className={cn(
        'text-xs font-medium',
        msg.type === 'success' && 'text-green-600',
        msg.type === 'error' && 'text-red-500'
      )}
    >
      {msg.message}
    </p>
  )
}

export type PhoneSectionProps = {
  phone1: string
  phoneDigitsState: FieldState
  phoneVerificationCodeFieldState: FieldState

  flowMessage: FlowMessage

  smsVerified: boolean
  smsCodeSent: boolean

  smsTimer: TimerLike
  smsSendLabel: string

  canSendSms: boolean
  canVerifySms: boolean

  onSendSmsCode: () => void
  onVerifySmsCode: () => void
}

export function PhoneSection({
  phone1,
  phoneDigitsState,
  phoneVerificationCodeFieldState,
  flowMessage,
  smsVerified,
  smsCodeSent,
  smsTimer,
  smsSendLabel,
  canSendSms,
  canVerifySms,
  onSendSmsCode,
  onVerifySmsCode,
}: PhoneSectionProps) {
  const canTypeSmsCode = smsCodeSent && !smsVerified
  const showTimerInCodeInput = smsCodeSent && smsTimer.isRunning && !smsVerified

  const sendBtn = getButtonProps(canSendSms)
  const verifyBtn = getButtonProps(canVerifySms)

  const smsCodeRightSlot = getSmsCodeRightSlot({
    verified: smsVerified,
    showTimer: showTimerInCodeInput,
    mmss: smsTimer.mmss,
  })

  const sendFlowMessage: FlowMessage =
    flowMessage.scope === 'send'
      ? flowMessage
      : { type: 'idle', message: null, scope: null }
  const verifyFlowMessage: FlowMessage =
    flowMessage.scope === 'verify' || flowMessage.scope === 'expired'
      ? flowMessage
      : { type: 'idle', message: null, scope: null }

  const firstRowBelow = renderFlowMessage(sendFlowMessage)
  const secondRowBelow = renderFlowMessage(verifyFlowMessage)

  const phoneDigitsLeft = (
    <div className="grid w-full min-w-0 grid-cols-[1fr_auto_1fr_auto_1fr] items-start gap-1">
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
  )

  return (
    <div className="flex min-w-0 flex-col gap-5">
      <label className="inline-flex items-start text-left text-[16px] leading-[22.24px] font-normal tracking-[-0.48px] text-[#121212]">
        휴대전화
        <span className="ml-0 text-[16px] leading-normal font-normal tracking-[-0.32px] text-[#EC0037]">
          *
        </span>
      </label>

      <ActionRow
        left={phoneDigitsLeft}
        right={
          <Button
            type="button"
            size="sm"
            variant={sendBtn.variant}
            disabled={sendBtn.disabled}
            className="whitespace-nowrap"
            onClick={onSendSmsCode}
          >
            {smsSendLabel}
          </Button>
        }
        below={firstRowBelow}
      />

      <ActionRow
        left={
          <CommonInputField<SignupFormData>
            name="phoneVerificationCode"
            type="text"
            placeholder="인증번호 6자리를 입력해주세요"
            width="100%"
            placeholderVariant="a"
            state={phoneVerificationCodeFieldState}
            helperVisibility="always"
            rightSlot={smsCodeRightSlot}
            locked={smsVerified}
            disabled={!canTypeSmsCode}
          />
        }
        right={
          <Button
            type="button"
            size="sm"
            variant={verifyBtn.variant}
            disabled={verifyBtn.disabled}
            className="whitespace-nowrap"
            onClick={onVerifySmsCode}
          >
            {smsVerified ? '인증완료' : '인증번호 확인'}
          </Button>
        }
        below={secondRowBelow}
      />
    </div>
  )
}
