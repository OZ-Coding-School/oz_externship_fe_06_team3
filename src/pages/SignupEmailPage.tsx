import { FormProvider } from 'react-hook-form'
import { Link } from 'react-router-dom'

import { Button } from '@/components/common/Button'
import { CommonInputField } from '@/components/common/CommonInputField'
import type { SignupFormData } from '@/schemas/auth'

import { useSignupEmailForm } from '@/hooks/useSignupEmailForm'

import { NicknameSection } from '@/components/signup/NicknameSection'
import { EmailSection } from '@/components/signup/EmailSection'
import { PhoneSection } from '@/components/signup/PhoneSection'
import { PasswordSection } from '@/components/signup/PasswordSection'
import { GenderField } from '@/components/signup/GenderField'
import { SectionBlock } from '@/components/signup/SectionBlock'
import cn from '@/lib/cn'

export default function SignupEmailPage() {
  const { methods, sections } = useSignupEmailForm()

  return (
    <FormProvider {...methods}>
      <div className="flex min-h-[calc(100vh-96px)] items-center justify-center bg-gray-100 pt-[min(8vh)] pb-[min(10vh)]">
        <div className="bg-white px-6 py-10">
          <div className="flex w-[480px] flex-col gap-9">
            {/* 상단 */}
            <div className="flex flex-col items-center gap-4">
              <p className="text-center text-[18px] leading-normal font-bold tracking-[-0.36px] text-[#000a30]">
                마법같이 빠르게 성장시켜줄
              </p>
              <img
                className="h-6 w-[180px] object-contain"
                alt="OZ. 오즈코딩스쿨"
                src="/LoginPage_img/ozcoding_logo.png"
              />
            </div>

            <h1 className="text-left text-[18px] leading-[25.2px] font-semibold tracking-[-0.54px] text-[#121212]">
              회원가입
            </h1>

            <form
              onSubmit={sections.submit.onSubmit}
              className="flex flex-col gap-11"
            >
              {/* 이름 */}
              <SectionBlock label="이름">
                <CommonInputField<SignupFormData>
                  name="name"
                  type="text"
                  placeholder="이름을 입력해주세요"
                  width="100%"
                  placeholderVariant="a"
                  helperVisibility="always"
                />
              </SectionBlock>

              {/* 닉네임 */}
              <NicknameSection {...sections.nickname} />

              {/* 생년월일 */}
              <SectionBlock label="생년월일">
                <CommonInputField<SignupFormData>
                  name="birthdate"
                  type="text"
                  placeholder="8자리 입력해주세요 (ex.20000101)"
                  width="100%"
                  placeholderVariant="a"
                  helperVisibility="always"
                />
              </SectionBlock>

              {/* 성별 */}
              <SectionBlock label="성별">
                <GenderField />
              </SectionBlock>

              {/* 이메일 */}
              <EmailSection {...sections.email} />

              {/* 휴대전화 */}
              <PhoneSection {...sections.sms} />

              {/* 비밀번호 */}
              <PasswordSection {...sections.password} />
              
              {/* 전역 폼 에러 */}
              <div className="flex flex-col gap-2">
                <div className="min-h-[16px] px-1 text-xs text-red-500">
                  <span
                    className={cn(
                      sections.submit.formError ? 'visible' : 'invisible'
                    )}
                  >
                    {sections.submit.formError ?? '\u00A0'}
                  </span>
                </div>

                {/* 제출 */}
                <Button
                  type="submit"
                  size="xxl"
                  variant={sections.submit.button.variant}
                  disabled={sections.submit.button.disabled}
                  className="whitespace-nowrap"
                >
                  {sections.submit.label}
                </Button>
              </div>
            </form>

            <p className="mt-6 text-center">
              <Link
                to="/signup"
                className="text-mono-600 text-[16px] leading-[22.4px] tracking-[-0.48px] underline hover:no-underline"
              >
                소셜/일반 선택으로 돌아가기
              </Link>
            </p>
          </div>
        </div>
      </div>
    </FormProvider>
  )
}
