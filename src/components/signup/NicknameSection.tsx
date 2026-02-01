import { Check } from 'lucide-react'

import { ActionRow } from '@/components/signup/ActionRow'
import { Button } from '@/components/common/Button'
import { CommonInputField } from '@/components/common/CommonInputField'
import type { FieldState } from '@/components/common/CommonInput'
import type { SignupFormData } from '@/schemas/auth'
import type { FlowMessage } from '@/utils/formMessage'
import cn from '@/lib/cn'

function getButtonProps(canAct: boolean) {
  return {
    variant: canAct ? 'secondary' : 'disabled',
    disabled: !canAct,
  } as const
}

export type NicknameSectionProps = {
  nicknameFieldState: FieldState
  flowMessage: FlowMessage
  nicknameChecked: boolean
  nickname: string
  canCheckNickname: boolean
  busy: boolean
  onCheckNickname: () => void
}

export function NicknameSection({
  nicknameFieldState,
  flowMessage,
  nicknameChecked,
  canCheckNickname,
  onCheckNickname,
}: NicknameSectionProps) {
  const btn = getButtonProps(canCheckNickname)
  const flowMessageNode =
    flowMessage.type !== 'idle' && flowMessage.message ? (
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
        닉네임
        <span className="ml-0 text-[16px] leading-normal font-normal tracking-[-0.32px] text-[#EC0037]">
          *
        </span>
      </label>

      <ActionRow
        left={
          <CommonInputField<SignupFormData>
            name="nickname"
            type="text"
            placeholder="닉네임을 입력해주세요"
            width="100%"
            placeholderVariant="a"
            state={nicknameFieldState}
            helperVisibility="always"
            rightSlot={
              nicknameChecked ? (
                <Check className="h-5 w-5 text-green-600" />
              ) : undefined
            }
          />
        }
        right={
          <Button
            type="button"
            size="sm"
            variant={btn.variant}
            disabled={btn.disabled}
            className="whitespace-nowrap"
            onClick={onCheckNickname}
          >
            {nicknameChecked ? '확인완료' : '중복확인'}
          </Button>
        }
        below={flowMessageNode}
      />
    </div>
  )
}
