import { FormProvider } from 'react-hook-form'
import { Link } from 'react-router-dom'

import cn from '@/lib/cn'
import { CommonInputField } from '@/components/common/CommonInputField'
import { PasswordField } from '@/components/common/PasswordField'
import { Button } from '@/components/common/Button'
import SocialLoginSection from '@/components/auth/SocialLoginSection'
import type { SocialProviderId } from '@/types/social'
import type { LoginFormData } from '@/schemas/auth'

import { useLoginPage } from '@/hooks/useLoginPage'

export default function LoginPage() {
  const { methods, vm } = useLoginPage()

  const handleSocialLogin = (provider: SocialProviderId) => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL ?? ''
    window.location.href = `${baseUrl}/api/v1/accounts/login/${provider}/`
  }

  const { fields, messages, ui, actions } = vm

  return (
    <FormProvider {...methods}>
      <div className="flex h-[calc(100vh-96px)] items-center justify-center bg-white px-4 py-12">
        <div className="relative mb-[min(20vh)] flex w-[348px] flex-col items-center gap-16">
          {/* 로고, 회원가입 */}
          <div className="flex w-full flex-col items-center gap-[27px]">
            <div className="flex w-[191px] flex-col items-center gap-4">
              <img
                className="h-6 w-[180px] object-cover"
                alt="Renewal ozcoding"
                src="/LoginPage_img/ozcoding_logo.png"
              />
            </div>

            <div className="flex w-full items-start justify-center gap-3">
              <div className="inline-flex items-center justify-center gap-2.5">
                <div className="text-mono-600 truncate whitespace-nowrap">
                  아직 회원이 아니신가요?
                </div>
              </div>

              <Link
                to="/signup"
                className="text-primary gap-2.5 text-[16px] leading-[22.4px] font-normal tracking-[-0.48px] whitespace-nowrap"
              >
                회원가입 하기
              </Link>
            </div>
          </div>

          {/* 로그인 폼 */}
          <div className="flex w-full flex-col items-center">
            <div className="flex w-full flex-col items-start gap-10">
              <SocialLoginSection onLogin={handleSocialLogin} />

              <form onSubmit={actions.onSubmit} className="w-full">
                <div className="flex flex-col items-start">
                  <div className="flex w-full flex-col gap-3">
                    <CommonInputField<LoginFormData>
                      name={fields.email.name}
                      type="email"
                      placeholder="아이디 (example@gmail.com)"
                      width="100%"
                      placeholderVariant="a"
                      state={fields.email.state}
                      stateOverride="default"
                      helperVisibility="focus"
                      helperTextByState={
                        fields.email.helperTextByState ?? { default: null }
                      }
                    />

                    <div className="flex w-full flex-col">
                      <PasswordField<LoginFormData>
                        name={fields.password.name}
                        placeholder="비밀번호를 입력해주세요."
                        width="100%"
                        placeholderVariant="a"
                        state={fields.password.state}
                        stateOverride="default"
                        helperVisibility="never"
                        showDefaultHelper={false}
                        helperTextByState={fields.password.helperTextByState}
                      />
                    </div>

                    <div className="px-1 text-xs font-medium text-red-500">
                      <span
                        className={cn(
                          messages.formError ? 'visible' : 'invisible'
                        )}
                      >
                        {messages.formError ?? '\u00A0'}
                      </span>
                    </div>
                  </div>

                  <div className="inline-flex items-center">
                    <Button
                      type="button"
                      variant="link"
                      size="auto"
                      className="py-2 whitespace-nowrap"
                      onClick={actions.goFindId}
                    >
                      아이디 찾기
                    </Button>

                    <span className="text-mono-600 px-2 py-2 text-sm">|</span>

                    <Button
                      type="button"
                      variant="link"
                      size="auto"
                      className="py-2 whitespace-nowrap"
                      onClick={actions.goFindPw}
                    >
                      비밀번호 찾기
                    </Button>
                  </div>

                  <Button
                    type="submit"
                    disabled={ui.submitButton.disabled}
                    variant={ui.submitButton.variant}
                    className="h-[52px] w-full gap-2.5 rounded px-2 py-2"
                  >
                    <div className="whitespace-nowrap">
                      {ui.submitButton.label}
                    </div>
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </FormProvider>
  )
}
