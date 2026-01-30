import { Check } from 'lucide-react'

import { PasswordField } from '@/components/common/PasswordField'
import { CommonInputField } from '@/components/common/CommonInputField'
import type { FieldState } from '@/components/common/CommonInput'
import type { SignupFormData } from '@/schemas/auth'

type PasswordSectionProps = {
  passwordFieldState: FieldState
  passwordConfirmState: FieldState
  passwordConfirmMsg: string | null
}

export function PasswordSection({
  passwordFieldState,
  passwordConfirmState,
  passwordConfirmMsg,
}: PasswordSectionProps) {
  return (
    <div className="flex flex-col gap-5">
      <div className="inline-flex items-center gap-4">
        <label className="inline-flex items-start text-left text-[16px] leading-[22.24px] font-normal tracking-[-0.48px] text-[#121212]">
          비밀번호
          <span className="ml-0 text-[16px] leading-normal font-normal tracking-[-0.32px] text-[#EC0037]">
            *
          </span>
        </label>
        <p className="text-primary text-left text-[14px] leading-[19.6px] font-semibold tracking-[-0.42px]">
          6~15자의 영문/숫자/특수문자 포함
        </p>
      </div>

      <PasswordField<SignupFormData>
        name="password"
        placeholder="비밀번호를 입력해주세요"
        width="100%"
        placeholderVariant="a"
        state={passwordFieldState}
        showDefaultHelper
        helperVisibility="focus"
        helperTextByState={{
          success: '* 사용 가능한 비밀번호입니다.',
        }}
      />

      <CommonInputField<SignupFormData>
        name="passwordConfirm"
        type="password"
        placeholder="비밀번호를 다시 입력해주세요"
        width="100%"
        placeholderVariant="a"
        state={passwordConfirmState}
        helperVisibility="always"
        helperTextByState={{
          success: passwordConfirmMsg,
          error: passwordConfirmMsg,
        }}
        rightSlot={
          passwordConfirmState === 'success' ? (
            <Check className="h-5 w-5 text-green-600" />
          ) : null
        }
      />
    </div>
  )
}
