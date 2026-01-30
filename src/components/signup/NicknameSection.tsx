import { Check } from 'lucide-react'

import { Button } from '@/components/common/Button'
import { CommonInputField } from '@/components/common/CommonInputField'
import type { FieldState } from '@/components/common/CommonInput'
import type { SignupFormData } from '@/schemas/auth'

type NicknameSectionProps = {
  nicknameFieldState: FieldState
  nicknameMsg: string | null
  nicknameChecked: boolean
  nickname: string
  canCheckNickname: boolean
  busy: boolean
  onCheckNickname: () => void
}

export function NicknameSection({
  nicknameFieldState,
  nicknameMsg,
  nicknameChecked,
  canCheckNickname,
  busy,
  onCheckNickname,
}: NicknameSectionProps) {
  return (
    <div className="flex flex-col gap-5">
      <label className="inline-flex items-start text-left text-[16px] leading-[22.24px] font-normal tracking-[-0.48px] text-[#121212]">
        닉네임
        <span className="ml-0 text-[16px] leading-normal font-normal tracking-[-0.32px] text-[#EC0037]">
          *
        </span>
      </label>

      <div className="flex min-w-0 gap-3 overflow-hidden">
        <div className="min-w-0 flex-1 overflow-hidden">
          <CommonInputField<SignupFormData>
            name="nickname"
            type="text"
            placeholder="닉네임을 입력해주세요"
            width="100%"
            placeholderVariant="a"
            state={nicknameFieldState}
            helperVisibility="always"
            helperTextByState={{
              success: nicknameMsg,
              error: nicknameMsg,
            }}
            rightSlot={
              nicknameChecked ? (
                <Check className="h-5 w-5 text-green-600" />
              ) : null
            }
          />
        </div>

        <Button
          type="button"
          size="sm"
          variant={
            !canCheckNickname || busy || nicknameChecked
              ? 'disabled'
              : 'secondary'
          }
          className="whitespace-nowrap"
          onClick={onCheckNickname}
        >
          {nicknameChecked ? '확인완료' : '중복확인'}
        </Button>
      </div>
    </div>
  )
}
